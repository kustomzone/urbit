/* vere/behn.c
**
*/
#include <fcntl.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <dirent.h>
#include <uv.h>
#include <ncurses/curses.h>
#include <termios.h>
#include <ncurses/term.h>
#include <errno.h>

#include "all.h"
#include "vere/vere.h"

/* u3_behn: just a timer for ever
*/
  typedef struct _u3_behn {
    u3_auto    car_u;                   //  driver
    uv_timer_t tim_u;                   //  behn timer
    c3_o       alm;                     //  alarm
  } u3_behn;

/* _behn_time_cb(): timer callback.
*/
static void
_behn_time_cb(uv_timer_t* tim_u)
{
  u3_behn* teh_u = tim_u->data;
  teh_u->alm = c3n;

  //  start another timer for 10 minutes
  //
  //  This is a backstop to deal with the case where a %doze is not
  //  properly sent, for example after a crash.  If the timer continues
  //  to fail, we can't proceed with the timers, but if it was a
  //  transient error, this will get us past it.
  //
  {
    c3_d gap_d = 10 * 60 * 1000;
    teh_u->alm = c3y;
    uv_timer_start(&teh_u->tim_u, _behn_time_cb, gap_d, 0);
  }

  // send timer event
  //
  {
    u3_noun wir = u3nc(c3__behn, u3_nul);
    u3_noun cad = u3nc(c3__wake, u3_nul);

    u3_auto_plan(&teh_u->car_u, 0, c3__b, wir, cad);
  }
}

/* u3_behn_ef_doze(): set or cancel timer
*/
static void
_behn_ef_doze(u3_behn* teh_u, u3_noun wen)
{
  if ( c3n == teh_u->car_u.liv_o ) {
    teh_u->car_u.liv_o = c3y;
  }

  if ( c3y == teh_u->alm ) {
    uv_timer_stop(&teh_u->tim_u);
    teh_u->alm = c3n;
  }

  if ( (u3_nul != wen) &&
       (c3y == u3du(wen)) &&
       (c3y == u3ud(u3t(wen))) )
  {
    struct timeval tim_tv;
    gettimeofday(&tim_tv, 0);

    u3_noun now = u3_time_in_tv(&tim_tv);
    c3_d gap_d = u3_time_gap_ms(now, u3k(u3t(wen)));

    teh_u->alm = c3y;
    uv_timer_start(&teh_u->tim_u, _behn_time_cb, gap_d, 0);
  }

  u3z(wen);
}

/* _behn_io_talk(): notify %behn that we're live
*/
static void
_behn_io_talk(u3_auto* car_u)
{
  //  XX remove u3A->sen
  //
  u3_noun wir = u3nt(c3__behn, u3k(u3A->sen), u3_nul);
  u3_noun cad = u3nc(c3__born, u3_nul);

  u3_auto_plan(car_u, 0, c3__b, wir, cad);
}

/* _behn_io_kick(): apply effects.
*/
static c3_o
_behn_io_kick(u3_auto* car_u, u3_noun wir, u3_noun cad)
{
  u3_behn* teh_u = (u3_behn*)car_u;

  u3_noun tag, dat, i_wir;
  c3_o ret_o;

  if (  (c3n == u3r_cell(wir, &i_wir, 0))
     || (c3n == u3r_cell(cad, &tag, &dat))
     || (c3__behn != i_wir) )
  {
    ret_o = c3n;
  }
  else {
    ret_o = c3y;
    _behn_ef_doze(teh_u, u3k(dat));
  }

  u3z(wir); u3z(cad);
  return ret_o;
}

/* _behn_exit_cb();
*/
static void
_behn_exit_cb(uv_timer_t* tim_u)
{
  u3_behn* teh_u = tim_u->data;
  c3_free(teh_u);
}

/* _behn_io_exit(): terminate timer.
*/
static void
_behn_io_exit(u3_auto* car_u)
{
  u3_behn* teh_u = (u3_behn*)car_u;
  uv_close((uv_handle_t*)&teh_u->tim_u, (uv_close_cb)_behn_exit_cb);
}

/* u3_behn(): initialize time timer.
*/
u3_auto*
u3_behn_io_init(u3_pier* pir_u)
{
  u3_behn* teh_u = c3_calloc(sizeof(*teh_u));
  teh_u->alm = c3n;

  uv_timer_init(u3L, &teh_u->tim_u);
  teh_u->tim_u.data = teh_u;

  u3_auto* car_u = &teh_u->car_u;
  car_u->nam_m = c3__behn;

  //  XX set in done_cb for %born
  //
  car_u->liv_o = c3y;
  car_u->io.talk_f = _behn_io_talk;
  car_u->io.kick_f = _behn_io_kick;
  car_u->io.exit_f = _behn_io_exit;
  //  XX retry up to N?
  //
  // car_u->ev.bail_f = ...;

  return car_u;
}
