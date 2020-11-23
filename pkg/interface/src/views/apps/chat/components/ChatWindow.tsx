import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import _ from "lodash";
import bigInt, { BigInteger } from 'big-integer';

import GlobalApi from "~/logic/api/global";
import { Patp, Path } from "~/types/noun";
import { Contacts } from "~/types/contact-update";
import { Association } from "~/types/metadata-update";
import { Group } from "~/types/group-update";
import { Envelope, IMessage } from "~/types/chat-update";
import { LocalUpdateRemoteContentPolicy, Graph } from "~/types";
import { BigIntOrderedMap } from "~/logic/lib/BigIntOrderedMap";

import VirtualScroller from "~/views/components/VirtualScroller";

import ChatMessage, { MessagePlaceholder } from './ChatMessage';
import { UnreadNotice } from "./unread-notice";
import { ResubscribeElement } from "./resubscribe-element";
import { BacklogElement } from "./backlog-element";

const INITIAL_LOAD = 20;
const DEFAULT_BACKLOG_SIZE = 100;
const IDLE_THRESHOLD = 64;
const MAX_BACKLOG_SIZE = 1000;

type ChatWindowProps = RouteComponentProps<{
  ship: Patp;
  station: string;
}> & {
  unreadCount: number;
  isChatMissing: boolean;
  isChatLoading: boolean;
  isChatUnsynced: boolean;
  unreadMsg: Envelope | false;
  stationPendingMessages: IMessage[];
  graph: Graph;
  contacts: Contacts;
  association: Association;
  group: Group;
  ship: Patp;
  station: any;
  api: GlobalApi;
  hideNicknames: boolean;
  hideAvatars: boolean;
  remoteContentPolicy: LocalUpdateRemoteContentPolicy;
  scrollTo?: number;
}

interface ChatWindowState {
  fetchPending: boolean;
  idle: boolean;
  initialized: boolean;
  lastRead: number;
}

export default class ChatWindow extends Component<ChatWindowProps, ChatWindowState> {
  private virtualList: VirtualScroller | null;
  private unreadMarkerRef: React.RefObject<HTMLDivElement>;
  private prevSize = 0;

  INITIALIZATION_MAX_TIME = 1500;

  constructor(props) {
    super(props);

    this.state = {
      fetchPending: false,
      idle: true,
      initialized: false,
      lastRead: props.unreadCount ? props.mailboxSize - props.unreadCount : -1,
    };

    this.dismissUnread = this.dismissUnread.bind(this);
    this.scrollToUnread = this.scrollToUnread.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleWindowFocus = this.handleWindowFocus.bind(this);
    this.stayLockedIfActive = this.stayLockedIfActive.bind(this);
    this.dismissIfLineVisible = this.dismissIfLineVisible.bind(this);

    this.virtualList = null;
    this.unreadMarkerRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
    this.initialFetch();
    setTimeout(() => {
      if(this.props.scrollTo) {
        this.scrollToUnread();
      }

      this.setState({ initialized: true });
    }, this.INITIALIZATION_MAX_TIME);
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  handleWindowBlur() {
    this.setState({ idle: true });
  }

  handleWindowFocus() {
    this.setState({ idle: false });
    if (this.virtualList?.window?.scrollTop === 0) {
      this.dismissUnread();
    }
  }

  initialFetch() {
    /*
    const { envelopes, mailboxSize, unreadCount } = this.props;
    if (envelopes.length > 0) {
      const start = Math.min(mailboxSize - unreadCount, mailboxSize - DEFAULT_BACKLOG_SIZE);
      this.stayLockedIfActive();
      this.fetchMessages(start, start + DEFAULT_BACKLOG_SIZE, true).then(() => {
        if (!this.virtualList) return;
        this.setState({ idle: false });
        this.setState({ initialized: true });
        this.dismissIfLineVisible();
      });
    } else {
      setTimeout(() => {
        this.initialFetch();
      }, 2000);
    }
     */
  }

  componentDidUpdate(prevProps: ChatWindowProps, prevState) {
    const { isChatMissing, history, graph, unreadCount, station } = this.props;

    if (isChatMissing) {
      history.push("/~404");
    } else if (graph.size !== prevProps.graph.size && this.state.fetchPending) {
      this.setState({ fetchPending: false });
    }

      /*if ((mailboxSize !== prevProps.mailboxSize) || (envelopes.length !== prevProps.envelopes.length)) {
      this.virtualList?.calculateVisibleItems();
      this.stayLockedIfActive();
    }*/

      /*if (unreadCount > prevProps.unreadCount && this.state.idle) {
      this.setState({
        lastRead: unreadCount ? mailboxSize - unreadCount : -1,
      });
    }*/

    console.log(graph.size);
    console.log(prevProps.graph.size);

    if(this.prevSize !== graph.size) {
      this.prevSize = graph.size;
      this.virtualList?.calculateVisibleItems();
    }
      /*
    if (stationPendingMessages.length !== prevProps.stationPendingMessages.length) {
      this.virtualList?.calculateVisibleItems();
    }

    if (!this.state.fetchPending && prevState.fetchPending) {
      this.virtualList?.calculateVisibleItems();
    }

    if (station !== prevProps.station) {
      this.virtualList?.resetScroll();
      this.scrollToUnread();
      this.setState({
        lastRead: unreadCount ? mailboxSize - unreadCount : -1,
      });
    }
     */
  }

  stayLockedIfActive() {
    if (this.virtualList && !this.state.idle) {
      this.virtualList.resetScroll();
      this.dismissUnread();
    }
  }

  scrollToUnread() {
    /*
    const { mailboxSize, unreadCount, scrollTo } = this.props;
    const target = scrollTo || (mailboxSize - unreadCount);
    this.virtualList?.scrollToData(target);
     */
  }

  dismissUnread() {
    if (this.state.fetchPending) return;
    if (this.props.unreadCount === 0) return;
    //this.props.api.chat.read(this.props.station);
    //this.props.api.hark.readIndex({ chat: { chat: this.props.station, mention: false }});
  }

  fetchMessages(start, end, force = false): Promise<void> {
    start = Math.max(start, 0);
    end = Math.max(end, 0);
    const { api, mailboxSize, station } = this.props;

    if (
      (this.state.fetchPending ||
      mailboxSize <= 0)
      && !force
    ) {
      return new Promise((resolve, reject) => {});
    }

    this.setState({ fetchPending: true });

    start = Math.min(mailboxSize - start, mailboxSize);
    end = Math.max(mailboxSize - end, 0, start - MAX_BACKLOG_SIZE);

    return api.chat
      .fetchMessages(end, start, station)
      .finally(() => {
        this.setState({ fetchPending: false });
      });
  }

  onScroll({ scrollTop, scrollHeight, windowHeight }) {
    if (!this.state.idle && scrollTop > IDLE_THRESHOLD) {
      this.setState({ idle: true });
    }

    this.dismissIfLineVisible();
  }

  dismissIfLineVisible() {
    if (this.props.unreadCount === 0) return;
    if (!this.unreadMarkerRef.current || !this.virtualList?.window) return;
    const parent = this.unreadMarkerRef.current.parentElement?.parentElement;
    if (!parent) return;
    const { scrollTop, scrollHeight, offsetHeight } = this.virtualList.window;
    if (
      (scrollHeight - parent.offsetTop > scrollTop)
      && (scrollHeight - parent.offsetTop < scrollTop + offsetHeight)
    ) {
      this.dismissUnread();
    }
  }

  render() {
    const {
      stationPendingMessages,
      unreadCount,
      unreadMsg,
      isChatLoading,
      isChatUnsynced,
      api,
      ship,
      station,
      association,
      group,
      contacts,
      mailboxSize,
      graph,
      hideAvatars,
      hideNicknames,
      remoteContentPolicy,
      history
    } = this.props;

    const unreadMarkerRef = this.unreadMarkerRef;

    let lastMessage = 0;

    const messageProps = { association, group, contacts, hideAvatars, hideNicknames, remoteContentPolicy, unreadMarkerRef, history, api };

    const keys = graph.keys().reverse();

    return (
      <>
        <UnreadNotice
          unreadCount={unreadCount}
          unreadMsg={unreadCount === 1 && unreadMsg && unreadMsg.author === window.ship ? false : unreadMsg}
          dismissUnread={this.dismissUnread}
          onClick={this.scrollToUnread}
        />
        <BacklogElement isChatLoading={isChatLoading} />
        <ResubscribeElement {...{ api, host: ship, station, isChatUnsynced}} />
        <VirtualScroller
          ref={list => {this.virtualList = list}}
          origin="bottom"
          style={{ height: '100%' }}
          onStartReached={() => {
            this.setState({ idle: false });
            this.dismissUnread();
          }}
          onScroll={this.onScroll.bind(this)}
          data={graph}
          size={graph.size}
          renderer={({ index, measure, scrollWindow }) => {
            const msg = graph.get(index)!.post;
            if (!msg) return null;
            if (!this.state.initialized) {
              return <MessagePlaceholder key={index.toString()} height="64px" index={index} />;
            }
            const isPending: boolean = 'pending' in msg && Boolean(msg.pending);
            const isLastMessage: boolean = Boolean(index.eq(bigInt(lastMessage)));
            const isLastRead: boolean = Boolean(!isLastMessage && index.eq(bigInt(this.state.lastRead)));
            const highlighted = bigInt(this.props.scrollTo || -1).eq(index);
            const props = { measure, highlighted, scrollWindow, isPending, isLastRead, isLastMessage, msg, ...messageProps };
            const graphIdx = keys.findIndex(idx => idx.eq(index));
            const prevIdx = keys[graphIdx+1];
            const nextIdx = keys[graphIdx-1];
            return (
              <ChatMessage
                key={index.toString()}
                previousMsg={prevIdx && graph.get(prevIdx)?.post}
                nextMsg={nextIdx && graph.get(nextIdx)?.post}
                {...props}
              />
            );
          }}
          loadRows={(start, end) => {
            this.fetchMessages(start.toJSNumber(), end.toJSNumber());
          }}
        />
      </>
    );
  }
}

