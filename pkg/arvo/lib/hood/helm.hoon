/-    sole
/+    pill
=*  card  card:agent:gall
::
|%
+$  state
  $:  %3
      say/sole-share:sole                               ::  console state
      mud/(unit (sole-dialog:sole @ud))                 ::  console dialog
      mass-timer/{way/wire nex/@da tim/@dr}
  ==
--
::
|=  [=bowl:gall =state]
=|  moz=(list card)
|%
+*  this  .
++  abet  [(flop moz) state]
++  flog  |=(=flog:dill (emit %pass /di %arvo %d %flog flog))
++  emit  |=(card this(moz [+< moz]))
::  +emil: emit multiple cards
::
++  emil
  |=  caz=(list card)
  ^+  this
  ?~(caz this $(caz t.caz, this (emit i.caz)))
::
++  poke-rekey                                        ::  rotate private keys
  |=  des=@t
  =/  sed=(unit seed:able:jael)
    %+  biff
      (bind (slaw %uw des) cue)
    (soft seed:able:jael)
  =<  abet
  ?~  sed
    ~&  %invalid-private-key
    this
  ?.  =(our who.u.sed)
    ~&  [%wrong-private-key-ship who.u.sed]
    this
  (emit %pass / %arvo %j %rekey lyf.u.sed key.u.sed)
::
++  poke-moon                                        ::  rotate moon keys
  |=  sed=(unit [=ship =udiff:point:able:jael])
  =<  abet
  ?~  sed
    this
  (emit %pass / %arvo %j %moon u.sed)
::
++  poke-mass
  |=  ~  =<  abet
  (emit %pass /heft %arvo %d %flog %heft ~)
::
++  poke-automass
  |=  recur=@dr
  =.  mass-timer.state
    [/helm/automass (add now recur) recur]
  abet:(emit %pass way.mass-timer.state %arvo %b %wait nex.mass-timer.state)
::
++  poke-cancel-automass
  |=  ~
  abet:(emit %pass way.mass-timer.state %arvo %b %rest nex.mass-timer.state)
::
++  poke-pack
  |=  ~  =<  abet
  (emit %pass /pack %arvo %d %flog %pack ~)
::
++  take-wake-automass
  |=  [way=wire error=(unit tang)]
  ?^  error
    %-  (slog u.error)
    ~&  %helm-wake-automass-fail
    abet
  =.  nex.mass-timer.state  (add now tim.mass-timer.state)
  =<  abet
  %-  emil
  :~  [%pass /heft %arvo %d %flog %crud %hax-heft ~]
      [%pass way.mass-timer.state %arvo %b %wait nex.mass-timer.state]
  ==
::
++  poke-send-hi
  |=  {her/ship mes/(unit tape)}  =<  abet
  %-  emit
  :*  %pass  /helm/hi/(scot %p her)
      %agent  [her %hood]  %poke
      %helm-hi  !>(?~(mes '' (crip u.mes)))
  ==
::
::
++  poke-hi
  |=  mes/@t
  ~|  %poke-hi-fail
  ?:  =(%fail mes)
    ~&  %poke-hi-fail
    !!
  abet:(flog %text "< {<src>}: {(trip mes)}")
::
++  poke-atom
  |=  ato/@
  =+  len=(scow %ud (met 3 ato))
  =+  gum=(scow %p (mug ato))
  =<  abet
  (flog %text "< {<src>}: atom: {len} bytes, mug {gum}")
::
++  coup-hi
  |=  {pax/path cop/(unit tang)}  =<  abet
  ?>  ?=({@t ~} pax)
  (flog %text "hi {(trip i.pax)} {?~(cop "" "un")}successful")
::
++  poke-reload  |=(all/(list term) (poke-reload-desk %home all))
++  poke-reload-desk                                 ::  reload vanes
  |:  $:{syd/desk all/(list term)}  =<  abet
  %-  emil
  %+  turn  all
  =+  top=`path`/(scot %p our)/[syd]/(scot %da now)
  =/  van/(list {term ~})
    :-  zus=[%zuse ~]
    ~(tap by dir:.^(arch %cy (welp top /sys/vane)))
  |=  nam/@tas
    =.  nam
    ?.  =(1 (met 3 nam))
      nam
    =/  zaz/(list {p/knot ~})
        (skim van |=({a/term ~} =(nam (end 3 1 a))))
    ?>  ?=({{@ ~} ~} zaz)
    `term`p.i.zaz
  =+  tip=(end 3 1 nam)
  =+  zus==('z' tip)
  =+  way=?:(zus (welp top /sys/[nam]) (welp top /sys/vane/[nam]))
  =+  fil=.^(@ %cx (welp way /hoon))
  [%pass /reload %arvo %d %flog %veer ?:(=('z' tip) %$ tip) way fil]
::  +poke-reset:  send %lyra to initiate kernel upgrade
::
::    And reinstall %zuse and the vanes with %veer.
::    Trigger with |reset.
::
++  poke-reset
  |=  hood-reset=~
  =<  abet
  %-  emil
  ^-  (list card:agent:gall)
  =/  top=path  /(scot %p our)/home/(scot %da now)/sys
  =/  hun  .^(@t %cx (welp top /hoon/hoon))
  =/  arv  .^(@t %cx (welp top /arvo/hoon))
  ~!  *task:able:dill
  :-  [%pass /reset %arvo %d %flog %lyra `hun arv]
  %+  turn
    (module-ova:pill top)
  |=([=wire =flog:dill] [%pass wire %arvo %d %flog flog])
::
++  poke-verb                                         ::  toggle verbose
  |=  ~  =<  abet
  (flog %verb ~)
::
++  poke-ames-sift
  |=  ships=(list ship)  =<  abet
  (emit %pass /helm %arvo %a %sift ships)
::
++  poke-ames-verb
  |=  veb=(list verb:ames)  =<  abet
  (emit %pass /helm %arvo %a %spew veb)
::
++  poke-ames-wake
  |=  ~  =<  abet
  (emit %pass /helm %arvo %a %stir '')
::
++  poke-knob
  |=  [error-tag=@tas level=?(%hush %soft %loud)]  =<  abet
  (emit %pass /helm %arvo %d %knob error-tag level)
::
++  poke-serve
  |=  [=binding:eyre =generator:eyre]  =<  abet
  (emit %pass /helm/serv %arvo %e %serve binding generator)
::
++  poke
  |=  [=mark =vase]
  ?+  mark  ~|([%poke-helm-bad-mark mark] !!)
    %helm-ames-sift        =;(f (f !<(_+<.f vase)) poke-ames-sift)
    %helm-ames-verb        =;(f (f !<(_+<.f vase)) poke-ames-verb)
    %helm-ames-wake        =;(f (f !<(_+<.f vase)) poke-ames-wake)
    %helm-atom             =;(f (f !<(_+<.f vase)) poke-atom)
    %helm-automass         =;(f (f !<(_+<.f vase)) poke-automass)
    %helm-cancel-automass  =;(f (f !<(_+<.f vase)) poke-cancel-automass)
    %helm-hi               =;(f (f !<(_+<.f vase)) poke-hi)
    %helm-knob             =;(f (f !<(_+<.f vase)) poke-knob)
    %helm-mass             =;(f (f !<(_+<.f vase)) poke-mass)
    %helm-moon             =;(f (f !<(_+<.f vase)) poke-moon)
    %helm-pack             =;(f (f !<(_+<.f vase)) poke-pack)
    %helm-rekey            =;(f (f !<(_+<.f vase)) poke-rekey)
    %helm-reload           =;(f (f !<(_+<.f vase)) poke-reload)
    %helm-reload-desk      =;(f (f !<(_+<.f vase)) poke-reload-desk)
    %helm-reset            =;(f (f !<(_+<.f vase)) poke-reset)
    %helm-send-hi          =;(f (f !<(_+<.f vase)) poke-send-hi)
    %helm-serve            =;(f (f !<(_+<.f vase)) poke-serve)
    %helm-verb             =;(f (f !<(_+<.f vase)) poke-verb)
  ==
::
++  take-agent
  |=  [=wire =sign:agent:gall]
  ?+  wire  ~|([%helm-bad-take-agent wire -.sign] !!)
    [%helm %hi *]  ?>  ?=(%poke-ack -.sign)
                   (coup-hi t.t.wire p.sign)
  ==
::
++  take-bound
  |=  [wir=wire success=? binding=binding:eyre]  =<  abet
  (flog %text "bound: {<success>}")
::
++  take-arvo
  |=  [=wire =sign-arvo]
  ?+  wire  ~|([%helm-bad-take-wire wire +<.sign-arvo] !!)
    [%automass *]  %+  take-wake-automass  t.wire
                   ?>(?=(%wake +<.sign-arvo) +>.sign-arvo)
    [%serv *]      %+  take-bound  t.wire
                   ?>(?=(%bound +<.sign-arvo) +>.sign-arvo)
  ==
--
