function hasClass(e, t) {
    return e.classList ? e.classList.contains(t) : !!e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"))
}

function addClass(e, t) {
    e.classList ? e.classList.add(t) : hasClass(e, t) || (e.className += " " + t)
}

function removeClass(e, t) {
    if (e.classList) e.classList.remove(t);
    else if (hasClass(e, t)) {
        var n = new RegExp("(\\s|^)" + t + "(\\s|$)");
        e.className = e.className.replace(n, " ")
    }
}

function KeepAlive(e) {
    var t = new XMLHttpRequest;
    t.open("HEAD", e, !0), t.onload = function(e) {
        if (4 === t.readyState && 200 <= t.status && t.status < 304) try {
            b4j_ws.readyState
        } catch (e) {}
    }, t.onerror = function(e) {}, t.send(null)
}

function GetIsReconnect() {
    return IsReconnect
}

function b4j_sendData(e) {
    b4j_ws && b4j_ws.send(JSON.stringify({
        type: "data",
        data: e
    }))
}

function b4j_raiseEvent(e, t) {
    if (b4j_ws) {
        document.getElementById("pageconnectedindicator");
        try {
            1 !== b4j_ws.readyState ? !1 === b4j_closeMessage && ("undefined" == typeof RobustWebSocket ? window.console.error("Server is currently not available.") : window.console.error("Connection is closed. Trying to reconnect."), b4j_closeMessage = !0) : (b4j_closeMessage = !1, b4j_ws.send(JSON.stringify({
                type: "event",
                event: e,
                params: t
            })))
        } catch (e) {}
    }
}

function b4j_addEvent(t, e, n, i) {
    var o = $(t);
    0 < o.length && o.on(e, function(e) {
        i && (e.preventDefault(), e.stopPropagation()), e.target.id ? b4j_raiseEvent(n, {
            which: e.which,
            target: e.target.id,
            pageX: e.pageX,
            pageY: e.pageY,
            metaKey: e.metaKey
        }) : b4j_raiseEvent(n, {
            which: e.which,
            target: t,
            pageX: e.pageX,
            pageY: e.pageY,
            metaKey: e.metaKey
        })
    })
}

function b4j_addAutomaticEvents(e) {
    $.each(e, function(e, t) {
        b4j_addEvent("#" + t.id, t.event, t.id + "_" + t.event, !0)
    })
}

function b4j_runFunction(e, t) {
    return "function" == typeof window[e] ? window[e].apply(null, t) : null
}

function b4j_eval(e, t) {
    return new Function(t).apply(null, e)
}

function b4j_connect(e) {
    if ("undefined" != typeof WebSocket) {
        var t, n = window.location;
        t = 0 != n.port ? ("https:" === n.protocol ? "wss://" : "ws://") + n.hostname + ":" + n.port + e + n.search : ("https:" === n.protocol ? "wss://" : "ws://") + n.hostname + e + n.search, "undefined" == typeof RobustWebSocket ? (console.log("Using normal WebSocket"), WebSocketType = "normal", b4j_ws = new WebSocket(t)) : (console.log("Using RobustWebSocket"), WebSocketType = "robust", b4j_ws = new RobustWebSocket(t)), b4j_ws.addEventListener("message", function(e) {
            var t = JSON.parse(e.data);
            "runmethod" === t.etype ? $(t.id)[t.method].apply($(t.id), t.params) : "runmethodWithResult" === t.etype ? b4j_sendData($(t.id)[t.method].apply($(t.id), t.params)) : "setAutomaticEvents" === t.etype ? b4j_addAutomaticEvents(t.data) : "runFunction" === t.etype ? b4j_runFunction(t.prop, t.value) : "runFunctionWithResult" === t.etype ? b4j_sendData(b4j_runFunction(t.prop, t.value)) : "eval" === t.etype ? b4j_eval(t.value, t.prop) : "evalWithResult" === t.etype ? b4j_sendData(b4j_eval(t.value, t.prop)) : "alert" === t.etype && window.alert(t.prop)
        }), b4j_ws.addEventListener("open", function(e) {
            console.log("WebSocket opened, reconnected?: " + IsReconnect), reconnectTimeout && clearInterval(reconnectTimeout);
            var t = document.body,
                n = document.getElementById("isloaderwrapper");
            if (n && !hasClass(n, "isloading") && !hasClass(t, "loaded")) {
                addClass(t, "loaded");
                var i = document.getElementById("loader-wrapper");
                i && i.parentElement.removeChild(i)
            }
            var o = document.getElementById("pageconnectedindicator");
            o && (removeClass(o, "indicatorinactive"), addClass(o, "indicatoractive"))
        }), b4j_ws.addEventListener("close", function(e) {
            IsReconnect = !0, console.log("closed - navigator.onLine:" + navigator.onLine), reconnectTimeout && clearInterval(reconnectTimeout);
            var t = document.getElementById("pageconnectedindicator");
            t && (removeClass(t, "indicatoractive"), addClass(t, "indicatorinactive")), navigator.onLine || (reconnectTimeout = setInterval(function() {
                navigator.onLine && (clearInterval(reconnectTimeout), "robust" == WebSocketType && b4j_ws.startReconnect(e))
            }, 1e3))
        });
        var i = isOnIOS ? "pagehide" : "beforeunload";
        window.addEventListener(i, function(e) {
            var t = "b4jspagekey",
                n = !1,
                i = 'return _b4jsclasses["' + t + '"].' + _b4jsvars[t + "_B4JSBeforeUnload"];
            i = (i = i.replace(/B4JS#!#KEY/g, e.key)).replace(/B4JS#!#KCODE/g, e.keyCode);
            var o = new Function(i);
            try {
                n = o()
            } catch (e) {}
            0 == n ? b4j_raiseEvent("page_parseevent", {
                eventname: "beforeunload",
                eventparams: ""
            }) : e.preventDefault()
        })
    } else window.alert("WebSockets are not supported by your browser.")
}

function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
}
var hasEvents = !1;
"function" != typeof Object.assign && (Object.assign = function(e) {
        "use strict";
        if (null == e) throw new TypeError("Cannot convert undefined or null to object");
        for (var t = Object(e), n = 1; n < arguments.length; n++) {
            var i = arguments[n];
            if (null != i)
                for (var o in i) i.hasOwnProperty(o) && (t[o] = i[o])
        }
        return t
    }),
    function(e) {
        function t(e, t) {
            var n;
            return t = t || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            }, "undefined" != typeof document ? (n = document.createEvent("CustomEvent")).initCustomEvent(e, t.bubbles, t.cancelable, t.detail) : n = {
                type: e,
                detail: t.detail,
                bubbles: !1,
                cancelable: !1,
                preventDefault: function() {},
                stopPropagation: function() {}
            }, n
        }
        "function" != typeof e.CustomEvent && (e.Event && (t.prototype = e.Event.prototype), e.CustomEvent = t)
    }(this),
    function(e, t) {
        "function" == typeof define && define.amd ? define(function() {
            return e(t, navigator)
        }) : "object" == typeof exports && "object" == typeof module ? module.exports = e(t, navigator) : t.RobustWebSocket = e(t, "undefined" != typeof Mocha ? Mocha : navigator)
    }(function(b, w) {
        var x = function(e, t, n) {
            function i() {
                l && (l = null, clearTimeout(l))
            }

            function o() {
                y && (b.removeEventListener("online", v), b.removeEventListener("offline", g), hasEvents = y = !1)
            }

            function r(e) {
                if (1e3 === e.code || h) return console.log("Stop reconnecting: " + e.code + "," + h), void(IsReconnect = !(d = 0));
                if (!1 !== w.onLine) {
                    var t = m.shouldReconnect(e, u);
                    "number" == typeof t && (l = setTimeout(a, t))
                } else p = !0
            }

            function a() {
                l = null, c = new WebSocket(e), d++, u.dispatchEvent(Object.assign(new CustomEvent("connecting"), {
                    attempts: d,
                    reconnects: f
                })), s = setTimeout(function() {
                    s = null, o(), u.dispatchEvent(Object.assign(new CustomEvent("timeout"), {
                        attempts: d,
                        reconnects: f
                    }))
                }, m.timeout), ["open", "close", "message", "error"].forEach(function(n) {
                    c.addEventListener(n, function(e) {
                        u.dispatchEvent(e);
                        var t = u["on" + n];
                        if ("function" == typeof t) return t.apply(u, arguments)
                    })
                }), y || (b.addEventListener("online", v), b.addEventListener("offline", g), hasEvents = y = !0)
            }
            var s, l, c = {
                    close: function() {}
                },
                u = this,
                d = 0,
                f = -1,
                p = !1,
                h = !1,
                m = Object.assign({}, x.defaultOptions, "function" == typeof n ? {
                    shouldReconnect: n
                } : n);
            if ("number" != typeof m.timeout) throw new Error("timeout must be the number of milliseconds to timeout a connection attempt");
            if ("function" != typeof m.shouldReconnect) throw new Error("shouldReconnect must be a function that returns the number of milliseconds to wait for a reconnect attempt, or null or undefined to not reconnect.");
            ["bufferedAmount", "url", "readyState", "protocol", "extensions"].forEach(function(e) {
                Object.defineProperty(u, e, {
                    get: function() {
                        return c[e]
                    }
                })
            });
            var v = function(e) {
                    p && (i(), r(e))
                },
                g = function() {
                    p = !0, c.close(1e3)
                },
                y = !1;
            u.send = function() {
                return c.send.apply(c, arguments)
            }, u.close = function(e, t) {
                return "number" != typeof e && (t = e, e = 1e3), i(), h = !(p = !1), o(), c.close(e, t)
            }, u.open = function() {
                c.readyState !== WebSocket.OPEN && c.readyState !== WebSocket.CONNECTING && (i(), h = p = !1, a())
            }, u.startReconnect = function(e) {
                IsReconnect = !0, p && (i(), r(e))
            }, Object.defineProperty(u, "listeners", {
                value: {
                    open: [function(e) {
                        s && (clearTimeout(s), s = null), e.reconnects = ++f, e.attempts = d, d = 0, p = !1
                    }],
                    close: [r]
                }
            }), Object.defineProperty(u, "attempts", {
                get: function() {
                    return d
                },
                enumerable: !0
            }), Object.defineProperty(u, "reconnects", {
                get: function() {
                    return f
                },
                enumerable: !0
            }), m.automaticOpen && a()
        };
        return x.defaultOptions = {
            timeout: 1e3,
            shouldReconnect: function(e, t) {
                return "online" === e.type ? 0 : 1008 !== e.code && 1011 !== e.code ? 1e3 : void 0
            },
            automaticOpen: !0
        }, x.prototype.addEventListener = function(e, t) {
            e in this.listeners || (this.listeners[e] = []), this.listeners[e].push(t)
        }, x.prototype.removeEventListener = function(e, t) {
            if (e in this.listeners)
                for (var n = this.listeners[e], i = 0, o = n.length; i < o; i++)
                    if (n[i] === t) return void n.splice(i, 1)
        }, x.prototype.dispatchEvent = function(e) {
            if (e.type in this.listeners)
                for (var t = (e.currentTarget = this).listeners[e.type], n = 0, i = t.length; n < i; n++) t[n].call(this, e)
        }, x
    }, this);
var b4j_ws, WebSocketType, reconnectTimeout, Vel, IsReconnect = !1,
    b4j_closeMessage = !1,
    isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i),
    mySessionId = "";
! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(h, e) {
    function s(e) {
        var t = e.length,
            n = K.type(e);
        return "function" !== n && !K.isWindow(e) && (!(1 !== e.nodeType || !t) || "array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }

    function t(e, n, i) {
        if (K.isFunction(n)) return K.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== i
        });
        if (n.nodeType) return K.grep(e, function(e) {
            return e === n !== i
        });
        if ("string" == typeof n) {
            if (re.test(n)) return K.filter(n, e, i);
            n = K.filter(n, e)
        }
        return K.grep(e, function(e) {
            return 0 <= K.inArray(e, n) !== i
        })
    }

    function n(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function i() {
        se.addEventListener ? (se.removeEventListener("DOMContentLoaded", o, !1), h.removeEventListener("load", o, !1)) : (se.detachEvent("onreadystatechange", o), h.detachEvent("onload", o))
    }

    function o() {
        (se.addEventListener || "load" === event.type || "complete" === se.readyState) && (i(), K.ready())
    }

    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var i = "data-" + t.replace(ge, "-$1").toLowerCase();
            if ("string" == typeof(n = e.getAttribute(i))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : ve.test(n) ? K.parseJSON(n) : n)
                } catch (e) {}
                K.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function c(e) {
        var t;
        for (t in e)
            if (("data" !== t || !K.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function r(e, t, n, i) {
        if (K.acceptData(e)) {
            var o, r, a = K.expando,
                s = e.nodeType,
                l = s ? K.cache : e,
                c = s ? e[a] : e[a] && a;
            if (c && l[c] && (i || l[c].data) || void 0 !== n || "string" != typeof t) return c || (c = s ? e[a] = H.pop() || K.guid++ : a), l[c] || (l[c] = s ? {} : {
                toJSON: K.noop
            }), ("object" == typeof t || "function" == typeof t) && (i ? l[c] = K.extend(l[c], t) : l[c].data = K.extend(l[c].data, t)), r = l[c], i || (r.data || (r.data = {}), r = r.data), void 0 !== n && (r[K.camelCase(t)] = n), "string" == typeof t ? null == (o = r[t]) && (o = r[K.camelCase(t)]) : o = r, o
        }
    }

    function a(e, t, n) {
        if (K.acceptData(e)) {
            var i, o, r = e.nodeType,
                a = r ? K.cache : e,
                s = r ? e[K.expando] : K.expando;
            if (a[s]) {
                if (t && (i = n ? a[s] : a[s].data)) {
                    o = (t = K.isArray(t) ? t.concat(K.map(t, K.camelCase)) : t in i ? [t] : (t = K.camelCase(t)) in i ? [t] : t.split(" ")).length;
                    for (; o--;) delete i[t[o]];
                    if (n ? !c(i) : !K.isEmptyObject(i)) return
                }(n || (delete a[s].data, c(a[s]))) && (r ? K.cleanData([e], !0) : G.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
            }
        }
    }

    function u() {
        return !0
    }

    function d() {
        return !1
    }

    function f() {
        try {
            return se.activeElement
        } catch (e) {}
    }

    function m(e) {
        var t = Oe.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function v(e, t) {
        var n, i, o = 0,
            r = typeof e.getElementsByTagName !== me ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== me ? e.querySelectorAll(t || "*") : void 0;
        if (!r)
            for (r = [], n = e.childNodes || e; null != (i = n[o]); o++) !t || K.nodeName(i, t) ? r.push(i) : K.merge(r, v(i, t));
        return void 0 === t || t && K.nodeName(e, t) ? K.merge([e], r) : r
    }

    function g(e) {
        Ce.test(e.type) && (e.defaultChecked = e.checked)
    }

    function p(e, t) {
        return K.nodeName(e, "table") && K.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function y(e) {
        return e.type = (null !== K.find.attr(e, "type")) + "/" + e.type, e
    }

    function b(e) {
        var t = Be.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function w(e, t) {
        for (var n, i = 0; null != (n = e[i]); i++) K._data(n, "globalEval", !t || K._data(t[i], "globalEval"))
    }

    function x(e, t) {
        if (1 === t.nodeType && K.hasData(e)) {
            var n, i, o, r = K._data(e),
                a = K._data(t, r),
                s = r.events;
            if (s)
                for (n in delete a.handle, a.events = {}, s)
                    for (i = 0, o = s[n].length; i < o; i++) K.event.add(t, n, s[n][i]);
            a.data && (a.data = K.extend({}, a.data))
        }
    }

    function C(e, t) {
        var n, i, o;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !G.noCloneEvent && t[K.expando]) {
                for (i in (o = K._data(t)).events) K.removeEvent(t, i, o.handle);
                t.removeAttribute(K.expando)
            }
            "script" === n && t.text !== e.text ? (y(t).text = e.text, b(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), G.html5Clone && e.innerHTML && !K.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ce.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }

    function S(e, t) {
        var n, i = K(t.createElement(e)).appendTo(t.body),
            o = h.getDefaultComputedStyle && (n = h.getDefaultComputedStyle(i[0])) ? n.display : K.css(i[0], "display");
        return i.detach(), o
    }

    function k(e) {
        var t = se,
            n = Ve[e];
        return n || ("none" !== (n = S(e, t)) && n || ((t = (($e = ($e || K("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentWindow || $e[0].contentDocument).document).write(), t.close(), n = S(e, t), $e.detach()), Ve[e] = n), n
    }

    function T(t, n) {
        return {
            get: function() {
                var e = t();
                return null != e ? e ? void delete this.get : (this.get = n).apply(this, arguments) : void 0
            }
        }
    }

    function E(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, o = ot.length; o--;)
            if ((t = ot[o] + n) in e) return t;
        return i
    }

    function A(e, t) {
        for (var n, i, o, r = [], a = 0, s = e.length; a < s; a++)(i = e[a]).style && (r[a] = K._data(i, "olddisplay"), n = i.style.display, t ? (r[a] || "none" !== n || (i.style.display = ""), "" === i.style.display && we(i) && (r[a] = K._data(i, "olddisplay", k(i.nodeName)))) : (o = we(i), (n && "none" !== n || !o) && K._data(i, "olddisplay", o ? n : K.css(i, "display"))));
        for (a = 0; a < s; a++)(i = e[a]).style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? r[a] || "" : "none"));
        return e
    }

    function O(e, t, n) {
        var i = et.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }

    function N(e, t, n, i, o) {
        for (var r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; r < 4; r += 2) "margin" === n && (a += K.css(e, n + be[r], !0, o)), i ? ("content" === n && (a -= K.css(e, "padding" + be[r], !0, o)), "margin" !== n && (a -= K.css(e, "border" + be[r] + "Width", !0, o))) : (a += K.css(e, "padding" + be[r], !0, o), "padding" !== n && (a += K.css(e, "border" + be[r] + "Width", !0, o)));
        return a
    }

    function j(e, t, n) {
        var i = !0,
            o = "width" === t ? e.offsetWidth : e.offsetHeight,
            r = Qe(e),
            a = G.boxSizing && "border-box" === K.css(e, "boxSizing", !1, r);
        if (o <= 0 || null == o) {
            if (((o = Xe(e, t, r)) < 0 || null == o) && (o = e.style[t]), Ye.test(o)) return o;
            i = a && (G.boxSizingReliable() || o === e.style[t]), o = parseFloat(o) || 0
        }
        return o + N(e, t, n || (a ? "border" : "content"), i, r) + "px"
    }

    function _(e, t, n, i, o) {
        return new _.prototype.init(e, t, n, i, o)
    }

    function P() {
        return setTimeout(function() {
            rt = void 0
        }), rt = K.now()
    }

    function M(e, t) {
        var n, i = {
                height: e
            },
            o = 0;
        for (t = t ? 1 : 0; o < 4; o += 2 - t) i["margin" + (n = be[o])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }

    function D(e, t, n) {
        for (var i, o = (vt[t] || []).concat(vt["*"]), r = 0, a = o.length; r < a; r++)
            if (i = o[r].call(n, t, e)) return i
    }

    function L(r, e, t) {
        var n, a, i = 0,
            o = mt.length,
            s = K.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (a) return !1;
                for (var e = rt || P(), t = Math.max(0, c.startTime + c.duration - e), n = 1 - (t / c.duration || 0), i = 0, o = c.tweens.length; i < o; i++) c.tweens[i].run(n);
                return s.notifyWith(r, [c, n, t]), n < 1 && o ? t : (s.resolveWith(r, [c]), !1)
            },
            c = s.promise({
                elem: r,
                props: K.extend({}, e),
                opts: K.extend(!0, {
                    specialEasing: {}
                }, t),
                originalProperties: e,
                originalOptions: t,
                startTime: rt || P(),
                duration: t.duration,
                tweens: [],
                createTween: function(e, t) {
                    var n = K.Tween(r, c.opts, e, t, c.opts.specialEasing[e] || c.opts.easing);
                    return c.tweens.push(n), n
                },
                stop: function(e) {
                    var t = 0,
                        n = e ? c.tweens.length : 0;
                    if (a) return this;
                    for (a = !0; t < n; t++) c.tweens[t].run(1);
                    return e ? s.resolveWith(r, [c, e]) : s.rejectWith(r, [c, e]), this
                }
            }),
            u = c.props;
        for (function(e, t) {
                var n, i, o, r, a;
                for (n in e)
                    if (o = t[i = K.camelCase(n)], r = e[n], K.isArray(r) && (o = r[1], r = e[n] = r[0]), n !== i && (e[i] = r, delete e[n]), (a = K.cssHooks[i]) && "expand" in a)
                        for (n in r = a.expand(r), delete e[i], r) n in e || (e[n] = r[n], t[n] = o);
                    else t[i] = o
            }(u, c.opts.specialEasing); i < o; i++)
            if (n = mt[i].call(c, r, u, c.opts)) return n;
        return K.map(u, D, c), K.isFunction(c.opts.start) && c.opts.start.call(r, c), K.fx.timer(K.extend(l, {
            elem: r,
            anim: c,
            queue: c.opts.queue
        })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }

    function I(r) {
        return function(e, t) {
            "string" != typeof e && (t = e, e = "*");
            var n, i = 0,
                o = e.toLowerCase().match(fe) || [];
            if (K.isFunction(t))
                for (; n = o[i++];) "+" === n.charAt(0) ? (n = n.slice(1) || "*", (r[n] = r[n] || []).unshift(t)) : (r[n] = r[n] || []).push(t)
        }
    }

    function R(t, o, r, a) {
        function s(e) {
            var i;
            return l[e] = !0, K.each(t[e] || [], function(e, t) {
                var n = t(o, r, a);
                return "string" != typeof n || c || l[n] ? c ? !(i = n) : void 0 : (o.dataTypes.unshift(n), s(n), !1)
            }), i
        }
        var l = {},
            c = t === Bt;
        return s(o.dataTypes[0]) || !l["*"] && s("*")
    }

    function q(e, t) {
        var n, i, o = K.ajaxSettings.flatOptions || {};
        for (i in t) void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
        return n && K.extend(!0, e, n), e
    }

    function B(n, e, i, o) {
        var t;
        if (K.isArray(e)) K.each(e, function(e, t) {
            i || Ht.test(n) ? o(n, t) : B(n + "[" + ("object" == typeof t ? e : "") + "]", t, i, o)
        });
        else if (i || "object" !== K.type(e)) o(n, e);
        else
            for (t in e) B(n + "[" + t + "]", e[t], i, o)
    }

    function F() {
        try {
            return new h.XMLHttpRequest
        } catch (e) {}
    }

    function W(e) {
        return K.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    var H = [],
        $ = H.slice,
        z = H.concat,
        V = H.push,
        Q = H.indexOf,
        X = {},
        U = X.toString,
        Y = X.hasOwnProperty,
        G = {},
        K = function(e, t) {
            return new K.fn.init(e, t)
        },
        J = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        Z = /^-ms-/,
        ee = /-([\da-z])/gi,
        te = function(e, t) {
            return t.toUpperCase()
        };
    K.fn = K.prototype = {
        jquery: "1.11.2",
        constructor: K,
        selector: "",
        length: 0,
        toArray: function() {
            return $.call(this)
        },
        get: function(e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : $.call(this)
        },
        pushStack: function(e) {
            var t = K.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return K.each(this, e, t)
        },
        map: function(n) {
            return this.pushStack(K.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack($.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: V,
        sort: H.sort,
        splice: H.splice
    }, K.extend = K.fn.extend = function() {
        var e, t, n, i, o, r, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof a && (c = a, a = arguments[s] || {}, s++), "object" == typeof a || K.isFunction(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
            if (null != (o = arguments[s]))
                for (i in o) e = a[i], a !== (n = o[i]) && (c && n && (K.isPlainObject(n) || (t = K.isArray(n))) ? (t ? (t = !1, r = e && K.isArray(e) ? e : []) : r = e && K.isPlainObject(e) ? e : {}, a[i] = K.extend(c, r, n)) : void 0 !== n && (a[i] = n));
        return a
    }, K.extend({
        expando: "jQuery" + ("1.11.2" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === K.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === K.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return !K.isArray(e) && 0 <= e - parseFloat(e) + 1
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== K.type(e) || e.nodeType || K.isWindow(e)) return !1;
            try {
                if (e.constructor && !Y.call(e, "constructor") && !Y.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (e) {
                return !1
            }
            if (G.ownLast)
                for (t in e) return Y.call(e, t);
            for (t in e);
            return void 0 === t || Y.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? X[U.call(e)] || "object" : typeof e
        },
        globalEval: function(e) {
            e && K.trim(e) && (h.execScript || function(e) {
                h.eval.call(h, e)
            })(e)
        },
        camelCase: function(e) {
            return e.replace(Z, "ms-").replace(ee, te)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, n) {
            var i = 0,
                o = e.length,
                r = s(e);
            if (n) {
                if (r)
                    for (; i < o && !1 !== t.apply(e[i], n); i++);
                else
                    for (i in e)
                        if (!1 === t.apply(e[i], n)) break
            } else if (r)
                for (; i < o && !1 !== t.call(e[i], i, e[i]); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i])) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(J, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (s(Object(e)) ? K.merge(n, "string" == typeof e ? [e] : e) : V.call(n, e)), n
        },
        inArray: function(e, t, n) {
            var i;
            if (t) {
                if (Q) return Q.call(t, e, n);
                for (i = t.length, n = n ? n < 0 ? Math.max(0, i + n) : n : 0; n < i; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, o = e.length; i < n;) e[o++] = t[i++];
            if (n != n)
                for (; void 0 !== t[i];) e[o++] = t[i++];
            return e.length = o, e
        },
        grep: function(e, t, n) {
            for (var i = [], o = 0, r = e.length, a = !n; o < r; o++) !t(e[o], o) !== a && i.push(e[o]);
            return i
        },
        map: function(e, t, n) {
            var i, o = 0,
                r = e.length,
                a = [];
            if (s(e))
                for (; o < r; o++) null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
            return z.apply([], a)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, i, o;
            return "string" == typeof t && (o = e[t], t = e, e = o), K.isFunction(e) ? (n = $.call(arguments, 2), (i = function() {
                return e.apply(t || this, n.concat($.call(arguments)))
            }).guid = e.guid = e.guid || K.guid++, i) : void 0
        },
        now: function() {
            return +new Date
        },
        support: G
    }), K.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        X["[object " + t + "]"] = t.toLowerCase()
    });
    var ne = function(n) {
        function w(e, t, n, i) {
            var o, r, a, s, l, c, u, d, f, p;
            if ((t ? t.ownerDocument || t : I) !== O && A(t), n = n || [], s = (t = t || O).nodeType, "string" != typeof e || !e || 1 !== s && 9 !== s && 11 !== s) return n;
            if (!i && j) {
                if (11 !== s && (o = pe.exec(e)))
                    if (a = o[1]) {
                        if (9 === s) {
                            if (!(r = t.getElementById(a)) || !r.parentNode) return n;
                            if (r.id === a) return n.push(r), n
                        } else if (t.ownerDocument && (r = t.ownerDocument.getElementById(a)) && D(t, r) && r.id === a) return n.push(r), n
                    } else {
                        if (o[2]) return X.apply(n, t.getElementsByTagName(e)), n;
                        if ((a = o[3]) && v.getElementsByClassName) return X.apply(n, t.getElementsByClassName(a)), n
                    } if (v.qsa && (!_ || !_.test(e))) {
                    if (d = u = L, f = t, p = 1 !== s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                        for (c = S(e), (u = t.getAttribute("id")) ? d = u.replace(me, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", l = c.length; l--;) c[l] = d + m(c[l]);
                        f = he.test(e) && h(t.parentNode) || t, p = c.join(",")
                    }
                    if (p) try {
                        return X.apply(n, f.querySelectorAll(p)), n
                    } catch (e) {} finally {
                        u || t.removeAttribute("id")
                    }
                }
            }
            return b(e.replace(ie, "$1"), t, n, i)
        }

        function e() {
            var i = [];
            return function e(t, n) {
                return i.push(t + " ") > C.cacheLength && delete e[i.shift()], e[t + " "] = n
            }
        }

        function l(e) {
            return e[L] = !0, e
        }

        function i(e) {
            var t = O.createElement("div");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function t(e, t) {
            for (var n = e.split("|"), i = e.length; i--;) C.attrHandle[n[i]] = t
        }

        function c(e, t) {
            var n = t && e,
                i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || 1 << 31) - (~e.sourceIndex || 1 << 31);
            if (i) return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function o(a) {
            return l(function(r) {
                return r = +r, l(function(e, t) {
                    for (var n, i = a([], e.length, r), o = i.length; o--;) e[n = i[o]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }

        function h(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }

        function r() {}

        function m(e) {
            for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
            return i
        }

        function d(a, e, t) {
            var s = e.dir,
                l = t && "parentNode" === s,
                c = q++;
            return e.first ? function(e, t, n) {
                for (; e = e[s];)
                    if (1 === e.nodeType || l) return a(e, t, n)
            } : function(e, t, n) {
                var i, o, r = [R, c];
                if (n) {
                    for (; e = e[s];)
                        if ((1 === e.nodeType || l) && a(e, t, n)) return !0
                } else
                    for (; e = e[s];)
                        if (1 === e.nodeType || l) {
                            if ((i = (o = e[L] || (e[L] = {}))[s]) && i[0] === R && i[1] === c) return r[2] = i[2];
                            if ((o[s] = r)[2] = a(e, t, n)) return !0
                        }
            }
        }

        function f(o) {
            return 1 < o.length ? function(e, t, n) {
                for (var i = o.length; i--;)
                    if (!o[i](e, t, n)) return !1;
                return !0
            } : o[0]
        }

        function x(e, t, n, i, o) {
            for (var r, a = [], s = 0, l = e.length, c = null != t; s < l; s++)(r = e[s]) && (!n || n(r, i, o)) && (a.push(r), c && t.push(s));
            return a
        }

        function y(p, h, m, v, g, e) {
            return v && !v[L] && (v = y(v)), g && !g[L] && (g = y(g, e)), l(function(e, t, n, i) {
                var o, r, a, s = [],
                    l = [],
                    c = t.length,
                    u = e || function(e, t, n) {
                        for (var i = 0, o = t.length; i < o; i++) w(e, t[i], n);
                        return n
                    }(h || "*", n.nodeType ? [n] : n, []),
                    d = !p || !e && h ? u : x(u, s, p, n, i),
                    f = m ? g || (e ? p : c || v) ? [] : t : d;
                if (m && m(d, f, n, i), v)
                    for (o = x(f, l), v(o, [], n, i), r = o.length; r--;)(a = o[r]) && (f[l[r]] = !(d[l[r]] = a));
                if (e) {
                    if (g || p) {
                        if (g) {
                            for (o = [], r = f.length; r--;)(a = f[r]) && o.push(d[r] = a);
                            g(null, f = [], o, i)
                        }
                        for (r = f.length; r--;)(a = f[r]) && -1 < (o = g ? Y(e, a) : s[r]) && (e[o] = !(t[o] = a))
                    }
                } else f = x(f === t ? f.splice(c, f.length) : f), g ? g(null, t, f, i) : X.apply(t, f)
            })
        }

        function p(e) {
            for (var o, t, n, i = e.length, r = C.relative[e[0].type], a = r || C.relative[" "], s = r ? 1 : 0, l = d(function(e) {
                    return e === o
                }, a, !0), c = d(function(e) {
                    return -1 < Y(o, e)
                }, a, !0), u = [function(e, t, n) {
                    var i = !r && (n || t !== k) || ((o = t).nodeType ? l(e, t, n) : c(e, t, n));
                    return o = null, i
                }]; s < i; s++)
                if (t = C.relative[e[s].type]) u = [d(f(u), t)];
                else {
                    if ((t = C.filter[e[s].type].apply(null, e[s].matches))[L]) {
                        for (n = ++s; n < i && !C.relative[e[n].type]; n++);
                        return y(1 < s && f(u), 1 < s && m(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(ie, "$1"), t, s < n && p(e.slice(s, n)), n < i && p(e = e.slice(n)), n < i && m(e))
                    }
                    u.push(t)
                } return f(u)
        }
        var a, v, C, s, u, S, g, b, k, T, E, A, O, N, j, _, P, M, D, L = "sizzle" + 1 * new Date,
            I = n.document,
            R = 0,
            q = 0,
            B = e(),
            F = e(),
            W = e(),
            H = function(e, t) {
                return e === t && (E = !0), 0
            },
            $ = {}.hasOwnProperty,
            z = [],
            V = z.pop,
            Q = z.push,
            X = z.push,
            U = z.slice,
            Y = function(e, t) {
                for (var n = 0, i = e.length; n < i; n++)
                    if (e[n] === t) return n;
                return -1
            },
            G = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            K = "[\\x20\\t\\r\\n\\f]",
            J = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            Z = J.replace("w", "w#"),
            ee = "\\[" + K + "*(" + J + ")(?:" + K + "*([*^$|!~]?=)" + K + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + Z + "))|)" + K + "*\\]",
            te = ":(" + J + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ee + ")*)|.*)\\)|)",
            ne = new RegExp(K + "+", "g"),
            ie = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
            oe = new RegExp("^" + K + "*," + K + "*"),
            re = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
            ae = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
            se = new RegExp(te),
            le = new RegExp("^" + Z + "$"),
            ce = {
                ID: new RegExp("^#(" + J + ")"),
                CLASS: new RegExp("^\\.(" + J + ")"),
                TAG: new RegExp("^(" + J.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + ee),
                PSEUDO: new RegExp("^" + te),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + G + ")$", "i"),
                needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
            },
            ue = /^(?:input|select|textarea|button)$/i,
            de = /^h\d$/i,
            fe = /^[^{]+\{\s*\[native \w/,
            pe = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            he = /[+~]/,
            me = /'|\\/g,
            ve = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
            ge = function(e, t, n) {
                var i = "0x" + t - 65536;
                return i != i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
            },
            ye = function() {
                A()
            };
        try {
            X.apply(z = U.call(I.childNodes), I.childNodes), z[I.childNodes.length].nodeType
        } catch (n) {
            X = {
                apply: z.length ? function(e, t) {
                    Q.apply(e, U.call(t))
                } : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++];);
                    e.length = n - 1
                }
            }
        }
        for (a in v = w.support = {}, u = w.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            }, A = w.setDocument = function(e) {
                var t, n, l = e ? e.ownerDocument || e : I;
                return l !== O && 9 === l.nodeType && l.documentElement ? (N = (O = l).documentElement, (n = l.defaultView) && n !== n.top && (n.addEventListener ? n.addEventListener("unload", ye, !1) : n.attachEvent && n.attachEvent("onunload", ye)), j = !u(l), v.attributes = i(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), v.getElementsByTagName = i(function(e) {
                    return e.appendChild(l.createComment("")), !e.getElementsByTagName("*").length
                }), v.getElementsByClassName = fe.test(l.getElementsByClassName), v.getById = i(function(e) {
                    return N.appendChild(e).id = L, !l.getElementsByName || !l.getElementsByName(L).length
                }), v.getById ? (C.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && j) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, C.filter.ID = function(e) {
                    var t = e.replace(ve, ge);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete C.find.ID, C.filter.ID = function(e) {
                    var n = e.replace(ve, ge);
                    return function(e) {
                        var t = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return t && t.value === n
                    }
                }), C.find.TAG = v.getElementsByTagName ? function(e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : v.qsa ? t.querySelectorAll(e) : void 0
                } : function(e, t) {
                    var n, i = [],
                        o = 0,
                        r = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = r[o++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return r
                }, C.find.CLASS = v.getElementsByClassName && function(e, t) {
                    return j ? t.getElementsByClassName(e) : void 0
                }, P = [], _ = [], (v.qsa = fe.test(l.querySelectorAll)) && (i(function(e) {
                    N.appendChild(e).innerHTML = "<a id='" + L + "'></a><select id='" + L + "-\f]' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && _.push("[*^$]=" + K + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || _.push("\\[" + K + "*(?:value|" + G + ")"), e.querySelectorAll("[id~=" + L + "-]").length || _.push("~="), e.querySelectorAll(":checked").length || _.push(":checked"), e.querySelectorAll("a#" + L + "+*").length || _.push(".#.+[+~]")
                }), i(function(e) {
                    var t = l.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && _.push("name" + K + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || _.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), _.push(",.*:")
                })), (v.matchesSelector = fe.test(M = N.matches || N.webkitMatchesSelector || N.mozMatchesSelector || N.oMatchesSelector || N.msMatchesSelector)) && i(function(e) {
                    v.disconnectedMatch = M.call(e, "div"), M.call(e, "[s!='']:x"), P.push("!=", te)
                }), _ = _.length && new RegExp(_.join("|")), P = P.length && new RegExp(P.join("|")), t = fe.test(N.compareDocumentPosition), D = t || fe.test(N.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, H = t ? function(e, t) {
                    if (e === t) return E = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !v.sortDetached && t.compareDocumentPosition(e) === n ? e === l || e.ownerDocument === I && D(I, e) ? -1 : t === l || t.ownerDocument === I && D(I, t) ? 1 : T ? Y(T, e) - Y(T, t) : 0 : 4 & n ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return E = !0, 0;
                    var n, i = 0,
                        o = e.parentNode,
                        r = t.parentNode,
                        a = [e],
                        s = [t];
                    if (!o || !r) return e === l ? -1 : t === l ? 1 : o ? -1 : r ? 1 : T ? Y(T, e) - Y(T, t) : 0;
                    if (o === r) return c(e, t);
                    for (n = e; n = n.parentNode;) a.unshift(n);
                    for (n = t; n = n.parentNode;) s.unshift(n);
                    for (; a[i] === s[i];) i++;
                    return i ? c(a[i], s[i]) : a[i] === I ? -1 : s[i] === I ? 1 : 0
                }, l) : O
            }, w.matches = function(e, t) {
                return w(e, null, null, t)
            }, w.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== O && A(e), t = t.replace(ae, "='$1']"), !(!v.matchesSelector || !j || P && P.test(t) || _ && _.test(t))) try {
                    var n = M.call(e, t);
                    if (n || v.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                } catch (e) {}
                return 0 < w(t, O, null, [e]).length
            }, w.contains = function(e, t) {
                return (e.ownerDocument || e) !== O && A(e), D(e, t)
            }, w.attr = function(e, t) {
                (e.ownerDocument || e) !== O && A(e);
                var n = C.attrHandle[t.toLowerCase()],
                    i = n && $.call(C.attrHandle, t.toLowerCase()) ? n(e, t, !j) : void 0;
                return void 0 !== i ? i : v.attributes || !j ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }, w.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, w.uniqueSort = function(e) {
                var t, n = [],
                    i = 0,
                    o = 0;
                if (E = !v.detectDuplicates, T = !v.sortStable && e.slice(0), e.sort(H), E) {
                    for (; t = e[o++];) t === e[o] && (i = n.push(o));
                    for (; i--;) e.splice(n[i], 1)
                }
                return T = null, e
            }, s = w.getText = function(e) {
                var t, n = "",
                    i = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += s(e)
                    } else if (3 === o || 4 === o) return e.nodeValue
                } else
                    for (; t = e[i++];) n += s(t);
                return n
            }, (C = w.selectors = {
                cacheLength: 50,
                createPseudo: l,
                match: ce,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(ve, ge), e[3] = (e[3] || e[4] || e[5] || "").replace(ve, ge), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || w.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && w.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return ce.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && se.test(n) && (t = S(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(ve, ge).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = B[e + " "];
                        return t || (t = new RegExp("(^|" + K + ")" + e + "(" + K + "|$)")) && B(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(n, i, o) {
                        return function(e) {
                            var t = w.attr(e, n);
                            return null == t ? "!=" === i : !i || (t += "", "=" === i ? t === o : "!=" === i ? t !== o : "^=" === i ? o && 0 === t.indexOf(o) : "*=" === i ? o && -1 < t.indexOf(o) : "$=" === i ? o && t.slice(-o.length) === o : "~=" === i ? -1 < (" " + t.replace(ne, " ") + " ").indexOf(o) : "|=" === i && (t === o || t.slice(0, o.length + 1) === o + "-"))
                        }
                    },
                    CHILD: function(p, e, t, h, m) {
                        var v = "nth" !== p.slice(0, 3),
                            g = "last" !== p.slice(-4),
                            y = "of-type" === e;
                        return 1 === h && 0 === m ? function(e) {
                            return !!e.parentNode
                        } : function(e, t, n) {
                            var i, o, r, a, s, l, c = v !== g ? "nextSibling" : "previousSibling",
                                u = e.parentNode,
                                d = y && e.nodeName.toLowerCase(),
                                f = !n && !y;
                            if (u) {
                                if (v) {
                                    for (; c;) {
                                        for (r = e; r = r[c];)
                                            if (y ? r.nodeName.toLowerCase() === d : 1 === r.nodeType) return !1;
                                        l = c = "only" === p && !l && "nextSibling"
                                    }
                                    return !0
                                }
                                if (l = [g ? u.firstChild : u.lastChild], g && f) {
                                    for (s = (i = (o = u[L] || (u[L] = {}))[p] || [])[0] === R && i[1], a = i[0] === R && i[2], r = s && u.childNodes[s]; r = ++s && r && r[c] || (a = s = 0) || l.pop();)
                                        if (1 === r.nodeType && ++a && r === e) {
                                            o[p] = [R, s, a];
                                            break
                                        }
                                } else if (f && (i = (e[L] || (e[L] = {}))[p]) && i[0] === R) a = i[1];
                                else
                                    for (;
                                        (r = ++s && r && r[c] || (a = s = 0) || l.pop()) && ((y ? r.nodeName.toLowerCase() !== d : 1 !== r.nodeType) || !++a || (f && ((r[L] || (r[L] = {}))[p] = [R, a]), r !== e)););
                                return (a -= m) === h || a % h == 0 && 0 <= a / h
                            }
                        }
                    },
                    PSEUDO: function(e, r) {
                        var t, a = C.pseudos[e] || C.setFilters[e.toLowerCase()] || w.error("unsupported pseudo: " + e);
                        return a[L] ? a(r) : 1 < a.length ? (t = [e, e, "", r], C.setFilters.hasOwnProperty(e.toLowerCase()) ? l(function(e, t) {
                            for (var n, i = a(e, r), o = i.length; o--;) e[n = Y(e, i[o])] = !(t[n] = i[o])
                        }) : function(e) {
                            return a(e, 0, t)
                        }) : a
                    }
                },
                pseudos: {
                    not: l(function(e) {
                        var i = [],
                            o = [],
                            s = g(e.replace(ie, "$1"));
                        return s[L] ? l(function(e, t, n, i) {
                            for (var o, r = s(e, null, i, []), a = e.length; a--;)(o = r[a]) && (e[a] = !(t[a] = o))
                        }) : function(e, t, n) {
                            return i[0] = e, s(i, null, n, o), i[0] = null, !o.pop()
                        }
                    }),
                    has: l(function(t) {
                        return function(e) {
                            return 0 < w(t, e).length
                        }
                    }),
                    contains: l(function(t) {
                        return t = t.replace(ve, ge),
                            function(e) {
                                return -1 < (e.textContent || e.innerText || s(e)).indexOf(t)
                            }
                    }),
                    lang: l(function(n) {
                        return le.test(n || "") || w.error("unsupported lang: " + n), n = n.replace(ve, ge).toLowerCase(),
                            function(e) {
                                var t;
                                do {
                                    if (t = j ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                                } while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function(e) {
                        var t = n.location && n.location.hash;
                        return t && t.slice(1) === e.id
                    },
                    root: function(e) {
                        return e === N
                    },
                    focus: function(e) {
                        return e === O.activeElement && (!O.hasFocus || O.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function(e) {
                        return !1 === e.disabled
                    },
                    disabled: function(e) {
                        return !0 === e.disabled
                    },
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !C.pseudos.empty(e)
                    },
                    header: function(e) {
                        return de.test(e.nodeName)
                    },
                    input: function(e) {
                        return ue.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: o(function() {
                        return [0]
                    }),
                    last: o(function(e, t) {
                        return [t - 1]
                    }),
                    eq: o(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: o(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: o(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: o(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; 0 <= --i;) e.push(i);
                        return e
                    }),
                    gt: o(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }).pseudos.nth = C.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) C.pseudos[a] = function(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }(a);
        for (a in {
                submit: !0,
                reset: !0
            }) C.pseudos[a] = function(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }(a);
        return r.prototype = C.filters = C.pseudos, C.setFilters = new r, S = w.tokenize = function(e, t) {
            var n, i, o, r, a, s, l, c = F[e + " "];
            if (c) return t ? 0 : c.slice(0);
            for (a = e, s = [], l = C.preFilter; a;) {
                for (r in (!n || (i = oe.exec(a))) && (i && (a = a.slice(i[0].length) || a), s.push(o = [])), n = !1, (i = re.exec(a)) && (n = i.shift(), o.push({
                        value: n,
                        type: i[0].replace(ie, " ")
                    }), a = a.slice(n.length)), C.filter) !(i = ce[r].exec(a)) || l[r] && !(i = l[r](i)) || (n = i.shift(), o.push({
                    value: n,
                    type: r,
                    matches: i
                }), a = a.slice(n.length));
                if (!n) break
            }
            return t ? a.length : a ? w.error(e) : F(e, s).slice(0)
        }, g = w.compile = function(e, t) {
            var n, v, g, y, b, i, o = [],
                r = [],
                a = W[e + " "];
            if (!a) {
                for (t || (t = S(e)), n = t.length; n--;)(a = p(t[n]))[L] ? o.push(a) : r.push(a);
                (a = W(e, (v = r, g = o, y = 0 < g.length, b = 0 < v.length, i = function(e, t, n, i, o) {
                    var r, a, s, l = 0,
                        c = "0",
                        u = e && [],
                        d = [],
                        f = k,
                        p = e || b && C.find.TAG("*", o),
                        h = R += null == f ? 1 : Math.random() || .1,
                        m = p.length;
                    for (o && (k = t !== O && t); c !== m && null != (r = p[c]); c++) {
                        if (b && r) {
                            for (a = 0; s = v[a++];)
                                if (s(r, t, n)) {
                                    i.push(r);
                                    break
                                } o && (R = h)
                        }
                        y && ((r = !s && r) && l--, e && u.push(r))
                    }
                    if (l += c, y && c !== l) {
                        for (a = 0; s = g[a++];) s(u, d, t, n);
                        if (e) {
                            if (0 < l)
                                for (; c--;) u[c] || d[c] || (d[c] = V.call(i));
                            d = x(d)
                        }
                        X.apply(i, d), o && !e && 0 < d.length && 1 < l + g.length && w.uniqueSort(i)
                    }
                    return o && (R = h, k = f), u
                }, y ? l(i) : i))).selector = e
            }
            return a
        }, b = w.select = function(e, t, n, i) {
            var o, r, a, s, l, c = "function" == typeof e && e,
                u = !i && S(e = c.selector || e);
            if (n = n || [], 1 === u.length) {
                if (2 < (r = u[0] = u[0].slice(0)).length && "ID" === (a = r[0]).type && v.getById && 9 === t.nodeType && j && C.relative[r[1].type]) {
                    if (!(t = (C.find.ID(a.matches[0].replace(ve, ge), t) || [])[0])) return n;
                    c && (t = t.parentNode), e = e.slice(r.shift().value.length)
                }
                for (o = ce.needsContext.test(e) ? 0 : r.length; o-- && (a = r[o], !C.relative[s = a.type]);)
                    if ((l = C.find[s]) && (i = l(a.matches[0].replace(ve, ge), he.test(r[0].type) && h(t.parentNode) || t))) {
                        if (r.splice(o, 1), !(e = i.length && m(r))) return X.apply(n, i), n;
                        break
                    }
            }
            return (c || g(e, u))(i, t, !j, n, he.test(e) && h(t.parentNode) || t), n
        }, v.sortStable = L.split("").sort(H).join("") === L, v.detectDuplicates = !!E, A(), v.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(O.createElement("div"))
        }), i(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || t("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), v.attributes && i(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || t("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), i(function(e) {
            return null == e.getAttribute("disabled")
        }) || t(G, function(e, t, n) {
            var i;
            return n ? void 0 : !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }), w
    }(h);
    K.find = ne, K.expr = ne.selectors, K.expr[":"] = K.expr.pseudos, K.unique = ne.uniqueSort, K.text = ne.getText, K.isXMLDoc = ne.isXML, K.contains = ne.contains;
    var ie = K.expr.match.needsContext,
        oe = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        re = /^.[^:#\[\.,]*$/;
    K.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? K.find.matchesSelector(i, e) ? [i] : [] : K.find.matches(e, K.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, K.fn.extend({
        find: function(e) {
            var t, n = [],
                i = this,
                o = i.length;
            if ("string" != typeof e) return this.pushStack(K(e).filter(function() {
                for (t = 0; t < o; t++)
                    if (K.contains(i[t], this)) return !0
            }));
            for (t = 0; t < o; t++) K.find(e, i[t], n);
            return (n = this.pushStack(1 < o ? K.unique(n) : n)).selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(t(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(t(this, e || [], !0))
        },
        is: function(e) {
            return !!t(this, "string" == typeof e && ie.test(e) ? K(e) : e || [], !1).length
        }
    });
    var ae, se = h.document,
        le = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (K.fn.init = function(e, t) {
        var n, i;
        if (!e) return this;
        if ("string" == typeof e) {
            if (!(n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && 3 <= e.length ? [null, e, null] : le.exec(e)) || !n[1] && t) return !t || t.jquery ? (t || ae).find(e) : this.constructor(t).find(e);
            if (n[1]) {
                if (t = t instanceof K ? t[0] : t, K.merge(this, K.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : se, !0)), oe.test(n[1]) && K.isPlainObject(t))
                    for (n in t) K.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                return this
            }
            if ((i = se.getElementById(n[2])) && i.parentNode) {
                if (i.id !== n[2]) return ae.find(e);
                this.length = 1, this[0] = i
            }
            return this.context = se, this.selector = e, this
        }
        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : K.isFunction(e) ? void 0 !== ae.ready ? ae.ready(e) : e(K) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), K.makeArray(e, this))
    }).prototype = K.fn, ae = K(se);
    var ce = /^(?:parents|prev(?:Until|All))/,
        ue = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    K.extend({
        dir: function(e, t, n) {
            for (var i = [], o = e[t]; o && 9 !== o.nodeType && (void 0 === n || 1 !== o.nodeType || !K(o).is(n));) 1 === o.nodeType && i.push(o), o = o[t];
            return i
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), K.fn.extend({
        has: function(e) {
            var t, n = K(e, this),
                i = n.length;
            return this.filter(function() {
                for (t = 0; t < i; t++)
                    if (K.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, i = 0, o = this.length, r = [], a = ie.test(e) || "string" != typeof e ? K(e, t || this.context) : 0; i < o; i++)
                for (n = this[i]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && K.find.matchesSelector(n, e))) {
                        r.push(n);
                        break
                    } return this.pushStack(1 < r.length ? K.unique(r) : r)
        },
        index: function(e) {
            return e ? "string" == typeof e ? K.inArray(this[0], K(e)) : K.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(K.unique(K.merge(this.get(), K(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), K.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return K.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return K.dir(e, "parentNode", n)
        },
        next: function(e) {
            return n(e, "nextSibling")
        },
        prev: function(e) {
            return n(e, "previousSibling")
        },
        nextAll: function(e) {
            return K.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return K.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return K.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return K.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return K.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return K.sibling(e.firstChild)
        },
        contents: function(e) {
            return K.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : K.merge([], e.childNodes)
        }
    }, function(i, o) {
        K.fn[i] = function(e, t) {
            var n = K.map(this, o, e);
            return "Until" !== i.slice(-5) && (t = e), t && "string" == typeof t && (n = K.filter(t, n)), 1 < this.length && (ue[i] || (n = K.unique(n)), ce.test(i) && (n = n.reverse())), this.pushStack(n)
        }
    });
    var de, fe = /\S+/g,
        pe = {};
    K.Callbacks = function(o) {
        var i, t, n, r, a, s, e, l, c = [],
            u = !(o = "string" == typeof o ? pe[o] || (e = o, l = pe[e] = {}, K.each(e.match(fe) || [], function(e, t) {
                l[t] = !0
            }), l) : K.extend({}, o)).once && [],
            d = function(e) {
                for (t = o.memory && e, n = !0, a = s || 0, s = 0, r = c.length, i = !0; c && a < r; a++)
                    if (!1 === c[a].apply(e[0], e[1]) && o.stopOnFalse) {
                        t = !1;
                        break
                    } i = !1, c && (u ? u.length && d(u.shift()) : t ? c = [] : f.disable())
            },
            f = {
                add: function() {
                    if (c) {
                        var e = c.length;
                        ! function i(e) {
                            K.each(e, function(e, t) {
                                var n = K.type(t);
                                "function" === n ? o.unique && f.has(t) || c.push(t) : t && t.length && "string" !== n && i(t)
                            })
                        }(arguments), i ? r = c.length : t && (s = e, d(t))
                    }
                    return this
                },
                remove: function() {
                    return c && K.each(arguments, function(e, t) {
                        for (var n; - 1 < (n = K.inArray(t, c, n));) c.splice(n, 1), i && (n <= r && r--, n <= a && a--)
                    }), this
                },
                has: function(e) {
                    return e ? -1 < K.inArray(e, c) : !(!c || !c.length)
                },
                empty: function() {
                    return c = [], r = 0, this
                },
                disable: function() {
                    return c = u = t = void 0, this
                },
                disabled: function() {
                    return !c
                },
                lock: function() {
                    return u = void 0, t || f.disable(), this
                },
                locked: function() {
                    return !u
                },
                fireWith: function(e, t) {
                    return !c || n && !u || (t = [e, (t = t || []).slice ? t.slice() : t], i ? u.push(t) : d(t)), this
                },
                fire: function() {
                    return f.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!n
                }
            };
        return f
    }, K.extend({
        Deferred: function(e) {
            var r = [
                    ["resolve", "done", K.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", K.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", K.Callbacks("memory")]
                ],
                o = "pending",
                a = {
                    state: function() {
                        return o
                    },
                    always: function() {
                        return s.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var o = arguments;
                        return K.Deferred(function(i) {
                            K.each(r, function(e, t) {
                                var n = K.isFunction(o[e]) && o[e];
                                s[t[1]](function() {
                                    var e = n && n.apply(this, arguments);
                                    e && K.isFunction(e.promise) ? e.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[t[0] + "With"](this === a ? i.promise() : this, n ? [e] : arguments)
                                })
                            }), o = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? K.extend(e, a) : a
                    }
                },
                s = {};
            return a.pipe = a.then, K.each(r, function(e, t) {
                var n = t[2],
                    i = t[3];
                a[t[1]] = n.add, i && n.add(function() {
                    o = i
                }, r[1 ^ e][2].disable, r[2][2].lock), s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? a : this, arguments), this
                }, s[t[0] + "With"] = n.fireWith
            }), a.promise(s), e && e.call(s, s), s
        },
        when: function(e) {
            var o, t, n, i = 0,
                r = $.call(arguments),
                a = r.length,
                s = 1 !== a || e && K.isFunction(e.promise) ? a : 0,
                l = 1 === s ? e : K.Deferred(),
                c = function(t, n, i) {
                    return function(e) {
                        n[t] = this, i[t] = 1 < arguments.length ? $.call(arguments) : e, i === o ? l.notifyWith(n, i) : --s || l.resolveWith(n, i)
                    }
                };
            if (1 < a)
                for (o = new Array(a), t = new Array(a), n = new Array(a); i < a; i++) r[i] && K.isFunction(r[i].promise) ? r[i].promise().done(c(i, n, r)).fail(l.reject).progress(c(i, t, o)) : --s;
            return s || l.resolveWith(n, r), l.promise()
        }
    }), K.fn.ready = function(e) {
        return K.ready.promise().done(e), this
    }, K.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? K.readyWait++ : K.ready(!0)
        },
        ready: function(e) {
            if (!0 === e ? !--K.readyWait : !K.isReady) {
                if (!se.body) return setTimeout(K.ready);
                (K.isReady = !0) !== e && 0 < --K.readyWait || (de.resolveWith(se, [K]), K.fn.triggerHandler && (K(se).triggerHandler("ready"), K(se).off("ready")))
            }
        }
    }), K.ready.promise = function(e) {
        if (!de)
            if (de = K.Deferred(), "complete" === se.readyState) setTimeout(K.ready);
            else if (se.addEventListener) se.addEventListener("DOMContentLoaded", o, !1), h.addEventListener("load", o, !1);
        else {
            se.attachEvent("onreadystatechange", o), h.attachEvent("onload", o);
            var n = !1;
            try {
                n = null == h.frameElement && se.documentElement
            } catch (e) {}
            n && n.doScroll && function t() {
                if (!K.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (e) {
                        return setTimeout(t, 50)
                    }
                    i(), K.ready()
                }
            }()
        }
        return de.promise(e)
    };
    var he, me = "undefined";
    for (he in K(G)) break;
    G.ownLast = "0" !== he, G.inlineBlockNeedsLayout = !1, K(function() {
            var e, t, n, i;
            (n = se.getElementsByTagName("body")[0]) && n.style && (t = se.createElement("div"), (i = se.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== me && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", G.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(i))
        }),
        function() {
            var e = se.createElement("div");
            if (null == G.deleteExpando) {
                G.deleteExpando = !0;
                try {
                    delete e.test
                } catch (e) {
                    G.deleteExpando = !1
                }
            }
            e = null
        }(), K.acceptData = function(e) {
            var t = K.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return (1 === n || 9 === n) && (!t || !0 !== t && e.getAttribute("classid") === t)
        };
    var ve = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        ge = /([A-Z])/g;
    K.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return !!(e = e.nodeType ? K.cache[e[K.expando]] : e[K.expando]) && !c(e)
        },
        data: function(e, t, n) {
            return r(e, t, n)
        },
        removeData: function(e, t) {
            return a(e, t)
        },
        _data: function(e, t, n) {
            return r(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return a(e, t, !0)
        }
    }), K.fn.extend({
        data: function(e, t) {
            var n, i, o, r = this[0],
                a = r && r.attributes;
            if (void 0 === e) {
                if (this.length && (o = K.data(r), 1 === r.nodeType && !K._data(r, "parsedAttrs"))) {
                    for (n = a.length; n--;) a[n] && 0 === (i = a[n].name).indexOf("data-") && l(r, i = K.camelCase(i.slice(5)), o[i]);
                    K._data(r, "parsedAttrs", !0)
                }
                return o
            }
            return "object" == typeof e ? this.each(function() {
                K.data(this, e)
            }) : 1 < arguments.length ? this.each(function() {
                K.data(this, e, t)
            }) : r ? l(r, e, K.data(r, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                K.removeData(this, e)
            })
        }
    }), K.extend({
        queue: function(e, t, n) {
            var i;
            return e ? (t = (t || "fx") + "queue", i = K._data(e, t), n && (!i || K.isArray(n) ? i = K._data(e, t, K.makeArray(n)) : i.push(n)), i || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = K.queue(e, t),
                i = n.length,
                o = n.shift(),
                r = K._queueHooks(e, t);
            "inprogress" === o && (o = n.shift(), i--), o && ("fx" === t && n.unshift("inprogress"), delete r.stop, o.call(e, function() {
                K.dequeue(e, t)
            }, r)), !i && r && r.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return K._data(e, n) || K._data(e, n, {
                empty: K.Callbacks("once memory").add(function() {
                    K._removeData(e, t + "queue"), K._removeData(e, n)
                })
            })
        }
    }), K.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t, t = "fx", e--), arguments.length < e ? K.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = K.queue(this, t, n);
                K._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && K.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                K.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, i = 1,
                o = K.Deferred(),
                r = this,
                a = this.length,
                s = function() {
                    --i || o.resolveWith(r, [r])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(n = K._data(r[a], e + "queueHooks")) && n.empty && (i++, n.empty.add(s));
            return s(), o.promise(t)
        }
    });
    var ye = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        be = ["Top", "Right", "Bottom", "Left"],
        we = function(e, t) {
            return e = t || e, "none" === K.css(e, "display") || !K.contains(e.ownerDocument, e)
        },
        xe = K.access = function(e, t, n, i, o, r, a) {
            var s = 0,
                l = e.length,
                c = null == n;
            if ("object" === K.type(n))
                for (s in o = !0, n) K.access(e, t, s, n[s], !0, r, a);
            else if (void 0 !== i && (o = !0, K.isFunction(i) || (a = !0), c && (a ? (t.call(e, i), t = null) : (c = t, t = function(e, t, n) {
                    return c.call(K(e), n)
                })), t))
                for (; s < l; s++) t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)));
            return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
        },
        Ce = /^(?:checkbox|radio)$/i;
    ! function() {
        var e = se.createElement("input"),
            t = se.createElement("div"),
            n = se.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", G.leadingWhitespace = 3 === t.firstChild.nodeType, G.tbody = !t.getElementsByTagName("tbody").length, G.htmlSerialize = !!t.getElementsByTagName("link").length, G.html5Clone = "<:nav></:nav>" !== se.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), G.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", G.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", G.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, G.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
                G.noCloneEvent = !1
            }), t.cloneNode(!0).click()), null == G.deleteExpando) {
            G.deleteExpando = !0;
            try {
                delete t.test
            } catch (e) {
                G.deleteExpando = !1
            }
        }
    }(),
    function() {
        var e, t, n = se.createElement("div");
        for (e in {
                submit: !0,
                change: !0,
                focusin: !0
            }) t = "on" + e, (G[e + "Bubbles"] = t in h) || (n.setAttribute(t, "t"), G[e + "Bubbles"] = !1 === n.attributes[t].expando);
        n = null
    }();
    var Se = /^(?:input|select|textarea)$/i,
        ke = /^key/,
        Te = /^(?:mouse|pointer|contextmenu)|click/,
        Ee = /^(?:focusinfocus|focusoutblur)$/,
        Ae = /^([^.]*)(?:\.(.+)|)$/;
    K.event = {
        global: {},
        add: function(e, t, n, i, o) {
            var r, a, s, l, c, u, d, f, p, h, m, v = K._data(e);
            if (v) {
                for (n.handler && (n = (l = n).handler, o = l.selector), n.guid || (n.guid = K.guid++), (a = v.events) || (a = v.events = {}), (u = v.handle) || ((u = v.handle = function(e) {
                        return typeof K === me || e && K.event.triggered === e.type ? void 0 : K.event.dispatch.apply(u.elem, arguments)
                    }).elem = e), s = (t = (t || "").match(fe) || [""]).length; s--;) p = m = (r = Ae.exec(t[s]) || [])[1], h = (r[2] || "").split(".").sort(), p && (c = K.event.special[p] || {}, p = (o ? c.delegateType : c.bindType) || p, c = K.event.special[p] || {}, d = K.extend({
                    type: p,
                    origType: m,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: o,
                    needsContext: o && K.expr.match.needsContext.test(o),
                    namespace: h.join(".")
                }, l), (f = a[p]) || ((f = a[p] = []).delegateCount = 0, c.setup && !1 !== c.setup.call(e, i, h, u) || (e.addEventListener ? e.addEventListener(p, u, !1) : e.attachEvent && e.attachEvent("on" + p, u))), c.add && (c.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), o ? f.splice(f.delegateCount++, 0, d) : f.push(d), K.event.global[p] = !0);
                e = null
            }
        },
        remove: function(e, t, n, i, o) {
            var r, a, s, l, c, u, d, f, p, h, m, v = K.hasData(e) && K._data(e);
            if (v && (u = v.events)) {
                for (c = (t = (t || "").match(fe) || [""]).length; c--;)
                    if (p = m = (s = Ae.exec(t[c]) || [])[1], h = (s[2] || "").split(".").sort(), p) {
                        for (d = K.event.special[p] || {}, f = u[p = (i ? d.delegateType : d.bindType) || p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = r = f.length; r--;) a = f[r], !o && m !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || i && i !== a.selector && ("**" !== i || !a.selector) || (f.splice(r, 1), a.selector && f.delegateCount--, d.remove && d.remove.call(e, a));
                        l && !f.length && (d.teardown && !1 !== d.teardown.call(e, h, v.handle) || K.removeEvent(e, p, v.handle), delete u[p])
                    } else
                        for (p in u) K.event.remove(e, p + t[c], n, i, !0);
                K.isEmptyObject(u) && (delete v.handle, K._removeData(e, "events"))
            }
        },
        trigger: function(e, t, n, i) {
            var o, r, a, s, l, c, u, d = [n || se],
                f = Y.call(e, "type") ? e.type : e,
                p = Y.call(e, "namespace") ? e.namespace.split(".") : [];
            if (a = c = n = n || se, 3 !== n.nodeType && 8 !== n.nodeType && !Ee.test(f + K.event.triggered) && (0 <= f.indexOf(".") && (f = (p = f.split(".")).shift(), p.sort()), r = f.indexOf(":") < 0 && "on" + f, (e = e[K.expando] ? e : new K.Event(f, "object" == typeof e && e)).isTrigger = i ? 2 : 3, e.namespace = p.join("."), e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : K.makeArray(t, [e]), l = K.event.special[f] || {}, i || !l.trigger || !1 !== l.trigger.apply(n, t))) {
                if (!i && !l.noBubble && !K.isWindow(n)) {
                    for (s = l.delegateType || f, Ee.test(s + f) || (a = a.parentNode); a; a = a.parentNode) d.push(a), c = a;
                    c === (n.ownerDocument || se) && d.push(c.defaultView || c.parentWindow || h)
                }
                for (u = 0;
                    (a = d[u++]) && !e.isPropagationStopped();) e.type = 1 < u ? s : l.bindType || f, (o = (K._data(a, "events") || {})[e.type] && K._data(a, "handle")) && o.apply(a, t), (o = r && a[r]) && o.apply && K.acceptData(a) && (e.result = o.apply(a, t), !1 === e.result && e.preventDefault());
                if (e.type = f, !i && !e.isDefaultPrevented() && (!l._default || !1 === l._default.apply(d.pop(), t)) && K.acceptData(n) && r && n[f] && !K.isWindow(n)) {
                    (c = n[r]) && (n[r] = null), K.event.triggered = f;
                    try {
                        n[f]()
                    } catch (e) {}
                    K.event.triggered = void 0, c && (n[r] = c)
                }
                return e.result
            }
        },
        dispatch: function(e) {
            e = K.event.fix(e);
            var t, n, i, o, r, a = [],
                s = $.call(arguments),
                l = (K._data(this, "events") || {})[e.type] || [],
                c = K.event.special[e.type] || {};
            if ((s[0] = e).delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, e)) {
                for (a = K.event.handlers.call(this, e, l), t = 0;
                    (o = a[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = o.elem, r = 0;
                        (i = o.handlers[r++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, void 0 !== (n = ((K.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, s)) && !1 === (e.result = n) && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, i, o, r, a = [],
                s = t.delegateCount,
                l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
                        for (o = [], r = 0; r < s; r++) void 0 === o[n = (i = t[r]).selector + " "] && (o[n] = i.needsContext ? 0 <= K(n, this).index(l) : K.find(n, this, null, [l]).length), o[n] && o.push(i);
                        o.length && a.push({
                            elem: l,
                            handlers: o
                        })
                    } return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }), a
        },
        fix: function(e) {
            if (e[K.expando]) return e;
            var t, n, i, o = e.type,
                r = e,
                a = this.fixHooks[o];
            for (a || (this.fixHooks[o] = a = Te.test(o) ? this.mouseHooks : ke.test(o) ? this.keyHooks : {}), i = a.props ? this.props.concat(a.props) : this.props, e = new K.Event(r), t = i.length; t--;) e[n = i[t]] = r[n];
            return e.target || (e.target = r.srcElement || se), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, r) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, i, o, r = t.button,
                    a = t.fromElement;
                return null == e.pageX && null != t.clientX && (o = (i = e.target.ownerDocument || se).documentElement, n = i.body, e.pageX = t.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a), e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== f() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === f() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return K.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return K.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, i) {
            var o = K.extend(new K.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? K.event.trigger(o, null, t) : K.event.dispatch.call(t, o), o.isDefaultPrevented() && n.preventDefault()
        }
    }, K.removeEvent = se.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        var i = "on" + t;
        e.detachEvent && (typeof e[i] === me && (e[i] = null), e.detachEvent(i, n))
    }, K.Event = function(e, t) {
        return this instanceof K.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? u : d) : this.type = e, t && K.extend(this, t), this.timeStamp = e && e.timeStamp || K.now(), void(this[K.expando] = !0)) : new K.Event(e, t)
    }, K.Event.prototype = {
        isDefaultPrevented: d,
        isPropagationStopped: d,
        isImmediatePropagationStopped: d,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = u, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = u, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = u, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, K.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, o) {
        K.event.special[e] = {
            delegateType: o,
            bindType: o,
            handle: function(e) {
                var t, n = e.relatedTarget,
                    i = e.handleObj;
                return (!n || n !== this && !K.contains(this, n)) && (e.type = i.origType, t = i.handler.apply(this, arguments), e.type = o), t
            }
        }
    }), G.submitBubbles || (K.event.special.submit = {
        setup: function() {
            return !K.nodeName(this, "form") && void K.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = K.nodeName(t, "input") || K.nodeName(t, "button") ? t.form : void 0;
                n && !K._data(n, "submitBubbles") && (K.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), K._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && K.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            return !K.nodeName(this, "form") && void K.event.remove(this, "._submit")
        }
    }), G.changeBubbles || (K.event.special.change = {
        setup: function() {
            return Se.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (K.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), K.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), K.event.simulate("change", this, e, !0)
            })), !1) : void K.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                Se.test(t.nodeName) && !K._data(t, "changeBubbles") && (K.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || K.event.simulate("change", this.parentNode, e, !0)
                }), K._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return K.event.remove(this, "._change"), !Se.test(this.nodeName)
        }
    }), G.focusinBubbles || K.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, i) {
        var o = function(e) {
            K.event.simulate(i, e.target, K.event.fix(e), !0)
        };
        K.event.special[i] = {
            setup: function() {
                var e = this.ownerDocument || this,
                    t = K._data(e, i);
                t || e.addEventListener(n, o, !0), K._data(e, i, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this,
                    t = K._data(e, i) - 1;
                t ? K._data(e, i, t) : (e.removeEventListener(n, o, !0), K._removeData(e, i))
            }
        }
    }), K.fn.extend({
        on: function(e, t, n, i, o) {
            var r, a;
            if ("object" == typeof e) {
                for (r in "string" != typeof t && (n = n || t, t = void 0), e) this.on(r, t, n, e[r], o);
                return this
            }
            if (null == n && null == i ? (i = t, n = t = void 0) : null == i && ("string" == typeof t ? (i = n, n = void 0) : (i = n, n = t, t = void 0)), !1 === i) i = d;
            else if (!i) return this;
            return 1 === o && (a = i, (i = function(e) {
                return K().off(e), a.apply(this, arguments)
            }).guid = a.guid || (a.guid = K.guid++)), this.each(function() {
                K.event.add(this, e, i, n, t)
            })
        },
        one: function(e, t, n, i) {
            return this.on(e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, o;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, K(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (o in e) this.off(o, t, e[o]);
                return this
            }
            return (!1 === t || "function" == typeof t) && (n = t, t = void 0), !1 === n && (n = d), this.each(function() {
                K.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                K.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? K.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Oe = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        Ne = / jQuery\d+="(?:null|\d+)"/g,
        je = new RegExp("<(?:" + Oe + ")[\\s/>]", "i"),
        _e = /^\s+/,
        Pe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Me = /<([\w:]+)/,
        De = /<tbody/i,
        Le = /<|&#?\w+;/,
        Ie = /<(?:script|style|link)/i,
        Re = /checked\s*(?:[^=]|=\s*.checked.)/i,
        qe = /^$|\/(?:java|ecma)script/i,
        Be = /^true\/(.*)/,
        Fe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        We = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: G.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        He = m(se).appendChild(se.createElement("div"));
    We.optgroup = We.option, We.tbody = We.tfoot = We.colgroup = We.caption = We.thead, We.th = We.td, K.extend({
        clone: function(e, t, n) {
            var i, o, r, a, s, l = K.contains(e.ownerDocument, e);
            if (G.html5Clone || K.isXMLDoc(e) || !je.test("<" + e.nodeName + ">") ? r = e.cloneNode(!0) : (He.innerHTML = e.outerHTML, He.removeChild(r = He.firstChild)), !(G.noCloneEvent && G.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || K.isXMLDoc(e)))
                for (i = v(r), s = v(e), a = 0; null != (o = s[a]); ++a) i[a] && C(o, i[a]);
            if (t)
                if (n)
                    for (s = s || v(e), i = i || v(r), a = 0; null != (o = s[a]); a++) x(o, i[a]);
                else x(e, r);
            return 0 < (i = v(r, "script")).length && w(i, !l && v(e, "script")), i = s = o = null, r
        },
        buildFragment: function(e, t, n, i) {
            for (var o, r, a, s, l, c, u, d = e.length, f = m(t), p = [], h = 0; h < d; h++)
                if ((r = e[h]) || 0 === r)
                    if ("object" === K.type(r)) K.merge(p, r.nodeType ? [r] : r);
                    else if (Le.test(r)) {
                for (s = s || f.appendChild(t.createElement("div")), l = (Me.exec(r) || ["", ""])[1].toLowerCase(), u = We[l] || We._default, s.innerHTML = u[1] + r.replace(Pe, "<$1></$2>") + u[2], o = u[0]; o--;) s = s.lastChild;
                if (!G.leadingWhitespace && _e.test(r) && p.push(t.createTextNode(_e.exec(r)[0])), !G.tbody)
                    for (o = (r = "table" !== l || De.test(r) ? "<table>" !== u[1] || De.test(r) ? 0 : s : s.firstChild) && r.childNodes.length; o--;) K.nodeName(c = r.childNodes[o], "tbody") && !c.childNodes.length && r.removeChild(c);
                for (K.merge(p, s.childNodes), s.textContent = ""; s.firstChild;) s.removeChild(s.firstChild);
                s = f.lastChild
            } else p.push(t.createTextNode(r));
            for (s && f.removeChild(s), G.appendChecked || K.grep(v(p, "input"), g), h = 0; r = p[h++];)
                if ((!i || -1 === K.inArray(r, i)) && (a = K.contains(r.ownerDocument, r), s = v(f.appendChild(r), "script"), a && w(s), n))
                    for (o = 0; r = s[o++];) qe.test(r.type || "") && n.push(r);
            return s = null, f
        },
        cleanData: function(e, t) {
            for (var n, i, o, r, a = 0, s = K.expando, l = K.cache, c = G.deleteExpando, u = K.event.special; null != (n = e[a]); a++)
                if ((t || K.acceptData(n)) && (r = (o = n[s]) && l[o])) {
                    if (r.events)
                        for (i in r.events) u[i] ? K.event.remove(n, i) : K.removeEvent(n, i, r.handle);
                    l[o] && (delete l[o], c ? delete n[s] : typeof n.removeAttribute !== me ? n.removeAttribute(s) : n[s] = null, H.push(o))
                }
        }
    }), K.fn.extend({
        text: function(e) {
            return xe(this, function(e) {
                return void 0 === e ? K.text(this) : this.empty().append((this[0] && this[0].ownerDocument || se).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || p(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = p(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, i = e ? K.filter(e, this) : this, o = 0; null != (n = i[o]); o++) t || 1 !== n.nodeType || K.cleanData(v(n)), n.parentNode && (t && K.contains(n.ownerDocument, n) && w(v(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && K.cleanData(v(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && K.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return K.clone(this, e, t)
            })
        },
        html: function(e) {
            return xe(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(Ne, "") : void 0;
                if (!("string" != typeof e || Ie.test(e) || !G.htmlSerialize && je.test(e) || !G.leadingWhitespace && _e.test(e) || We[(Me.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = e.replace(Pe, "<$1></$2>");
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (K.cleanData(v(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var t = arguments[0];
            return this.domManip(arguments, function(e) {
                t = this.parentNode, K.cleanData(v(this)), t && t.replaceChild(e, this)
            }), t && (t.length || t.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(n, i) {
            n = z.apply([], n);
            var e, t, o, r, a, s, l = 0,
                c = this.length,
                u = this,
                d = c - 1,
                f = n[0],
                p = K.isFunction(f);
            if (p || 1 < c && "string" == typeof f && !G.checkClone && Re.test(f)) return this.each(function(e) {
                var t = u.eq(e);
                p && (n[0] = f.call(this, e, t.html())), t.domManip(n, i)
            });
            if (c && (e = (s = K.buildFragment(n, this[0].ownerDocument, !1, this)).firstChild, 1 === s.childNodes.length && (s = e), e)) {
                for (o = (r = K.map(v(s, "script"), y)).length; l < c; l++) t = s, l !== d && (t = K.clone(t, !0, !0), o && K.merge(r, v(t, "script"))), i.call(this[l], t, l);
                if (o)
                    for (a = r[r.length - 1].ownerDocument, K.map(r, b), l = 0; l < o; l++) t = r[l], qe.test(t.type || "") && !K._data(t, "globalEval") && K.contains(a, t) && (t.src ? K._evalUrl && K._evalUrl(t.src) : K.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Fe, "")));
                s = e = null
            }
            return this
        }
    }), K.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        K.fn[e] = function(e) {
            for (var t, n = 0, i = [], o = K(e), r = o.length - 1; n <= r; n++) t = n === r ? this : this.clone(!0), K(o[n])[a](t), V.apply(i, t.get());
            return this.pushStack(i)
        }
    });
    var $e, ze, Ve = {};
    G.shrinkWrapBlocks = function() {
        return null != ze ? ze : (ze = !1, (t = se.getElementsByTagName("body")[0]) && t.style ? (e = se.createElement("div"), (n = se.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", t.appendChild(n).appendChild(e), typeof e.style.zoom !== me && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", e.appendChild(se.createElement("div")).style.width = "5px", ze = 3 !== e.offsetWidth), t.removeChild(n), ze) : void 0);
        var e, t, n
    };
    var Qe, Xe, Ue = /^margin/,
        Ye = new RegExp("^(" + ye + ")(?!px)[a-z%]+$", "i"),
        Ge = /^(top|right|bottom|left)$/;
    h.getComputedStyle ? (Qe = function(e) {
            return e.ownerDocument.defaultView.opener ? e.ownerDocument.defaultView.getComputedStyle(e, null) : h.getComputedStyle(e, null)
        }, Xe = function(e, t, n) {
            var i, o, r, a, s = e.style;
            return a = (n = n || Qe(e)) ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== a || K.contains(e.ownerDocument, e) || (a = K.style(e, t)), Ye.test(a) && Ue.test(t) && (i = s.width, o = s.minWidth, r = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = i, s.minWidth = o, s.maxWidth = r)), void 0 === a ? a : a + ""
        }) : se.documentElement.currentStyle && (Qe = function(e) {
            return e.currentStyle
        }, Xe = function(e, t, n) {
            var i, o, r, a, s = e.style;
            return null == (a = (n = n || Qe(e)) ? n[t] : void 0) && s && s[t] && (a = s[t]), Ye.test(a) && !Ge.test(t) && (i = s.left, (r = (o = e.runtimeStyle) && o.left) && (o.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = i, r && (o.left = r)), void 0 === a ? a : a + "" || "auto"
        }),
        function() {
            function e() {
                var e, t, n, i;
                (t = se.getElementsByTagName("body")[0]) && t.style && (e = se.createElement("div"), (n = se.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", t.appendChild(n).appendChild(e), e.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", o = r = !1, s = !0, h.getComputedStyle && (o = "1%" !== (h.getComputedStyle(e, null) || {}).top, r = "4px" === (h.getComputedStyle(e, null) || {
                    width: "4px"
                }).width, (i = e.appendChild(se.createElement("div"))).style.cssText = e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", e.style.width = "1px", s = !parseFloat((h.getComputedStyle(i, null) || {}).marginRight), e.removeChild(i)), e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (i = e.getElementsByTagName("td"))[0].style.cssText = "margin:0;border:0;padding:0;display:none", (a = 0 === i[0].offsetHeight) && (i[0].style.display = "", i[1].style.display = "none", a = 0 === i[0].offsetHeight), t.removeChild(n))
            }
            var t, n, i, o, r, a, s;
            (t = se.createElement("div")).innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", (n = (i = t.getElementsByTagName("a")[0]) && i.style) && (n.cssText = "float:left;opacity:.5", G.opacity = "0.5" === n.opacity, G.cssFloat = !!n.cssFloat, t.style.backgroundClip = "content-box", t.cloneNode(!0).style.backgroundClip = "", G.clearCloneStyle = "content-box" === t.style.backgroundClip, G.boxSizing = "" === n.boxSizing || "" === n.MozBoxSizing || "" === n.WebkitBoxSizing, K.extend(G, {
                reliableHiddenOffsets: function() {
                    return null == a && e(), a
                },
                boxSizingReliable: function() {
                    return null == r && e(), r
                },
                pixelPosition: function() {
                    return null == o && e(), o
                },
                reliableMarginRight: function() {
                    return null == s && e(), s
                }
            }))
        }(), K.swap = function(e, t, n, i) {
            var o, r, a = {};
            for (r in t) a[r] = e.style[r], e.style[r] = t[r];
            for (r in o = n.apply(e, i || []), t) e.style[r] = a[r];
            return o
        };
    var Ke = /alpha\([^)]*\)/i,
        Je = /opacity\s*=\s*([^)]*)/,
        Ze = /^(none|table(?!-c[ea]).+)/,
        et = new RegExp("^(" + ye + ")(.*)$", "i"),
        tt = new RegExp("^([+-])=(" + ye + ")", "i"),
        nt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        it = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        ot = ["Webkit", "O", "Moz", "ms"];
    K.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = Xe(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: G.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, r, a, s = K.camelCase(t),
                    l = e.style;
                if (t = K.cssProps[s] || (K.cssProps[s] = E(l, s)), a = K.cssHooks[t] || K.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (o = a.get(e, !1, i)) ? o : l[t];
                if ("string" == (r = typeof n) && (o = tt.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(K.css(e, t)), r = "number"), null != n && n == n && ("number" !== r || K.cssNumber[s] || (n += "px"), G.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(a && "set" in a && void 0 === (n = a.set(e, n, i))))) try {
                    l[t] = n
                } catch (e) {}
            }
        },
        css: function(e, t, n, i) {
            var o, r, a, s = K.camelCase(t);
            return t = K.cssProps[s] || (K.cssProps[s] = E(e.style, s)), (a = K.cssHooks[t] || K.cssHooks[s]) && "get" in a && (r = a.get(e, !0, n)), void 0 === r && (r = Xe(e, t, i)), "normal" === r && t in it && (r = it[t]), "" === n || n ? (o = parseFloat(r), !0 === n || K.isNumeric(o) ? o || 0 : r) : r
        }
    }), K.each(["height", "width"], function(e, o) {
        K.cssHooks[o] = {
            get: function(e, t, n) {
                return t ? Ze.test(K.css(e, "display")) && 0 === e.offsetWidth ? K.swap(e, nt, function() {
                    return j(e, o, n)
                }) : j(e, o, n) : void 0
            },
            set: function(e, t, n) {
                var i = n && Qe(e);
                return O(0, t, n ? N(e, o, n, G.boxSizing && "border-box" === K.css(e, "boxSizing", !1, i), i) : 0)
            }
        }
    }), G.opacity || (K.cssHooks.opacity = {
        get: function(e, t) {
            return Je.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                i = e.currentStyle,
                o = K.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                r = i && i.filter || n.filter || "";
            ((n.zoom = 1) <= t || "" === t) && "" === K.trim(r.replace(Ke, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = Ke.test(r) ? r.replace(Ke, o) : r + " " + o)
        }
    }), K.cssHooks.marginRight = T(G.reliableMarginRight, function(e, t) {
        return t ? K.swap(e, {
            display: "inline-block"
        }, Xe, [e, "marginRight"]) : void 0
    }), K.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(o, r) {
        K.cssHooks[o + r] = {
            expand: function(e) {
                for (var t = 0, n = {}, i = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++) n[o + be[t] + r] = i[t] || i[t - 2] || i[0];
                return n
            }
        }, Ue.test(o) || (K.cssHooks[o + r].set = O)
    }), K.fn.extend({
        css: function(e, t) {
            return xe(this, function(e, t, n) {
                var i, o, r = {},
                    a = 0;
                if (K.isArray(t)) {
                    for (i = Qe(e), o = t.length; a < o; a++) r[t[a]] = K.css(e, t[a], !1, i);
                    return r
                }
                return void 0 !== n ? K.style(e, t, n) : K.css(e, t)
            }, e, t, 1 < arguments.length)
        },
        show: function() {
            return A(this, !0)
        },
        hide: function() {
            return A(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                we(this) ? K(this).show() : K(this).hide()
            })
        }
    }), ((K.Tween = _).prototype = {
        constructor: _,
        init: function(e, t, n, i, o, r) {
            this.elem = e, this.prop = n, this.easing = o || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = r || (K.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = _.propHooks[this.prop];
            return e && e.get ? e.get(this) : _.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = _.propHooks[this.prop];
            return this.pos = t = this.options.duration ? K.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : _.propHooks._default.set(this), this
        }
    }).init.prototype = _.prototype, (_.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = K.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0 : e.elem[e.prop]
            },
            set: function(e) {
                K.fx.step[e.prop] ? K.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[K.cssProps[e.prop]] || K.cssHooks[e.prop]) ? K.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }).scrollTop = _.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, K.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, K.fx = _.prototype.init, K.fx.step = {};
    var rt, at, st, lt, ct, ut, dt, ft = /^(?:toggle|show|hide)$/,
        pt = new RegExp("^(?:([+-])=|)(" + ye + ")([a-z%]*)$", "i"),
        ht = /queueHooks$/,
        mt = [function(t, e, n) {
            var i, o, r, a, s, l, c, u = this,
                d = {},
                f = t.style,
                p = t.nodeType && we(t),
                h = K._data(t, "fxshow");
            for (i in n.queue || (null == (s = K._queueHooks(t, "fx")).unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || l()
                }), s.unqueued++, u.always(function() {
                    u.always(function() {
                        s.unqueued--, K.queue(t, "fx").length || s.empty.fire()
                    })
                })), 1 === t.nodeType && ("height" in e || "width" in e) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], "inline" === ("none" === (c = K.css(t, "display")) ? K._data(t, "olddisplay") || k(t.nodeName) : c) && "none" === K.css(t, "float") && (G.inlineBlockNeedsLayout && "inline" !== k(t.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", G.shrinkWrapBlocks() || u.always(function() {
                    f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
                })), e)
                if (o = e[i], ft.exec(o)) {
                    if (delete e[i], r = r || "toggle" === o, o === (p ? "hide" : "show")) {
                        if ("show" !== o || !h || void 0 === h[i]) continue;
                        p = !0
                    }
                    d[i] = h && h[i] || K.style(t, i)
                } else c = void 0;
            if (K.isEmptyObject(d)) "inline" === ("none" === c ? k(t.nodeName) : c) && (f.display = c);
            else
                for (i in h ? "hidden" in h && (p = h.hidden) : h = K._data(t, "fxshow", {}), r && (h.hidden = !p), p ? K(t).show() : u.done(function() {
                        K(t).hide()
                    }), u.done(function() {
                        var e;
                        for (e in K._removeData(t, "fxshow"), d) K.style(t, e, d[e])
                    }), d) a = D(p ? h[i] : 0, i, u), i in h || (h[i] = a.start, p && (a.end = a.start, a.start = "width" === i || "height" === i ? 1 : 0))
        }],
        vt = {
            "*": [function(e, t) {
                var n = this.createTween(e, t),
                    i = n.cur(),
                    o = pt.exec(t),
                    r = o && o[3] || (K.cssNumber[e] ? "" : "px"),
                    a = (K.cssNumber[e] || "px" !== r && +i) && pt.exec(K.css(n.elem, e)),
                    s = 1,
                    l = 20;
                if (a && a[3] !== r)
                    for (r = r || a[3], o = o || [], a = +i || 1; a /= s = s || ".5", K.style(n.elem, e, a + r), s !== (s = n.cur() / i) && 1 !== s && --l;);
                return o && (a = n.start = +a || +i || 0, n.unit = r, n.end = o[1] ? a + (o[1] + 1) * o[2] : +o[2]), n
            }]
        };
    K.Animation = K.extend(L, {
        tweener: function(e, t) {
            K.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            for (var n, i = 0, o = e.length; i < o; i++) n = e[i], vt[n] = vt[n] || [], vt[n].unshift(t)
        },
        prefilter: function(e, t) {
            t ? mt.unshift(e) : mt.push(e)
        }
    }), K.speed = function(e, t, n) {
        var i = e && "object" == typeof e ? K.extend({}, e) : {
            complete: n || !n && t || K.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !K.isFunction(t) && t
        };
        return i.duration = K.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in K.fx.speeds ? K.fx.speeds[i.duration] : K.fx.speeds._default, (null == i.queue || !0 === i.queue) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
            K.isFunction(i.old) && i.old.call(this), i.queue && K.dequeue(this, i.queue)
        }, i
    }, K.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter(we).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function(t, e, n, i) {
            var o = K.isEmptyObject(t),
                r = K.speed(e, n, i),
                a = function() {
                    var e = L(this, K.extend({}, t), r);
                    (o || K._data(this, "finish")) && e.stop(!0)
                };
            return a.finish = a, o || !1 === r.queue ? this.each(a) : this.queue(r.queue, a)
        },
        stop: function(o, e, r) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop, t(r)
            };
            return "string" != typeof o && (r = e, e = o, o = void 0), e && !1 !== o && this.queue(o || "fx", []), this.each(function() {
                var e = !0,
                    t = null != o && o + "queueHooks",
                    n = K.timers,
                    i = K._data(this);
                if (t) i[t] && i[t].stop && a(i[t]);
                else
                    for (t in i) i[t] && i[t].stop && ht.test(t) && a(i[t]);
                for (t = n.length; t--;) n[t].elem !== this || null != o && n[t].queue !== o || (n[t].anim.stop(r), e = !1, n.splice(t, 1));
                (e || !r) && K.dequeue(this, o)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"), this.each(function() {
                var e, t = K._data(this),
                    n = t[a + "queue"],
                    i = t[a + "queueHooks"],
                    o = K.timers,
                    r = n ? n.length : 0;
                for (t.finish = !0, K.queue(this, a, []), i && i.stop && i.stop.call(this, !0), e = o.length; e--;) o[e].elem === this && o[e].queue === a && (o[e].anim.stop(!0), o.splice(e, 1));
                for (e = 0; e < r; e++) n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }), K.each(["toggle", "show", "hide"], function(e, i) {
        var o = K.fn[i];
        K.fn[i] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? o.apply(this, arguments) : this.animate(M(i, !0), e, t, n)
        }
    }), K.each({
        slideDown: M("show"),
        slideUp: M("hide"),
        slideToggle: M("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, i) {
        K.fn[e] = function(e, t, n) {
            return this.animate(i, e, t, n)
        }
    }), K.timers = [], K.fx.tick = function() {
        var e, t = K.timers,
            n = 0;
        for (rt = K.now(); n < t.length; n++)(e = t[n])() || t[n] !== e || t.splice(n--, 1);
        t.length || K.fx.stop(), rt = void 0
    }, K.fx.timer = function(e) {
        K.timers.push(e), e() ? K.fx.start() : K.timers.pop()
    }, K.fx.interval = 13, K.fx.start = function() {
        at || (at = setInterval(K.fx.tick, K.fx.interval))
    }, K.fx.stop = function() {
        clearInterval(at), at = null
    }, K.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, K.fn.delay = function(i, e) {
        return i = K.fx && K.fx.speeds[i] || i, e = e || "fx", this.queue(e, function(e, t) {
            var n = setTimeout(e, i);
            t.stop = function() {
                clearTimeout(n)
            }
        })
    }, (lt = se.createElement("div")).setAttribute("className", "t"), lt.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ut = lt.getElementsByTagName("a")[0], dt = (ct = se.createElement("select")).appendChild(se.createElement("option")), st = lt.getElementsByTagName("input")[0], ut.style.cssText = "top:1px", G.getSetAttribute = "t" !== lt.className, G.style = /top/.test(ut.getAttribute("style")), G.hrefNormalized = "/a" === ut.getAttribute("href"), G.checkOn = !!st.value, G.optSelected = dt.selected, G.enctype = !!se.createElement("form").enctype, ct.disabled = !0, G.optDisabled = !dt.disabled, (st = se.createElement("input")).setAttribute("value", ""), G.input = "" === st.getAttribute("value"), st.value = "t", st.setAttribute("type", "radio"), G.radioValue = "t" === st.value;
    var gt = /\r/g;
    K.fn.extend({
        val: function(n) {
            var i, e, o, t = this[0];
            return arguments.length ? (o = K.isFunction(n), this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = o ? n.call(this, e, K(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : K.isArray(t) && (t = K.map(t, function(e) {
                    return null == e ? "" : e + ""
                })), (i = K.valHooks[this.type] || K.valHooks[this.nodeName.toLowerCase()]) && "set" in i && void 0 !== i.set(this, t, "value") || (this.value = t))
            })) : t ? (i = K.valHooks[t.type] || K.valHooks[t.nodeName.toLowerCase()]) && "get" in i && void 0 !== (e = i.get(t, "value")) ? e : "string" == typeof(e = t.value) ? e.replace(gt, "") : null == e ? "" : e : void 0
        }
    }), K.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = K.find.attr(e, "value");
                    return null != t ? t : K.trim(K.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, i = e.options, o = e.selectedIndex, r = "select-one" === e.type || o < 0, a = r ? null : [], s = r ? o + 1 : i.length, l = o < 0 ? s : r ? o : 0; l < s; l++)
                        if (!(!(n = i[l]).selected && l !== o || (G.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && K.nodeName(n.parentNode, "optgroup"))) {
                            if (t = K(n).val(), r) return t;
                            a.push(t)
                        } return a
                },
                set: function(e, t) {
                    for (var n, i, o = e.options, r = K.makeArray(t), a = o.length; a--;)
                        if (i = o[a], 0 <= K.inArray(K.valHooks.option.get(i), r)) try {
                            i.selected = n = !0
                        } catch (e) {
                            i.scrollHeight
                        } else i.selected = !1;
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), K.each(["radio", "checkbox"], function() {
        K.valHooks[this] = {
            set: function(e, t) {
                return K.isArray(t) ? e.checked = 0 <= K.inArray(K(e).val(), t) : void 0
            }
        }, G.checkOn || (K.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var yt, bt, wt = K.expr.attrHandle,
        xt = /^(?:checked|selected)$/i,
        Ct = G.getSetAttribute,
        St = G.input;
    K.fn.extend({
        attr: function(e, t) {
            return xe(this, K.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                K.removeAttr(this, e)
            })
        }
    }), K.extend({
        attr: function(e, t, n) {
            var i, o, r = e.nodeType;
            return e && 3 !== r && 8 !== r && 2 !== r ? typeof e.getAttribute === me ? K.prop(e, t, n) : (1 === r && K.isXMLDoc(e) || (t = t.toLowerCase(), i = K.attrHooks[t] || (K.expr.match.bool.test(t) ? bt : yt)), void 0 === n ? i && "get" in i && null !== (o = i.get(e, t)) ? o : null == (o = K.find.attr(e, t)) ? void 0 : o : null !== n ? i && "set" in i && void 0 !== (o = i.set(e, n, t)) ? o : (e.setAttribute(t, n + ""), n) : void K.removeAttr(e, t)) : void 0
        },
        removeAttr: function(e, t) {
            var n, i, o = 0,
                r = t && t.match(fe);
            if (r && 1 === e.nodeType)
                for (; n = r[o++];) i = K.propFix[n] || n, K.expr.match.bool.test(n) ? St && Ct || !xt.test(n) ? e[i] = !1 : e[K.camelCase("default-" + n)] = e[i] = !1 : K.attr(e, n, ""), e.removeAttribute(Ct ? n : i)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!G.radioValue && "radio" === t && K.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), bt = {
        set: function(e, t, n) {
            return !1 === t ? K.removeAttr(e, n) : St && Ct || !xt.test(n) ? e.setAttribute(!Ct && K.propFix[n] || n, n) : e[K.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, K.each(K.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var r = wt[t] || K.find.attr;
        wt[t] = St && Ct || !xt.test(t) ? function(e, t, n) {
            var i, o;
            return n || (o = wt[t], wt[t] = i, i = null != r(e, t, n) ? t.toLowerCase() : null, wt[t] = o), i
        } : function(e, t, n) {
            return n ? void 0 : e[K.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), St && Ct || (K.attrHooks.value = {
        set: function(e, t, n) {
            return K.nodeName(e, "input") ? void(e.defaultValue = t) : yt && yt.set(e, t, n)
        }
    }), Ct || (yt = {
        set: function(e, t, n) {
            var i = e.getAttributeNode(n);
            return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)), i.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    }, wt.id = wt.name = wt.coords = function(e, t, n) {
        var i;
        return n ? void 0 : (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
    }, K.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: yt.set
    }, K.attrHooks.contenteditable = {
        set: function(e, t, n) {
            yt.set(e, "" !== t && t, n)
        }
    }, K.each(["width", "height"], function(e, n) {
        K.attrHooks[n] = {
            set: function(e, t) {
                return "" === t ? (e.setAttribute(n, "auto"), t) : void 0
            }
        }
    })), G.style || (K.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var kt = /^(?:input|select|textarea|button|object)$/i,
        Tt = /^(?:a|area)$/i;
    K.fn.extend({
        prop: function(e, t) {
            return xe(this, K.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return e = K.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (e) {}
            })
        }
    }), K.extend({
        propFix: {
            for: "htmlFor",
            class: "className"
        },
        prop: function(e, t, n) {
            var i, o, r = e.nodeType;
            return e && 3 !== r && 8 !== r && 2 !== r ? ((1 !== r || !K.isXMLDoc(e)) && (t = K.propFix[t] || t, o = K.propHooks[t]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = K.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : kt.test(e.nodeName) || Tt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), G.hrefNormalized || K.each(["href", "src"], function(e, t) {
        K.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), G.optSelected || (K.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), K.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        K.propFix[this.toLowerCase()] = this
    }), G.enctype || (K.propFix.enctype = "encoding");
    var Et = /[\t\r\n\f]/g;
    K.fn.extend({
        addClass: function(t) {
            var e, n, i, o, r, a, s = 0,
                l = this.length,
                c = "string" == typeof t && t;
            if (K.isFunction(t)) return this.each(function(e) {
                K(this).addClass(t.call(this, e, this.className))
            });
            if (c)
                for (e = (t || "").match(fe) || []; s < l; s++)
                    if (i = 1 === (n = this[s]).nodeType && (n.className ? (" " + n.className + " ").replace(Et, " ") : " ")) {
                        for (r = 0; o = e[r++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        a = K.trim(i), n.className !== a && (n.className = a)
                    } return this
        },
        removeClass: function(t) {
            var e, n, i, o, r, a, s = 0,
                l = this.length,
                c = 0 === arguments.length || "string" == typeof t && t;
            if (K.isFunction(t)) return this.each(function(e) {
                K(this).removeClass(t.call(this, e, this.className))
            });
            if (c)
                for (e = (t || "").match(fe) || []; s < l; s++)
                    if (i = 1 === (n = this[s]).nodeType && (n.className ? (" " + n.className + " ").replace(Et, " ") : "")) {
                        for (r = 0; o = e[r++];)
                            for (; 0 <= i.indexOf(" " + o + " ");) i = i.replace(" " + o + " ", " ");
                        a = t ? K.trim(i) : "", n.className !== a && (n.className = a)
                    } return this
        },
        toggleClass: function(o, t) {
            var r = typeof o;
            return "boolean" == typeof t && "string" === r ? t ? this.addClass(o) : this.removeClass(o) : this.each(K.isFunction(o) ? function(e) {
                K(this).toggleClass(o.call(this, e, this.className, t), t)
            } : function() {
                if ("string" === r)
                    for (var e, t = 0, n = K(this), i = o.match(fe) || []; e = i[t++];) n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                else(r === me || "boolean" === r) && (this.className && K._data(this, "__className__", this.className), this.className = this.className || !1 === o ? "" : K._data(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, i = this.length; n < i; n++)
                if (1 === this[n].nodeType && 0 <= (" " + this[n].className + " ").replace(Et, " ").indexOf(t)) return !0;
            return !1
        }
    }), K.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, n) {
        K.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }), K.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var At = K.now(),
        Ot = /\?/,
        Nt = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    K.parseJSON = function(e) {
        if (h.JSON && h.JSON.parse) return h.JSON.parse(e + "");
        var o, r = null,
            t = K.trim(e + "");
        return t && !K.trim(t.replace(Nt, function(e, t, n, i) {
            return o && t && (r = 0), 0 === r ? e : (o = n || t, r += !i - !n, "")
        })) ? Function("return " + t)() : K.error("Invalid JSON: " + e)
    }, K.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e) return null;
        try {
            h.DOMParser ? t = (new DOMParser).parseFromString(e, "text/xml") : ((t = new ActiveXObject("Microsoft.XMLDOM")).async = "false", t.loadXML(e))
        } catch (e) {
            t = void 0
        }
        return t && t.documentElement && !t.getElementsByTagName("parsererror").length || K.error("Invalid XML: " + e), t
    };
    var jt, _t, Pt = /#.*$/,
        Mt = /([?&])_=[^&]*/,
        Dt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Lt = /^(?:GET|HEAD)$/,
        It = /^\/\//,
        Rt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        qt = {},
        Bt = {},
        Ft = "*/".concat("*");
    try {
        _t = location.href
    } catch (h) {
        (_t = se.createElement("a")).href = "", _t = _t.href
    }
    jt = Rt.exec(_t.toLowerCase()) || [], K.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: _t,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(jt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Ft,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": K.parseJSON,
                "text xml": K.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? q(q(e, K.ajaxSettings), t) : q(K.ajaxSettings, e)
        },
        ajaxPrefilter: I(qt),
        ajaxTransport: I(Bt),
        ajax: function(e, t) {
            function n(e, t, n, i) {
                var o, r, a, s, l, c = t;
                2 !== x && (x = 2, f && clearTimeout(f), h = void 0, d = i || "", C.readyState = 0 < e ? 4 : 0, o = 200 <= e && e < 300 || 304 === e, n && (s = function(e, t, n) {
                    for (var i, o, r, a, s = e.contents, l = e.dataTypes;
                        "*" === l[0];) l.shift(), void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (o)
                        for (a in s)
                            if (s[a] && s[a].test(o)) {
                                l.unshift(a);
                                break
                            } if (l[0] in n) r = l[0];
                    else {
                        for (a in n) {
                            if (!l[0] || e.converters[a + " " + l[0]]) {
                                r = a;
                                break
                            }
                            i || (i = a)
                        }
                        r = r || i
                    }
                    return r ? (r !== l[0] && l.unshift(r), n[r]) : void 0
                }(m, C, n)), s = function(e, t, n, i) {
                    var o, r, a, s, l, c = {},
                        u = e.dataTypes.slice();
                    if (u[1])
                        for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
                    for (r = u.shift(); r;)
                        if (e.responseFields[r] && (n[e.responseFields[r]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = u.shift())
                            if ("*" === r) r = l;
                            else if ("*" !== l && l !== r) {
                        if (!(a = c[l + " " + r] || c["* " + r]))
                            for (o in c)
                                if ((s = o.split(" "))[1] === r && (a = c[l + " " + s[0]] || c["* " + s[0]])) {
                                    !0 === a ? a = c[o] : !0 !== c[o] && (r = s[0], u.unshift(s[1]));
                                    break
                                } if (!0 !== a)
                            if (a && e.throws) t = a(t);
                            else try {
                                t = a(t)
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: a ? e : "No conversion from " + l + " to " + r
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: t
                    }
                }(m, s, C, o), o ? (m.ifModified && ((l = C.getResponseHeader("Last-Modified")) && (K.lastModified[u] = l), (l = C.getResponseHeader("etag")) && (K.etag[u] = l)), 204 === e || "HEAD" === m.type ? c = "nocontent" : 304 === e ? c = "notmodified" : (c = s.state, r = s.data, o = !(a = s.error))) : (a = c, (e || !c) && (c = "error", e < 0 && (e = 0))), C.status = e, C.statusText = (t || c) + "", o ? y.resolveWith(v, [r, c, C]) : y.rejectWith(v, [C, c, a]), C.statusCode(w), w = void 0, p && g.trigger(o ? "ajaxSuccess" : "ajaxError", [C, m, o ? r : a]), b.fireWith(v, [C, c]), p && (g.trigger("ajaxComplete", [C, m]), --K.active || K.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var i, o, u, d, f, p, h, r, m = K.ajaxSetup({}, t),
                v = m.context || m,
                g = m.context && (v.nodeType || v.jquery) ? K(v) : K.event,
                y = K.Deferred(),
                b = K.Callbacks("once memory"),
                w = m.statusCode || {},
                a = {},
                s = {},
                x = 0,
                l = "canceled",
                C = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === x) {
                            if (!r)
                                for (r = {}; t = Dt.exec(d);) r[t[1].toLowerCase()] = t[2];
                            t = r[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === x ? d : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return x || (e = s[n] = s[n] || e, a[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return x || (m.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (x < 2)
                                for (t in e) w[t] = [w[t], e[t]];
                            else C.always(e[C.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || l;
                        return h && h.abort(t), n(0, t), this
                    }
                };
            if (y.promise(C).complete = b.add, C.success = C.done, C.error = C.fail, m.url = ((e || m.url || _t) + "").replace(Pt, "").replace(It, jt[1] + "//"), m.type = t.method || t.type || m.method || m.type, m.dataTypes = K.trim(m.dataType || "*").toLowerCase().match(fe) || [""], null == m.crossDomain && (i = Rt.exec(m.url.toLowerCase()), m.crossDomain = !(!i || i[1] === jt[1] && i[2] === jt[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (jt[3] || ("http:" === jt[1] ? "80" : "443")))), m.data && m.processData && "string" != typeof m.data && (m.data = K.param(m.data, m.traditional)), R(qt, m, t, C), 2 === x) return C;
            for (o in (p = K.event && m.global) && 0 == K.active++ && K.event.trigger("ajaxStart"), m.type = m.type.toUpperCase(), m.hasContent = !Lt.test(m.type), u = m.url, m.hasContent || (m.data && (u = m.url += (Ot.test(u) ? "&" : "?") + m.data, delete m.data), !1 === m.cache && (m.url = Mt.test(u) ? u.replace(Mt, "$1_=" + At++) : u + (Ot.test(u) ? "&" : "?") + "_=" + At++)), m.ifModified && (K.lastModified[u] && C.setRequestHeader("If-Modified-Since", K.lastModified[u]), K.etag[u] && C.setRequestHeader("If-None-Match", K.etag[u])), (m.data && m.hasContent && !1 !== m.contentType || t.contentType) && C.setRequestHeader("Content-Type", m.contentType), C.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + Ft + "; q=0.01" : "") : m.accepts["*"]), m.headers) C.setRequestHeader(o, m.headers[o]);
            if (m.beforeSend && (!1 === m.beforeSend.call(v, C, m) || 2 === x)) return C.abort();
            for (o in l = "abort", {
                    success: 1,
                    error: 1,
                    complete: 1
                }) C[o](m[o]);
            if (h = R(Bt, m, t, C)) {
                C.readyState = 1, p && g.trigger("ajaxSend", [C, m]), m.async && 0 < m.timeout && (f = setTimeout(function() {
                    C.abort("timeout")
                }, m.timeout));
                try {
                    x = 1, h.send(a, n)
                } catch (e) {
                    if (!(x < 2)) throw e;
                    n(-1, e)
                }
            } else n(-1, "No Transport");
            return C
        },
        getJSON: function(e, t, n) {
            return K.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return K.get(e, void 0, t, "script")
        }
    }), K.each(["get", "post"], function(e, o) {
        K[o] = function(e, t, n, i) {
            return K.isFunction(t) && (i = i || n, n = t, t = void 0), K.ajax({
                url: e,
                type: o,
                dataType: i,
                data: t,
                success: n
            })
        }
    }), K._evalUrl = function(e) {
        return K.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            throws: !0
        })
    }, K.fn.extend({
        wrapAll: function(t) {
            if (K.isFunction(t)) return this.each(function(e) {
                K(this).wrapAll(t.call(this, e))
            });
            if (this[0]) {
                var e = K(t, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(n) {
            return this.each(K.isFunction(n) ? function(e) {
                K(this).wrapInner(n.call(this, e))
            } : function() {
                var e = K(this),
                    t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = K.isFunction(t);
            return this.each(function(e) {
                K(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                K.nodeName(this, "body") || K(this).replaceWith(this.childNodes)
            }).end()
        }
    }), K.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !G.reliableHiddenOffsets() && "none" === (e.style && e.style.display || K.css(e, "display"))
    }, K.expr.filters.visible = function(e) {
        return !K.expr.filters.hidden(e)
    };
    var Wt = /%20/g,
        Ht = /\[\]$/,
        $t = /\r?\n/g,
        zt = /^(?:submit|button|image|reset|file)$/i,
        Vt = /^(?:input|select|textarea|keygen)/i;
    K.param = function(e, t) {
        var n, i = [],
            o = function(e, t) {
                t = K.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = K.ajaxSettings && K.ajaxSettings.traditional), K.isArray(e) || e.jquery && !K.isPlainObject(e)) K.each(e, function() {
            o(this.name, this.value)
        });
        else
            for (n in e) B(n, e[n], t, o);
        return i.join("&").replace(Wt, "+")
    }, K.fn.extend({
        serialize: function() {
            return K.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = K.prop(this, "elements");
                return e ? K.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !K(this).is(":disabled") && Vt.test(this.nodeName) && !zt.test(e) && (this.checked || !Ce.test(e))
            }).map(function(e, t) {
                var n = K(this).val();
                return null == n ? null : K.isArray(n) ? K.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace($t, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace($t, "\r\n")
                }
            }).get()
        }
    }), K.ajaxSettings.xhr = void 0 !== h.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && F() || function() {
            try {
                return new h.ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
        }()
    } : F;
    var Qt = 0,
        Xt = {},
        Ut = K.ajaxSettings.xhr();
    h.attachEvent && h.attachEvent("onunload", function() {
        for (var e in Xt) Xt[e](void 0, !0)
    }), G.cors = !!Ut && "withCredentials" in Ut, (Ut = G.ajax = !!Ut) && K.ajaxTransport(function(l) {
        var c;
        if (!l.crossDomain || G.cors) return {
            send: function(e, r) {
                var t, a = l.xhr(),
                    s = ++Qt;
                if (a.open(l.type, l.url, l.async, l.username, l.password), l.xhrFields)
                    for (t in l.xhrFields) a[t] = l.xhrFields[t];
                for (t in l.mimeType && a.overrideMimeType && a.overrideMimeType(l.mimeType), l.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e) void 0 !== e[t] && a.setRequestHeader(t, e[t] + "");
                a.send(l.hasContent && l.data || null), c = function(e, t) {
                    var n, i, o;
                    if (c && (t || 4 === a.readyState))
                        if (delete Xt[s], c = void 0, a.onreadystatechange = K.noop, t) 4 !== a.readyState && a.abort();
                        else {
                            o = {}, n = a.status, "string" == typeof a.responseText && (o.text = a.responseText);
                            try {
                                i = a.statusText
                            } catch (e) {
                                i = ""
                            }
                            n || !l.isLocal || l.crossDomain ? 1223 === n && (n = 204) : n = o.text ? 200 : 404
                        } o && r(n, i, o, a.getAllResponseHeaders())
                }, l.async ? 4 === a.readyState ? setTimeout(c) : a.onreadystatechange = Xt[s] = c : c()
            },
            abort: function() {
                c && c(void 0, !0)
            }
        }
    }), K.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return K.globalEval(e), e
            }
        }
    }), K.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), K.ajaxTransport("script", function(t) {
        if (t.crossDomain) {
            var i, o = se.head || K("head")[0] || se.documentElement;
            return {
                send: function(e, n) {
                    (i = se.createElement("script")).async = !0, t.scriptCharset && (i.charset = t.scriptCharset), i.src = t.url, i.onload = i.onreadystatechange = function(e, t) {
                        (t || !i.readyState || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = null, i.parentNode && i.parentNode.removeChild(i), i = null, t || n(200, "success"))
                    }, o.insertBefore(i, o.firstChild)
                },
                abort: function() {
                    i && i.onload(void 0, !0)
                }
            }
        }
    });
    var Yt = [],
        Gt = /(=)\?(?=&|$)|\?\?/;
    K.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Yt.pop() || K.expando + "_" + At++;
            return this[e] = !0, e
        }
    }), K.ajaxPrefilter("json jsonp", function(e, t, n) {
        var i, o, r, a = !1 !== e.jsonp && (Gt.test(e.url) ? "url" : "string" == typeof e.data && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && Gt.test(e.data) && "data");
        return a || "jsonp" === e.dataTypes[0] ? (i = e.jsonpCallback = K.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Gt, "$1" + i) : !1 !== e.jsonp && (e.url += (Ot.test(e.url) ? "&" : "?") + e.jsonp + "=" + i), e.converters["script json"] = function() {
            return r || K.error(i + " was not called"), r[0]
        }, e.dataTypes[0] = "json", o = h[i], h[i] = function() {
            r = arguments
        }, n.always(function() {
            h[i] = o, e[i] && (e.jsonpCallback = t.jsonpCallback, Yt.push(i)), r && K.isFunction(o) && o(r[0]), r = o = void 0
        }), "script") : void 0
    }), K.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || se;
        var i = oe.exec(e),
            o = !n && [];
        return i ? [t.createElement(i[1])] : (i = K.buildFragment([e], t, o), o && o.length && K(o).remove(), K.merge([], i.childNodes))
    };
    var Kt = K.fn.load;
    K.fn.load = function(e, t, n) {
        if ("string" != typeof e && Kt) return Kt.apply(this, arguments);
        var i, o, r, a = this,
            s = e.indexOf(" ");
        return 0 <= s && (i = K.trim(e.slice(s, e.length)), e = e.slice(0, s)), K.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (r = "POST"), 0 < a.length && K.ajax({
            url: e,
            type: r,
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments, a.html(i ? K("<div>").append(K.parseHTML(e)).find(i) : e)
        }).complete(n && function(e, t) {
            a.each(n, o || [e.responseText, t, e])
        }), this
    }, K.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        K.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), K.expr.filters.animated = function(t) {
        return K.grep(K.timers, function(e) {
            return t === e.elem
        }).length
    };
    var Jt = h.document.documentElement;
    K.offset = {
        setOffset: function(e, t, n) {
            var i, o, r, a, s, l, c = K.css(e, "position"),
                u = K(e),
                d = {};
            "static" === c && (e.style.position = "relative"), s = u.offset(), r = K.css(e, "top"), l = K.css(e, "left"), ("absolute" === c || "fixed" === c) && -1 < K.inArray("auto", [r, l]) ? (a = (i = u.position()).top, o = i.left) : (a = parseFloat(r) || 0, o = parseFloat(l) || 0), K.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + o), "using" in t ? t.using.call(e, d) : u.css(d)
        }
    }, K.fn.extend({
        offset: function(t) {
            if (arguments.length) return void 0 === t ? this : this.each(function(e) {
                K.offset.setOffset(this, t, e)
            });
            var e, n, i = {
                    top: 0,
                    left: 0
                },
                o = this[0],
                r = o && o.ownerDocument;
            return r ? (e = r.documentElement, K.contains(e, o) ? (typeof o.getBoundingClientRect !== me && (i = o.getBoundingClientRect()), n = W(r), {
                top: i.top + (n.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                left: i.left + (n.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
            }) : i) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    i = this[0];
                return "fixed" === K.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), K.nodeName(e[0], "html") || (n = e.offset()), n.top += K.css(e[0], "borderTopWidth", !0), n.left += K.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - K.css(i, "marginTop", !0),
                    left: t.left - n.left - K.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || Jt; e && !K.nodeName(e, "html") && "static" === K.css(e, "position");) e = e.offsetParent;
                return e || Jt
            })
        }
    }), K.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, o) {
        var r = /Y/.test(o);
        K.fn[t] = function(e) {
            return xe(this, function(e, t, n) {
                var i = W(e);
                return void 0 === n ? i ? o in i ? i[o] : i.document.documentElement[t] : e[t] : void(i ? i.scrollTo(r ? K(i).scrollLeft() : n, r ? n : K(i).scrollTop()) : e[t] = n)
            }, t, e, arguments.length, null)
        }
    }), K.each(["top", "left"], function(e, n) {
        K.cssHooks[n] = T(G.pixelPosition, function(e, t) {
            return t ? (t = Xe(e, n), Ye.test(t) ? K(e).position()[n] + "px" : t) : void 0
        })
    }), K.each({
        Height: "height",
        Width: "width"
    }, function(r, a) {
        K.each({
            padding: "inner" + r,
            content: a,
            "": "outer" + r
        }, function(i, e) {
            K.fn[e] = function(e, t) {
                var n = arguments.length && (i || "boolean" != typeof e),
                    o = i || (!0 === e || !0 === t ? "margin" : "border");
                return xe(this, function(e, t, n) {
                    var i;
                    return K.isWindow(e) ? e.document.documentElement["client" + r] : 9 === e.nodeType ? (i = e.documentElement, Math.max(e.body["scroll" + r], i["scroll" + r], e.body["offset" + r], i["offset" + r], i["client" + r])) : void 0 === n ? K.css(e, t, o) : K.style(e, t, n, o)
                }, a, n ? e : void 0, n, null)
            }
        })
    }), K.fn.size = function() {
        return this.length
    }, K.fn.andSelf = K.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return K
    });
    var Zt = h.jQuery,
        en = h.$;
    return K.noConflict = function(e) {
        return h.$ === K && (h.$ = en), e && h.jQuery === K && (h.jQuery = Zt), K
    }, typeof e === me && (h.jQuery = h.$ = K), K
}),
function(e) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e : e(jQuery)
}(function(c) {
    function u(e, t) {
        try {
            if (t[a]) {
                e = e || "";
                var n = c(t.ownerNode || t.owningElement);
                return "" === e || "*" === e || "#" + (n.prop("id") || "") == e || (n.prop("href") || "") == i.prop("href", e).prop("href")
            }
            return !1
        } catch (e) {
            return !1
        }
    }

    function d(e) {
        var t = (/.*?{/.exec(e) || ["{"])[0],
            n = /{.*}/g.exec(e);
        if (null === n) {
            var i = e.split("{");
            n = "{" + i[1 == i.length ? 0 : 1].split("}")[0] + "}"
        } else n = n[0];
        return {
            styleSheet: c.trim(t.substr(0, t.length - 1)),
            selectorText: function(e) {
                var t, n = [];
                t = h[a].length, f.call(h, e, ";");
                for (var i = h[a].length - 1; t <= i; i--) n.push(h[a][i].selectorText), p.call(h, i);
                return n.reverse().join(", ")
            }(n.substr(1, n.length - 2))
        }
    }

    function o(e, t) {
        return e.ownerDocument = e.ownerDocument || document, e.nodeType = e.nodeType || 1, e.nodeName = e.nodeName || "DIV", e.parentNode = e.parentNode || t.ownerNode || t.owningElement, e.parentStyleSheet = e.parentStyleSheet || t, e
    }

    function f(e, n, t) {
        if (!e || !n) return -1;
        var i = this,
            o = i.insertRule ? function(e, t, n) {
                this.insertRule(e + "{" + t + "}", n)
            } : i.addRule;
        t = t || this[a].length;
        try {
            return o.call(i, e, n, t)
        } catch (t) {
            return c.each(e.split(","), function(e, t) {
                o.call(i, c.trim(t), n)
            }), -1
        }
    }

    function p(n) {
        if (n = n && n.rule ? n.rule : n) {
            var i = this,
                o = i.deleteRule || i.removeRule;
            o || c(document.styleSheets).each(function(e, t) {
                return 1 == c(t[a]).filter(function() {
                    return this === n
                }).length ? (o = (i = t).deleteRule || i.removeRule, !1) : void 0
            }), "number" == c.type(n) ? o.call(i, n) : c.each(i[a], function(e, t) {
                return n === t ? (o.call(i, e), !1) : void 0
            })
        }
    }
    var e, i = c(document.createElement("a")),
        r = i.prop("style"),
        h = (e = c('<style type="text/css">*{}</style>').appendTo("head")[0]).sheet || e.styleSheet,
        a = "cssRules" in h ? "cssRules" : "rules",
        s = ["Webkit", "O", "Moz", "ms"];
    try {
        o(h[a][0], h), c.support.nativeCSSStyleRule = !0
    } catch (u) {
        c.support.nativeCSSStyleRule = !1, CSSStyleRule = function(e) {
            c.extend(this, e), this.rule = e, this.currentStyle = e.style
        }
    }
    c.stylesheet = function(e, t, n) {
        return this instanceof c.stylesheet ? (this.init(e), this.css(t, n)) : new c.stylesheet(e, t, n)
    }, c.extend(c.stylesheet, {
        cssRules: function(e) {
            var n = [],
                i = d(e);
            return c(document.styleSheets).each(function(e, t) {
                u(i.styleSheet, t) && c.merge(n, c(t[a]).filter(function() {
                    return t = i.selectorText, e = "*" === i.styleSheet, "string" === c.type(this.selectorText) && (this.selectorText === t || !0 === e && 0 < c(c.map(this.selectorText.split(","), c.trim)).filter(function(e) {
                        return this.toString() === t
                    }).length);
                    var t, e
                }).map(function() {
                    return o(c.support.nativeCSSStyleRule ? this : new CSSStyleRule(this), t)
                }))
            }), n.reverse()
        },
        camelCase: c.camelCase || function(e) {
            return e.replace(/-([\da-z])/g, function(e) {
                return e.toUpperCase().replace("-", "")
            })
        },
        cssProps: c.cssProps || {},
        cssStyleName: function(e) {
            if (e) {
                var t = c.camelCase(e);
                if (t in r) return t;
                if ((c.cssProps[e] || (c.cssProps[e] = function(e) {
                        for (var t, n = e[0].toUpperCase() + e.slice(1), i = s.length; --i;)
                            if ((t = s[i] + n) in r) return t;
                        return e
                    }(t))) in r) return c.cssProps[e]
            }
        }
    }), c.stylesheet.fn = c.stylesheet.prototype = {
        init: function(s) {
            var l = [];
            switch (c.type(s)) {
                case "string":
                    l = c.stylesheet.cssRules(s);
                    break;
                case "array":
                    c.each(s, function(e, t) {
                        "string" === c.type(t) ? c.merge(l, c.stylesheet.cssRules(t)) : t instanceof CSSStyleRule && l.push(t)
                    });
                    break;
                case "object":
                    s instanceof CSSStyleRule && l.push(val)
            }
            c.extend(this, {
                rules: function() {
                    return l.slice()
                },
                css: function(e, n) {
                    var i = this,
                        o = void 0;
                    switch (c.type(e)) {
                        case "null":
                            return c.each(l, function(e, t) {
                                p.call(t.parentStyleSheet, t)
                            }), l = c.stylesheet.cssRules(s), i;
                        case "string":
                            var r = c.stylesheet.cssStyleName(e);
                            if (r)
                                if (0 === l.length && void 0 !== n) {
                                    var t = d(s),
                                        a = c(document.styleSheets).filter(function() {
                                            return u(t.styleSheet, this)
                                        });
                                    a = a && 1 == a.length ? a[0] : h, f.call(a, t.selectorText, e + ":" + n + ";"), l = c.stylesheet.cssRules(s), o = i
                                } else c.each(l, function(e, t) {
                                    return "" !== t.style[r] ? (void 0 !== n ? (t.style[r] = n, o = i) : o = t.style[r], !1) : void 0
                                }), void 0 === o && void 0 !== n && (l[0].style[r] = n, o = i);
                            break;
                        case "array":
                            o = {}, c.each(e, function(e, t) {
                                o[t] = i.css(t, n)
                            }), void 0 !== n && (o = i);
                            break;
                        case "object":
                            return c.each(e, function(e, t) {
                                i.css(e, t)
                            }), i;
                        default:
                            return i
                    }
                    return o
                }
            })
        }
    }
}),
function() {
    if (window.getComputedStyle) {
        var n = window.getComputedStyle;
        window.getComputedStyle = function(e, t) {
            return e.parentStyleSheet ? e.style : n(e, t)
        }
    } else document.documentElement.currentStyle && (jQuery.cssHooks.display = {
        get: function(e) {
            return e.parentStyleSheet && "" === e.style.display ? document.documentElement.currentStyle.display : e.style.display
        }
    });
    if (!jQuery.support.opacity && jQuery.cssHooks.opacity) {
        var a = jQuery.cssHooks.opacity,
            s = /alpha\([^)]*\)/i;
        jQuery.cssHooks.opacity = {
            get: a.get,
            set: function(e, t) {
                if (e.parentStyleSheet) {
                    var n = e.style,
                        i = e.currentStyle,
                        o = jQuery.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                        r = i && i.filter || n.filter || "";
                    if (((n.zoom = 1) <= t || "" === t) && "" === jQuery.trim(r.replace(s, "")) && (n.setAttribute("filter", "", 1), n.cssText = n.cssText.replace(/FILTER: ;/i, ""), "" === t || i && !i.filter)) return;
                    n.filter = s.test(r) ? r.replace(s, o) : r + " " + o
                } else a.set(e, t)
            }
        }
    }
}(),
function(s) {
    s.fn.initialize = function(e, t) {
        var r = this,
            a = r.selector;
        if ("function" != typeof e || !a) return s(r);
        var n = s("body")[0];
        return r.firstInitsCalled = r.firstInitsCalled || [], "function" == typeof t && -1 == r.firstInitsCalled.indexOf(t) && (r.firstInitsCalled.push(t), t()), r.initData = r.initData || {}, r.initData[a] = r.initData[a] || [], r.initData[a].push(e), s(this).each(function() {
            this.initsCalled = this.initsCalled || [], -1 == this.initsCalled.indexOf(e) && (this.initsCalled.push(e), s(this).each(e))
        }), this.initializedObserver || (this.initializedObserver = !0, window.MutationObserver = window.MutationObserver || window.WebKitMutationObserver, new MutationObserver(function(e) {
            s.each(e, function(e, t) {
                var n = s();
                for (a in "attributes" == t.type && (n = s(t.target)), "childList" == t.type && t.addedNodes.length && s.each(t.addedNodes, function(e, t) {
                        n = n.add(t)
                    }), r.initData) {
                    var i = r.initData[a],
                        o = n.find(a);
                    n.is(a) && (o = o.add(n)), o.each(function() {
                        var n = this;
                        n.initsCalled = n.initsCalled || [], s.each(i, function(e, t) {
                            -1 == n.initsCalled.indexOf(t) && (n.initsCalled.push(t), s(n).each(t))
                        })
                    })
                }
            })
        }).observe(n, {
            attributes: !0,
            childList: !0,
            characterData: !1,
            subtree: !0
        })), s(this)
    }
}(jQuery), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function(e, t, n, i, o) {
            return jQuery.easing[jQuery.easing.def](e, t, n, i, o)
        },
        easeInQuad: function(e, t, n, i, o) {
            return i * (t /= o) * t + n
        },
        easeOutQuad: function(e, t, n, i, o) {
            return -i * (t /= o) * (t - 2) + n
        },
        easeInOutQuad: function(e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t + n : -i / 2 * (--t * (t - 2) - 1) + n
        },
        easeInCubic: function(e, t, n, i, o) {
            return i * (t /= o) * t * t + n
        },
        easeOutCubic: function(e, t, n, i, o) {
            return i * ((t = t / o - 1) * t * t + 1) + n
        },
        easeInOutCubic: function(e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t + n : i / 2 * ((t -= 2) * t * t + 2) + n
        },
        easeInQuart: function(e, t, n, i, o) {
            return i * (t /= o) * t * t * t + n
        },
        easeOutQuart: function(e, t, n, i, o) {
            return -i * ((t = t / o - 1) * t * t * t - 1) + n
        },
        easeInOutQuart: function(e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t * t + n : -i / 2 * ((t -= 2) * t * t * t - 2) + n
        },
        easeInQuint: function(e, t, n, i, o) {
            return i * (t /= o) * t * t * t * t + n
        },
        easeOutQuint: function(e, t, n, i, o) {
            return i * ((t = t / o - 1) * t * t * t * t + 1) + n
        },
        easeInOutQuint: function(e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t * t * t + n : i / 2 * ((t -= 2) * t * t * t * t + 2) + n
        },
        easeInSine: function(e, t, n, i, o) {
            return -i * Math.cos(t / o * (Math.PI / 2)) + i + n
        },
        easeOutSine: function(e, t, n, i, o) {
            return i * Math.sin(t / o * (Math.PI / 2)) + n
        },
        easeInOutSine: function(e, t, n, i, o) {
            return -i / 2 * (Math.cos(Math.PI * t / o) - 1) + n
        },
        easeInExpo: function(e, t, n, i, o) {
            return 0 == t ? n : i * Math.pow(2, 10 * (t / o - 1)) + n
        },
        easeOutExpo: function(e, t, n, i, o) {
            return t == o ? n + i : i * (1 - Math.pow(2, -10 * t / o)) + n
        },
        easeInOutExpo: function(e, t, n, i, o) {
            return 0 == t ? n : t == o ? n + i : (t /= o / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + n : i / 2 * (2 - Math.pow(2, -10 * --t)) + n
        },
        easeInCirc: function(e, t, n, i, o) {
            return -i * (Math.sqrt(1 - (t /= o) * t) - 1) + n
        },
        easeOutCirc: function(e, t, n, i, o) {
            return i * Math.sqrt(1 - (t = t / o - 1) * t) + n
        },
        easeInOutCirc: function(e, t, n, i, o) {
            return (t /= o / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + n : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n
        },
        easeInElastic: function(e, t, n, i, o) {
            var r = 1.70158,
                a = 0,
                s = i;
            return 0 == t ? n : 1 == (t /= o) ? n + i : (a || (a = .3 * o), s < Math.abs(i) ? (s = i, r = a / 4) : r = a / (2 * Math.PI) * Math.asin(i / s), -s * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * o - r) * Math.PI / a) + n)
        },
        easeOutElastic: function(e, t, n, i, o) {
            var r = 1.70158,
                a = 0,
                s = i;
            return 0 == t ? n : 1 == (t /= o) ? n + i : (a || (a = .3 * o), s < Math.abs(i) ? (s = i, r = a / 4) : r = a / (2 * Math.PI) * Math.asin(i / s), s * Math.pow(2, -10 * t) * Math.sin(2 * (t * o - r) * Math.PI / a) + i + n)
        },
        easeInOutElastic: function(e, t, n, i, o) {
            var r = 1.70158,
                a = 0,
                s = i;
            return 0 == t ? n : 2 == (t /= o / 2) ? n + i : (a || (a = .3 * o * 1.5), s < Math.abs(i) ? (s = i, r = a / 4) : r = a / (2 * Math.PI) * Math.asin(i / s), t < 1 ? -.5 * s * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * o - r) * Math.PI / a) + n : s * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t * o - r) * Math.PI / a) * .5 + i + n)
        },
        easeInBack: function(e, t, n, i, o, r) {
            return null == r && (r = 1.70158), i * (t /= o) * t * ((r + 1) * t - r) + n
        },
        easeOutBack: function(e, t, n, i, o, r) {
            return null == r && (r = 1.70158), i * ((t = t / o - 1) * t * ((r + 1) * t + r) + 1) + n
        },
        easeInOutBack: function(e, t, n, i, o, r) {
            return null == r && (r = 1.70158), (t /= o / 2) < 1 ? i / 2 * t * t * ((1 + (r *= 1.525)) * t - r) + n : i / 2 * ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) + n
        },
        easeInBounce: function(e, t, n, i, o) {
            return i - jQuery.easing.easeOutBounce(e, o - t, 0, i, o) + n
        },
        easeOutBounce: function(e, t, n, i, o) {
            return (t /= o) < 1 / 2.75 ? 7.5625 * i * t * t + n : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
        },
        easeInOutBounce: function(e, t, n, i, o) {
            return t < o / 2 ? .5 * jQuery.easing.easeInBounce(e, 2 * t, 0, i, o) + n : .5 * jQuery.easing.easeOutBounce(e, 2 * t - o, 0, i, o) + .5 * i + n
        }
    }), jQuery.extend(jQuery.easing, {
        easeInOutMaterial: function(e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t + n : i / 4 * ((t -= 2) * t * t + 2) + n
        }
    }),
    function(t) {
        function a(e) {
            var t = e.length,
                n = u.type(e);
            return "function" !== n && !u.isWindow(e) && (!(1 !== e.nodeType || !t) || "array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
        }
        if (!t.jQuery) {
            var u = function(e, t) {
                return new u.fn.init(e, t)
            };
            u.isWindow = function(e) {
                return null != e && e == e.window
            }, u.type = function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[o.call(e)] || "object" : typeof e
            }, u.isArray = Array.isArray || function(e) {
                return "array" === u.type(e)
            }, u.isPlainObject = function(e) {
                var t;
                if (!e || "object" !== u.type(e) || e.nodeType || u.isWindow(e)) return !1;
                try {
                    if (e.constructor && !i.call(e, "constructor") && !i.call(e.constructor.prototype, "isPrototypeOf")) return !1
                } catch (e) {
                    return !1
                }
                for (t in e);
                return void 0 === t || i.call(e, t)
            }, u.each = function(e, t, n) {
                var i = 0,
                    o = e.length,
                    r = a(e);
                if (n) {
                    if (r)
                        for (; i < o && !1 !== t.apply(e[i], n); i++);
                    else
                        for (i in e)
                            if (!1 === t.apply(e[i], n)) break
                } else if (r)
                    for (; i < o && !1 !== t.call(e[i], i, e[i]); i++);
                else
                    for (i in e)
                        if (!1 === t.call(e[i], i, e[i])) break;
                return e
            }, u.data = function(e, t, n) {
                if (void 0 === n) {
                    var i = (o = e[u.expando]) && r[o];
                    if (void 0 === t) return i;
                    if (i && t in i) return i[t]
                } else if (void 0 !== t) {
                    var o = e[u.expando] || (e[u.expando] = ++u.uuid);
                    return r[o] = r[o] || {}, r[o][t] = n
                }
            }, u.removeData = function(e, t) {
                var n = e[u.expando],
                    i = n && r[n];
                i && u.each(t, function(e, t) {
                    delete i[t]
                })
            }, u.extend = function() {
                var e, t, n, i, o, r, a = arguments[0] || {},
                    s = 1,
                    l = arguments.length,
                    c = !1;
                for ("boolean" == typeof a && (c = a, a = arguments[s] || {}, s++), "object" != typeof a && "function" !== u.type(a) && (a = {}), s === l && (a = this, s--); s < l; s++)
                    if (null != (o = arguments[s]))
                        for (i in o) e = a[i], a !== (n = o[i]) && (c && n && (u.isPlainObject(n) || (t = u.isArray(n))) ? (t ? (t = !1, r = e && u.isArray(e) ? e : []) : r = e && u.isPlainObject(e) ? e : {}, a[i] = u.extend(c, r, n)) : void 0 !== n && (a[i] = n));
                return a
            }, u.queue = function(e, t, n) {
                if (e) {
                    t = (t || "fx") + "queue";
                    var i = u.data(e, t);
                    return n ? (!i || u.isArray(n) ? i = u.data(e, t, (r = [], null != (o = n) && (a(Object(o)) ? function(e, t) {
                        for (var n = +t.length, i = 0, o = e.length; i < n;) e[o++] = t[i++];
                        if (n != n)
                            for (; void 0 !== t[i];) e[o++] = t[i++];
                        e.length = o
                    }(r, "string" == typeof o ? [o] : o) : [].push.call(r, o)), r)) : i.push(n), i) : i || []
                }
                var o, r
            }, u.dequeue = function(e, o) {
                u.each(e.nodeType ? [e] : e, function(e, t) {
                    o = o || "fx";
                    var n = u.queue(t, o),
                        i = n.shift();
                    "inprogress" === i && (i = n.shift()), i && ("fx" === o && n.unshift("inprogress"), i.call(t, function() {
                        u.dequeue(t, o)
                    }))
                })
            }, u.fn = u.prototype = {
                init: function(e) {
                    if (e.nodeType) return this[0] = e, this;
                    throw new Error("Not a DOM node.")
                },
                offset: function() {
                    var e = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                        top: 0,
                        left: 0
                    };
                    return {
                        top: e.top + (t.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                        left: e.left + (t.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                    }
                },
                position: function() {
                    function e() {
                        for (var e = this.offsetParent || document; e && "html" === !e.nodeType.toLowerCase && "static" === e.style.position;) e = e.offsetParent;
                        return e || document
                    }
                    var t = this[0],
                        e = e.apply(t),
                        n = this.offset(),
                        i = /^(?:body|html)$/i.test(e.nodeName) ? {
                            top: 0,
                            left: 0
                        } : u(e).offset();
                    return n.top -= parseFloat(t.style.marginTop) || 0, n.left -= parseFloat(t.style.marginLeft) || 0, e.style && (i.top += parseFloat(e.style.borderTopWidth) || 0, i.left += parseFloat(e.style.borderLeftWidth) || 0), {
                        top: n.top - i.top,
                        left: n.left - i.left
                    }
                }
            };
            var r = {};
            u.expando = "velocity" + (new Date).getTime(), u.uuid = 0;
            for (var n = {}, i = n.hasOwnProperty, o = n.toString, e = "Boolean Number String Function Array Date RegExp Object Error".split(" "), s = 0; s < e.length; s++) n["[object " + e[s] + "]"] = e[s].toLowerCase();
            u.fn.init.prototype = u.fn, t.Velocity = {
                Utilities: u
            }
        }
    }(window),
    function(e) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : e()
    }(function() {
        return function(e, I, R, q) {
            function h(e) {
                return $.isWrapped(e) ? e = [].slice.call(e) : $.isNode(e) && (e = [e]), e
            }

            function B(e) {
                var t = H.data(e, "velocity");
                return null === t ? q : t
            }

            function i(a, t, s, n) {
                function i(e, t) {
                    return 1 - 3 * t + 3 * e
                }

                function o(e, t) {
                    return 3 * t - 6 * e
                }

                function r(e) {
                    return 3 * e
                }

                function l(e, t, n) {
                    return ((i(t, n) * e + o(t, n)) * e + r(t)) * e
                }

                function c(e, t, n) {
                    return 3 * i(t, n) * e * e + 2 * o(t, n) * e + r(t)
                }
                var e = "Float32Array" in I;
                if (4 !== arguments.length) return !1;
                for (var u = 0; u < 4; ++u)
                    if ("number" != typeof arguments[u] || isNaN(arguments[u]) || !isFinite(arguments[u])) return !1;
                a = Math.min(a, 1), s = Math.min(s, 1), a = Math.max(a, 0), s = Math.max(s, 0);
                var d = e ? new Float32Array(11) : new Array(11),
                    f = !1,
                    p = function(e) {
                        return f || (f = !0, (a != t || s != n) && function() {
                            for (var e = 0; e < 11; ++e) d[e] = l(.1 * e, a, s)
                        }()), a === t && s === n ? e : 0 === e ? 0 : 1 === e ? 1 : l(function(e) {
                            for (var t = 0, n = 1; 10 != n && d[n] <= e; ++n) t += .1;
                            var i = t + (e - d[--n]) / (d[n + 1] - d[n]) * .1,
                                o = c(i, a, s);
                            return .001 <= o ? function(e, t) {
                                for (var n = 0; n < 4; ++n) {
                                    var i = c(t, a, s);
                                    if (0 === i) return t;
                                    t -= (l(t, a, s) - e) / i
                                }
                                return t
                            }(e, i) : 0 == o ? i : function(e, t, n) {
                                for (var i, o, r = 0; 0 < (i = l(o = t + (n - t) / 2, a, s) - e) ? n = o : t = o, 1e-7 < Math.abs(i) && ++r < 10;);
                                return o
                            }(e, t, t + .1)
                        }(e), t, n)
                    };
                p.getControlPoints = function() {
                    return [{
                        x: a,
                        y: t
                    }, {
                        x: s,
                        y: n
                    }]
                };
                var h = "generateBezier(" + [a, t, s, n] + ")";
                return p.toString = function() {
                    return h
                }, p
            }

            function F(e, t) {
                var n = e;
                return $.isString(e) ? z.Easings[e] || (n = !1) : n = $.isArray(e) && 1 === e.length ? function(t) {
                    return function(e) {
                        return Math.round(e * t) * (1 / t)
                    }
                }.apply(null, e) : $.isArray(e) && 2 === e.length ? a.apply(null, e.concat([t])) : !(!$.isArray(e) || 4 !== e.length) && i.apply(null, e), !1 === n && (n = z.Easings[z.defaults.easing] ? z.defaults.easing : r), n
            }

            function W(e) {
                if (e) {
                    var t = (new Date).getTime(),
                        n = z.State.calls.length;
                    1e4 < n && (z.State.calls = function(e) {
                        for (var t = -1, n = e ? e.length : 0, i = []; ++t < n;) {
                            var o = e[t];
                            o && i.push(o)
                        }
                        return i
                    }(z.State.calls));
                    for (var i = 0; i < n; i++)
                        if (z.State.calls[i]) {
                            var o = z.State.calls[i],
                                r = o[0],
                                a = o[2],
                                s = o[3],
                                l = !!s,
                                c = null;
                            s || (s = z.State.calls[i][3] = t - 16);
                            for (var u = Math.min((t - s) / a.duration, 1), d = 0, f = r.length; d < f; d++) {
                                var p = r[d],
                                    h = p.element;
                                if (B(h)) {
                                    var m = !1;
                                    for (var v in a.display !== q && null !== a.display && "none" !== a.display && ("flex" === a.display && H.each(["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"], function(e, t) {
                                            V.setPropertyValue(h, "display", t)
                                        }), V.setPropertyValue(h, "display", a.display)), a.visibility !== q && "hidden" !== a.visibility && V.setPropertyValue(h, "visibility", a.visibility), p)
                                        if ("element" !== v) {
                                            var g, y = p[v],
                                                b = $.isString(y.easing) ? z.Easings[y.easing] : y.easing;
                                            if (1 === u) g = y.endValue;
                                            else {
                                                var w = y.endValue - y.startValue;
                                                if (g = y.startValue + w * b(u, a, w), !l && g === y.currentValue) continue
                                            }
                                            if (y.currentValue = g, "tween" === v) c = g;
                                            else {
                                                if (V.Hooks.registered[v]) {
                                                    var x = V.Hooks.getRoot(v),
                                                        C = B(h).rootPropertyValueCache[x];
                                                    C && (y.rootPropertyValue = C)
                                                }
                                                var S = V.setPropertyValue(h, v, y.currentValue + (0 === parseFloat(g) ? "" : y.unitType), y.rootPropertyValue, y.scrollData);
                                                V.Hooks.registered[v] && (B(h).rootPropertyValueCache[x] = V.Normalizations.registered[x] ? V.Normalizations.registered[x]("extract", null, S[1]) : S[1]), "transform" === S[0] && (m = !0)
                                            }
                                        } a.mobileHA && B(h).transformCache.translate3d === q && (B(h).transformCache.translate3d = "(0px, 0px, 0px)", m = !0), m && V.flushTransformCache(h)
                                }
                            }
                            a.display !== q && "none" !== a.display && (z.State.calls[i][2].display = !1), a.visibility !== q && "hidden" !== a.visibility && (z.State.calls[i][2].visibility = !1), a.progress && a.progress.call(o[1], o[1], u, Math.max(0, s + a.duration - t), s, c), 1 === u && k(i)
                        }
                }
                z.State.isTicking && T(W)
            }

            function k(e, t) {
                if (!z.State.calls[e]) return !1;
                for (var n = z.State.calls[e][0], i = z.State.calls[e][1], o = z.State.calls[e][2], r = z.State.calls[e][4], a = !1, s = 0, l = n.length; s < l; s++) {
                    var c = n[s].element;
                    if (t || o.loop || ("none" === o.display && V.setPropertyValue(c, "display", o.display), "hidden" === o.visibility && V.setPropertyValue(c, "visibility", o.visibility)), !0 !== o.loop && (H.queue(c)[1] === q || !/\.velocityQueueEntryFlag/i.test(H.queue(c)[1])) && B(c)) {
                        B(c).isAnimating = !1;
                        var u = !(B(c).rootPropertyValueCache = {});
                        H.each(V.Lists.transforms3D, function(e, t) {
                            var n = /^scale/.test(t) ? 1 : 0,
                                i = B(c).transformCache[t];
                            B(c).transformCache[t] !== q && new RegExp("^\\(" + n + "[^.]").test(i) && (u = !0, delete B(c).transformCache[t])
                        }), o.mobileHA && (u = !0, delete B(c).transformCache.translate3d), u && V.flushTransformCache(c), V.Values.removeClass(c, "velocity-animating")
                    }
                    if (!t && o.complete && !o.loop && s === l - 1) try {
                        o.complete.call(i, i)
                    } catch (e) {
                        setTimeout(function() {
                            throw e
                        }, 1)
                    }
                    r && !0 !== o.loop && r(i), B(c) && !0 === o.loop && !t && (H.each(B(c).tweensContainer, function(e, t) {
                        /^rotate/.test(e) && 360 === parseFloat(t.endValue) && (t.endValue = 0, t.startValue = 360), /^backgroundPosition/.test(e) && 100 === parseFloat(t.endValue) && "%" === t.unitType && (t.endValue = 0, t.startValue = 100)
                    }), z(c, "reverse", {
                        loop: !0,
                        delay: o.delay
                    })), !1 !== o.queue && H.dequeue(c, o.queue)
                }
                z.State.calls[e] = !1;
                for (var d = 0, f = z.State.calls.length; d < f; d++)
                    if (!1 !== z.State.calls[d]) {
                        a = !0;
                        break
                    }! 1 === a && (z.State.isTicking = !1, delete z.State.calls, z.State.calls = [])
            }
            var H, o, d = function() {
                    if (R.documentMode) return R.documentMode;
                    for (var e = 7; 4 < e; e--) {
                        var t = R.createElement("div");
                        if (t.innerHTML = "\x3c!--[if IE " + e + "]><span></span><![endif]--\x3e", t.getElementsByTagName("span").length) return t = null, e
                    }
                    return q
                }(),
                t = (o = 0, I.webkitRequestAnimationFrame || I.mozRequestAnimationFrame || function(e) {
                    var t, n = (new Date).getTime();
                    return t = Math.max(0, 16 - (n - o)), o = n + t, setTimeout(function() {
                        e(n + t)
                    }, t)
                }),
                $ = {
                    isString: function(e) {
                        return "string" == typeof e
                    },
                    isArray: Array.isArray || function(e) {
                        return "[object Array]" === Object.prototype.toString.call(e)
                    },
                    isFunction: function(e) {
                        return "[object Function]" === Object.prototype.toString.call(e)
                    },
                    isNode: function(e) {
                        return e && e.nodeType
                    },
                    isNodeList: function(e) {
                        return "object" == typeof e && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e)) && e.length !== q && (0 === e.length || "object" == typeof e[0] && 0 < e[0].nodeType)
                    },
                    isWrapped: function(e) {
                        return e && (e.jquery || I.Zepto && I.Zepto.zepto.isZ(e))
                    },
                    isSVG: function(e) {
                        return I.SVGElement && e instanceof I.SVGElement
                    },
                    isEmptyObject: function(e) {
                        for (var t in e) return !1;
                        return !0
                    }
                },
                n = !1;
            if (e.fn && e.fn.jquery ? (H = e, n = !0) : H = I.Velocity.Utilities, d <= 8 && !n) throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
            if (!(d <= 7)) {
                var r = "swing",
                    z = {
                        State: {
                            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                            isAndroid: /Android/i.test(navigator.userAgent),
                            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                            isChrome: I.chrome,
                            isFirefox: /Firefox/i.test(navigator.userAgent),
                            prefixElement: R.createElement("div"),
                            prefixMatches: {},
                            scrollAnchor: null,
                            scrollPropertyLeft: null,
                            scrollPropertyTop: null,
                            isTicking: !1,
                            calls: []
                        },
                        CSS: {},
                        Utilities: H,
                        Redirects: {},
                        Easings: {},
                        Promise: I.Promise,
                        defaults: {
                            queue: "",
                            duration: 400,
                            easing: r,
                            begin: q,
                            complete: q,
                            progress: q,
                            display: q,
                            visibility: q,
                            loop: !1,
                            delay: !1,
                            mobileHA: !0,
                            _cacheValues: !0
                        },
                        init: function(e) {
                            H.data(e, "velocity", {
                                isSVG: $.isSVG(e),
                                isAnimating: !1,
                                computedStyle: null,
                                tweensContainer: null,
                                rootPropertyValueCache: {},
                                transformCache: {}
                            })
                        },
                        hook: null,
                        mock: !1,
                        version: {
                            major: 1,
                            minor: 2,
                            patch: 2
                        },
                        debug: !1
                    };
                I.pageYOffset !== q ? (z.State.scrollAnchor = I, z.State.scrollPropertyLeft = "pageXOffset", z.State.scrollPropertyTop = "pageYOffset") : (z.State.scrollAnchor = R.documentElement || R.body.parentNode || R.body, z.State.scrollPropertyLeft = "scrollLeft", z.State.scrollPropertyTop = "scrollTop");
                var a = function() {
                    function y(e) {
                        return -e.tension * e.x - e.friction * e.v
                    }

                    function b(e, t, n) {
                        var i = {
                            x: e.x + n.dx * t,
                            v: e.v + n.dv * t,
                            tension: e.tension,
                            friction: e.friction
                        };
                        return {
                            dx: i.v,
                            dv: y(i)
                        }
                    }
                    return function e(t, n, i) {
                        var o, r, a, s, l, c, u, d, f, p, h, m = {
                                x: -1,
                                v: 0,
                                tension: null,
                                friction: null
                            },
                            v = [0],
                            g = 0;
                        for (t = parseFloat(t) || 500, n = parseFloat(n) || 20, i = i || null, m.tension = t, m.friction = n, r = (o = null !== i) ? (g = e(t, n)) / i * .016 : .016; f = b(s, l = r, d = b(s, .5 * l, u = b(s, .5 * l, c = {
                                dx: (s = a || m).v,
                                dv: y(s)
                            }))), p = 1 / 6 * (c.dx + 2 * (u.dx + d.dx) + f.dx), h = 1 / 6 * (c.dv + 2 * (u.dv + d.dv) + f.dv), s.x = s.x + p * l, s.v = s.v + h * l, a = s, v.push(1 + a.x), g += 16, 1e-4 < Math.abs(a.x) && 1e-4 < Math.abs(a.v););
                        return o ? function(e) {
                            return v[e * (v.length - 1) | 0]
                        } : g
                    }
                }();
                z.Easings = {
                    linear: function(e) {
                        return e
                    },
                    swing: function(e) {
                        return .5 - Math.cos(e * Math.PI) / 2
                    },
                    spring: function(e) {
                        return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6 * -e)
                    }
                }, H.each([
                    ["ease", [.25, .1, .25, 1]],
                    ["ease-in", [.42, 0, 1, 1]],
                    ["ease-out", [0, 0, .58, 1]],
                    ["ease-in-out", [.42, 0, .58, 1]],
                    ["easeInSine", [.47, 0, .745, .715]],
                    ["easeOutSine", [.39, .575, .565, 1]],
                    ["easeInOutSine", [.445, .05, .55, .95]],
                    ["easeInQuad", [.55, .085, .68, .53]],
                    ["easeOutQuad", [.25, .46, .45, .94]],
                    ["easeInOutQuad", [.455, .03, .515, .955]],
                    ["easeInCubic", [.55, .055, .675, .19]],
                    ["easeOutCubic", [.215, .61, .355, 1]],
                    ["easeInOutCubic", [.645, .045, .355, 1]],
                    ["easeInQuart", [.895, .03, .685, .22]],
                    ["easeOutQuart", [.165, .84, .44, 1]],
                    ["easeInOutQuart", [.77, 0, .175, 1]],
                    ["easeInQuint", [.755, .05, .855, .06]],
                    ["easeOutQuint", [.23, 1, .32, 1]],
                    ["easeInOutQuint", [.86, 0, .07, 1]],
                    ["easeInExpo", [.95, .05, .795, .035]],
                    ["easeOutExpo", [.19, 1, .22, 1]],
                    ["easeInOutExpo", [1, 0, 0, 1]],
                    ["easeInCirc", [.6, .04, .98, .335]],
                    ["easeOutCirc", [.075, .82, .165, 1]],
                    ["easeInOutCirc", [.785, .135, .15, .86]]
                ], function(e, t) {
                    z.Easings[t[0]] = i.apply(null, t[1])
                });
                var V = z.CSS = {
                    RegEx: {
                        isHex: /^#([A-f\d]{3}){1,2}$/i,
                        valueUnwrap: /^[A-z]+\((.*)\)$/i,
                        wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                        valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
                    },
                    Lists: {
                        colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                        transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                        transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
                    },
                    Hooks: {
                        templates: {
                            textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                            boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                            clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                            backgroundPosition: ["X Y", "0% 0%"],
                            transformOrigin: ["X Y Z", "50% 50% 0px"],
                            perspectiveOrigin: ["X Y", "50% 50%"]
                        },
                        registered: {},
                        register: function() {
                            for (r = 0; r < V.Lists.colors.length; r++) {
                                var e = "color" === V.Lists.colors[r] ? "0 0 0 1" : "255 255 255 1";
                                V.Hooks.templates[V.Lists.colors[r]] = ["Red Green Blue Alpha", e]
                            }
                            var t, n, i;
                            if (d)
                                for (t in V.Hooks.templates) {
                                    i = (n = V.Hooks.templates[t])[0].split(" ");
                                    var o = n[1].match(V.RegEx.valueSplit);
                                    "Color" === i[0] && (i.push(i.shift()), o.push(o.shift()), V.Hooks.templates[t] = [i.join(" "), o.join(" ")])
                                }
                            for (t in V.Hooks.templates)
                                for (var r in i = (n = V.Hooks.templates[t])[0].split(" ")) {
                                    var a = t + i[r],
                                        s = r;
                                    V.Hooks.registered[a] = [t, s]
                                }
                        },
                        getRoot: function(e) {
                            var t = V.Hooks.registered[e];
                            return t ? t[0] : e
                        },
                        cleanRootPropertyValue: function(e, t) {
                            return V.RegEx.valueUnwrap.test(t) && (t = t.match(V.RegEx.valueUnwrap)[1]), V.Values.isCSSNullValue(t) && (t = V.Hooks.templates[e][1]), t
                        },
                        extractValue: function(e, t) {
                            var n = V.Hooks.registered[e];
                            if (n) {
                                var i = n[0],
                                    o = n[1];
                                return (t = V.Hooks.cleanRootPropertyValue(i, t)).toString().match(V.RegEx.valueSplit)[o]
                            }
                            return t
                        },
                        injectValue: function(e, t, n) {
                            var i = V.Hooks.registered[e];
                            if (i) {
                                var o, r = i[0],
                                    a = i[1];
                                return (o = (n = V.Hooks.cleanRootPropertyValue(r, n)).toString().match(V.RegEx.valueSplit))[a] = t, o.join(" ")
                            }
                            return n
                        }
                    },
                    Normalizations: {
                        registered: {
                            clip: function(e, t, n) {
                                switch (e) {
                                    case "name":
                                        return "clip";
                                    case "extract":
                                        var i;
                                        return V.RegEx.wrappedValueAlreadyExtracted.test(n) ? n : (i = n.toString().match(V.RegEx.valueUnwrap)) ? i[1].replace(/,(\s+)?/g, " ") : n;
                                    case "inject":
                                        return "rect(" + n + ")"
                                }
                            },
                            blur: function(e, t, n) {
                                switch (e) {
                                    case "name":
                                        return z.State.isFirefox ? "filter" : "-webkit-filter";
                                    case "extract":
                                        var i = parseFloat(n);
                                        if (!i && 0 !== i) {
                                            var o = n.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                            i = o ? o[1] : 0
                                        }
                                        return i;
                                    case "inject":
                                        return parseFloat(n) ? "blur(" + n + ")" : "none"
                                }
                            },
                            opacity: function(e, t, n) {
                                if (d <= 8) switch (e) {
                                    case "name":
                                        return "filter";
                                    case "extract":
                                        var i = n.toString().match(/alpha\(opacity=(.*)\)/i);
                                        return i ? i[1] / 100 : 1;
                                    case "inject":
                                        return (t.style.zoom = 1) <= parseFloat(n) ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(n), 10) + ")"
                                } else switch (e) {
                                    case "name":
                                        return "opacity";
                                    case "extract":
                                    case "inject":
                                        return n
                                }
                            }
                        },
                        register: function() {
                            for (d <= 9 || z.State.isGingerbread || (V.Lists.transformsBase = V.Lists.transformsBase.concat(V.Lists.transforms3D)), e = 0; e < V.Lists.transformsBase.length; e++) ! function() {
                                var o = V.Lists.transformsBase[e];
                                V.Normalizations.registered[o] = function(e, t, n) {
                                    switch (e) {
                                        case "name":
                                            return "transform";
                                        case "extract":
                                            return B(t) === q || B(t).transformCache[o] === q ? /^scale/i.test(o) ? 1 : 0 : B(t).transformCache[o].replace(/[()]/g, "");
                                        case "inject":
                                            var i = !1;
                                            switch (o.substr(0, o.length - 1)) {
                                                case "translate":
                                                    i = !/(%|px|em|rem|vw|vh|\d)$/i.test(n);
                                                    break;
                                                case "scal":
                                                case "scale":
                                                    z.State.isAndroid && B(t).transformCache[o] === q && n < 1 && (n = 1), i = !/(\d)$/i.test(n);
                                                    break;
                                                case "skew":
                                                    i = !/(deg|\d)$/i.test(n);
                                                    break;
                                                case "rotate":
                                                    i = !/(deg|\d)$/i.test(n)
                                            }
                                            return i || (B(t).transformCache[o] = "(" + n + ")"), B(t).transformCache[o]
                                    }
                                }
                            }();
                            for (var e = 0; e < V.Lists.colors.length; e++) ! function() {
                                var a = V.Lists.colors[e];
                                V.Normalizations.registered[a] = function(e, t, n) {
                                    switch (e) {
                                        case "name":
                                            return a;
                                        case "extract":
                                            var i;
                                            if (V.RegEx.wrappedValueAlreadyExtracted.test(n)) i = n;
                                            else {
                                                var o, r = {
                                                    black: "rgb(0, 0, 0)",
                                                    blue: "rgb(0, 0, 255)",
                                                    gray: "rgb(128, 128, 128)",
                                                    green: "rgb(0, 128, 0)",
                                                    red: "rgb(255, 0, 0)",
                                                    white: "rgb(255, 255, 255)"
                                                };
                                                /^[A-z]+$/i.test(n) ? o = r[n] !== q ? r[n] : r.black : V.RegEx.isHex.test(n) ? o = "rgb(" + V.Values.hexToRgb(n).join(" ") + ")" : /^rgba?\(/i.test(n) || (o = r.black), i = (o || n).toString().match(V.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                            }
                                            return d <= 8 || 3 !== i.split(" ").length || (i += " 1"), i;
                                        case "inject":
                                            return d <= 8 ? 4 === n.split(" ").length && (n = n.split(/\s+/).slice(0, 3).join(" ")) : 3 === n.split(" ").length && (n += " 1"), (d <= 8 ? "rgb" : "rgba") + "(" + n.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                    }
                                }
                            }()
                        }
                    },
                    Names: {
                        camelCase: function(e) {
                            return e.replace(/-(\w)/g, function(e, t) {
                                return t.toUpperCase()
                            })
                        },
                        SVGAttribute: function(e) {
                            var t = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                            return (d || z.State.isAndroid && !z.State.isChrome) && (t += "|transform"), new RegExp("^(" + t + ")$", "i").test(e)
                        },
                        prefixCheck: function(e) {
                            if (z.State.prefixMatches[e]) return [z.State.prefixMatches[e], !0];
                            for (var t = ["", "Webkit", "Moz", "ms", "O"], n = 0, i = t.length; n < i; n++) {
                                var o;
                                if (o = 0 === n ? e : t[n] + e.replace(/^\w/, function(e) {
                                        return e.toUpperCase()
                                    }), $.isString(z.State.prefixElement.style[o])) return [z.State.prefixMatches[e] = o, !0]
                            }
                            return [e, !1]
                        }
                    },
                    Values: {
                        hexToRgb: function(e) {
                            var t;
                            return e = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(e, t, n, i) {
                                return t + t + n + n + i + i
                            }), (t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e)) ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : [0, 0, 0]
                        },
                        isCSSNullValue: function(e) {
                            return 0 == e || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)
                        },
                        getUnitType: function(e) {
                            return /^(rotate|skew)/i.test(e) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e) ? "" : "px"
                        },
                        getDisplayType: function(e) {
                            var t = e && e.tagName.toString().toLowerCase();
                            return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t) ? "inline" : /^(li)$/i.test(t) ? "list-item" : /^(tr)$/i.test(t) ? "table-row" : /^(table)$/i.test(t) ? "table" : /^(tbody)$/i.test(t) ? "table-row-group" : "block"
                        },
                        addClass: function(e, t) {
                            e.classList ? e.classList.add(t) : e.className += (e.className.length ? " " : "") + t
                        },
                        removeClass: function(e, t) {
                            e.classList ? e.classList.remove(t) : e.className = e.className.toString().replace(new RegExp("(^|\\s)" + t.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                        }
                    },
                    getPropertyValue: function(e, t, n, c) {
                        function u(e, t) {
                            function n() {
                                r && V.setPropertyValue(e, "display", "none")
                            }
                            var i = 0;
                            if (d <= 8) i = H.css(e, t);
                            else {
                                var o, r = !1;
                                if (/^(width|height)$/.test(t) && 0 === V.getPropertyValue(e, "display") && (r = !0, V.setPropertyValue(e, "display", V.Values.getDisplayType(e))), !c) {
                                    if ("height" === t && "border-box" !== V.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                        var a = e.offsetHeight - (parseFloat(V.getPropertyValue(e, "borderTopWidth")) || 0) - (parseFloat(V.getPropertyValue(e, "borderBottomWidth")) || 0) - (parseFloat(V.getPropertyValue(e, "paddingTop")) || 0) - (parseFloat(V.getPropertyValue(e, "paddingBottom")) || 0);
                                        return n(), a
                                    }
                                    if ("width" === t && "border-box" !== V.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                        var s = e.offsetWidth - (parseFloat(V.getPropertyValue(e, "borderLeftWidth")) || 0) - (parseFloat(V.getPropertyValue(e, "borderRightWidth")) || 0) - (parseFloat(V.getPropertyValue(e, "paddingLeft")) || 0) - (parseFloat(V.getPropertyValue(e, "paddingRight")) || 0);
                                        return n(), s
                                    }
                                }
                                o = B(e) === q ? I.getComputedStyle(e, null) : B(e).computedStyle ? B(e).computedStyle : B(e).computedStyle = I.getComputedStyle(e, null), "borderColor" === t && (t = "borderTopColor"), ("" === (i = 9 === d && "filter" === t ? o.getPropertyValue(t) : o[t]) || null === i) && (i = e.style[t]), n()
                            }
                            if ("auto" === i && /^(top|right|bottom|left)$/i.test(t)) {
                                var l = u(e, "position");
                                ("fixed" === l || "absolute" === l && /top|left/i.test(t)) && (i = H(e).position()[t] + "px")
                            }
                            return i
                        }
                        var i;
                        if (V.Hooks.registered[t]) {
                            var o = t,
                                r = V.Hooks.getRoot(o);
                            n === q && (n = V.getPropertyValue(e, V.Names.prefixCheck(r)[0])), V.Normalizations.registered[r] && (n = V.Normalizations.registered[r]("extract", e, n)), i = V.Hooks.extractValue(o, n)
                        } else if (V.Normalizations.registered[t]) {
                            var a, s;
                            "transform" !== (a = V.Normalizations.registered[t]("name", e)) && (s = u(e, V.Names.prefixCheck(a)[0]), V.Values.isCSSNullValue(s) && V.Hooks.templates[t] && (s = V.Hooks.templates[t][1])), i = V.Normalizations.registered[t]("extract", e, s)
                        }
                        if (!/^[\d-]/.test(i))
                            if (B(e) && B(e).isSVG && V.Names.SVGAttribute(t))
                                if (/^(height|width)$/i.test(t)) try {
                                    i = e.getBBox()[t]
                                } catch (e) {
                                    i = 0
                                } else i = e.getAttribute(t);
                                else i = u(e, V.Names.prefixCheck(t)[0]);
                        return V.Values.isCSSNullValue(i) && (i = 0), 2 <= z.debug && console.log("Get " + t + ": " + i), i
                    },
                    setPropertyValue: function(e, t, n, i, o) {
                        var r = t;
                        if ("scroll" === t) o.container ? o.container["scroll" + o.direction] = n : "Left" === o.direction ? I.scrollTo(n, o.alternateValue) : I.scrollTo(o.alternateValue, n);
                        else if (V.Normalizations.registered[t] && "transform" === V.Normalizations.registered[t]("name", e)) V.Normalizations.registered[t]("inject", e, n), r = "transform", n = B(e).transformCache[t];
                        else {
                            if (V.Hooks.registered[t]) {
                                var a = t,
                                    s = V.Hooks.getRoot(t);
                                i = i || V.getPropertyValue(e, s), n = V.Hooks.injectValue(a, n, i), t = s
                            }
                            if (V.Normalizations.registered[t] && (n = V.Normalizations.registered[t]("inject", e, n), t = V.Normalizations.registered[t]("name", e)), r = V.Names.prefixCheck(t)[0], d <= 8) try {
                                e.style[r] = n
                            } catch (e) {
                                z.debug && console.log("Browser does not support [" + n + "] for [" + r + "]")
                            } else B(e) && B(e).isSVG && V.Names.SVGAttribute(t) ? e.setAttribute(t, n) : e.style[r] = n;
                            2 <= z.debug && console.log("Set " + t + " (" + r + "): " + n)
                        }
                        return [r, n]
                    },
                    flushTransformCache: function(t) {
                        function e(e) {
                            return parseFloat(V.getPropertyValue(t, e))
                        }
                        var n = "";
                        if ((d || z.State.isAndroid && !z.State.isChrome) && B(t).isSVG) {
                            var i = {
                                translate: [e("translateX"), e("translateY")],
                                skewX: [e("skewX")],
                                skewY: [e("skewY")],
                                scale: 1 !== e("scale") ? [e("scale"), e("scale")] : [e("scaleX"), e("scaleY")],
                                rotate: [e("rotateZ"), 0, 0]
                            };
                            H.each(B(t).transformCache, function(e) {
                                /^translate/i.test(e) ? e = "translate" : /^scale/i.test(e) ? e = "scale" : /^rotate/i.test(e) && (e = "rotate"), i[e] && (n += e + "(" + i[e].join(" ") + ") ", delete i[e])
                            })
                        } else {
                            var o, r;
                            H.each(B(t).transformCache, function(e) {
                                return o = B(t).transformCache[e], "transformPerspective" === e ? (r = o, !0) : (9 === d && "rotateZ" === e && (e = "rotate"), void(n += e + o + " "))
                            }), r && (n = "perspective" + r + " " + n)
                        }
                        V.setPropertyValue(t, "transform", n)
                    }
                };
                V.Hooks.register(), V.Normalizations.register(), z.hook = function(e, i, o) {
                    var r = q;
                    return e = h(e), H.each(e, function(e, t) {
                        if (B(t) === q && z.init(t), o === q) r === q && (r = z.CSS.getPropertyValue(t, i));
                        else {
                            var n = z.CSS.setPropertyValue(t, i, o);
                            "transform" === n[0] && z.CSS.flushTransformCache(t), r = n
                        }
                    }), r
                };
                var m = function() {
                    function e() {
                        return t ? M.promise || null : n
                    }
                    var t, n, i, A, O, N, o = arguments[0] && (arguments[0].p || H.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || $.isString(arguments[0].properties));
                    if ($.isWrapped(this) ? (t = !1, i = 0, n = A = this) : (t = !0, i = 1, A = o ? arguments[0].elements || arguments[0].e : arguments[0]), A = h(A)) {
                        o ? (O = arguments[0].properties || arguments[0].p, N = arguments[0].options || arguments[0].o) : (O = arguments[i], N = arguments[i + 1]);
                        var j = A.length,
                            _ = 0;
                        if (!/^(stop|finish)$/i.test(O) && !H.isPlainObject(N)) {
                            N = {};
                            for (var r = i + 1; r < arguments.length; r++) $.isArray(arguments[r]) || !/^(fast|normal|slow)$/i.test(arguments[r]) && !/^\d/.test(arguments[r]) ? $.isString(arguments[r]) || $.isArray(arguments[r]) ? N.easing = arguments[r] : $.isFunction(arguments[r]) && (N.complete = arguments[r]) : N.duration = arguments[r]
                        }
                        var P, M = {
                            promise: null,
                            resolver: null,
                            rejecter: null
                        };
                        switch (t && z.Promise && (M.promise = new z.Promise(function(e, t) {
                            M.resolver = e, M.rejecter = t
                        })), O) {
                            case "scroll":
                                P = "scroll";
                                break;
                            case "reverse":
                                P = "reverse";
                                break;
                            case "finish":
                            case "stop":
                                H.each(A, function(e, t) {
                                    B(t) && B(t).delayTimer && (clearTimeout(B(t).delayTimer.setTimeout), B(t).delayTimer.next && B(t).delayTimer.next(), delete B(t).delayTimer)
                                });
                                var a = [];
                                return H.each(z.State.calls, function(o, r) {
                                    r && H.each(r[1], function(e, n) {
                                        var i = N === q ? "" : N;
                                        return !0 !== i && r[2].queue !== i && (N !== q || !1 !== r[2].queue) || void H.each(A, function(e, t) {
                                            t === n && ((!0 === N || $.isString(N)) && (H.each(H.queue(t, $.isString(N) ? N : ""), function(e, t) {
                                                $.isFunction(t) && t(null, !0)
                                            }), H.queue(t, $.isString(N) ? N : "", [])), "stop" === O ? (B(t) && B(t).tweensContainer && !1 !== i && H.each(B(t).tweensContainer, function(e, t) {
                                                t.endValue = t.currentValue
                                            }), a.push(o)) : "finish" === O && (r[2].duration = 1))
                                        })
                                    })
                                }), "stop" === O && (H.each(a, function(e, t) {
                                    k(t, !0)
                                }), M.promise && M.resolver(A)), e();
                            default:
                                if (!H.isPlainObject(O) || $.isEmptyObject(O)) {
                                    if ($.isString(O) && z.Redirects[O]) {
                                        var s = (d = H.extend({}, N)).duration,
                                            l = d.delay || 0;
                                        return !0 === d.backwards && (A = H.extend(!0, [], A).reverse()), H.each(A, function(e, t) {
                                            parseFloat(d.stagger) ? d.delay = l + parseFloat(d.stagger) * e : $.isFunction(d.stagger) && (d.delay = l + d.stagger.call(t, e, j)), d.drag && (d.duration = parseFloat(s) || (/^(callout|transition)/.test(O) ? 1e3 : 400), d.duration = Math.max(d.duration * (d.backwards ? 1 - e / j : (e + 1) / j), .75 * d.duration, 200)), z.Redirects[O].call(t, t, d || {}, e, j, A, M.promise ? M : q)
                                        }), e()
                                    }
                                    var c = "Velocity: First argument (" + O + ") was not a property map, a known action, or a registered redirect. Aborting.";
                                    return M.promise ? M.rejecter(new Error(c)) : console.log(c), e()
                                }
                                P = "start"
                        }
                        var D = {
                                lastParent: null,
                                lastPosition: null,
                                lastFontSize: null,
                                lastPercentToPxWidth: null,
                                lastPercentToPxHeight: null,
                                lastEmToPx: null,
                                remToPx: null,
                                vwToPx: null,
                                vhToPx: null
                            },
                            L = [];
                        H.each(A, function(e, t) {
                            $.isNode(t) && function() {
                                function n(e) {
                                    function d(e, t) {
                                        var n = q,
                                            i = q,
                                            o = q;
                                        return $.isArray(e) ? (n = e[0], !$.isArray(e[1]) && /^[\d-]/.test(e[1]) || $.isFunction(e[1]) || V.RegEx.isHex.test(e[1]) ? o = e[1] : ($.isString(e[1]) && !V.RegEx.isHex.test(e[1]) || $.isArray(e[1])) && (i = t ? e[1] : F(e[1], T.duration), e[2] !== q && (o = e[2]))) : n = e, t || (i = i || T.easing), $.isFunction(n) && (n = n.call(k, _, j)), $.isFunction(o) && (o = o.call(k, _, j)), [n || 0, i, o]
                                    }

                                    function t(e, t) {
                                        var n, i;
                                        return i = (t || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(e) {
                                            return n = e, ""
                                        }), n || (n = V.Values.getUnitType(e)), [i, n]
                                    }
                                    if (T.begin && 0 === _) try {
                                        T.begin.call(A, A)
                                    } catch (e) {
                                        setTimeout(function() {
                                            throw e
                                        }, 1)
                                    }
                                    if ("scroll" === P) {
                                        var n, i, o, r = /^x$/i.test(T.axis) ? "Left" : "Top",
                                            a = parseFloat(T.offset) || 0;
                                        T.container ? $.isWrapped(T.container) || $.isNode(T.container) ? (T.container = T.container[0] || T.container, o = (n = T.container["scroll" + r]) + H(k).position()[r.toLowerCase()] + a) : T.container = null : (n = z.State.scrollAnchor[z.State["scrollProperty" + r]], i = z.State.scrollAnchor[z.State["scrollProperty" + ("Left" === r ? "Top" : "Left")]], o = H(k).offset()[r.toLowerCase()] + a), E = {
                                            scroll: {
                                                rootPropertyValue: !1,
                                                startValue: n,
                                                currentValue: n,
                                                endValue: o,
                                                unitType: "",
                                                easing: T.easing,
                                                scrollData: {
                                                    container: T.container,
                                                    direction: r,
                                                    alternateValue: i
                                                }
                                            },
                                            element: k
                                        }, z.debug && console.log("tweensContainer (scroll): ", E.scroll, k)
                                    } else if ("reverse" === P) {
                                        if (!B(k).tweensContainer) return void H.dequeue(k, T.queue);
                                        for (var s in "none" === B(k).opts.display && (B(k).opts.display = "auto"), "hidden" === B(k).opts.visibility && (B(k).opts.visibility = "visible"), B(k).opts.loop = !1, B(k).opts.begin = null, B(k).opts.complete = null, N.easing || delete T.easing, N.duration || delete T.duration, T = H.extend({}, B(k).opts, T), c = H.extend(!0, {}, B(k).tweensContainer))
                                            if ("element" !== s) {
                                                var l = c[s].startValue;
                                                c[s].startValue = c[s].currentValue = c[s].endValue, c[s].endValue = l, $.isEmptyObject(N) || (c[s].easing = T.easing), z.debug && console.log("reverse tweensContainer (" + s + "): " + JSON.stringify(c[s]), k)
                                            } E = c
                                    } else if ("start" === P) {
                                        var c;
                                        for (var u in B(k).tweensContainer && !0 === B(k).isAnimating && (c = B(k).tweensContainer), H.each(O, function(e, t) {
                                                if (RegExp("^" + V.Lists.colors.join("$|^") + "$").test(e)) {
                                                    var n = d(t, !0),
                                                        i = n[0],
                                                        o = n[1],
                                                        r = n[2];
                                                    if (V.RegEx.isHex.test(i)) {
                                                        for (var a = ["Red", "Green", "Blue"], s = V.Values.hexToRgb(i), l = r ? V.Values.hexToRgb(r) : q, c = 0; c < a.length; c++) {
                                                            var u = [s[c]];
                                                            o && u.push(o), l !== q && u.push(l[c]), O[e + a[c]] = u
                                                        }
                                                        delete O[e]
                                                    }
                                                }
                                            }), O) {
                                            var f = d(O[u]),
                                                p = f[0],
                                                h = f[1],
                                                m = f[2];
                                            u = V.Names.camelCase(u);
                                            var v = V.Hooks.getRoot(u),
                                                g = !1;
                                            if (B(k).isSVG || "tween" === v || !1 !== V.Names.prefixCheck(v)[1] || V.Normalizations.registered[v] !== q) {
                                                (T.display !== q && null !== T.display && "none" !== T.display || T.visibility !== q && "hidden" !== T.visibility) && /opacity|filter/.test(u) && !m && 0 !== p && (m = 0), T._cacheValues && c && c[u] ? (m === q && (m = c[u].endValue + c[u].unitType), g = B(k).rootPropertyValueCache[v]) : V.Hooks.registered[u] ? m === q ? (g = V.getPropertyValue(k, v), m = V.getPropertyValue(k, u, g)) : g = V.Hooks.templates[v][1] : m === q && (m = V.getPropertyValue(k, u));
                                                var y, b, w, x = !1;
                                                if (m = (y = t(u, m))[0], w = y[1], p = (y = t(u, p))[0].replace(/^([+-\/*])=/, function(e, t) {
                                                        return x = t, ""
                                                    }), b = y[1], m = parseFloat(m) || 0, p = parseFloat(p) || 0, "%" === b && (/^(fontSize|lineHeight)$/.test(u) ? (p /= 100, b = "em") : /^scale/.test(u) ? (p /= 100, b = "") : /(Red|Green|Blue)$/i.test(u) && (p = p / 100 * 255, b = "")), /[\/*]/.test(x)) b = w;
                                                else if (w !== b && 0 !== m)
                                                    if (0 === p) b = w;
                                                    else {
                                                        S = S || function() {
                                                            var e = {
                                                                    myParent: k.parentNode || R.body,
                                                                    position: V.getPropertyValue(k, "position"),
                                                                    fontSize: V.getPropertyValue(k, "fontSize")
                                                                },
                                                                t = e.position === D.lastPosition && e.myParent === D.lastParent,
                                                                n = e.fontSize === D.lastFontSize;
                                                            D.lastParent = e.myParent, D.lastPosition = e.position, D.lastFontSize = e.fontSize;
                                                            var i = {};
                                                            if (n && t) i.emToPx = D.lastEmToPx, i.percentToPxWidth = D.lastPercentToPxWidth, i.percentToPxHeight = D.lastPercentToPxHeight;
                                                            else {
                                                                var o = B(k).isSVG ? R.createElementNS("http://www.w3.org/2000/svg", "rect") : R.createElement("div");
                                                                z.init(o), e.myParent.appendChild(o), H.each(["overflow", "overflowX", "overflowY"], function(e, t) {
                                                                    z.CSS.setPropertyValue(o, t, "hidden")
                                                                }), z.CSS.setPropertyValue(o, "position", e.position), z.CSS.setPropertyValue(o, "fontSize", e.fontSize), z.CSS.setPropertyValue(o, "boxSizing", "content-box"), H.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(e, t) {
                                                                    z.CSS.setPropertyValue(o, t, "100%")
                                                                }), z.CSS.setPropertyValue(o, "paddingLeft", "100em"), i.percentToPxWidth = D.lastPercentToPxWidth = (parseFloat(V.getPropertyValue(o, "width", null, !0)) || 1) / 100, i.percentToPxHeight = D.lastPercentToPxHeight = (parseFloat(V.getPropertyValue(o, "height", null, !0)) || 1) / 100, i.emToPx = D.lastEmToPx = (parseFloat(V.getPropertyValue(o, "paddingLeft")) || 1) / 100, e.myParent.removeChild(o)
                                                            }
                                                            return null === D.remToPx && (D.remToPx = parseFloat(V.getPropertyValue(R.body, "fontSize")) || 16), null === D.vwToPx && (D.vwToPx = parseFloat(I.innerWidth) / 100, D.vhToPx = parseFloat(I.innerHeight) / 100), i.remToPx = D.remToPx, i.vwToPx = D.vwToPx, i.vhToPx = D.vhToPx, 1 <= z.debug && console.log("Unit ratios: " + JSON.stringify(i), k), i
                                                        }();
                                                        var C = /margin|padding|left|right|width|text|word|letter/i.test(u) || /X$/.test(u) || "x" === u ? "x" : "y";
                                                        switch (w) {
                                                            case "%":
                                                                m *= "x" === C ? S.percentToPxWidth : S.percentToPxHeight;
                                                                break;
                                                            case "px":
                                                                break;
                                                            default:
                                                                m *= S[w + "ToPx"]
                                                        }
                                                        switch (b) {
                                                            case "%":
                                                                m *= 1 / ("x" === C ? S.percentToPxWidth : S.percentToPxHeight);
                                                                break;
                                                            case "px":
                                                                break;
                                                            default:
                                                                m *= 1 / S[b + "ToPx"]
                                                        }
                                                    } switch (x) {
                                                    case "+":
                                                        p = m + p;
                                                        break;
                                                    case "-":
                                                        p = m - p;
                                                        break;
                                                    case "*":
                                                        p *= m;
                                                        break;
                                                    case "/":
                                                        p = m / p
                                                }
                                                E[u] = {
                                                    rootPropertyValue: g,
                                                    startValue: m,
                                                    currentValue: m,
                                                    endValue: p,
                                                    unitType: b,
                                                    easing: h
                                                }, z.debug && console.log("tweensContainer (" + u + "): " + JSON.stringify(E[u]), k)
                                            } else z.debug && console.log("Skipping [" + v + "] due to a lack of browser support.")
                                        }
                                        E.element = k
                                    }
                                    E.element && (V.Values.addClass(k, "velocity-animating"), L.push(E), "" === T.queue && (B(k).tweensContainer = E, B(k).opts = T), B(k).isAnimating = !0, _ === j - 1 ? (z.State.calls.push([L, A, T, null, M.resolver]), !1 === z.State.isTicking && (z.State.isTicking = !0, W())) : _++)
                                }
                                var S, k = this,
                                    T = H.extend({}, z.defaults, N),
                                    E = {};
                                switch (B(k) === q && z.init(k), parseFloat(T.delay) && !1 !== T.queue && H.queue(k, T.queue, function(e) {
                                    z.velocityQueueEntryFlag = !0, B(k).delayTimer = {
                                        setTimeout: setTimeout(e, parseFloat(T.delay)),
                                        next: e
                                    }
                                }), T.duration.toString().toLowerCase()) {
                                    case "fast":
                                        T.duration = 200;
                                        break;
                                    case "normal":
                                        T.duration = 400;
                                        break;
                                    case "slow":
                                        T.duration = 600;
                                        break;
                                    default:
                                        T.duration = parseFloat(T.duration) || 1
                                }!1 !== z.mock && (!0 === z.mock ? T.duration = T.delay = 1 : (T.duration *= parseFloat(z.mock) || 1, T.delay *= parseFloat(z.mock) || 1)), T.easing = F(T.easing, T.duration), T.begin && !$.isFunction(T.begin) && (T.begin = null), T.progress && !$.isFunction(T.progress) && (T.progress = null), T.complete && !$.isFunction(T.complete) && (T.complete = null), T.display !== q && null !== T.display && (T.display = T.display.toString().toLowerCase(), "auto" === T.display && (T.display = z.CSS.Values.getDisplayType(k))), T.visibility !== q && null !== T.visibility && (T.visibility = T.visibility.toString().toLowerCase()), T.mobileHA = T.mobileHA && z.State.isMobile && !z.State.isGingerbread, !1 === T.queue ? T.delay ? setTimeout(n, T.delay) : n() : H.queue(k, T.queue, function(e, t) {
                                    return !0 === t ? (M.promise && M.resolver(A), !0) : (z.velocityQueueEntryFlag = !0, void n())
                                }), "" !== T.queue && "fx" !== T.queue || "inprogress" === H.queue(k)[0] || H.dequeue(k)
                            }.call(t)
                        });
                        var u, d = H.extend({}, z.defaults, N);
                        if (d.loop = parseInt(d.loop), u = 2 * d.loop - 1, d.loop)
                            for (var f = 0; f < u; f++) {
                                var p = {
                                    delay: d.delay,
                                    progress: d.progress
                                };
                                f === u - 1 && (p.display = d.display, p.visibility = d.visibility, p.complete = d.complete), m(A, "reverse", p)
                            }
                        return e()
                    }
                };
                (z = H.extend(m, z)).animate = m;
                var T = I.requestAnimationFrame || t;
                return z.State.isMobile || R.hidden === q || R.addEventListener("visibilitychange", function() {
                    R.hidden ? (T = function(e) {
                        return setTimeout(function() {
                            e(!0)
                        }, 16)
                    }, W()) : T = I.requestAnimationFrame || t
                }), e.Velocity = z, e !== I && (e.fn.velocity = m, e.fn.velocity.defaults = z.defaults), H.each(["Down", "Up"], function(e, d) {
                    z.Redirects["slide" + d] = function(n, e, t, i, o, r) {
                        var a = H.extend({}, e),
                            s = a.begin,
                            l = a.complete,
                            c = {
                                height: "",
                                marginTop: "",
                                marginBottom: "",
                                paddingTop: "",
                                paddingBottom: ""
                            },
                            u = {};
                        a.display === q && (a.display = "Down" === d ? "inline" === z.CSS.Values.getDisplayType(n) ? "inline-block" : "block" : "none"), a.begin = function() {
                            for (var e in s && s.call(o, o), c) {
                                u[e] = n.style[e];
                                var t = z.CSS.getPropertyValue(n, e);
                                c[e] = "Down" === d ? [t, 0] : [0, t]
                            }
                            u.overflow = n.style.overflow, n.style.overflow = "hidden"
                        }, a.complete = function() {
                            for (var e in u) n.style[e] = u[e];
                            l && l.call(o, o), r && r.resolver(o)
                        }, z(n, c, a)
                    }
                }), H.each(["In", "Out"], function(e, c) {
                    z.Redirects["fade" + c] = function(e, t, n, i, o, r) {
                        var a = H.extend({}, t),
                            s = {
                                opacity: "In" === c ? 1 : 0
                            },
                            l = a.complete;
                        a.complete = n !== i - 1 ? a.begin = null : function() {
                            l && l.call(o, o), r && r.resolver(o)
                        }, a.display === q && (a.display = "In" === c ? "auto" : "none"), z(this, s, a)
                    }
                }), z
            }
            jQuery.fn.velocity = jQuery.fn.animate
        }(window.jQuery || window.Zepto || window, window, document)
    }),
	(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function t(t,s){var n,a,o,r=t.nodeName.toLowerCase();return"area"===r?(n=t.parentNode,a=n.name,t.href&&a&&"map"===n.nodeName.toLowerCase()?(o=e("img[usemap='#"+a+"']")[0],!!o&&i(o)):!1):(/^(input|select|textarea|button|object)$/.test(r)?!t.disabled:"a"===r?t.href||s:s)&&i(t)}function i(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}function s(e){for(var t,i;e.length&&e[0]!==document;){if(t=e.css("position"),("absolute"===t||"relative"===t||"fixed"===t)&&(i=parseInt(e.css("zIndex"),10),!isNaN(i)&&0!==i))return i;e=e.parent()}return 0}function n(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},e.extend(this._defaults,this.regional[""]),this.regional.en=e.extend(!0,{},this.regional[""]),this.regional["en-US"]=e.extend(!0,{},this.regional.en),this.dpDiv=a(e("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function a(t){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return t.delegate(i,"mouseout",function(){e(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",o)}function o(){e.datepicker._isDisabledDatepicker(v.inline?v.dpDiv.parent()[0]:v.input[0])||(e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),e(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).addClass("ui-datepicker-next-hover"))}function r(t,i){e.extend(t,i);for(var s in i)null==i[s]&&(t[s]=i[s]);return t}function h(e){return function(){var t=this.element.val();e.apply(this,arguments),this._refresh(),t!==this.element.val()&&this._trigger("change")}}e.ui=e.ui||{},e.extend(e.ui,{version:"1.11.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({scrollParent:function(t){var i=this.css("position"),s="absolute"===i,n=t?/(auto|scroll|hidden)/:/(auto|scroll)/,a=this.parents().filter(function(){var t=e(this);return s&&"static"===t.css("position")?!1:n.test(t.css("overflow")+t.css("overflow-y")+t.css("overflow-x"))}).eq(0);return"fixed"!==i&&a.length?a:e(this[0].ownerDocument||document)},uniqueId:function(){var e=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(i){return t(i,!isNaN(e.attr(i,"tabindex")))},tabbable:function(i){var s=e.attr(i,"tabindex"),n=isNaN(s);return(n||s>=0)&&t(i,!n)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(t,i){function s(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],a=i.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+i]=function(t){return void 0===t?o["inner"+i].call(this):this.each(function(){e(this).css(a,s(this,t)+"px")})},e.fn["outer"+i]=function(t,n){return"number"!=typeof t?o["outer"+i].call(this,t):this.each(function(){e(this).css(a,s(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),disableSelection:function(){var e="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.bind(e+".ui-disableSelection",function(e){e.preventDefault()})}}(),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(t){if(void 0!==t)return this.css("zIndex",t);if(this.length)for(var i,s,n=e(this[0]);n.length&&n[0]!==document;){if(i=n.css("position"),("absolute"===i||"relative"===i||"fixed"===i)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0}}),e.ui.plugin={add:function(t,i,s){var n,a=e.ui[t].prototype;for(n in s)a.plugins[n]=a.plugins[n]||[],a.plugins[n].push([i,s[n]])},call:function(e,t,i,s){var n,a=e.plugins[t];if(a&&(s||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(n=0;a.length>n;n++)e.options[a[n][0]]&&a[n][1].apply(e.element,i)}};var l=0,u=Array.prototype.slice;e.cleanData=function(t){return function(i){var s,n,a;for(a=0;null!=(n=i[a]);a++)try{s=e._data(n,"events"),s&&s.remove&&e(n).triggerHandler("remove")}catch(o){}t(i)}}(e.cleanData),e.widget=function(t,i,s){var n,a,o,r,h={},l=t.split(".")[0];return t=t.split(".")[1],n=l+"-"+t,s||(s=i,i=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[l]=e[l]||{},a=e[l][t],o=e[l][t]=function(e,t){return this._createWidget?(arguments.length&&this._createWidget(e,t),void 0):new o(e,t)},e.extend(o,a,{version:s.version,_proto:e.extend({},s),_childConstructors:[]}),r=new i,r.options=e.widget.extend({},r.options),e.each(s,function(t,s){return e.isFunction(s)?(h[t]=function(){var e=function(){return i.prototype[t].apply(this,arguments)},n=function(e){return i.prototype[t].apply(this,e)};return function(){var t,i=this._super,a=this._superApply;return this._super=e,this._superApply=n,t=s.apply(this,arguments),this._super=i,this._superApply=a,t}}(),void 0):(h[t]=s,void 0)}),o.prototype=e.widget.extend(r,{widgetEventPrefix:a?r.widgetEventPrefix||t:t},h,{constructor:o,namespace:l,widgetName:t,widgetFullName:n}),a?(e.each(a._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete a._childConstructors):i._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var i,s,n=u.call(arguments,1),a=0,o=n.length;o>a;a++)for(i in n[a])s=n[a][i],n[a].hasOwnProperty(i)&&void 0!==s&&(t[i]=e.isPlainObject(s)?e.isPlainObject(t[i])?e.widget.extend({},t[i],s):e.widget.extend({},s):s);return t},e.widget.bridge=function(t,i){var s=i.prototype.widgetFullName||t;e.fn[t]=function(n){var a="string"==typeof n,o=u.call(arguments,1),r=this;return a?this.each(function(){var i,a=e.data(this,s);return"instance"===n?(r=a,!1):a?e.isFunction(a[n])&&"_"!==n.charAt(0)?(i=a[n].apply(a,o),i!==a&&void 0!==i?(r=i&&i.jquery?r.pushStack(i.get()):i,!1):void 0):e.error("no such method '"+n+"' for "+t+" widget instance"):e.error("cannot call methods on "+t+" prior to initialization; "+"attempted to call method '"+n+"'")}):(o.length&&(n=e.widget.extend.apply(null,[n].concat(o))),this.each(function(){var t=e.data(this,s);t?(t.option(n||{}),t._init&&t._init()):e.data(this,s,new i(n,this))})),r}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,i){i=e(i||this.defaultElement||this)[0],this.element=e(i),this.uuid=l++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),i!==this&&(e.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===i&&this.destroy()}}),this.document=e(i.style?i.ownerDocument:i.document||i),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(t,i){var s,n,a,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},s=t.split("."),t=s.shift(),s.length){for(n=o[t]=e.widget.extend({},this.options[t]),a=0;s.length-1>a;a++)n[s[a]]=n[s[a]]||{},n=n[s[a]];if(t=s.pop(),1===arguments.length)return void 0===n[t]?null:n[t];n[t]=i}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=i}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),t&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,i,s){var n,a=this;"boolean"!=typeof t&&(s=i,i=t,t=!1),s?(i=n=e(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),e.each(s,function(s,o){function r(){return t||a.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?a[o]:o).apply(a,arguments):void 0}"string"!=typeof o&&(r.guid=o.guid=o.guid||r.guid||e.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+a.eventNamespace,u=h[2];u?n.delegate(u,l,r):i.bind(l,r)})},_off:function(t,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(i).undelegate(i),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),o=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&e.effects&&e.effects.effect[r]?s[t](n):r!==t&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}}),e.widget;var d=!1;e(document).mouseup(function(){d=!1}),e.widget("ui.mouse",{version:"1.11.4",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(!d){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var i=this,s=1===t.which,n="string"==typeof this.options.cancel&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;return s&&!n&&this._mouseCapture(t)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(t)!==!1,!this._mouseStarted)?(t.preventDefault(),!0):(!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return i._mouseMove(e)},this._mouseUpDelegate=function(e){return i._mouseUp(e)},this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),d=!0,!0)):!0}},_mouseMove:function(t){if(this._mouseMoved){if(e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button)return this._mouseUp(t);if(!t.which)return this._mouseUp(t)}return(t.which||t.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),d=!1,!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),function(){function t(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function i(t,i){return parseInt(e.css(t,i),10)||0}function s(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,d=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(void 0!==n)return n;var t,i,s=e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),a=s.children()[0];return e("body").append(s),t=a.offsetWidth,s.css("overflow","scroll"),i=a.offsetWidth,t===i&&(i=s[0].clientWidth),s.remove(),n=t-i},getScrollInfo:function(t){var i=t.isWindow||t.isDocument?"":t.element.css("overflow-x"),s=t.isWindow||t.isDocument?"":t.element.css("overflow-y"),n="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,a="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:a?e.position.scrollbarWidth():0,height:n?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s||n?i.width():i.outerWidth(),height:s||n?i.height():i.outerHeight()}}},e.fn.position=function(n){if(!n||!n.of)return f.apply(this,arguments);n=e.extend({},n);var p,m,g,v,y,b,_=e(n.of),x=e.position.getWithinInfo(n.within),w=e.position.getScrollInfo(x),k=(n.collision||"flip").split(" "),T={};return b=s(_),_[0].preventDefault&&(n.at="left top"),m=b.width,g=b.height,v=b.offset,y=e.extend({},v),e.each(["my","at"],function(){var e,t,i=(n[this]||"").split(" ");1===i.length&&(i=l.test(i[0])?i.concat(["center"]):u.test(i[0])?["center"].concat(i):["center","center"]),i[0]=l.test(i[0])?i[0]:"center",i[1]=u.test(i[1])?i[1]:"center",e=d.exec(i[0]),t=d.exec(i[1]),T[this]=[e?e[0]:0,t?t[0]:0],n[this]=[c.exec(i[0])[0],c.exec(i[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===n.at[0]?y.left+=m:"center"===n.at[0]&&(y.left+=m/2),"bottom"===n.at[1]?y.top+=g:"center"===n.at[1]&&(y.top+=g/2),p=t(T.at,m,g),y.left+=p[0],y.top+=p[1],this.each(function(){var s,l,u=e(this),d=u.outerWidth(),c=u.outerHeight(),f=i(this,"marginLeft"),b=i(this,"marginTop"),D=d+f+i(this,"marginRight")+w.width,S=c+b+i(this,"marginBottom")+w.height,M=e.extend({},y),C=t(T.my,u.outerWidth(),u.outerHeight());"right"===n.my[0]?M.left-=d:"center"===n.my[0]&&(M.left-=d/2),"bottom"===n.my[1]?M.top-=c:"center"===n.my[1]&&(M.top-=c/2),M.left+=C[0],M.top+=C[1],a||(M.left=h(M.left),M.top=h(M.top)),s={marginLeft:f,marginTop:b},e.each(["left","top"],function(t,i){e.ui.position[k[t]]&&e.ui.position[k[t]][i](M,{targetWidth:m,targetHeight:g,elemWidth:d,elemHeight:c,collisionPosition:s,collisionWidth:D,collisionHeight:S,offset:[p[0]+C[0],p[1]+C[1]],my:n.my,at:n.at,within:x,elem:u})}),n.using&&(l=function(e){var t=v.left-M.left,i=t+m-d,s=v.top-M.top,a=s+g-c,h={target:{element:_,left:v.left,top:v.top,width:m,height:g},element:{element:u,left:M.left,top:M.top,width:d,height:c},horizontal:0>i?"left":t>0?"right":"center",vertical:0>a?"top":s>0?"bottom":"middle"};d>m&&m>r(t+i)&&(h.horizontal="center"),c>g&&g>r(s+a)&&(h.vertical="middle"),h.important=o(r(t),r(i))>o(r(s),r(a))?"horizontal":"vertical",n.using.call(this,e,h)}),u.offset(e.extend(M,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=e.left-t.collisionPosition.marginLeft,h=n-r,l=r+t.collisionWidth-a-n;t.collisionWidth>a?h>0&&0>=l?(i=e.left+h+t.collisionWidth-a-n,e.left+=h-i):e.left=l>0&&0>=h?n:h>l?n+a-t.collisionWidth:n:h>0?e.left+=h:l>0?e.left-=l:e.left=o(e.left-r,e.left)},top:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollTop:s.offset.top,a=t.within.height,r=e.top-t.collisionPosition.marginTop,h=n-r,l=r+t.collisionHeight-a-n;t.collisionHeight>a?h>0&&0>=l?(i=e.top+h+t.collisionHeight-a-n,e.top+=h-i):e.top=l>0&&0>=h?n:h>l?n+a-t.collisionHeight:n:h>0?e.top+=h:l>0?e.top-=l:e.top=o(e.top-r,e.top)}},flip:{left:function(e,t){var i,s,n=t.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,d=l+t.collisionWidth-o-h,c="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+c+p+f+t.collisionWidth-o-a,(0>i||r(u)>i)&&(e.left+=c+p+f)):d>0&&(s=e.left-t.collisionPosition.marginLeft+c+p+f-h,(s>0||d>r(s))&&(e.left+=c+p+f))},top:function(e,t){var i,s,n=t.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,d=l+t.collisionHeight-o-h,c="top"===t.my[1],p=c?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-o-a,(0>s||r(u)>s)&&(e.top+=p+f+m)):d>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,(i>0||d>r(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,n,o,r=document.getElementsByTagName("body")[0],h=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(o in s)t.style[o]=s[o];t.appendChild(h),i=r||document.documentElement,i.insertBefore(t,i.firstChild),h.style.cssText="position: absolute; left: 10.7432222px;",n=e(h).offset().left,a=n>10&&11>n,t.innerHTML="",i.removeChild(t)}()}(),e.ui.position,e.widget("ui.accordion",{version:"1.11.4",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},hideProps:{borderTopWidth:"hide",borderBottomWidth:"hide",paddingTop:"hide",paddingBottom:"hide",height:"hide"},showProps:{borderTopWidth:"show",borderBottomWidth:"show",paddingTop:"show",paddingBottom:"show",height:"show"},_create:function(){var t=this.options;this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),t.collapsible||t.active!==!1&&null!=t.active||(t.active=0),this._processPanels(),0>t.active&&(t.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():e()}},_createIcons:function(){var t=this.options.icons;t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var e;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").removeUniqueId(),this._destroyIcons(),e=this.headers.next().removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").css("display","").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeUniqueId(),"content"!==this.options.heightStyle&&e.css("height","")},_setOption:function(e,t){return"active"===e?(this._activate(t),void 0):("event"===e&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),"collapsible"!==e||t||this.options.active!==!1||this._activate(0),"icons"===e&&(this._destroyIcons(),t&&this._createIcons()),"disabled"===e&&(this.element.toggleClass("ui-state-disabled",!!t).attr("aria-disabled",t),this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t)),void 0)},_keydown:function(t){if(!t.altKey&&!t.ctrlKey){var i=e.ui.keyCode,s=this.headers.length,n=this.headers.index(t.target),a=!1;switch(t.keyCode){case i.RIGHT:case i.DOWN:a=this.headers[(n+1)%s];break;case i.LEFT:case i.UP:a=this.headers[(n-1+s)%s];break;case i.SPACE:case i.ENTER:this._eventHandler(t);break;case i.HOME:a=this.headers[0];break;case i.END:a=this.headers[s-1]}a&&(e(t.target).attr("tabIndex",-1),e(a).attr("tabIndex",0),a.focus(),t.preventDefault())}},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus()},refresh:function(){var t=this.options;this._processPanels(),t.active===!1&&t.collapsible===!0||!this.headers.length?(t.active=!1,this.active=e()):t.active===!1?this._activate(0):this.active.length&&!e.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(t.active=!1,this.active=e()):this._activate(Math.max(0,t.active-1)):t.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){var e=this.headers,t=this.panels;this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-state-default ui-corner-all"),this.panels=this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide(),t&&(this._off(e.not(this.headers)),this._off(t.not(this.panels)))},_refresh:function(){var t,i=this.options,s=i.heightStyle,n=this.element.parent();this.active=this._findActive(i.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(){var t=e(this),i=t.uniqueId().attr("id"),s=t.next(),n=s.uniqueId().attr("id");t.attr("aria-controls",n),s.attr("aria-labelledby",i)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}).next().attr({"aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}).next().attr({"aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(i.event),"fill"===s?(t=n.height(),this.element.siblings(":visible").each(function(){var i=e(this),s=i.css("position");"absolute"!==s&&"fixed"!==s&&(t-=i.outerHeight(!0))}),this.headers.each(function(){t-=e(this).outerHeight(!0)}),this.headers.next().each(function(){e(this).height(Math.max(0,t-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===s&&(t=0,this.headers.next().each(function(){t=Math.max(t,e(this).css("height","").height())}).height(t))},_activate:function(t){var i=this._findActive(t)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return"number"==typeof t?this.headers.eq(t):e()},_setupEvents:function(t){var i={keydown:"_keydown"};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(t){var i=this.options,s=this.active,n=e(t.currentTarget),a=n[0]===s[0],o=a&&i.collapsible,r=o?e():n.next(),h=s.next(),l={oldHeader:s,oldPanel:h,newHeader:o?e():n,newPanel:r};t.preventDefault(),a&&!i.collapsible||this._trigger("beforeActivate",t,l)===!1||(i.active=o?!1:this.headers.index(n),this.active=a?e():n,this._toggle(l),s.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),a||(n.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&n.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),n.next().addClass("ui-accordion-content-active")))},_toggle:function(t){var i=t.newPanel,s=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=s,this.options.animate?this._animate(i,s,t):(s.hide(),i.show(),this._toggleComplete(t)),s.attr({"aria-hidden":"true"}),s.prev().attr({"aria-selected":"false","aria-expanded":"false"}),i.length&&s.length?s.prev().attr({tabIndex:-1,"aria-expanded":"false"}):i.length&&this.headers.filter(function(){return 0===parseInt(e(this).attr("tabIndex"),10)}).attr("tabIndex",-1),i.attr("aria-hidden","false").prev().attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_animate:function(e,t,i){var s,n,a,o=this,r=0,h=e.css("box-sizing"),l=e.length&&(!t.length||e.index()<t.index()),u=this.options.animate||{},d=l&&u.down||u,c=function(){o._toggleComplete(i)};return"number"==typeof d&&(a=d),"string"==typeof d&&(n=d),n=n||d.easing||u.easing,a=a||d.duration||u.duration,t.length?e.length?(s=e.show().outerHeight(),t.animate(this.hideProps,{duration:a,easing:n,step:function(e,t){t.now=Math.round(e)}}),e.hide().animate(this.showProps,{duration:a,easing:n,complete:c,step:function(e,i){i.now=Math.round(e),"height"!==i.prop?"content-box"===h&&(r+=i.now):"content"!==o.options.heightStyle&&(i.now=Math.round(s-t.outerHeight()-r),r=0)}}),void 0):t.animate(this.hideProps,a,n,c):e.animate(this.showProps,a,n,c)},_toggleComplete:function(e){var t=e.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e)}}),e.widget("ui.menu",{version:"1.11.4",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},items:"> *",menus:"ul",position:{my:"left-1 top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item":function(e){e.preventDefault()},"click .ui-menu-item":function(t){var i=e(t.target);!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.select(t),t.isPropagationStopped()||(this.mouseHandled=!0),i.has(".ui-menu").length?this.expand(t):!this.element.is(":focus")&&e(this.document[0].activeElement).closest(".ui-menu").length&&(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){if(!this.previousFilter){var i=e(t.currentTarget);
i.siblings(".ui-state-active").removeClass("ui-state-active"),this.focus(t,i)}},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(e,t){var i=this.active||this.element.find(this.options.items).eq(0);t||this.focus(e,i)},blur:function(t){this._delay(function(){e.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){this._closeOnDocumentClick(e)&&this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-menu-icons ui-front").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").removeUniqueId().removeClass("ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);t.data("ui-menu-submenu-carat")&&t.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(t){var i,s,n,a,o=!0;switch(t.keyCode){case e.ui.keyCode.PAGE_UP:this.previousPage(t);break;case e.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case e.ui.keyCode.HOME:this._move("first","first",t);break;case e.ui.keyCode.END:this._move("last","last",t);break;case e.ui.keyCode.UP:this.previous(t);break;case e.ui.keyCode.DOWN:this.next(t);break;case e.ui.keyCode.LEFT:this.collapse(t);break;case e.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._activate(t);break;case e.ui.keyCode.ESCAPE:this.collapse(t);break;default:o=!1,s=this.previousFilter||"",n=String.fromCharCode(t.keyCode),a=!1,clearTimeout(this.filterTimer),n===s?a=!0:n=s+n,i=this._filterMenuItems(n),i=a&&-1!==i.index(this.active.next())?this.active.nextAll(".ui-menu-item"):i,i.length||(n=String.fromCharCode(t.keyCode),i=this._filterMenuItems(n)),i.length?(this.focus(t,i),this.previousFilter=n,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter}o&&t.preventDefault()},_activate:function(e){this.active.is(".ui-state-disabled")||(this.active.is("[aria-haspopup='true']")?this.expand(e):this.select(e))},refresh:function(){var t,i,s=this,n=this.options.icons.submenu,a=this.element.find(this.options.menus);this.element.toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length),a.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-front").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var t=e(this),i=t.parent(),s=e("<span>").addClass("ui-menu-icon ui-icon "+n).data("ui-menu-submenu-carat",!0);i.attr("aria-haspopup","true").prepend(s),t.attr("aria-labelledby",i.attr("id"))}),t=a.add(this.element),i=t.find(this.options.items),i.not(".ui-menu-item").each(function(){var t=e(this);s._isDivider(t)&&t.addClass("ui-widget-content ui-menu-divider")}),i.not(".ui-menu-item, .ui-menu-divider").addClass("ui-menu-item").uniqueId().attr({tabIndex:-1,role:this._itemRole()}),i.filter(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!e.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(e,t){"icons"===e&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu),"disabled"===e&&this.element.toggleClass("ui-state-disabled",!!t).attr("aria-disabled",t),this._super(e,t)},focus:function(e,t){var i,s;this.blur(e,e&&"focus"===e.type),this._scrollIntoView(t),this.active=t.first(),s=this.active.addClass("ui-state-focus").removeClass("ui-state-active"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").addClass("ui-state-active"),e&&"keydown"===e.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=t.children(".ui-menu"),i.length&&e&&/^mouse/.test(e.type)&&this._startOpening(i),this.activeMenu=t.parent(),this._trigger("focus",e,{item:t})},_scrollIntoView:function(t){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(e.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(e.css(this.activeMenu[0],"paddingTop"))||0,n=t.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=t.outerHeight(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(e,t){t||clearTimeout(this.timer),this.active&&(this.active.removeClass("ui-state-focus"),this.active=null,this._trigger("blur",e,{item:this.active}))},_startOpening:function(e){clearTimeout(this.timer),"true"===e.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(e)},this.delay))},_open:function(t){var i=e.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(t,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:e(t&&t.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(t),this.activeMenu=s},this.delay)},_close:function(e){e||(e=this.active?this.active.parent():this.element),e.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find(".ui-state-active").not(".ui-state-focus").removeClass("ui-state-active")},_closeOnDocumentClick:function(t){return!e(t.target).closest(".ui-menu").length},_isDivider:function(e){return!/[^\-\u2014\u2013\s]/.test(e.text())},collapse:function(e){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);t&&t.length&&(this._close(),this.focus(e,t))},expand:function(e){var t=this.active&&this.active.children(".ui-menu ").find(this.options.items).first();t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(e,t)}))},next:function(e){this._move("next","first",e)},previous:function(e){this._move("prev","last",e)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(e,t,i){var s;this.active&&(s="first"===e||"last"===e?this.active["first"===e?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[e+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.find(this.options.items)[t]()),this.focus(i,s)},nextPage:function(t){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=e(this),0>i.offset().top-s-n}),this.focus(t,i)):this.focus(t,this.activeMenu.find(this.options.items)[this.active?"last":"first"]())),void 0):(this.next(t),void 0)},previousPage:function(t){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=e(this),i.offset().top-s+n>0}),this.focus(t,i)):this.focus(t,this.activeMenu.find(this.options.items).first())),void 0):(this.next(t),void 0)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||e(t.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,i)},_filterMenuItems:function(t){var i=t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&"),s=RegExp("^"+i,"i");return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function(){return s.test(e.trim(e(this).text()))})}}),e.widget("ui.autocomplete",{version:"1.11.4",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},requestIndex:0,pending:0,_create:function(){var t,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return t=!0,s=!0,i=!0,void 0;t=!1,s=!1,i=!1;var a=e.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:t=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:t=!0,this._move("nextPage",n);break;case a.UP:t=!0,this._keyEvent("previous",n);break;case a.DOWN:t=!0,this._keyEvent("next",n);break;case a.ENTER:this.menu.active&&(t=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this.isMultiLine||this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(t)return t=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),void 0;if(!i){var n=e.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(e){return s?(s=!1,e.preventDefault(),void 0):(this._searchTimeout(e),void 0)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,void 0):(clearTimeout(this.searching),this.close(e),this._change(e),void 0)}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().menu("instance"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(s){s.target===t.element[0]||s.target===i||e.contains(i,s.target)||t.close()})})},menufocus:function(t,i){var s,n;return this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type))?(this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent)}),void 0):(n=i.item.data("ui-autocomplete-item"),!1!==this._trigger("focus",t,{item:n})&&t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(n.value),s=i.item.attr("aria-label")||n.value,s&&e.trim(s).length&&(this.liveRegion.children().hide(),e("<div>").text(s).appendTo(this.liveRegion)),void 0)},menuselect:function(e,t){var i=t.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",e,{item:i})&&this._value(i.value),this.term=this._value(),this.close(e),this.selectedItem=i}}),this.liveRegion=e("<span>",{role:"status","aria-live":"assertive","aria-relevant":"additions"}).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(e,t){this._super(e,t),"source"===e&&this._initSource(),"appendTo"===e&&this.menu.element.appendTo(this._appendTo()),"disabled"===e&&t&&this.xhr&&this.xhr.abort()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?e(t):this.document.find(t).eq(0)),t&&t[0]||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_initSource:function(){var t,i,s=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(i,s){s(e.ui.autocomplete.filter(t,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(t,n){s.xhr&&s.xhr.abort(),s.xhr=e.ajax({url:i,data:t,dataType:"json",success:function(e){n(e)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){var t=this.term===this._value(),i=this.menu.element.is(":visible"),s=e.altKey||e.ctrlKey||e.metaKey||e.shiftKey;(!t||t&&!i&&!s)&&(this.selectedItem=null,this.search(null,e))},this.options.delay)},search:function(e,t){return e=null!=e?e:this._value(),this.term=this._value(),e.length<this.options.minLength?this.close(t):this._trigger("search",t)!==!1?this._search(e):void 0},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response())},_response:function(){var t=++this.requestIndex;return e.proxy(function(e){t===this.requestIndex&&this.__response(e),this.pending--,this.pending||this.element.removeClass("ui-autocomplete-loading")},this)},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close()},close:function(e){this.cancelSearch=!0,this._close(e)},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e))},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return"string"==typeof t?{label:t,value:t}:e.extend({},t,{label:t.label||t.value,value:t.value||t.label})})},_suggest:function(t){var i=this.menu.element.empty();this._renderMenu(i,t),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var s=this;e.each(i,function(e,i){s._renderItemData(t,i)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t)},_renderItem:function(t,i){return e("<li>").text(i.label).appendTo(t)},_move:function(e,t){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)?(this.isMultiLine||this._value(this.term),this.menu.blur(),void 0):(this.menu[e](t),void 0):(this.search(null,t),void 0)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(e,t){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(e,t),t.preventDefault())}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,i){var s=RegExp(e.ui.autocomplete.escapeRegex(i),"i");return e.grep(t,function(e){return s.test(e.label||e.value||e)})}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var i;this._superApply(arguments),this.options.disabled||this.cancelSearch||(i=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.children().hide(),e("<div>").text(i).appendTo(this.liveRegion))}}),e.ui.autocomplete;var c,p="ui-button ui-widget ui-state-default ui-corner-all",f="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",m=function(){var t=e(this);setTimeout(function(){t.find(":ui-button").button("refresh")},1)},g=function(t){var i=t.name,s=t.form,n=e([]);return i&&(i=i.replace(/'/g,"\\'"),n=s?e(s).find("[name='"+i+"'][type=radio]"):e("[name='"+i+"'][type=radio]",t.ownerDocument).filter(function(){return!this.form})),n};e.widget("ui.button",{version:"1.11.4",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,m),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var t=this,i=this.options,s="checkbox"===this.type||"radio"===this.type,n=s?"":"ui-state-active";null===i.label&&(i.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(p).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){i.disabled||this===c&&e(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){i.disabled||e(this).removeClass(n)}).bind("click"+this.eventNamespace,function(e){i.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}),this._on({focus:function(){this.buttonElement.addClass("ui-state-focus")},blur:function(){this.buttonElement.removeClass("ui-state-focus")}}),s&&this.element.bind("change"+this.eventNamespace,function(){t.refresh()}),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return i.disabled?!1:void 0}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(i.disabled)return!1;e(this).addClass("ui-state-active"),t.buttonElement.attr("aria-pressed","true");var s=t.element[0];g(s).not(s).map(function(){return e(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return i.disabled?!1:(e(this).addClass("ui-state-active"),c=this,t.document.one("mouseup",function(){c=null}),void 0)}).bind("mouseup"+this.eventNamespace,function(){return i.disabled?!1:(e(this).removeClass("ui-state-active"),void 0)}).bind("keydown"+this.eventNamespace,function(t){return i.disabled?!1:((t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active"),void 0)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){e(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click()})),this._setOption("disabled",i.disabled),this._resetButton()},_determineButtonType:function(){var e,t,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(p+" ui-state-active "+f).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(e,t){return this._super(e,t),"disabled"===e?(this.widget().toggleClass("ui-state-disabled",!!t),this.element.prop("disabled",!!t),t&&("checkbox"===this.type||"radio"===this.type?this.buttonElement.removeClass("ui-state-focus"):this.buttonElement.removeClass("ui-state-focus ui-state-active")),void 0):(this._resetButton(),void 0)},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t),"radio"===this.type?g(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),void 0;var t=this.buttonElement.removeClass(f),i=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),s=this.options.icons,n=s.primary&&s.secondary,a=[];s.primary||s.secondary?(this.options.text&&a.push("ui-button-text-icon"+(n?"s":s.primary?"-primary":"-secondary")),s.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+s.primary+"'></span>"),s.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+s.secondary+"'></span>"),this.options.text||(a.push(n?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(i)))):a.push("ui-button-text-only"),t.addClass(a.join(" "))}}),e.widget("ui.buttonset",{version:"1.11.4",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(e,t){"disabled"===e&&this.buttons.button("option",e,t),this._super(e,t)},refresh:function(){var t="rtl"===this.element.css("direction"),i=this.element.find(this.options.items),s=i.filter(":ui-button");i.not(":ui-button").button(),s.button("refresh"),this.buttons=i.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}}),e.ui.button,e.extend(e.ui,{datepicker:{version:"1.11.4"}});var v;e.extend(n.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return r(this._defaults,e||{}),this},_attachDatepicker:function(t,i){var s,n,a;s=t.nodeName.toLowerCase(),n="div"===s||"span"===s,t.id||(this.uuid+=1,t.id="dp"+this.uuid),a=this._newInst(e(t),n),a.settings=e.extend({},i||{}),"input"===s?this._connectDatepicker(t,a):n&&this._inlineDatepicker(t,a)},_newInst:function(t,i){var s=t[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:t,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?a(e("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(t,i){var s=e(t);i.append=e([]),i.trigger=e([]),s.hasClass(this.markerClassName)||(this._attachments(s,i),s.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),e.data(t,"datepicker",i),i.settings.disabled&&this._disableDatepicker(t))},_attachments:function(t,i){var s,n,a,o=this._get(i,"appendText"),r=this._get(i,"isRTL");i.append&&i.append.remove(),o&&(i.append=e("<span class='"+this._appendClass+"'>"+o+"</span>"),t[r?"before":"after"](i.append)),t.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),s=this._get(i,"showOn"),("focus"===s||"both"===s)&&t.focus(this._showDatepicker),("button"===s||"both"===s)&&(n=this._get(i,"buttonText"),a=this._get(i,"buttonImage"),i.trigger=e(this._get(i,"buttonImageOnly")?e("<img/>").addClass(this._triggerClass).attr({src:a,alt:n,title:n}):e("<button type='button'></button>").addClass(this._triggerClass).html(a?e("<img/>").attr({src:a,alt:n,title:n}):n)),t[r?"before":"after"](i.trigger),i.trigger.click(function(){return e.datepicker._datepickerShowing&&e.datepicker._lastInput===t[0]?e.datepicker._hideDatepicker():e.datepicker._datepickerShowing&&e.datepicker._lastInput!==t[0]?(e.datepicker._hideDatepicker(),e.datepicker._showDatepicker(t[0])):e.datepicker._showDatepicker(t[0]),!1}))},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t,i,s,n,a=new Date(2009,11,20),o=this._get(e,"dateFormat");o.match(/[DM]/)&&(t=function(e){for(i=0,s=0,n=0;e.length>n;n++)e[n].length>i&&(i=e[n].length,s=n);return s},a.setMonth(t(this._get(e,o.match(/MM/)?"monthNames":"monthNamesShort"))),a.setDate(t(this._get(e,o.match(/DD/)?"dayNames":"dayNamesShort"))+20-a.getDay())),e.input.attr("size",this._formatDate(e,a).length)}},_inlineDatepicker:function(t,i){var s=e(t);s.hasClass(this.markerClassName)||(s.addClass(this.markerClassName).append(i.dpDiv),e.data(t,"datepicker",i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(t),i.dpDiv.css("display","block"))},_dialogDatepicker:function(t,i,s,n,a){var o,h,l,u,d,c=this._dialogInst;return c||(this.uuid+=1,o="dp"+this.uuid,this._dialogInput=e("<input type='text' id='"+o+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),e("body").append(this._dialogInput),c=this._dialogInst=this._newInst(this._dialogInput,!1),c.settings={},e.data(this._dialogInput[0],"datepicker",c)),r(c.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(c,i):i,this._dialogInput.val(i),this._pos=a?a.length?a:[a.pageX,a.pageY]:null,this._pos||(h=document.documentElement.clientWidth,l=document.documentElement.clientHeight,u=document.documentElement.scrollLeft||document.body.scrollLeft,d=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[h/2-100+u,l/2-150+d]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),c.settings.onSelect=s,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),e.blockUI&&e.blockUI(this.dpDiv),e.data(this._dialogInput[0],"datepicker",c),this},_destroyDatepicker:function(t){var i,s=e(t),n=e.data(t,"datepicker");s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),e.removeData(t,"datepicker"),"input"===i?(n.append.remove(),n.trigger.remove(),s.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&s.removeClass(this.markerClassName).empty(),v===n&&(v=null))},_enableDatepicker:function(t){var i,s,n=e(t),a=e.data(t,"datepicker");n.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!1,a.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().removeClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}))},_disableDatepicker:function(t){var i,s,n=e(t),a=e.data(t,"datepicker");n.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!0,a.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(s=n.children("."+this._inlineClass),s.children().addClass("ui-state-disabled"),s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;this._disabledInputs.length>t;t++)if(this._disabledInputs[t]===e)return!0;return!1},_getInst:function(t){try{return e.data(t,"datepicker")}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(t,i,s){var n,a,o,h,l=this._getInst(t);return 2===arguments.length&&"string"==typeof i?"defaults"===i?e.extend({},e.datepicker._defaults):l?"all"===i?e.extend({},l.settings):this._get(l,i):null:(n=i||{},"string"==typeof i&&(n={},n[i]=s),l&&(this._curInst===l&&this._hideDatepicker(),a=this._getDateDatepicker(t,!0),o=this._getMinMaxDate(l,"min"),h=this._getMinMaxDate(l,"max"),r(l.settings,n),null!==o&&void 0!==n.dateFormat&&void 0===n.minDate&&(l.settings.minDate=this._formatDate(l,o)),null!==h&&void 0!==n.dateFormat&&void 0===n.maxDate&&(l.settings.maxDate=this._formatDate(l,h)),"disabled"in n&&(n.disabled?this._disableDatepicker(t):this._enableDatepicker(t)),this._attachments(e(t),l),this._autoSize(l),this._setDate(l,a),this._updateAlternate(l),this._updateDatepicker(l)),void 0)},_changeDatepicker:function(e,t,i){this._optionDatepicker(e,t,i)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var i=this._getInst(e);i&&(this._setDate(i,t),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(e,t){var i=this._getInst(e);return i&&!i.inline&&this._setDateFromField(i,t),i?this._getDate(i):null},_doKeyDown:function(t){var i,s,n,a=e.datepicker._getInst(t.target),o=!0,r=a.dpDiv.is(".ui-datepicker-rtl");if(a._keyEvent=!0,e.datepicker._datepickerShowing)switch(t.keyCode){case 9:e.datepicker._hideDatepicker(),o=!1;break;case 13:return n=e("td."+e.datepicker._dayOverClass+":not(."+e.datepicker._currentClass+")",a.dpDiv),n[0]&&e.datepicker._selectDay(t.target,a.selectedMonth,a.selectedYear,n[0]),i=e.datepicker._get(a,"onSelect"),i?(s=e.datepicker._formatDate(a),i.apply(a.input?a.input[0]:null,[s,a])):e.datepicker._hideDatepicker(),!1;case 27:e.datepicker._hideDatepicker();break;case 33:e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(a,"stepBigMonths"):-e.datepicker._get(a,"stepMonths"),"M");break;case 34:e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(a,"stepBigMonths"):+e.datepicker._get(a,"stepMonths"),"M");break;case 35:(t.ctrlKey||t.metaKey)&&e.datepicker._clearDate(t.target),o=t.ctrlKey||t.metaKey;break;case 36:(t.ctrlKey||t.metaKey)&&e.datepicker._gotoToday(t.target),o=t.ctrlKey||t.metaKey;break;case 37:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,r?1:-1,"D"),o=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(a,"stepBigMonths"):-e.datepicker._get(a,"stepMonths"),"M");break;case 38:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,-7,"D"),o=t.ctrlKey||t.metaKey;break;case 39:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,r?-1:1,"D"),o=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(a,"stepBigMonths"):+e.datepicker._get(a,"stepMonths"),"M");break;case 40:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,7,"D"),o=t.ctrlKey||t.metaKey;break;default:o=!1}else 36===t.keyCode&&t.ctrlKey?e.datepicker._showDatepicker(this):o=!1;o&&(t.preventDefault(),t.stopPropagation())},_doKeyPress:function(t){var i,s,n=e.datepicker._getInst(t.target);
return e.datepicker._get(n,"constrainInput")?(i=e.datepicker._possibleChars(e.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==t.charCode?t.keyCode:t.charCode),t.ctrlKey||t.metaKey||" ">s||!i||i.indexOf(s)>-1):void 0},_doKeyUp:function(t){var i,s=e.datepicker._getInst(t.target);if(s.input.val()!==s.lastVal)try{i=e.datepicker.parseDate(e.datepicker._get(s,"dateFormat"),s.input?s.input.val():null,e.datepicker._getFormatConfig(s)),i&&(e.datepicker._setDateFromField(s),e.datepicker._updateAlternate(s),e.datepicker._updateDatepicker(s))}catch(n){}return!0},_showDatepicker:function(t){if(t=t.target||t,"input"!==t.nodeName.toLowerCase()&&(t=e("input",t.parentNode)[0]),!e.datepicker._isDisabledDatepicker(t)&&e.datepicker._lastInput!==t){var i,n,a,o,h,l,u;i=e.datepicker._getInst(t),e.datepicker._curInst&&e.datepicker._curInst!==i&&(e.datepicker._curInst.dpDiv.stop(!0,!0),i&&e.datepicker._datepickerShowing&&e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),n=e.datepicker._get(i,"beforeShow"),a=n?n.apply(t,[t,i]):{},a!==!1&&(r(i.settings,a),i.lastVal=null,e.datepicker._lastInput=t,e.datepicker._setDateFromField(i),e.datepicker._inDialog&&(t.value=""),e.datepicker._pos||(e.datepicker._pos=e.datepicker._findPos(t),e.datepicker._pos[1]+=t.offsetHeight),o=!1,e(t).parents().each(function(){return o|="fixed"===e(this).css("position"),!o}),h={left:e.datepicker._pos[0],top:e.datepicker._pos[1]},e.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),e.datepicker._updateDatepicker(i),h=e.datepicker._checkOffset(i,h,o),i.dpDiv.css({position:e.datepicker._inDialog&&e.blockUI?"static":o?"fixed":"absolute",display:"none",left:h.left+"px",top:h.top+"px"}),i.inline||(l=e.datepicker._get(i,"showAnim"),u=e.datepicker._get(i,"duration"),i.dpDiv.css("z-index",s(e(t))+1),e.datepicker._datepickerShowing=!0,e.effects&&e.effects.effect[l]?i.dpDiv.show(l,e.datepicker._get(i,"showOptions"),u):i.dpDiv[l||"show"](l?u:null),e.datepicker._shouldFocusInput(i)&&i.input.focus(),e.datepicker._curInst=i))}},_updateDatepicker:function(t){this.maxRows=4,v=t,t.dpDiv.empty().append(this._generateHTML(t)),this._attachHandlers(t);var i,s=this._getNumberOfMonths(t),n=s[1],a=17,r=t.dpDiv.find("."+this._dayOverClass+" a");r.length>0&&o.apply(r.get(0)),t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),n>1&&t.dpDiv.addClass("ui-datepicker-multi-"+n).css("width",a*n+"em"),t.dpDiv[(1!==s[0]||1!==s[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),t.dpDiv[(this._get(t,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),t===e.datepicker._curInst&&e.datepicker._datepickerShowing&&e.datepicker._shouldFocusInput(t)&&t.input.focus(),t.yearshtml&&(i=t.yearshtml,setTimeout(function(){i===t.yearshtml&&t.yearshtml&&t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml),i=t.yearshtml=null},0))},_shouldFocusInput:function(e){return e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&!e.input.is(":focus")},_checkOffset:function(t,i,s){var n=t.dpDiv.outerWidth(),a=t.dpDiv.outerHeight(),o=t.input?t.input.outerWidth():0,r=t.input?t.input.outerHeight():0,h=document.documentElement.clientWidth+(s?0:e(document).scrollLeft()),l=document.documentElement.clientHeight+(s?0:e(document).scrollTop());return i.left-=this._get(t,"isRTL")?n-o:0,i.left-=s&&i.left===t.input.offset().left?e(document).scrollLeft():0,i.top-=s&&i.top===t.input.offset().top+r?e(document).scrollTop():0,i.left-=Math.min(i.left,i.left+n>h&&h>n?Math.abs(i.left+n-h):0),i.top-=Math.min(i.top,i.top+a>l&&l>a?Math.abs(a+r):0),i},_findPos:function(t){for(var i,s=this._getInst(t),n=this._get(s,"isRTL");t&&("hidden"===t.type||1!==t.nodeType||e.expr.filters.hidden(t));)t=t[n?"previousSibling":"nextSibling"];return i=e(t).offset(),[i.left,i.top]},_hideDatepicker:function(t){var i,s,n,a,o=this._curInst;!o||t&&o!==e.data(t,"datepicker")||this._datepickerShowing&&(i=this._get(o,"showAnim"),s=this._get(o,"duration"),n=function(){e.datepicker._tidyDialog(o)},e.effects&&(e.effects.effect[i]||e.effects[i])?o.dpDiv.hide(i,e.datepicker._get(o,"showOptions"),s,n):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?s:null,n),i||n(),this._datepickerShowing=!1,a=this._get(o,"onClose"),a&&a.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),e.blockUI&&(e.unblockUI(),e("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(t){if(e.datepicker._curInst){var i=e(t.target),s=e.datepicker._getInst(i[0]);(i[0].id!==e.datepicker._mainDivId&&0===i.parents("#"+e.datepicker._mainDivId).length&&!i.hasClass(e.datepicker.markerClassName)&&!i.closest("."+e.datepicker._triggerClass).length&&e.datepicker._datepickerShowing&&(!e.datepicker._inDialog||!e.blockUI)||i.hasClass(e.datepicker.markerClassName)&&e.datepicker._curInst!==s)&&e.datepicker._hideDatepicker()}},_adjustDate:function(t,i,s){var n=e(t),a=this._getInst(n[0]);this._isDisabledDatepicker(n[0])||(this._adjustInstDate(a,i+("M"===s?this._get(a,"showCurrentAtPos"):0),s),this._updateDatepicker(a))},_gotoToday:function(t){var i,s=e(t),n=this._getInst(s[0]);this._get(n,"gotoCurrent")&&n.currentDay?(n.selectedDay=n.currentDay,n.drawMonth=n.selectedMonth=n.currentMonth,n.drawYear=n.selectedYear=n.currentYear):(i=new Date,n.selectedDay=i.getDate(),n.drawMonth=n.selectedMonth=i.getMonth(),n.drawYear=n.selectedYear=i.getFullYear()),this._notifyChange(n),this._adjustDate(s)},_selectMonthYear:function(t,i,s){var n=e(t),a=this._getInst(n[0]);a["selected"+("M"===s?"Month":"Year")]=a["draw"+("M"===s?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(a),this._adjustDate(n)},_selectDay:function(t,i,s,n){var a,o=e(t);e(n).hasClass(this._unselectableClass)||this._isDisabledDatepicker(o[0])||(a=this._getInst(o[0]),a.selectedDay=a.currentDay=e("a",n).html(),a.selectedMonth=a.currentMonth=i,a.selectedYear=a.currentYear=s,this._selectDate(t,this._formatDate(a,a.currentDay,a.currentMonth,a.currentYear)))},_clearDate:function(t){var i=e(t);this._selectDate(i,"")},_selectDate:function(t,i){var s,n=e(t),a=this._getInst(n[0]);i=null!=i?i:this._formatDate(a),a.input&&a.input.val(i),this._updateAlternate(a),s=this._get(a,"onSelect"),s?s.apply(a.input?a.input[0]:null,[i,a]):a.input&&a.input.trigger("change"),a.inline?this._updateDatepicker(a):(this._hideDatepicker(),this._lastInput=a.input[0],"object"!=typeof a.input[0]&&a.input.focus(),this._lastInput=null)},_updateAlternate:function(t){var i,s,n,a=this._get(t,"altField");a&&(i=this._get(t,"altFormat")||this._get(t,"dateFormat"),s=this._getDate(t),n=this.formatDate(i,s,this._getFormatConfig(t)),e(a).each(function(){e(this).val(n)}))},noWeekends:function(e){var t=e.getDay();return[t>0&&6>t,""]},iso8601Week:function(e){var t,i=new Date(e.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),t=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((t-i)/864e5)/7)+1},parseDate:function(t,i,s){if(null==t||null==i)throw"Invalid arguments";if(i="object"==typeof i?""+i:i+"",""===i)return null;var n,a,o,r,h=0,l=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,u="string"!=typeof l?l:(new Date).getFullYear()%100+parseInt(l,10),d=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,c=(s?s.dayNames:null)||this._defaults.dayNames,p=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,f=(s?s.monthNames:null)||this._defaults.monthNames,m=-1,g=-1,v=-1,y=-1,b=!1,_=function(e){var i=t.length>n+1&&t.charAt(n+1)===e;return i&&n++,i},x=function(e){var t=_(e),s="@"===e?14:"!"===e?20:"y"===e&&t?4:"o"===e?3:2,n="y"===e?s:1,a=RegExp("^\\d{"+n+","+s+"}"),o=i.substring(h).match(a);if(!o)throw"Missing number at position "+h;return h+=o[0].length,parseInt(o[0],10)},w=function(t,s,n){var a=-1,o=e.map(_(t)?n:s,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)});if(e.each(o,function(e,t){var s=t[1];return i.substr(h,s.length).toLowerCase()===s.toLowerCase()?(a=t[0],h+=s.length,!1):void 0}),-1!==a)return a+1;throw"Unknown name at position "+h},k=function(){if(i.charAt(h)!==t.charAt(n))throw"Unexpected literal at position "+h;h++};for(n=0;t.length>n;n++)if(b)"'"!==t.charAt(n)||_("'")?k():b=!1;else switch(t.charAt(n)){case"d":v=x("d");break;case"D":w("D",d,c);break;case"o":y=x("o");break;case"m":g=x("m");break;case"M":g=w("M",p,f);break;case"y":m=x("y");break;case"@":r=new Date(x("@")),m=r.getFullYear(),g=r.getMonth()+1,v=r.getDate();break;case"!":r=new Date((x("!")-this._ticksTo1970)/1e4),m=r.getFullYear(),g=r.getMonth()+1,v=r.getDate();break;case"'":_("'")?k():b=!0;break;default:k()}if(i.length>h&&(o=i.substr(h),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===m?m=(new Date).getFullYear():100>m&&(m+=(new Date).getFullYear()-(new Date).getFullYear()%100+(u>=m?0:-100)),y>-1)for(g=1,v=y;;){if(a=this._getDaysInMonth(m,g-1),a>=v)break;g++,v-=a}if(r=this._daylightSavingAdjust(new Date(m,g-1,v)),r.getFullYear()!==m||r.getMonth()+1!==g||r.getDate()!==v)throw"Invalid date";return r},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(e,t,i){if(!t)return"";var s,n=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,a=(i?i.dayNames:null)||this._defaults.dayNames,o=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,r=(i?i.monthNames:null)||this._defaults.monthNames,h=function(t){var i=e.length>s+1&&e.charAt(s+1)===t;return i&&s++,i},l=function(e,t,i){var s=""+t;if(h(e))for(;i>s.length;)s="0"+s;return s},u=function(e,t,i,s){return h(e)?s[t]:i[t]},d="",c=!1;if(t)for(s=0;e.length>s;s++)if(c)"'"!==e.charAt(s)||h("'")?d+=e.charAt(s):c=!1;else switch(e.charAt(s)){case"d":d+=l("d",t.getDate(),2);break;case"D":d+=u("D",t.getDay(),n,a);break;case"o":d+=l("o",Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5),3);break;case"m":d+=l("m",t.getMonth()+1,2);break;case"M":d+=u("M",t.getMonth(),o,r);break;case"y":d+=h("y")?t.getFullYear():(10>t.getYear()%100?"0":"")+t.getYear()%100;break;case"@":d+=t.getTime();break;case"!":d+=1e4*t.getTime()+this._ticksTo1970;break;case"'":h("'")?d+="'":c=!0;break;default:d+=e.charAt(s)}return d},_possibleChars:function(e){var t,i="",s=!1,n=function(i){var s=e.length>t+1&&e.charAt(t+1)===i;return s&&t++,s};for(t=0;e.length>t;t++)if(s)"'"!==e.charAt(t)||n("'")?i+=e.charAt(t):s=!1;else switch(e.charAt(t)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":n("'")?i+="'":s=!0;break;default:i+=e.charAt(t)}return i},_get:function(e,t){return void 0!==e.settings[t]?e.settings[t]:this._defaults[t]},_setDateFromField:function(e,t){if(e.input.val()!==e.lastVal){var i=this._get(e,"dateFormat"),s=e.lastVal=e.input?e.input.val():null,n=this._getDefaultDate(e),a=n,o=this._getFormatConfig(e);try{a=this.parseDate(i,s,o)||n}catch(r){s=t?"":s}e.selectedDay=a.getDate(),e.drawMonth=e.selectedMonth=a.getMonth(),e.drawYear=e.selectedYear=a.getFullYear(),e.currentDay=s?a.getDate():0,e.currentMonth=s?a.getMonth():0,e.currentYear=s?a.getFullYear():0,this._adjustInstDate(e)}},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(t,i,s){var n=function(e){var t=new Date;return t.setDate(t.getDate()+e),t},a=function(i){try{return e.datepicker.parseDate(e.datepicker._get(t,"dateFormat"),i,e.datepicker._getFormatConfig(t))}catch(s){}for(var n=(i.toLowerCase().match(/^c/)?e.datepicker._getDate(t):null)||new Date,a=n.getFullYear(),o=n.getMonth(),r=n.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":r+=parseInt(l[1],10);break;case"w":case"W":r+=7*parseInt(l[1],10);break;case"m":case"M":o+=parseInt(l[1],10),r=Math.min(r,e.datepicker._getDaysInMonth(a,o));break;case"y":case"Y":a+=parseInt(l[1],10),r=Math.min(r,e.datepicker._getDaysInMonth(a,o))}l=h.exec(i)}return new Date(a,o,r)},o=null==i||""===i?s:"string"==typeof i?a(i):"number"==typeof i?isNaN(i)?s:n(i):new Date(i.getTime());return o=o&&"Invalid Date"==""+o?s:o,o&&(o.setHours(0),o.setMinutes(0),o.setSeconds(0),o.setMilliseconds(0)),this._daylightSavingAdjust(o)},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},_setDate:function(e,t,i){var s=!t,n=e.selectedMonth,a=e.selectedYear,o=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=o.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=o.getMonth(),e.drawYear=e.selectedYear=e.currentYear=o.getFullYear(),n===e.selectedMonth&&a===e.selectedYear||i||this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(s?"":this._formatDate(e))},_getDate:function(e){var t=!e.currentYear||e.input&&""===e.input.val()?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return t},_attachHandlers:function(t){var i=this._get(t,"stepMonths"),s="#"+t.id.replace(/\\\\/g,"\\");t.dpDiv.find("[data-handler]").map(function(){var t={prev:function(){e.datepicker._adjustDate(s,-i,"M")},next:function(){e.datepicker._adjustDate(s,+i,"M")},hide:function(){e.datepicker._hideDatepicker()},today:function(){e.datepicker._gotoToday(s)},selectDay:function(){return e.datepicker._selectDay(s,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return e.datepicker._selectMonthYear(s,this,"M"),!1},selectYear:function(){return e.datepicker._selectMonthYear(s,this,"Y"),!1}};e(this).bind(this.getAttribute("data-event"),t[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t,i,s,n,a,o,r,h,l,u,d,c,p,f,m,g,v,y,b,_,x,w,k,T,D,S,M,C,N,A,P,I,H,z,F,E,O,j,W,L=new Date,R=this._daylightSavingAdjust(new Date(L.getFullYear(),L.getMonth(),L.getDate())),Y=this._get(e,"isRTL"),B=this._get(e,"showButtonPanel"),J=this._get(e,"hideIfNoPrevNext"),q=this._get(e,"navigationAsDateFormat"),K=this._getNumberOfMonths(e),V=this._get(e,"showCurrentAtPos"),U=this._get(e,"stepMonths"),Q=1!==K[0]||1!==K[1],G=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),X=this._getMinMaxDate(e,"min"),$=this._getMinMaxDate(e,"max"),Z=e.drawMonth-V,et=e.drawYear;if(0>Z&&(Z+=12,et--),$)for(t=this._daylightSavingAdjust(new Date($.getFullYear(),$.getMonth()-K[0]*K[1]+1,$.getDate())),t=X&&X>t?X:t;this._daylightSavingAdjust(new Date(et,Z,1))>t;)Z--,0>Z&&(Z=11,et--);for(e.drawMonth=Z,e.drawYear=et,i=this._get(e,"prevText"),i=q?this.formatDate(i,this._daylightSavingAdjust(new Date(et,Z-U,1)),this._getFormatConfig(e)):i,s=this._canAdjustMonth(e,-1,et,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":J?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",n=this._get(e,"nextText"),n=q?this.formatDate(n,this._daylightSavingAdjust(new Date(et,Z+U,1)),this._getFormatConfig(e)):n,a=this._canAdjustMonth(e,1,et,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>":J?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+n+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+n+"</span></a>",o=this._get(e,"currentText"),r=this._get(e,"gotoCurrent")&&e.currentDay?G:R,o=q?this.formatDate(o,r,this._getFormatConfig(e)):o,h=e.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(e,"closeText")+"</button>",l=B?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(e,r)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+o+"</button>":"")+(Y?"":h)+"</div>":"",u=parseInt(this._get(e,"firstDay"),10),u=isNaN(u)?0:u,d=this._get(e,"showWeek"),c=this._get(e,"dayNames"),p=this._get(e,"dayNamesMin"),f=this._get(e,"monthNames"),m=this._get(e,"monthNamesShort"),g=this._get(e,"beforeShowDay"),v=this._get(e,"showOtherMonths"),y=this._get(e,"selectOtherMonths"),b=this._getDefaultDate(e),_="",w=0;K[0]>w;w++){for(k="",this.maxRows=4,T=0;K[1]>T;T++){if(D=this._daylightSavingAdjust(new Date(et,Z,e.selectedDay)),S=" ui-corner-all",M="",Q){if(M+="<div class='ui-datepicker-group",K[1]>1)switch(T){case 0:M+=" ui-datepicker-group-first",S=" ui-corner-"+(Y?"right":"left");break;case K[1]-1:M+=" ui-datepicker-group-last",S=" ui-corner-"+(Y?"left":"right");break;default:M+=" ui-datepicker-group-middle",S=""}M+="'>"}for(M+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+S+"'>"+(/all|left/.test(S)&&0===w?Y?a:s:"")+(/all|right/.test(S)&&0===w?Y?s:a:"")+this._generateMonthYearHeader(e,Z,et,X,$,w>0||T>0,f,m)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",C=d?"<th class='ui-datepicker-week-col'>"+this._get(e,"weekHeader")+"</th>":"",x=0;7>x;x++)N=(x+u)%7,C+="<th scope='col'"+((x+u+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+c[N]+"'>"+p[N]+"</span></th>";for(M+=C+"</tr></thead><tbody>",A=this._getDaysInMonth(et,Z),et===e.selectedYear&&Z===e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,A)),P=(this._getFirstDayOfMonth(et,Z)-u+7)%7,I=Math.ceil((P+A)/7),H=Q?this.maxRows>I?this.maxRows:I:I,this.maxRows=H,z=this._daylightSavingAdjust(new Date(et,Z,1-P)),F=0;H>F;F++){for(M+="<tr>",E=d?"<td class='ui-datepicker-week-col'>"+this._get(e,"calculateWeek")(z)+"</td>":"",x=0;7>x;x++)O=g?g.apply(e.input?e.input[0]:null,[z]):[!0,""],j=z.getMonth()!==Z,W=j&&!y||!O[0]||X&&X>z||$&&z>$,E+="<td class='"+((x+u+6)%7>=5?" ui-datepicker-week-end":"")+(j?" ui-datepicker-other-month":"")+(z.getTime()===D.getTime()&&Z===e.selectedMonth&&e._keyEvent||b.getTime()===z.getTime()&&b.getTime()===D.getTime()?" "+this._dayOverClass:"")+(W?" "+this._unselectableClass+" ui-state-disabled":"")+(j&&!v?"":" "+O[1]+(z.getTime()===G.getTime()?" "+this._currentClass:"")+(z.getTime()===R.getTime()?" ui-datepicker-today":""))+"'"+(j&&!v||!O[2]?"":" title='"+O[2].replace(/'/g,"&#39;")+"'")+(W?"":" data-handler='selectDay' data-event='click' data-month='"+z.getMonth()+"' data-year='"+z.getFullYear()+"'")+">"+(j&&!v?"&#xa0;":W?"<span class='ui-state-default'>"+z.getDate()+"</span>":"<a class='ui-state-default"+(z.getTime()===R.getTime()?" ui-state-highlight":"")+(z.getTime()===G.getTime()?" ui-state-active":"")+(j?" ui-priority-secondary":"")+"' href='#'>"+z.getDate()+"</a>")+"</td>",z.setDate(z.getDate()+1),z=this._daylightSavingAdjust(z);M+=E+"</tr>"}Z++,Z>11&&(Z=0,et++),M+="</tbody></table>"+(Q?"</div>"+(K[0]>0&&T===K[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),k+=M}_+=k}return _+=l,e._keyEvent=!1,_},_generateMonthYearHeader:function(e,t,i,s,n,a,o,r){var h,l,u,d,c,p,f,m,g=this._get(e,"changeMonth"),v=this._get(e,"changeYear"),y=this._get(e,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",_="";if(a||!g)_+="<span class='ui-datepicker-month'>"+o[t]+"</span>";else{for(h=s&&s.getFullYear()===i,l=n&&n.getFullYear()===i,_+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",u=0;12>u;u++)(!h||u>=s.getMonth())&&(!l||n.getMonth()>=u)&&(_+="<option value='"+u+"'"+(u===t?" selected='selected'":"")+">"+r[u]+"</option>");_+="</select>"}if(y||(b+=_+(!a&&g&&v?"":"&#xa0;")),!e.yearshtml)if(e.yearshtml="",a||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(d=this._get(e,"yearRange").split(":"),c=(new Date).getFullYear(),p=function(e){var t=e.match(/c[+\-].*/)?i+parseInt(e.substring(1),10):e.match(/[+\-].*/)?c+parseInt(e,10):parseInt(e,10);return isNaN(t)?c:t},f=p(d[0]),m=Math.max(f,p(d[1]||"")),f=s?Math.max(f,s.getFullYear()):f,m=n?Math.min(m,n.getFullYear()):m,e.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";m>=f;f++)e.yearshtml+="<option value='"+f+"'"+(f===i?" selected='selected'":"")+">"+f+"</option>";e.yearshtml+="</select>",b+=e.yearshtml,e.yearshtml=null}return b+=this._get(e,"yearSuffix"),y&&(b+=(!a&&g&&v?"":"&#xa0;")+_),b+="</div>"},_adjustInstDate:function(e,t,i){var s=e.drawYear+("Y"===i?t:0),n=e.drawMonth+("M"===i?t:0),a=Math.min(e.selectedDay,this._getDaysInMonth(s,n))+("D"===i?t:0),o=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(s,n,a)));e.selectedDay=o.getDate(),e.drawMonth=e.selectedMonth=o.getMonth(),e.drawYear=e.selectedYear=o.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(e)},_restrictMinMax:function(e,t){var i=this._getMinMaxDate(e,"min"),s=this._getMinMaxDate(e,"max"),n=i&&i>t?i:t;return s&&n>s?s:n},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return null==t?[1,1]:"number"==typeof t?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return new Date(e,t,1).getDay()},_canAdjustMonth:function(e,t,i,s){var n=this._getNumberOfMonths(e),a=this._daylightSavingAdjust(new Date(i,s+(0>t?t:n[0]*n[1]),1));return 0>t&&a.setDate(this._getDaysInMonth(a.getFullYear(),a.getMonth())),this._isInRange(e,a)},_isInRange:function(e,t){var i,s,n=this._getMinMaxDate(e,"min"),a=this._getMinMaxDate(e,"max"),o=null,r=null,h=this._get(e,"yearRange");return h&&(i=h.split(":"),s=(new Date).getFullYear(),o=parseInt(i[0],10),r=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(o+=s),i[1].match(/[+\-].*/)&&(r+=s)),(!n||t.getTime()>=n.getTime())&&(!a||t.getTime()<=a.getTime())&&(!o||t.getFullYear()>=o)&&(!r||r>=t.getFullYear())},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return t="string"!=typeof t?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,i,s){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var n=t?"object"==typeof t?t:this._daylightSavingAdjust(new Date(s,i,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),n,this._getFormatConfig(e))}}),e.fn.datepicker=function(t){if(!this.length)return this;e.datepicker.initialized||(e(document).mousedown(e.datepicker._checkExternalClick),e.datepicker.initialized=!0),0===e("#"+e.datepicker._mainDivId).length&&e("body").append(e.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof t||"isDisabled"!==t&&"getDate"!==t&&"widget"!==t?"option"===t&&2===arguments.length&&"string"==typeof arguments[1]?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof t?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this].concat(i)):e.datepicker._attachDatepicker(this,t)}):e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i))},e.datepicker=new n,e.datepicker.initialized=!1,e.datepicker.uuid=(new Date).getTime(),e.datepicker.version="1.11.4",e.datepicker,e.widget("ui.draggable",e.ui.mouse,{version:"1.11.4",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"===this.options.helper&&this._setPositionRelative(),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._setHandleClassName(),this._mouseInit()},_setOption:function(e,t){this._super(e,t),"handle"===e&&(this._removeHandleClassName(),this._setHandleClassName())},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(t){var i=this.options;return this._blurActiveElement(t),this.helper||i.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(this._blockFrames(i.iframeFix===!0?"iframe":i.iframeFix),!0):!1)},_blockFrames:function(t){this.iframeBlocks=this.document.find(t).map(function(){var t=e(this);return e("<div>").css("position","absolute").appendTo(t.parent()).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_blurActiveElement:function(t){var i=this.document[0];if(this.handleElement.is(t.target))try{i.activeElement&&"body"!==i.activeElement.nodeName.toLowerCase()&&e(i.activeElement).blur()}catch(s){}},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(!0),this.offsetParent=this.helper.offsetParent(),this.hasFixedAncestor=this.helper.parents().filter(function(){return"fixed"===e(this).css("position")}).length>0,this.positionAbs=this.element.offset(),this._refreshOffsets(t),this.originalPosition=this.position=this._generatePosition(t,!1),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._normalizeRightBottom(),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_refreshOffsets:function(e){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:!1,parent:this._getParentOffset(),relative:this._getRelativeOffset()},this.offset.click={left:e.pageX-this.offset.left,top:e.pageY-this.offset.top}},_mouseDrag:function(t,i){if(this.hasFixedAncestor&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(t,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",t,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i=this,s=!1;return e.ui.ddmanager&&!this.options.dropBehaviour&&(s=e.ui.ddmanager.drop(this,t)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",t)!==!1&&i._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1},_mouseUp:function(t){return this._unblockFrames(),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),this.handleElement.is(t.target)&&this.element.focus(),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element,this.handleElement.addClass("ui-draggable-handle")},_removeHandleClassName:function(){this.handleElement.removeClass("ui-draggable-handle")},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper),n=s?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return n.parents("body").length||n.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s&&n[0]===this.element[0]&&this._setPositionRelative(),n[0]===this.element[0]||/(fixed|absolute)/.test(n.css("position"))||n.css("position","absolute"),n},_setPositionRelative:function(){/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative")},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_isRootNode:function(e){return/(html|body)/i.test(e.tagName)||e===this.document[0]},_getParentOffset:function(){var t=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var e=this.element.position(),t=this._isRootNode(this.scrollParent[0]);return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+(t?0:this.scrollParent.scrollTop()),left:e.left-(parseInt(this.helper.css("left"),10)||0)+(t?0:this.scrollParent.scrollLeft())}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,n=this.options,a=this.document[0];return this.relativeContainer=null,n.containment?"window"===n.containment?(this.containment=[e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,e(window).scrollLeft()+e(window).width()-this.helperProportions.width-this.margins.left,e(window).scrollTop()+(e(window).height()||a.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,e(a).width()-this.helperProportions.width-this.margins.left,(e(a).height()||a.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=e(n.containment),s=i[0],s&&(t=/(scroll|auto)/.test(i.css("overflow")),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(t?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relativeContainer=i),void 0):(this.containment=null,void 0)
},_convertPositionTo:function(e,t){t||(t=this.position);var i="absolute"===e?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:t.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:t.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(e,t){var i,s,n,a,o=this.options,r=this._isRootNode(this.scrollParent[0]),h=e.pageX,l=e.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),t&&(this.containment&&(this.relativeContainer?(s=this.relativeContainer.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,e.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),e.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),e.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),e.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),o.grid&&(n=o.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY,l=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-o.grid[1]:n+o.grid[1]:n,a=o.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX,h=i?a-this.offset.click.left>=i[0]||a-this.offset.click.left>i[2]?a:a-this.offset.click.left>=i[0]?a-o.grid[0]:a+o.grid[0]:a),"y"===o.axis&&(h=this.originalPageX),"x"===o.axis&&(l=this.originalPageY)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_normalizeRightBottom:function(){"y"!==this.options.axis&&"auto"!==this.helper.css("right")&&(this.helper.width(this.helper.width()),this.helper.css("right","auto")),"x"!==this.options.axis&&"auto"!==this.helper.css("bottom")&&(this.helper.height(this.helper.height()),this.helper.css("bottom","auto"))},_trigger:function(t,i,s){return s=s||this._uiHash(),e.ui.plugin.call(this,t,[i,s,this],!0),/^(drag|start|stop)/.test(t)&&(this.positionAbs=this._convertPositionTo("absolute"),s.offset=this.positionAbs),e.Widget.prototype._trigger.call(this,t,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i,s){var n=e.extend({},i,{item:s.element});s.sortables=[],e(s.options.connectToSortable).each(function(){var i=e(this).sortable("instance");i&&!i.options.disabled&&(s.sortables.push(i),i.refreshPositions(),i._trigger("activate",t,n))})},stop:function(t,i,s){var n=e.extend({},i,{item:s.element});s.cancelHelperRemoval=!1,e.each(s.sortables,function(){var e=this;e.isOver?(e.isOver=0,s.cancelHelperRemoval=!0,e.cancelHelperRemoval=!1,e._storedCSS={position:e.placeholder.css("position"),top:e.placeholder.css("top"),left:e.placeholder.css("left")},e._mouseStop(t),e.options.helper=e.options._helper):(e.cancelHelperRemoval=!0,e._trigger("deactivate",t,n))})},drag:function(t,i,s){e.each(s.sortables,function(){var n=!1,a=this;a.positionAbs=s.positionAbs,a.helperProportions=s.helperProportions,a.offset.click=s.offset.click,a._intersectsWith(a.containerCache)&&(n=!0,e.each(s.sortables,function(){return this.positionAbs=s.positionAbs,this.helperProportions=s.helperProportions,this.offset.click=s.offset.click,this!==a&&this._intersectsWith(this.containerCache)&&e.contains(a.element[0],this.element[0])&&(n=!1),n})),n?(a.isOver||(a.isOver=1,s._parent=i.helper.parent(),a.currentItem=i.helper.appendTo(a.element).data("ui-sortable-item",!0),a.options._helper=a.options.helper,a.options.helper=function(){return i.helper[0]},t.target=a.currentItem[0],a._mouseCapture(t,!0),a._mouseStart(t,!0,!0),a.offset.click.top=s.offset.click.top,a.offset.click.left=s.offset.click.left,a.offset.parent.left-=s.offset.parent.left-a.offset.parent.left,a.offset.parent.top-=s.offset.parent.top-a.offset.parent.top,s._trigger("toSortable",t),s.dropped=a.element,e.each(s.sortables,function(){this.refreshPositions()}),s.currentItem=s.element,a.fromOutside=s),a.currentItem&&(a._mouseDrag(t),i.position=a.position)):a.isOver&&(a.isOver=0,a.cancelHelperRemoval=!0,a.options._revert=a.options.revert,a.options.revert=!1,a._trigger("out",t,a._uiHash(a)),a._mouseStop(t,!0),a.options.revert=a.options._revert,a.options.helper=a.options._helper,a.placeholder&&a.placeholder.remove(),i.helper.appendTo(s._parent),s._refreshOffsets(t),i.position=s._generatePosition(t,!0),s._trigger("fromSortable",t),s.dropped=!1,e.each(s.sortables,function(){this.refreshPositions()}))})}}),e.ui.plugin.add("draggable","cursor",{start:function(t,i,s){var n=e("body"),a=s.options;n.css("cursor")&&(a._cursor=n.css("cursor")),n.css("cursor",a.cursor)},stop:function(t,i,s){var n=s.options;n._cursor&&e("body").css("cursor",n._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i,s){var n=e(i.helper),a=s.options;n.css("opacity")&&(a._opacity=n.css("opacity")),n.css("opacity",a.opacity)},stop:function(t,i,s){var n=s.options;n._opacity&&e(i.helper).css("opacity",n._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(e,t,i){i.scrollParentNotHidden||(i.scrollParentNotHidden=i.helper.scrollParent(!1)),i.scrollParentNotHidden[0]!==i.document[0]&&"HTML"!==i.scrollParentNotHidden[0].tagName&&(i.overflowOffset=i.scrollParentNotHidden.offset())},drag:function(t,i,s){var n=s.options,a=!1,o=s.scrollParentNotHidden[0],r=s.document[0];o!==r&&"HTML"!==o.tagName?(n.axis&&"x"===n.axis||(s.overflowOffset.top+o.offsetHeight-t.pageY<n.scrollSensitivity?o.scrollTop=a=o.scrollTop+n.scrollSpeed:t.pageY-s.overflowOffset.top<n.scrollSensitivity&&(o.scrollTop=a=o.scrollTop-n.scrollSpeed)),n.axis&&"y"===n.axis||(s.overflowOffset.left+o.offsetWidth-t.pageX<n.scrollSensitivity?o.scrollLeft=a=o.scrollLeft+n.scrollSpeed:t.pageX-s.overflowOffset.left<n.scrollSensitivity&&(o.scrollLeft=a=o.scrollLeft-n.scrollSpeed))):(n.axis&&"x"===n.axis||(t.pageY-e(r).scrollTop()<n.scrollSensitivity?a=e(r).scrollTop(e(r).scrollTop()-n.scrollSpeed):e(window).height()-(t.pageY-e(r).scrollTop())<n.scrollSensitivity&&(a=e(r).scrollTop(e(r).scrollTop()+n.scrollSpeed))),n.axis&&"y"===n.axis||(t.pageX-e(r).scrollLeft()<n.scrollSensitivity?a=e(r).scrollLeft(e(r).scrollLeft()-n.scrollSpeed):e(window).width()-(t.pageX-e(r).scrollLeft())<n.scrollSensitivity&&(a=e(r).scrollLeft(e(r).scrollLeft()+n.scrollSpeed)))),a!==!1&&e.ui.ddmanager&&!n.dropBehaviour&&e.ui.ddmanager.prepareOffsets(s,t)}}),e.ui.plugin.add("draggable","snap",{start:function(t,i,s){var n=s.options;s.snapElements=[],e(n.snap.constructor!==String?n.snap.items||":data(ui-draggable)":n.snap).each(function(){var t=e(this),i=t.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:t.outerWidth(),height:t.outerHeight(),top:i.top,left:i.left})})},drag:function(t,i,s){var n,a,o,r,h,l,u,d,c,p,f=s.options,m=f.snapTolerance,g=i.offset.left,v=g+s.helperProportions.width,y=i.offset.top,b=y+s.helperProportions.height;for(c=s.snapElements.length-1;c>=0;c--)h=s.snapElements[c].left-s.margins.left,l=h+s.snapElements[c].width,u=s.snapElements[c].top-s.margins.top,d=u+s.snapElements[c].height,h-m>v||g>l+m||u-m>b||y>d+m||!e.contains(s.snapElements[c].item.ownerDocument,s.snapElements[c].item)?(s.snapElements[c].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,t,e.extend(s._uiHash(),{snapItem:s.snapElements[c].item})),s.snapElements[c].snapping=!1):("inner"!==f.snapMode&&(n=m>=Math.abs(u-b),a=m>=Math.abs(d-y),o=m>=Math.abs(h-v),r=m>=Math.abs(l-g),n&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top),a&&(i.position.top=s._convertPositionTo("relative",{top:d,left:0}).top),o&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left)),p=n||a||o||r,"outer"!==f.snapMode&&(n=m>=Math.abs(u-y),a=m>=Math.abs(d-b),o=m>=Math.abs(h-g),r=m>=Math.abs(l-v),n&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top),a&&(i.position.top=s._convertPositionTo("relative",{top:d-s.helperProportions.height,left:0}).top),o&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left)),!s.snapElements[c].snapping&&(n||a||o||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,t,e.extend(s._uiHash(),{snapItem:s.snapElements[c].item})),s.snapElements[c].snapping=n||a||o||r||p)}}),e.ui.plugin.add("draggable","stack",{start:function(t,i,s){var n,a=s.options,o=e.makeArray(e(a.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});o.length&&(n=parseInt(e(o[0]).css("zIndex"),10)||0,e(o).each(function(t){e(this).css("zIndex",n+t)}),this.css("zIndex",n+o.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i,s){var n=e(i.helper),a=s.options;n.css("zIndex")&&(a._zIndex=n.css("zIndex")),n.css("zIndex",a.zIndex)},stop:function(t,i,s){var n=s.options;n._zIndex&&e(i.helper).css("zIndex",n._zIndex)}}),e.ui.draggable,e.widget("ui.resizable",e.ui.mouse,{version:"1.11.4",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(e){return parseInt(e,10)||0},_isNumber:function(e){return!isNaN(parseInt(e,10))},_hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return t[s]>0?!0:(t[s]=1,n=t[s]>0,t[s]=0,n)},_create:function(){var t,i,s,n,a,o=this,r=this.options;if(this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!r.aspectRatio,aspectRatio:r.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:r.helper||r.ghost||r.animate?r.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(e("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=r.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=e(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),t=this.handles.split(","),this.handles={},i=0;t.length>i;i++)s=e.trim(t[i]),a="ui-resizable-"+s,n=e("<div class='ui-resizable-handle "+a+"'></div>"),n.css({zIndex:r.zIndex}),"se"===s&&n.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(n);this._renderAxis=function(t){var i,s,n,a;t=t||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=e(this.handles[i]),this._on(this.handles[i],{mousedown:o._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=e(this.handles[i],this.element),a=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),t.css(n,a),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.mouseover(function(){o.resizing||(this.className&&(n=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),o.axis=n&&n[1]?n[1]:"se")}),r.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){r.disabled||(e(this).removeClass("ui-resizable-autohide"),o._handles.show())}).mouseleave(function(){r.disabled||o.resizing||(e(this).addClass("ui-resizable-autohide"),o._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var t,i=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),t=this.element,this.originalElement.css({position:t.css("position"),width:t.outerWidth(),height:t.outerHeight(),top:t.css("top"),left:t.css("left")}).insertAfter(t),t.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(t){var i,s,n=!1;for(i in this.handles)s=e(this.handles[i])[0],(s===t.target||e.contains(s,t.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(t){var i,s,n,a=this.options,o=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),a.containment&&(i+=e(a.containment).scrollLeft()||0,s+=e(a.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:o.width(),height:o.height()},this.originalSize=this._helper?{width:o.outerWidth(),height:o.outerHeight()}:{width:o.width(),height:o.height()},this.sizeDiff={width:o.outerWidth()-o.width(),height:o.outerHeight()-o.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:t.pageX,top:t.pageY},this.aspectRatio="number"==typeof a.aspectRatio?a.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=e(".ui-resizable-"+this.axis).css("cursor"),e("body").css("cursor","auto"===n?this.axis+"-resize":n),o.addClass("ui-resizable-resizing"),this._propagate("start",t),!0},_mouseDrag:function(t){var i,s,n=this.originalMousePosition,a=this.axis,o=t.pageX-n.left||0,r=t.pageY-n.top||0,h=this._change[a];return this._updatePrevProperties(),h?(i=h.apply(this,[t,o,r]),this._updateVirtualBoundaries(t.shiftKey),(this._aspectRatio||t.shiftKey)&&(i=this._updateRatio(i,t)),i=this._respectSize(i,t),this._updateCache(i),this._propagate("resize",t),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),e.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",t,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(t){this.resizing=!1;var i,s,n,a,o,r,h,l=this.options,u=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:u.sizeDiff.height,a=s?0:u.sizeDiff.width,o={width:u.helper.width()-a,height:u.helper.height()-n},r=parseInt(u.element.css("left"),10)+(u.position.left-u.originalPosition.left)||null,h=parseInt(u.element.css("top"),10)+(u.position.top-u.originalPosition.top)||null,l.animate||this.element.css(e.extend(o,{top:h,left:r})),u.helper.height(u.size.height),u.helper.width(u.size.width),this._helper&&!l.animate&&this._proportionallyResize()),e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var e={};return this.position.top!==this.prevPosition.top&&(e.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(e.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(e.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(e.height=this.size.height+"px"),this.helper.css(e),e},_updateVirtualBoundaries:function(e){var t,i,s,n,a,o=this.options;a={minWidth:this._isNumber(o.minWidth)?o.minWidth:0,maxWidth:this._isNumber(o.maxWidth)?o.maxWidth:1/0,minHeight:this._isNumber(o.minHeight)?o.minHeight:0,maxHeight:this._isNumber(o.maxHeight)?o.maxHeight:1/0},(this._aspectRatio||e)&&(t=a.minHeight*this.aspectRatio,s=a.minWidth/this.aspectRatio,i=a.maxHeight*this.aspectRatio,n=a.maxWidth/this.aspectRatio,t>a.minWidth&&(a.minWidth=t),s>a.minHeight&&(a.minHeight=s),a.maxWidth>i&&(a.maxWidth=i),a.maxHeight>n&&(a.maxHeight=n)),this._vBoundaries=a},_updateCache:function(e){this.offset=this.helper.offset(),this._isNumber(e.left)&&(this.position.left=e.left),this._isNumber(e.top)&&(this.position.top=e.top),this._isNumber(e.height)&&(this.size.height=e.height),this._isNumber(e.width)&&(this.size.width=e.width)},_updateRatio:function(e){var t=this.position,i=this.size,s=this.axis;return this._isNumber(e.height)?e.width=e.height*this.aspectRatio:this._isNumber(e.width)&&(e.height=e.width/this.aspectRatio),"sw"===s&&(e.left=t.left+(i.width-e.width),e.top=null),"nw"===s&&(e.top=t.top+(i.height-e.height),e.left=t.left+(i.width-e.width)),e},_respectSize:function(e){var t=this._vBoundaries,i=this.axis,s=this._isNumber(e.width)&&t.maxWidth&&t.maxWidth<e.width,n=this._isNumber(e.height)&&t.maxHeight&&t.maxHeight<e.height,a=this._isNumber(e.width)&&t.minWidth&&t.minWidth>e.width,o=this._isNumber(e.height)&&t.minHeight&&t.minHeight>e.height,r=this.originalPosition.left+this.originalSize.width,h=this.position.top+this.size.height,l=/sw|nw|w/.test(i),u=/nw|ne|n/.test(i);return a&&(e.width=t.minWidth),o&&(e.height=t.minHeight),s&&(e.width=t.maxWidth),n&&(e.height=t.maxHeight),a&&l&&(e.left=r-t.minWidth),s&&l&&(e.left=r-t.maxWidth),o&&u&&(e.top=h-t.minHeight),n&&u&&(e.top=h-t.maxHeight),e.width||e.height||e.left||!e.top?e.width||e.height||e.top||!e.left||(e.left=null):e.top=null,e},_getPaddingPlusBorderDimensions:function(e){for(var t=0,i=[],s=[e.css("borderTopWidth"),e.css("borderRightWidth"),e.css("borderBottomWidth"),e.css("borderLeftWidth")],n=[e.css("paddingTop"),e.css("paddingRight"),e.css("paddingBottom"),e.css("paddingLeft")];4>t;t++)i[t]=parseInt(s[t],10)||0,i[t]+=parseInt(n[t],10)||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var e,t=0,i=this.helper||this.element;this._proportionallyResizeElements.length>t;t++)e=this._proportionallyResizeElements[t],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(e)),e.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var t=this.element,i=this.options;this.elementOffset=t.offset(),this._helper?(this.helper=this.helper||e("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(e,t){return{width:this.originalSize.width+t}},w:function(e,t){var i=this.originalSize,s=this.originalPosition;return{left:s.left+t,width:i.width-t}},n:function(e,t,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(e,t,i){return{height:this.originalSize.height+i}},se:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},sw:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,i,s]))},ne:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},nw:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,i,s]))}},_propagate:function(t,i){e.ui.plugin.call(this,t,[i,this.ui()]),"resize"!==t&&this._trigger(t,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),e.ui.plugin.add("resizable","animate",{stop:function(t){var i=e(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,a=n.length&&/textarea/i.test(n[0].nodeName),o=a&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=a?0:i.sizeDiff.width,h={width:i.size.width-r,height:i.size.height-o},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,u=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(e.extend(h,u&&l?{top:u,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};n&&n.length&&e(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",t)}})}}),e.ui.plugin.add("resizable","containment",{start:function(){var t,i,s,n,a,o,r,h=e(this).resizable("instance"),l=h.options,u=h.element,d=l.containment,c=d instanceof e?d.get(0):/parent/.test(d)?u.parent().get(0):d;c&&(h.containerElement=e(c),/document/.test(d)||d===document?(h.containerOffset={left:0,top:0},h.containerPosition={left:0,top:0},h.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}):(t=e(c),i=[],e(["Top","Right","Left","Bottom"]).each(function(e,s){i[e]=h._num(t.css("padding"+s))}),h.containerOffset=t.offset(),h.containerPosition=t.position(),h.containerSize={height:t.innerHeight()-i[3],width:t.innerWidth()-i[1]},s=h.containerOffset,n=h.containerSize.height,a=h.containerSize.width,o=h._hasScroll(c,"left")?c.scrollWidth:a,r=h._hasScroll(c)?c.scrollHeight:n,h.parentData={element:c,left:s.left,top:s.top,width:o,height:r}))},resize:function(t){var i,s,n,a,o=e(this).resizable("instance"),r=o.options,h=o.containerOffset,l=o.position,u=o._aspectRatio||t.shiftKey,d={top:0,left:0},c=o.containerElement,p=!0;c[0]!==document&&/static/.test(c.css("position"))&&(d=h),l.left<(o._helper?h.left:0)&&(o.size.width=o.size.width+(o._helper?o.position.left-h.left:o.position.left-d.left),u&&(o.size.height=o.size.width/o.aspectRatio,p=!1),o.position.left=r.helper?h.left:0),l.top<(o._helper?h.top:0)&&(o.size.height=o.size.height+(o._helper?o.position.top-h.top:o.position.top),u&&(o.size.width=o.size.height*o.aspectRatio,p=!1),o.position.top=o._helper?h.top:0),n=o.containerElement.get(0)===o.element.parent().get(0),a=/relative|absolute/.test(o.containerElement.css("position")),n&&a?(o.offset.left=o.parentData.left+o.position.left,o.offset.top=o.parentData.top+o.position.top):(o.offset.left=o.element.offset().left,o.offset.top=o.element.offset().top),i=Math.abs(o.sizeDiff.width+(o._helper?o.offset.left-d.left:o.offset.left-h.left)),s=Math.abs(o.sizeDiff.height+(o._helper?o.offset.top-d.top:o.offset.top-h.top)),i+o.size.width>=o.parentData.width&&(o.size.width=o.parentData.width-i,u&&(o.size.height=o.size.width/o.aspectRatio,p=!1)),s+o.size.height>=o.parentData.height&&(o.size.height=o.parentData.height-s,u&&(o.size.width=o.size.height*o.aspectRatio,p=!1)),p||(o.position.left=o.prevPosition.left,o.position.top=o.prevPosition.top,o.size.width=o.prevSize.width,o.size.height=o.prevSize.height)},stop:function(){var t=e(this).resizable("instance"),i=t.options,s=t.containerOffset,n=t.containerPosition,a=t.containerElement,o=e(t.helper),r=o.offset(),h=o.outerWidth()-t.sizeDiff.width,l=o.outerHeight()-t.sizeDiff.height;t._helper&&!i.animate&&/relative/.test(a.css("position"))&&e(this).css({left:r.left-n.left-s.left,width:h,height:l}),t._helper&&!i.animate&&/static/.test(a.css("position"))&&e(this).css({left:r.left-n.left-s.left,width:h,height:l})}}),e.ui.plugin.add("resizable","alsoResize",{start:function(){var t=e(this).resizable("instance"),i=t.options;e(i.alsoResize).each(function(){var t=e(this);t.data("ui-resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})},resize:function(t,i){var s=e(this).resizable("instance"),n=s.options,a=s.originalSize,o=s.originalPosition,r={height:s.size.height-a.height||0,width:s.size.width-a.width||0,top:s.position.top-o.top||0,left:s.position.left-o.left||0};e(n.alsoResize).each(function(){var t=e(this),s=e(this).data("ui-resizable-alsoresize"),n={},a=t.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(a,function(e,t){var i=(s[t]||0)+(r[t]||0);i&&i>=0&&(n[t]=i||null)}),t.css(n)})},stop:function(){e(this).removeData("resizable-alsoresize")}}),e.ui.plugin.add("resizable","ghost",{start:function(){var t=e(this).resizable("instance"),i=t.options,s=t.size;t.ghost=t.originalElement.clone(),t.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),t.ghost.appendTo(t.helper)},resize:function(){var t=e(this).resizable("instance");t.ghost&&t.ghost.css({position:"relative",height:t.size.height,width:t.size.width})},stop:function(){var t=e(this).resizable("instance");t.ghost&&t.helper&&t.helper.get(0).removeChild(t.ghost.get(0))}}),e.ui.plugin.add("resizable","grid",{resize:function(){var t,i=e(this).resizable("instance"),s=i.options,n=i.size,a=i.originalSize,o=i.originalPosition,r=i.axis,h="number"==typeof s.grid?[s.grid,s.grid]:s.grid,l=h[0]||1,u=h[1]||1,d=Math.round((n.width-a.width)/l)*l,c=Math.round((n.height-a.height)/u)*u,p=a.width+d,f=a.height+c,m=s.maxWidth&&p>s.maxWidth,g=s.maxHeight&&f>s.maxHeight,v=s.minWidth&&s.minWidth>p,y=s.minHeight&&s.minHeight>f;s.grid=h,v&&(p+=l),y&&(f+=u),m&&(p-=l),g&&(f-=u),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=o.top-c):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=o.left-d):((0>=f-u||0>=p-l)&&(t=i._getPaddingPlusBorderDimensions(this)),f-u>0?(i.size.height=f,i.position.top=o.top-c):(f=u-t.height,i.size.height=f,i.position.top=o.top+a.height-f),p-l>0?(i.size.width=p,i.position.left=o.left-d):(p=l-t.width,i.size.width=p,i.position.left=o.left+a.width-p))}}),e.ui.resizable,e.widget("ui.dialog",{version:"1.11.4",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"Close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var i=e(this).css(t).offset().top;0>i&&e(this).css("top",t.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},sizeRelatedOptions:{buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},resizableRelatedOptions:{maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&e.fn.draggable&&this._makeDraggable(),this.options.resizable&&e.fn.resizable&&this._makeResizable(),this._isOpen=!1,this._trackFocus()},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var t=this.options.appendTo;return t&&(t.jquery||t.nodeType)?e(t):this.document.find(t||"body").eq(0)},_destroy:function(){var e,t=this.originalPosition;this._untrackInstance(),this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},disable:e.noop,enable:e.noop,close:function(t){var i,s=this;if(this._isOpen&&this._trigger("beforeClose",t)!==!1){if(this._isOpen=!1,this._focusedElement=null,this._destroyOverlay(),this._untrackInstance(),!this.opener.filter(":focusable").focus().length)try{i=this.document[0].activeElement,i&&"body"!==i.nodeName.toLowerCase()&&e(i).blur()}catch(n){}this._hide(this.uiDialog,this.options.hide,function(){s._trigger("close",t)})}},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(t,i){var s=!1,n=this.uiDialog.siblings(".ui-front:visible").map(function(){return+e(this).css("z-index")}).get(),a=Math.max.apply(null,n);return a>=+this.uiDialog.css("z-index")&&(this.uiDialog.css("z-index",a+1),s=!0),s&&!i&&this._trigger("focus",t),s},open:function(){var t=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),void 0):(this._isOpen=!0,this.opener=e(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this.overlay&&this.overlay.css("z-index",this.uiDialog.css("z-index")-1),this._show(this.uiDialog,this.options.show,function(){t._focusTabbable(),t._trigger("focus")}),this._makeFocusTarget(),this._trigger("open"),void 0)},_focusTabbable:function(){var e=this._focusedElement;e||(e=this.element.find("[autofocus]")),e.length||(e=this.element.find(":tabbable")),e.length||(e=this.uiDialogButtonPane.find(":tabbable")),e.length||(e=this.uiDialogTitlebarClose.filter(":tabbable")),e.length||(e=this.uiDialog),e.eq(0).focus()},_keepFocus:function(t){function i(){var t=this.document[0].activeElement,i=this.uiDialog[0]===t||e.contains(this.uiDialog[0],t);i||this._focusTabbable()}t.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=e("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(t){if(this.options.closeOnEscape&&!t.isDefaultPrevented()&&t.keyCode&&t.keyCode===e.ui.keyCode.ESCAPE)return t.preventDefault(),this.close(t),void 0;
if(t.keyCode===e.ui.keyCode.TAB&&!t.isDefaultPrevented()){var i=this.uiDialog.find(":tabbable"),s=i.filter(":first"),n=i.filter(":last");t.target!==n[0]&&t.target!==this.uiDialog[0]||t.shiftKey?t.target!==s[0]&&t.target!==this.uiDialog[0]||!t.shiftKey||(this._delay(function(){n.focus()}),t.preventDefault()):(this._delay(function(){s.focus()}),t.preventDefault())}},mousedown:function(e){this._moveToTop(e)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var t;this.uiDialogTitlebar=e("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(t){e(t.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=e("<button type='button'></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(e){e.preventDefault(),this.close(e)}}),t=e("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(t),this.uiDialog.attr({"aria-labelledby":t.attr("id")})},_title:function(e){this.options.title||e.html("&#160;"),e.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=e("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=e("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var t=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),e.isEmptyObject(i)||e.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),void 0):(e.each(i,function(i,s){var n,a;s=e.isFunction(s)?{click:s,text:i}:s,s=e.extend({type:"button"},s),n=s.click,s.click=function(){n.apply(t.element[0],arguments)},a={icons:s.icons,text:s.showText},delete s.icons,delete s.showText,e("<button></button>",s).button(a).appendTo(t.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),void 0)},_makeDraggable:function(){function t(e){return{position:e.position,offset:e.offset}}var i=this,s=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(s,n){e(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",s,t(n))},drag:function(e,s){i._trigger("drag",e,t(s))},stop:function(n,a){var o=a.offset.left-i.document.scrollLeft(),r=a.offset.top-i.document.scrollTop();s.position={my:"left top",at:"left"+(o>=0?"+":"")+o+" "+"top"+(r>=0?"+":"")+r,of:i.window},e(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",n,t(a))}})},_makeResizable:function(){function t(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}var i=this,s=this.options,n=s.resizable,a=this.uiDialog.css("position"),o="string"==typeof n?n:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:s.maxWidth,maxHeight:s.maxHeight,minWidth:s.minWidth,minHeight:this._minHeight(),handles:o,start:function(s,n){e(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",s,t(n))},resize:function(e,s){i._trigger("resize",e,t(s))},stop:function(n,a){var o=i.uiDialog.offset(),r=o.left-i.document.scrollLeft(),h=o.top-i.document.scrollTop();s.height=i.uiDialog.height(),s.width=i.uiDialog.width(),s.position={my:"left top",at:"left"+(r>=0?"+":"")+r+" "+"top"+(h>=0?"+":"")+h,of:i.window},e(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",n,t(a))}}).css("position",a)},_trackFocus:function(){this._on(this.widget(),{focusin:function(t){this._makeFocusTarget(),this._focusedElement=e(t.target)}})},_makeFocusTarget:function(){this._untrackInstance(),this._trackingInstances().unshift(this)},_untrackInstance:function(){var t=this._trackingInstances(),i=e.inArray(this,t);-1!==i&&t.splice(i,1)},_trackingInstances:function(){var e=this.document.data("ui-dialog-instances");return e||(e=[],this.document.data("ui-dialog-instances",e)),e},_minHeight:function(){var e=this.options;return"auto"===e.height?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(){var e=this.uiDialog.is(":visible");e||this.uiDialog.show(),this.uiDialog.position(this.options.position),e||this.uiDialog.hide()},_setOptions:function(t){var i=this,s=!1,n={};e.each(t,function(e,t){i._setOption(e,t),e in i.sizeRelatedOptions&&(s=!0),e in i.resizableRelatedOptions&&(n[e]=t)}),s&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",n)},_setOption:function(e,t){var i,s,n=this.uiDialog;"dialogClass"===e&&n.removeClass(this.options.dialogClass).addClass(t),"disabled"!==e&&(this._super(e,t),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:""+t}),"draggable"===e&&(i=n.is(":data(ui-draggable)"),i&&!t&&n.draggable("destroy"),!i&&t&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(s=n.is(":data(ui-resizable)"),s&&!t&&n.resizable("destroy"),s&&"string"==typeof t&&n.resizable("option","handles",t),s||t===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var e,t,i,s=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),s.minWidth>s.width&&(s.width=s.minWidth),e=this.uiDialog.css({height:"auto",width:s.width}).outerHeight(),t=Math.max(0,s.minHeight-e),i="number"==typeof s.maxHeight?Math.max(0,s.maxHeight-e):"none","auto"===s.height?this.element.css({minHeight:t,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,s.height-e)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var t=e(this);return e("<div>").css({position:"absolute",width:t.outerWidth(),height:t.outerHeight()}).appendTo(t.parent()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(t){return e(t.target).closest(".ui-dialog").length?!0:!!e(t.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var t=!0;this._delay(function(){t=!1}),this.document.data("ui-dialog-overlays")||this._on(this.document,{focusin:function(e){t||this._allowInteraction(e)||(e.preventDefault(),this._trackingInstances()[0]._focusTabbable())}}),this.overlay=e("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),this.document.data("ui-dialog-overlays",(this.document.data("ui-dialog-overlays")||0)+1)}},_destroyOverlay:function(){if(this.options.modal&&this.overlay){var e=this.document.data("ui-dialog-overlays")-1;e?this.document.data("ui-dialog-overlays",e):this.document.unbind("focusin").removeData("ui-dialog-overlays"),this.overlay.remove(),this.overlay=null}}}),e.widget("ui.droppable",{version:"1.11.4",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=e.isFunction(s)?s:function(e){return e.is(s)},this.proportions=function(){return arguments.length?(t=arguments[0],void 0):t?t:t={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},this._addToManager(i.scope),i.addClasses&&this.element.addClass("ui-droppable")},_addToManager:function(t){e.ui.ddmanager.droppables[t]=e.ui.ddmanager.droppables[t]||[],e.ui.ddmanager.droppables[t].push(this)},_splice:function(e){for(var t=0;e.length>t;t++)e[t]===this&&e.splice(t,1)},_destroy:function(){var t=e.ui.ddmanager.droppables[this.options.scope];this._splice(t),this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,i){if("accept"===t)this.accept=e.isFunction(i)?i:function(e){return e.is(i)};else if("scope"===t){var s=e.ui.ddmanager.droppables[this.options.scope];this._splice(s),this._addToManager(i)}this._super(t,i)},_activate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",t,this.ui(i))},_deactivate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",t,this.ui(i))},_over:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(i)))},_out:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(i)))},_drop:function(t,i){var s=i||e.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var i=e(this).droppable("instance");return i.options.greedy&&!i.options.disabled&&i.options.scope===s.options.scope&&i.accept.call(i.element[0],s.currentItem||s.element)&&e.ui.intersect(s,e.extend(i,{offset:i.element.offset()}),i.options.tolerance,t)?(n=!0,!1):void 0}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(s)),this.element):!1):!1},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(){function e(e,t,i){return e>=t&&t+i>e}return function(t,i,s,n){if(!i.offset)return!1;var a=(t.positionAbs||t.position.absolute).left+t.margins.left,o=(t.positionAbs||t.position.absolute).top+t.margins.top,r=a+t.helperProportions.width,h=o+t.helperProportions.height,l=i.offset.left,u=i.offset.top,d=l+i.proportions().width,c=u+i.proportions().height;switch(s){case"fit":return a>=l&&d>=r&&o>=u&&c>=h;case"intersect":return a+t.helperProportions.width/2>l&&d>r-t.helperProportions.width/2&&o+t.helperProportions.height/2>u&&c>h-t.helperProportions.height/2;case"pointer":return e(n.pageY,u,i.proportions().height)&&e(n.pageX,l,i.proportions().width);case"touch":return(o>=u&&c>=o||h>=u&&c>=h||u>o&&h>c)&&(a>=l&&d>=a||r>=l&&d>=r||l>a&&r>d);default:return!1}}}(),e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,i){var s,n,a=e.ui.ddmanager.droppables[t.options.scope]||[],o=i?i.type:null,r=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();e:for(s=0;a.length>s;s++)if(!(a[s].options.disabled||t&&!a[s].accept.call(a[s].element[0],t.currentItem||t.element))){for(n=0;r.length>n;n++)if(r[n]===a[s].element[0]){a[s].proportions().height=0;continue e}a[s].visible="none"!==a[s].element.css("display"),a[s].visible&&("mousedown"===o&&a[s]._activate.call(a[s],i),a[s].offset=a[s].element.offset(),a[s].proportions({width:a[s].element[0].offsetWidth,height:a[s].element[0].offsetHeight}))}},drop:function(t,i){var s=!1;return e.each((e.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance,i)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(t,i){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)})},drag:function(t,i){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,i),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,a,o=e.ui.intersect(t,this,this.options.tolerance,i),r=!o&&this.isover?"isout":o&&!this.isover?"isover":null;r&&(this.options.greedy&&(n=this.options.scope,a=this.element.parents(":data(ui-droppable)").filter(function(){return e(this).droppable("instance").options.scope===n}),a.length&&(s=e(a[0]).droppable("instance"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(t,i){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)}},e.ui.droppable;var y="ui-effects-",b=e;e.effects={effect:{}},function(e,t){function i(e,t,i){var s=d[t.type]||{};return null==e?i||!t.def?null:t.def:(e=s.floor?~~e:parseFloat(e),isNaN(e)?t.def:s.mod?(e+s.mod)%s.mod:0>e?0:e>s.max?s.max:e)}function s(i){var s=l(),n=s._rgba=[];return i=i.toLowerCase(),f(h,function(e,a){var o,r=a.re.exec(i),h=r&&a.parse(r),l=a.space||"rgba";return h?(o=s[l](h),s[u[l].cache]=o[u[l].cache],n=s._rgba=o._rgba,!1):t}),n.length?("0,0,0,0"===n.join()&&e.extend(n,a.transparent),s):a[i]}function n(e,t,i){return i=(i+1)%1,1>6*i?e+6*(t-e)*i:1>2*i?t:2>3*i?e+6*(t-e)*(2/3-i):e}var a,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,h=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1],e[2],e[3],e[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(e){return[2.55*e[1],2.55*e[2],2.55*e[3],e[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(e){return[e[1],e[2]/100,e[3]/100,e[4]]}}],l=e.Color=function(t,i,s,n){return new e.Color.fn.parse(t,i,s,n)},u={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},d={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},c=l.support={},p=e("<p>")[0],f=e.each;p.style.cssText="background-color:rgba(1,1,1,.5)",c.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(u,function(e,t){t.cache="_"+e,t.props.alpha={idx:3,type:"percent",def:1}}),l.fn=e.extend(l.prototype,{parse:function(n,o,r,h){if(n===t)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=e(n).css(o),o=t);var d=this,c=e.type(n),p=this._rgba=[];return o!==t&&(n=[n,o,r,h],c="array"),"string"===c?this.parse(s(n)||a._default):"array"===c?(f(u.rgba.props,function(e,t){p[t.idx]=i(n[t.idx],t)}),this):"object"===c?(n instanceof l?f(u,function(e,t){n[t.cache]&&(d[t.cache]=n[t.cache].slice())}):f(u,function(t,s){var a=s.cache;f(s.props,function(e,t){if(!d[a]&&s.to){if("alpha"===e||null==n[e])return;d[a]=s.to(d._rgba)}d[a][t.idx]=i(n[e],t,!0)}),d[a]&&0>e.inArray(null,d[a].slice(0,3))&&(d[a][3]=1,s.from&&(d._rgba=s.from(d[a])))}),this):t},is:function(e){var i=l(e),s=!0,n=this;return f(u,function(e,a){var o,r=i[a.cache];return r&&(o=n[a.cache]||a.to&&a.to(n._rgba)||[],f(a.props,function(e,i){return null!=r[i.idx]?s=r[i.idx]===o[i.idx]:t})),s}),s},_space:function(){var e=[],t=this;return f(u,function(i,s){t[s.cache]&&e.push(i)}),e.pop()},transition:function(e,t){var s=l(e),n=s._space(),a=u[n],o=0===this.alpha()?l("transparent"):this,r=o[a.cache]||a.to(o._rgba),h=r.slice();return s=s[a.cache],f(a.props,function(e,n){var a=n.idx,o=r[a],l=s[a],u=d[n.type]||{};null!==l&&(null===o?h[a]=l:(u.mod&&(l-o>u.mod/2?o+=u.mod:o-l>u.mod/2&&(o-=u.mod)),h[a]=i((l-o)*t+o,n)))}),this[n](h)},blend:function(t){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=l(t)._rgba;return l(e.map(i,function(e,t){return(1-s)*n[t]+s*e}))},toRgbaString:function(){var t="rgba(",i=e.map(this._rgba,function(e,t){return null==e?t>2?1:0:e});return 1===i[3]&&(i.pop(),t="rgb("),t+i.join()+")"},toHslaString:function(){var t="hsla(",i=e.map(this.hsla(),function(e,t){return null==e&&(e=t>2?1:0),t&&3>t&&(e=Math.round(100*e)+"%"),e});return 1===i[3]&&(i.pop(),t="hsl("),t+i.join()+")"},toHexString:function(t){var i=this._rgba.slice(),s=i.pop();return t&&i.push(~~(255*s)),"#"+e.map(i,function(e){return e=(e||0).toString(16),1===e.length?"0"+e:e}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,u.hsla.to=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t,i,s=e[0]/255,n=e[1]/255,a=e[2]/255,o=e[3],r=Math.max(s,n,a),h=Math.min(s,n,a),l=r-h,u=r+h,d=.5*u;return t=h===r?0:s===r?60*(n-a)/l+360:n===r?60*(a-s)/l+120:60*(s-n)/l+240,i=0===l?0:.5>=d?l/u:l/(2-u),[Math.round(t)%360,i,d,null==o?1:o]},u.hsla.from=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t=e[0]/360,i=e[1],s=e[2],a=e[3],o=.5>=s?s*(1+i):s+i-s*i,r=2*s-o;return[Math.round(255*n(r,o,t+1/3)),Math.round(255*n(r,o,t)),Math.round(255*n(r,o,t-1/3)),a]},f(u,function(s,n){var a=n.props,o=n.cache,h=n.to,u=n.from;l.fn[s]=function(s){if(h&&!this[o]&&(this[o]=h(this._rgba)),s===t)return this[o].slice();var n,r=e.type(s),d="array"===r||"object"===r?s:arguments,c=this[o].slice();return f(a,function(e,t){var s=d["object"===r?e:t.idx];null==s&&(s=c[t.idx]),c[t.idx]=i(s,t)}),u?(n=l(u(c)),n[o]=c,n):l(c)},f(a,function(t,i){l.fn[t]||(l.fn[t]=function(n){var a,o=e.type(n),h="alpha"===t?this._hsla?"hsla":"rgba":s,l=this[h](),u=l[i.idx];return"undefined"===o?u:("function"===o&&(n=n.call(this,u),o=e.type(n)),null==n&&i.empty?this:("string"===o&&(a=r.exec(n),a&&(n=u+parseFloat(a[2])*("+"===a[1]?1:-1))),l[i.idx]=n,this[h](l)))})})}),l.hook=function(t){var i=t.split(" ");f(i,function(t,i){e.cssHooks[i]={set:function(t,n){var a,o,r="";if("transparent"!==n&&("string"!==e.type(n)||(a=s(n)))){if(n=l(a||n),!c.rgba&&1!==n._rgba[3]){for(o="backgroundColor"===i?t.parentNode:t;(""===r||"transparent"===r)&&o&&o.style;)try{r=e.css(o,"backgroundColor"),o=o.parentNode}catch(h){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{t.style[i]=n}catch(h){}}},e.fx.step[i]=function(t){t.colorInit||(t.start=l(t.elem,i),t.end=l(t.end),t.colorInit=!0),e.cssHooks[i].set(t.elem,t.start.transition(t.end,t.pos))}})},l.hook(o),e.cssHooks.borderColor={expand:function(e){var t={};return f(["Top","Right","Bottom","Left"],function(i,s){t["border"+s+"Color"]=e}),t}},a=e.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(b),function(){function t(t){var i,s,n=t.ownerDocument.defaultView?t.ownerDocument.defaultView.getComputedStyle(t,null):t.currentStyle,a={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(a[e.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(a[i]=n[i]);return a}function i(t,i){var s,a,o={};for(s in i)a=i[s],t[s]!==a&&(n[s]||(e.fx.step[s]||!isNaN(parseFloat(a)))&&(o[s]=a));return o}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};e.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,i){e.fx.step[i]=function(e){("none"!==e.end&&!e.setAttr||1===e.pos&&!e.setAttr)&&(b.style(e.elem,i,e.end),e.setAttr=!0)}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e.effects.animateClass=function(n,a,o,r){var h=e.speed(a,o,r);return this.queue(function(){var a,o=e(this),r=o.attr("class")||"",l=h.children?o.find("*").addBack():o;l=l.map(function(){var i=e(this);return{el:i,start:t(this)}}),a=function(){e.each(s,function(e,t){n[t]&&o[t+"Class"](n[t])})},a(),l=l.map(function(){return this.end=t(this.el[0]),this.diff=i(this.start,this.end),this}),o.attr("class",r),l=l.map(function(){var t=this,i=e.Deferred(),s=e.extend({},h,{queue:!1,complete:function(){i.resolve(t)}});return this.el.animate(this.diff,s),i.promise()}),e.when.apply(e,l.get()).done(function(){a(),e.each(arguments,function(){var t=this.el;e.each(this.diff,function(e){t.css(e,"")})}),h.complete.call(o[0])})})},e.fn.extend({addClass:function(t){return function(i,s,n,a){return s?e.effects.animateClass.call(this,{add:i},s,n,a):t.apply(this,arguments)}}(e.fn.addClass),removeClass:function(t){return function(i,s,n,a){return arguments.length>1?e.effects.animateClass.call(this,{remove:i},s,n,a):t.apply(this,arguments)}}(e.fn.removeClass),toggleClass:function(t){return function(i,s,n,a,o){return"boolean"==typeof s||void 0===s?n?e.effects.animateClass.call(this,s?{add:i}:{remove:i},n,a,o):t.apply(this,arguments):e.effects.animateClass.call(this,{toggle:i},s,n,a)}}(e.fn.toggleClass),switchClass:function(t,i,s,n,a){return e.effects.animateClass.call(this,{add:i,remove:t},s,n,a)}})}(),function(){function t(t,i,s,n){return e.isPlainObject(t)&&(i=t,t=t.effect),t={effect:t},null==i&&(i={}),e.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||e.fx.speeds[i])&&(n=s,s=i,i={}),e.isFunction(s)&&(n=s,s=null),i&&e.extend(t,i),s=s||i.duration,t.duration=e.fx.off?0:"number"==typeof s?s:s in e.fx.speeds?e.fx.speeds[s]:e.fx.speeds._default,t.complete=n||i.complete,t}function i(t){return!t||"number"==typeof t||e.fx.speeds[t]?!0:"string"!=typeof t||e.effects.effect[t]?e.isFunction(t)?!0:"object"!=typeof t||t.effect?!1:!0:!0}e.extend(e.effects,{version:"1.11.4",save:function(e,t){for(var i=0;t.length>i;i++)null!==t[i]&&e.data(y+t[i],e[0].style[t[i]])},restore:function(e,t){var i,s;for(s=0;t.length>s;s++)null!==t[s]&&(i=e.data(y+t[s]),void 0===i&&(i=""),e.css(t[s],i))},setMode:function(e,t){return"toggle"===t&&(t=e.is(":hidden")?"show":"hide"),t},getBaseline:function(e,t){var i,s;switch(e[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=e[0]/t.height}switch(e[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=e[1]/t.width}return{x:s,y:i}},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper"))return t.parent();var i={width:t.outerWidth(!0),height:t.outerHeight(!0),"float":t.css("float")},s=e("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:t.width(),height:t.height()},a=document.activeElement;try{a.id}catch(o){a=document.body}return t.wrap(s),(t[0]===a||e.contains(t[0],a))&&e(a).focus(),s=t.parent(),"static"===t.css("position")?(s.css({position:"relative"}),t.css({position:"relative"})):(e.extend(i,{position:t.css("position"),zIndex:t.css("z-index")}),e.each(["top","left","bottom","right"],function(e,s){i[s]=t.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(n),s.css(i).show()},removeWrapper:function(t){var i=document.activeElement;return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===i||e.contains(t[0],i))&&e(i).focus()),t},setTransition:function(t,i,s,n){return n=n||{},e.each(i,function(e,i){var a=t.cssUnit(i);a[0]>0&&(n[i]=a[0]*s+a[1])}),n}}),e.fn.extend({effect:function(){function i(t){function i(){e.isFunction(a)&&a.call(n[0]),e.isFunction(t)&&t()}var n=e(this),a=s.complete,r=s.mode;(n.is(":hidden")?"hide"===r:"show"===r)?(n[r](),i()):o.call(n[0],s,i)}var s=t.apply(this,arguments),n=s.mode,a=s.queue,o=e.effects.effect[s.effect];return e.fx.off||!o?n?this[n](s.duration,s.complete):this.each(function(){s.complete&&s.complete.call(this)}):a===!1?this.each(i):this.queue(a||"fx",i)},show:function(e){return function(s){if(i(s))return e.apply(this,arguments);var n=t.apply(this,arguments);return n.mode="show",this.effect.call(this,n)}}(e.fn.show),hide:function(e){return function(s){if(i(s))return e.apply(this,arguments);var n=t.apply(this,arguments);return n.mode="hide",this.effect.call(this,n)}}(e.fn.hide),toggle:function(e){return function(s){if(i(s)||"boolean"==typeof s)return e.apply(this,arguments);var n=t.apply(this,arguments);return n.mode="toggle",this.effect.call(this,n)}}(e.fn.toggle),cssUnit:function(t){var i=this.css(t),s=[];return e.each(["em","px","%","pt"],function(e,t){i.indexOf(t)>0&&(s=[parseFloat(i),t])}),s}})}(),function(){var t={};e.each(["Quad","Cubic","Quart","Quint","Expo"],function(e,i){t[i]=function(t){return Math.pow(t,e+2)}}),e.extend(t,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return 0===e||1===e?e:-Math.pow(2,8*(e-1))*Math.sin((80*(e-1)-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){for(var t,i=4;((t=Math.pow(2,--i))-1)/11>e;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*t-2)/22-e,2)}}),e.each(t,function(t,i){e.easing["easeIn"+t]=i,e.easing["easeOut"+t]=function(e){return 1-i(1-e)},e.easing["easeInOut"+t]=function(e){return.5>e?i(2*e)/2:1-i(-2*e+2)/2}})}(),e.effects,e.effects.effect.blind=function(t,i){var s,n,a,o=e(this),r=/up|down|vertical/,h=/up|left|vertical|horizontal/,l=["position","top","bottom","left","right","height","width"],u=e.effects.setMode(o,t.mode||"hide"),d=t.direction||"up",c=r.test(d),p=c?"height":"width",f=c?"top":"left",m=h.test(d),g={},v="show"===u;o.parent().is(".ui-effects-wrapper")?e.effects.save(o.parent(),l):e.effects.save(o,l),o.show(),s=e.effects.createWrapper(o).css({overflow:"hidden"}),n=s[p](),a=parseFloat(s.css(f))||0,g[p]=v?n:0,m||(o.css(c?"bottom":"right",0).css(c?"top":"left","auto").css({position:"absolute"}),g[f]=v?a:n+a),v&&(s.css(p,0),m||s.css(f,a+n)),s.animate(g,{duration:t.duration,easing:t.easing,queue:!1,complete:function(){"hide"===u&&o.hide(),e.effects.restore(o,l),e.effects.removeWrapper(o),i()}})},e.effects.effect.bounce=function(t,i){var s,n,a,o=e(this),r=["position","top","bottom","left","right","height","width"],h=e.effects.setMode(o,t.mode||"effect"),l="hide"===h,u="show"===h,d=t.direction||"up",c=t.distance,p=t.times||5,f=2*p+(u||l?1:0),m=t.duration/f,g=t.easing,v="up"===d||"down"===d?"top":"left",y="up"===d||"left"===d,b=o.queue(),_=b.length;for((u||l)&&r.push("opacity"),e.effects.save(o,r),o.show(),e.effects.createWrapper(o),c||(c=o["top"===v?"outerHeight":"outerWidth"]()/3),u&&(a={opacity:1},a[v]=0,o.css("opacity",0).css(v,y?2*-c:2*c).animate(a,m,g)),l&&(c/=Math.pow(2,p-1)),a={},a[v]=0,s=0;p>s;s++)n={},n[v]=(y?"-=":"+=")+c,o.animate(n,m,g).animate(a,m,g),c=l?2*c:c/2;l&&(n={opacity:0},n[v]=(y?"-=":"+=")+c,o.animate(n,m,g)),o.queue(function(){l&&o.hide(),e.effects.restore(o,r),e.effects.removeWrapper(o),i()}),_>1&&b.splice.apply(b,[1,0].concat(b.splice(_,f+1))),o.dequeue()},e.effects.effect.clip=function(t,i){var s,n,a,o=e(this),r=["position","top","bottom","left","right","height","width"],h=e.effects.setMode(o,t.mode||"hide"),l="show"===h,u=t.direction||"vertical",d="vertical"===u,c=d?"height":"width",p=d?"top":"left",f={};e.effects.save(o,r),o.show(),s=e.effects.createWrapper(o).css({overflow:"hidden"}),n="IMG"===o[0].tagName?s:o,a=n[c](),l&&(n.css(c,0),n.css(p,a/2)),f[c]=l?a:0,f[p]=l?0:a/2,n.animate(f,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){l||o.hide(),e.effects.restore(o,r),e.effects.removeWrapper(o),i()}})},e.effects.effect.drop=function(t,i){var s,n=e(this),a=["position","top","bottom","left","right","opacity","height","width"],o=e.effects.setMode(n,t.mode||"hide"),r="show"===o,h=t.direction||"left",l="up"===h||"down"===h?"top":"left",u="up"===h||"left"===h?"pos":"neg",d={opacity:r?1:0};e.effects.save(n,a),n.show(),e.effects.createWrapper(n),s=t.distance||n["top"===l?"outerHeight":"outerWidth"](!0)/2,r&&n.css("opacity",0).css(l,"pos"===u?-s:s),d[l]=(r?"pos"===u?"+=":"-=":"pos"===u?"-=":"+=")+s,n.animate(d,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){"hide"===o&&n.hide(),e.effects.restore(n,a),e.effects.removeWrapper(n),i()}})},e.effects.effect.explode=function(t,i){function s(){b.push(this),b.length===d*c&&n()}function n(){p.css({visibility:"visible"}),e(b).remove(),m||p.hide(),i()}var a,o,r,h,l,u,d=t.pieces?Math.round(Math.sqrt(t.pieces)):3,c=d,p=e(this),f=e.effects.setMode(p,t.mode||"hide"),m="show"===f,g=p.show().css("visibility","hidden").offset(),v=Math.ceil(p.outerWidth()/c),y=Math.ceil(p.outerHeight()/d),b=[];for(a=0;d>a;a++)for(h=g.top+a*y,u=a-(d-1)/2,o=0;c>o;o++)r=g.left+o*v,l=o-(c-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-o*v,top:-a*y}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:v,height:y,left:r+(m?l*v:0),top:h+(m?u*y:0),opacity:m?0:1}).animate({left:r+(m?0:l*v),top:h+(m?0:u*y),opacity:m?1:0},t.duration||500,t.easing,s)},e.effects.effect.fade=function(t,i){var s=e(this),n=e.effects.setMode(s,t.mode||"toggle");s.animate({opacity:n},{queue:!1,duration:t.duration,easing:t.easing,complete:i})},e.effects.effect.fold=function(t,i){var s,n,a=e(this),o=["position","top","bottom","left","right","height","width"],r=e.effects.setMode(a,t.mode||"hide"),h="show"===r,l="hide"===r,u=t.size||15,d=/([0-9]+)%/.exec(u),c=!!t.horizFirst,p=h!==c,f=p?["width","height"]:["height","width"],m=t.duration/2,g={},v={};e.effects.save(a,o),a.show(),s=e.effects.createWrapper(a).css({overflow:"hidden"}),n=p?[s.width(),s.height()]:[s.height(),s.width()],d&&(u=parseInt(d[1],10)/100*n[l?0:1]),h&&s.css(c?{height:0,width:u}:{height:u,width:0}),g[f[0]]=h?n[0]:u,v[f[1]]=h?n[1]:0,s.animate(g,m,t.easing).animate(v,m,t.easing,function(){l&&a.hide(),e.effects.restore(a,o),e.effects.removeWrapper(a),i()})},e.effects.effect.highlight=function(t,i){var s=e(this),n=["backgroundImage","backgroundColor","opacity"],a=e.effects.setMode(s,t.mode||"show"),o={backgroundColor:s.css("backgroundColor")};"hide"===a&&(o.opacity=0),e.effects.save(s,n),s.show().css({backgroundImage:"none",backgroundColor:t.color||"#ffff99"}).animate(o,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){"hide"===a&&s.hide(),e.effects.restore(s,n),i()}})},e.effects.effect.size=function(t,i){var s,n,a,o=e(this),r=["position","top","bottom","left","right","width","height","overflow","opacity"],h=["position","top","bottom","left","right","overflow","opacity"],l=["width","height","overflow"],u=["fontSize"],d=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],c=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],p=e.effects.setMode(o,t.mode||"effect"),f=t.restore||"effect"!==p,m=t.scale||"both",g=t.origin||["middle","center"],v=o.css("position"),y=f?r:h,b={height:0,width:0,outerHeight:0,outerWidth:0};"show"===p&&o.show(),s={height:o.height(),width:o.width(),outerHeight:o.outerHeight(),outerWidth:o.outerWidth()},"toggle"===t.mode&&"show"===p?(o.from=t.to||b,o.to=t.from||s):(o.from=t.from||("show"===p?b:s),o.to=t.to||("hide"===p?b:s)),a={from:{y:o.from.height/s.height,x:o.from.width/s.width},to:{y:o.to.height/s.height,x:o.to.width/s.width}},("box"===m||"both"===m)&&(a.from.y!==a.to.y&&(y=y.concat(d),o.from=e.effects.setTransition(o,d,a.from.y,o.from),o.to=e.effects.setTransition(o,d,a.to.y,o.to)),a.from.x!==a.to.x&&(y=y.concat(c),o.from=e.effects.setTransition(o,c,a.from.x,o.from),o.to=e.effects.setTransition(o,c,a.to.x,o.to))),("content"===m||"both"===m)&&a.from.y!==a.to.y&&(y=y.concat(u).concat(l),o.from=e.effects.setTransition(o,u,a.from.y,o.from),o.to=e.effects.setTransition(o,u,a.to.y,o.to)),e.effects.save(o,y),o.show(),e.effects.createWrapper(o),o.css("overflow","hidden").css(o.from),g&&(n=e.effects.getBaseline(g,s),o.from.top=(s.outerHeight-o.outerHeight())*n.y,o.from.left=(s.outerWidth-o.outerWidth())*n.x,o.to.top=(s.outerHeight-o.to.outerHeight)*n.y,o.to.left=(s.outerWidth-o.to.outerWidth)*n.x),o.css(o.from),("content"===m||"both"===m)&&(d=d.concat(["marginTop","marginBottom"]).concat(u),c=c.concat(["marginLeft","marginRight"]),l=r.concat(d).concat(c),o.find("*[width]").each(function(){var i=e(this),s={height:i.height(),width:i.width(),outerHeight:i.outerHeight(),outerWidth:i.outerWidth()};
f&&e.effects.save(i,l),i.from={height:s.height*a.from.y,width:s.width*a.from.x,outerHeight:s.outerHeight*a.from.y,outerWidth:s.outerWidth*a.from.x},i.to={height:s.height*a.to.y,width:s.width*a.to.x,outerHeight:s.height*a.to.y,outerWidth:s.width*a.to.x},a.from.y!==a.to.y&&(i.from=e.effects.setTransition(i,d,a.from.y,i.from),i.to=e.effects.setTransition(i,d,a.to.y,i.to)),a.from.x!==a.to.x&&(i.from=e.effects.setTransition(i,c,a.from.x,i.from),i.to=e.effects.setTransition(i,c,a.to.x,i.to)),i.css(i.from),i.animate(i.to,t.duration,t.easing,function(){f&&e.effects.restore(i,l)})})),o.animate(o.to,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){0===o.to.opacity&&o.css("opacity",o.from.opacity),"hide"===p&&o.hide(),e.effects.restore(o,y),f||("static"===v?o.css({position:"relative",top:o.to.top,left:o.to.left}):e.each(["top","left"],function(e,t){o.css(t,function(t,i){var s=parseInt(i,10),n=e?o.to.left:o.to.top;return"auto"===i?n+"px":s+n+"px"})})),e.effects.removeWrapper(o),i()}})},e.effects.effect.scale=function(t,i){var s=e(this),n=e.extend(!0,{},t),a=e.effects.setMode(s,t.mode||"effect"),o=parseInt(t.percent,10)||(0===parseInt(t.percent,10)?0:"hide"===a?0:100),r=t.direction||"both",h=t.origin,l={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()},u={y:"horizontal"!==r?o/100:1,x:"vertical"!==r?o/100:1};n.effect="size",n.queue=!1,n.complete=i,"effect"!==a&&(n.origin=h||["middle","center"],n.restore=!0),n.from=t.from||("show"===a?{height:0,width:0,outerHeight:0,outerWidth:0}:l),n.to={height:l.height*u.y,width:l.width*u.x,outerHeight:l.outerHeight*u.y,outerWidth:l.outerWidth*u.x},n.fade&&("show"===a&&(n.from.opacity=0,n.to.opacity=1),"hide"===a&&(n.from.opacity=1,n.to.opacity=0)),s.effect(n)},e.effects.effect.puff=function(t,i){var s=e(this),n=e.effects.setMode(s,t.mode||"hide"),a="hide"===n,o=parseInt(t.percent,10)||150,r=o/100,h={height:s.height(),width:s.width(),outerHeight:s.outerHeight(),outerWidth:s.outerWidth()};e.extend(t,{effect:"scale",queue:!1,fade:!0,mode:n,complete:i,percent:a?o:100,from:a?h:{height:h.height*r,width:h.width*r,outerHeight:h.outerHeight*r,outerWidth:h.outerWidth*r}}),s.effect(t)},e.effects.effect.pulsate=function(t,i){var s,n=e(this),a=e.effects.setMode(n,t.mode||"show"),o="show"===a,r="hide"===a,h=o||"hide"===a,l=2*(t.times||5)+(h?1:0),u=t.duration/l,d=0,c=n.queue(),p=c.length;for((o||!n.is(":visible"))&&(n.css("opacity",0).show(),d=1),s=1;l>s;s++)n.animate({opacity:d},u,t.easing),d=1-d;n.animate({opacity:d},u,t.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&c.splice.apply(c,[1,0].concat(c.splice(p,l+1))),n.dequeue()},e.effects.effect.shake=function(t,i){var s,n=e(this),a=["position","top","bottom","left","right","height","width"],o=e.effects.setMode(n,t.mode||"effect"),r=t.direction||"left",h=t.distance||20,l=t.times||3,u=2*l+1,d=Math.round(t.duration/u),c="up"===r||"down"===r?"top":"left",p="up"===r||"left"===r,f={},m={},g={},v=n.queue(),y=v.length;for(e.effects.save(n,a),n.show(),e.effects.createWrapper(n),f[c]=(p?"-=":"+=")+h,m[c]=(p?"+=":"-=")+2*h,g[c]=(p?"-=":"+=")+2*h,n.animate(f,d,t.easing),s=1;l>s;s++)n.animate(m,d,t.easing).animate(g,d,t.easing);n.animate(m,d,t.easing).animate(f,d/2,t.easing).queue(function(){"hide"===o&&n.hide(),e.effects.restore(n,a),e.effects.removeWrapper(n),i()}),y>1&&v.splice.apply(v,[1,0].concat(v.splice(y,u+1))),n.dequeue()},e.effects.effect.slide=function(t,i){var s,n=e(this),a=["position","top","bottom","left","right","width","height"],o=e.effects.setMode(n,t.mode||"show"),r="show"===o,h=t.direction||"left",l="up"===h||"down"===h?"top":"left",u="up"===h||"left"===h,d={};e.effects.save(n,a),n.show(),s=t.distance||n["top"===l?"outerHeight":"outerWidth"](!0),e.effects.createWrapper(n).css({overflow:"hidden"}),r&&n.css(l,u?isNaN(s)?"-"+s:-s:s),d[l]=(r?u?"+=":"-=":u?"-=":"+=")+s,n.animate(d,{queue:!1,duration:t.duration,easing:t.easing,complete:function(){"hide"===o&&n.hide(),e.effects.restore(n,a),e.effects.removeWrapper(n),i()}})},e.effects.effect.transfer=function(t,i){var s=e(this),n=e(t.to),a="fixed"===n.css("position"),o=e("body"),r=a?o.scrollTop():0,h=a?o.scrollLeft():0,l=n.offset(),u={top:l.top-r,left:l.left-h,height:n.innerHeight(),width:n.innerWidth()},d=s.offset(),c=e("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(t.className).css({top:d.top-r,left:d.left-h,height:s.innerHeight(),width:s.innerWidth(),position:a?"fixed":"absolute"}).animate(u,t.duration,t.easing,function(){c.remove(),i()})},e.widget("ui.progressbar",{version:"1.11.4",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(e){return void 0===e?this.options.value:(this.options.value=this._constrainedValue(e),this._refreshValue(),void 0)},_constrainedValue:function(e){return void 0===e&&(e=this.options.value),this.indeterminate=e===!1,"number"!=typeof e&&(e=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,e))},_setOptions:function(e){var t=e.value;delete e.value,this._super(e),this.options.value=this._constrainedValue(t),this._refreshValue()},_setOption:function(e,t){"max"===e&&(t=Math.max(this.min,t)),"disabled"===e&&this.element.toggleClass("ui-state-disabled",!!t).attr("aria-disabled",t),this._super(e,t)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var t=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||t>this.min).toggleClass("ui-corner-right",t===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=e("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":t}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==t&&(this.oldValue=t,this._trigger("change")),t===this.options.max&&this._trigger("complete")}}),e.widget("ui.selectable",e.ui.mouse,{version:"1.11.4",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var t,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){t=e(i.options.filter,i.element[0]),t.addClass("ui-selectee"),t.each(function(){var t=e(this),i=t.offset();e.data(this,"selectable-item",{element:this,$element:t,left:i.left,top:i.top,right:i.left+t.outerWidth(),bottom:i.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=t.addClass("ui-selectee"),this._mouseInit(),this.helper=e("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(t){var i=this,s=this.options;this.opos=[t.pageX,t.pageY],this.options.disabled||(this.selectees=e(s.filter,this.element[0]),this._trigger("start",t),e(s.appendTo).append(this.helper),this.helper.css({left:t.pageX,top:t.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=e.data(this,"selectable-item");s.startselected=!0,t.metaKey||t.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",t,{unselecting:s.element}))}),e(t.target).parents().addBack().each(function(){var s,n=e.data(this,"selectable-item");return n?(s=!t.metaKey&&!t.ctrlKey||!n.$element.hasClass("ui-selected"),n.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",t,{selecting:n.element}):i._trigger("unselecting",t,{unselecting:n.element}),!1):void 0}))},_mouseDrag:function(t){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,a=this.opos[0],o=this.opos[1],r=t.pageX,h=t.pageY;return a>r&&(i=r,r=a,a=i),o>h&&(i=h,h=o,o=i),this.helper.css({left:a,top:o,width:r-a,height:h-o}),this.selectees.each(function(){var i=e.data(this,"selectable-item"),l=!1;i&&i.element!==s.element[0]&&("touch"===n.tolerance?l=!(i.left>r||a>i.right||i.top>h||o>i.bottom):"fit"===n.tolerance&&(l=i.left>a&&r>i.right&&i.top>o&&h>i.bottom),l?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",t,{selecting:i.element}))):(i.selecting&&((t.metaKey||t.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",t,{unselecting:i.element}))),i.selected&&(t.metaKey||t.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",t,{unselecting:i.element})))))}),!1}},_mouseStop:function(t){var i=this;return this.dragged=!1,e(".ui-unselecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",t,{unselected:s.element})}),e(".ui-selecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",t,{selected:s.element})}),this._trigger("stop",t),this.helper.remove(),!1}}),e.widget("ui.selectmenu",{version:"1.11.4",defaultElement:"<select>",options:{appendTo:null,disabled:null,icons:{button:"ui-icon-triangle-1-s"},position:{my:"left top",at:"left bottom",collision:"none"},width:null,change:null,close:null,focus:null,open:null,select:null},_create:function(){var e=this.element.uniqueId().attr("id");this.ids={element:e,button:e+"-button",menu:e+"-menu"},this._drawButton(),this._drawMenu(),this.options.disabled&&this.disable()},_drawButton:function(){var t=this;this.label=e("label[for='"+this.ids.element+"']").attr("for",this.ids.button),this._on(this.label,{click:function(e){this.button.focus(),e.preventDefault()}}),this.element.hide(),this.button=e("<span>",{"class":"ui-selectmenu-button ui-widget ui-state-default ui-corner-all",tabindex:this.options.disabled?-1:0,id:this.ids.button,role:"combobox","aria-expanded":"false","aria-autocomplete":"list","aria-owns":this.ids.menu,"aria-haspopup":"true"}).insertAfter(this.element),e("<span>",{"class":"ui-icon "+this.options.icons.button}).prependTo(this.button),this.buttonText=e("<span>",{"class":"ui-selectmenu-text"}).appendTo(this.button),this._setText(this.buttonText,this.element.find("option:selected").text()),this._resizeButton(),this._on(this.button,this._buttonEvents),this.button.one("focusin",function(){t.menuItems||t._refreshMenu()}),this._hoverable(this.button),this._focusable(this.button)},_drawMenu:function(){var t=this;this.menu=e("<ul>",{"aria-hidden":"true","aria-labelledby":this.ids.button,id:this.ids.menu}),this.menuWrap=e("<div>",{"class":"ui-selectmenu-menu ui-front"}).append(this.menu).appendTo(this._appendTo()),this.menuInstance=this.menu.menu({role:"listbox",select:function(e,i){e.preventDefault(),t._setSelection(),t._select(i.item.data("ui-selectmenu-item"),e)},focus:function(e,i){var s=i.item.data("ui-selectmenu-item");null!=t.focusIndex&&s.index!==t.focusIndex&&(t._trigger("focus",e,{item:s}),t.isOpen||t._select(s,e)),t.focusIndex=s.index,t.button.attr("aria-activedescendant",t.menuItems.eq(s.index).attr("id"))}}).menu("instance"),this.menu.addClass("ui-corner-bottom").removeClass("ui-corner-all"),this.menuInstance._off(this.menu,"mouseleave"),this.menuInstance._closeOnDocumentClick=function(){return!1},this.menuInstance._isDivider=function(){return!1}},refresh:function(){this._refreshMenu(),this._setText(this.buttonText,this._getSelectedItem().text()),this.options.width||this._resizeButton()},_refreshMenu:function(){this.menu.empty();var e,t=this.element.find("option");t.length&&(this._parseOptions(t),this._renderMenu(this.menu,this.items),this.menuInstance.refresh(),this.menuItems=this.menu.find("li").not(".ui-selectmenu-optgroup"),e=this._getSelectedItem(),this.menuInstance.focus(null,e),this._setAria(e.data("ui-selectmenu-item")),this._setOption("disabled",this.element.prop("disabled")))},open:function(e){this.options.disabled||(this.menuItems?(this.menu.find(".ui-state-focus").removeClass("ui-state-focus"),this.menuInstance.focus(null,this._getSelectedItem())):this._refreshMenu(),this.isOpen=!0,this._toggleAttr(),this._resizeMenu(),this._position(),this._on(this.document,this._documentClick),this._trigger("open",e))},_position:function(){this.menuWrap.position(e.extend({of:this.button},this.options.position))},close:function(e){this.isOpen&&(this.isOpen=!1,this._toggleAttr(),this.range=null,this._off(this.document),this._trigger("close",e))},widget:function(){return this.button},menuWidget:function(){return this.menu},_renderMenu:function(t,i){var s=this,n="";e.each(i,function(i,a){a.optgroup!==n&&(e("<li>",{"class":"ui-selectmenu-optgroup ui-menu-divider"+(a.element.parent("optgroup").prop("disabled")?" ui-state-disabled":""),text:a.optgroup}).appendTo(t),n=a.optgroup),s._renderItemData(t,a)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-selectmenu-item",t)},_renderItem:function(t,i){var s=e("<li>");return i.disabled&&s.addClass("ui-state-disabled"),this._setText(s,i.label),s.appendTo(t)},_setText:function(e,t){t?e.text(t):e.html("&#160;")},_move:function(e,t){var i,s,n=".ui-menu-item";this.isOpen?i=this.menuItems.eq(this.focusIndex):(i=this.menuItems.eq(this.element[0].selectedIndex),n+=":not(.ui-state-disabled)"),s="first"===e||"last"===e?i["first"===e?"prevAll":"nextAll"](n).eq(-1):i[e+"All"](n).eq(0),s.length&&this.menuInstance.focus(t,s)},_getSelectedItem:function(){return this.menuItems.eq(this.element[0].selectedIndex)},_toggle:function(e){this[this.isOpen?"close":"open"](e)},_setSelection:function(){var e;this.range&&(window.getSelection?(e=window.getSelection(),e.removeAllRanges(),e.addRange(this.range)):this.range.select(),this.button.focus())},_documentClick:{mousedown:function(t){this.isOpen&&(e(t.target).closest(".ui-selectmenu-menu, #"+this.ids.button).length||this.close(t))}},_buttonEvents:{mousedown:function(){var e;window.getSelection?(e=window.getSelection(),e.rangeCount&&(this.range=e.getRangeAt(0))):this.range=document.selection.createRange()},click:function(e){this._setSelection(),this._toggle(e)},keydown:function(t){var i=!0;switch(t.keyCode){case e.ui.keyCode.TAB:case e.ui.keyCode.ESCAPE:this.close(t),i=!1;break;case e.ui.keyCode.ENTER:this.isOpen&&this._selectFocusedItem(t);break;case e.ui.keyCode.UP:t.altKey?this._toggle(t):this._move("prev",t);break;case e.ui.keyCode.DOWN:t.altKey?this._toggle(t):this._move("next",t);break;case e.ui.keyCode.SPACE:this.isOpen?this._selectFocusedItem(t):this._toggle(t);break;case e.ui.keyCode.LEFT:this._move("prev",t);break;case e.ui.keyCode.RIGHT:this._move("next",t);break;case e.ui.keyCode.HOME:case e.ui.keyCode.PAGE_UP:this._move("first",t);break;case e.ui.keyCode.END:case e.ui.keyCode.PAGE_DOWN:this._move("last",t);break;default:this.menu.trigger(t),i=!1}i&&t.preventDefault()}},_selectFocusedItem:function(e){var t=this.menuItems.eq(this.focusIndex);t.hasClass("ui-state-disabled")||this._select(t.data("ui-selectmenu-item"),e)},_select:function(e,t){var i=this.element[0].selectedIndex;this.element[0].selectedIndex=e.index,this._setText(this.buttonText,e.label),this._setAria(e),this._trigger("select",t,{item:e}),e.index!==i&&this._trigger("change",t,{item:e}),this.close(t)},_setAria:function(e){var t=this.menuItems.eq(e.index).attr("id");this.button.attr({"aria-labelledby":t,"aria-activedescendant":t}),this.menu.attr("aria-activedescendant",t)},_setOption:function(e,t){"icons"===e&&this.button.find("span.ui-icon").removeClass(this.options.icons.button).addClass(t.button),this._super(e,t),"appendTo"===e&&this.menuWrap.appendTo(this._appendTo()),"disabled"===e&&(this.menuInstance.option("disabled",t),this.button.toggleClass("ui-state-disabled",t).attr("aria-disabled",t),this.element.prop("disabled",t),t?(this.button.attr("tabindex",-1),this.close()):this.button.attr("tabindex",0)),"width"===e&&this._resizeButton()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?e(t):this.document.find(t).eq(0)),t&&t[0]||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_toggleAttr:function(){this.button.toggleClass("ui-corner-top",this.isOpen).toggleClass("ui-corner-all",!this.isOpen).attr("aria-expanded",this.isOpen),this.menuWrap.toggleClass("ui-selectmenu-open",this.isOpen),this.menu.attr("aria-hidden",!this.isOpen)},_resizeButton:function(){var e=this.options.width;e||(e=this.element.show().outerWidth(),this.element.hide()),this.button.outerWidth(e)},_resizeMenu:function(){this.menu.outerWidth(Math.max(this.button.outerWidth(),this.menu.width("").outerWidth()+1))},_getCreateOptions:function(){return{disabled:this.element.prop("disabled")}},_parseOptions:function(t){var i=[];t.each(function(t,s){var n=e(s),a=n.parent("optgroup");i.push({element:n,index:t,value:n.val(),label:n.text(),optgroup:a.attr("label")||"",disabled:a.prop("disabled")||n.prop("disabled")})}),this.items=i},_destroy:function(){this.menuWrap.remove(),this.button.remove(),this.element.show(),this.element.removeUniqueId(),this.label.attr("for",this.ids.element)}}),e.widget("ui.slider",e.ui.mouse,{version:"1.11.4",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},numPages:5,_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this._calculateNewMax(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var t,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),a="<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",o=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),t=n.length;i>t;t++)o.push(a);this.handles=n.add(e(o.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)})},_createRange:function(){var t=this.options,i="";t.range?(t.range===!0&&(t.values?t.values.length&&2!==t.values.length?t.values=[t.values[0],t.values[0]]:e.isArray(t.values)&&(t.values=t.values.slice(0)):t.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=e("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===t.range||"max"===t.range?" ui-slider-range-"+t.range:""))):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){this._off(this.handles),this._on(this.handles,this._handleEvents),this._hoverable(this.handles),this._focusable(this.handles)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var i,s,n,a,o,r,h,l,u=this,d=this.options;return d.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:t.pageX,y:t.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var i=Math.abs(s-u.values(t));(n>i||n===i&&(t===u._lastChangedValue||u.values(t)===d.min))&&(n=i,a=e(this),o=t)}),r=this._start(t,o),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,a.addClass("ui-state-active").focus(),h=a.offset(),l=!e(t.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:t.pageX-h.left-a.width()/2,top:t.pageY-h.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,o,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,i),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,i,s,n,a;return"horizontal"===this.orientation?(t=this.elementSize.width,i=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,i=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/t,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),a=this._valueMin()+s*n,this._trimAlignValue(a)},_start:function(e,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",e,i)},_slide:function(e,t,i){var s,n,a;this.options.values&&this.options.values.length?(s=this.values(t?0:1),2===this.options.values.length&&this.options.range===!0&&(0===t&&i>s||1===t&&s>i)&&(i=s),i!==this.values(t)&&(n=this.values(),n[t]=i,a=this._trigger("slide",e,{handle:this.handles[t],value:i,values:n}),s=this.values(t?0:1),a!==!1&&this.values(t,i))):i!==this.value()&&(a=this._trigger("slide",e,{handle:this.handles[t],value:i}),a!==!1&&this.value(i))},_stop:function(e,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("stop",e,i)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._lastChangedValue=t,this._trigger("change",e,i)}},value:function(e){return arguments.length?(this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0),void 0):this._value()},values:function(t,i){var s,n,a;if(arguments.length>1)return this.options.values[t]=this._trimAlignValue(i),this._refreshValue(),this._change(null,t),void 0;if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();for(s=this.options.values,n=arguments[0],a=0;s.length>a;a+=1)s[a]=this._trimAlignValue(n[a]),this._change(null,a);this._refreshValue()},_setOption:function(t,i){var s,n=0;switch("range"===t&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),e.isArray(this.options.values)&&(n=this.options.values.length),"disabled"===t&&this.element.toggleClass("ui-state-disabled",!!i),this._super(t,i),t){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue(),this.handles.css("horizontal"===i?"bottom":"left","");break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"step":case"min":case"max":this._animateOff=!0,this._calculateNewMax(),this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_values:function(e){var t,i,s;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(e){if(this._valueMin()>=e)return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=i>0?t:-t),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var e=this.options.max,t=this._valueMin(),i=this.options.step,s=Math.floor(+(e-t).toFixed(this._precision())/i)*i;e=s+t,this.max=parseFloat(e.toFixed(this._precision()))},_precision:function(){var e=this._precisionOf(this.options.step);return null!==this.options.min&&(e=Math.max(e,this._precisionOf(this.options.min))),e},_precisionOf:function(e){var t=""+e,i=t.indexOf(".");return-1===i?0:t.length-i-1},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_refreshValue:function(){var t,i,s,n,a,o=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),u["horizontal"===h.orientation?"left":"bottom"]=i+"%",e(this).stop(1,1)[l?"animate":"css"](u,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-t+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-t+"%"},{queue:!1,duration:r.animate}))),t=i}):(s=this.value(),n=this._valueMin(),a=this._valueMax(),i=a!==n?100*((s-n)/(a-n)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](u,r.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===o&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===o&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(t){var i,s,n,a,o=e(t.target).data("ui-slider-handle-index");switch(t.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(t.preventDefault(),!this._keySliding&&(this._keySliding=!0,e(t.target).addClass("ui-state-active"),i=this._start(t,o),i===!1))return}switch(a=this.options.step,s=n=this.options.values&&this.options.values.length?this.values(o):this.value(),t.keyCode){case e.ui.keyCode.HOME:n=this._valueMin();break;case e.ui.keyCode.END:n=this._valueMax();break;case e.ui.keyCode.PAGE_UP:n=this._trimAlignValue(s+(this._valueMax()-this._valueMin())/this.numPages);break;case e.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(s-(this._valueMax()-this._valueMin())/this.numPages);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(s===this._valueMax())return;n=this._trimAlignValue(s+a);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(s===this._valueMin())return;n=this._trimAlignValue(s-a)}this._slide(t,o,n)},keyup:function(t){var i=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,i),this._change(t,i),e(t.target).removeClass("ui-state-active"))}}}),e.widget("ui.sortable",e.ui.mouse,{version:"1.11.4",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(e,t,i){return e>=t&&t+i>e},_isFloating:function(e){return/left|right/.test(e.css("float"))||/inline|table-cell/.test(e.css("display"))},_create:function(){this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(e,t){this._super(e,t),"handle"===e&&this._setHandleClassName()},_setHandleClassName:function(){this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle"),e.each(this.items,function(){(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item).addClass("ui-sortable-handle")})},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle"),this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(t,i){var s=null,n=!1,a=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(t),e(t.target).parents().each(function(){return e.data(this,a.widgetName+"-item")===a?(s=e(this),!1):void 0}),e.data(t.target,a.widgetName+"-item")===a&&(s=e(t.target)),s?!this.options.handle||i||(e(this.options.handle,s).find("*").addBack().each(function(){this===t.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(t,i,s){var n,a,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(a=this.document.find("body"),this.storedCursor=a.css("cursor"),a.css("cursor",o.cursor),this.storedStylesheet=e("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(a)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",t,this._uiHash(this));
return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!o.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){var i,s,n,a,o=this.options,r=!1;for(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:t.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:t.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(t.pageY-this.document.scrollTop()<o.scrollSensitivity?r=this.document.scrollTop(this.document.scrollTop()-o.scrollSpeed):this.window.height()-(t.pageY-this.document.scrollTop())<o.scrollSensitivity&&(r=this.document.scrollTop(this.document.scrollTop()+o.scrollSpeed)),t.pageX-this.document.scrollLeft()<o.scrollSensitivity?r=this.document.scrollLeft(this.document.scrollLeft()-o.scrollSpeed):this.window.width()-(t.pageX-this.document.scrollLeft())<o.scrollSensitivity&&(r=this.document.scrollLeft(this.document.scrollLeft()+o.scrollSpeed))),r!==!1&&e.ui.ddmanager&&!o.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],a=this._intersectsWithPointer(s),a&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===a?"next":"prev"]()[0]!==n&&!e.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!e.contains(this.element[0],n):!0)){if(this.direction=1===a?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(t,s),this._trigger("change",t,this._uiHash());break}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,i){if(t){if(e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t),this.options.revert){var s=this,n=this.placeholder.offset(),a=this.options.axis,o={};a&&"x"!==a||(o.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollLeft)),a&&"y"!==a||(o.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,e(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(t)})}else this._clear(t,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},e(i).each(function(){var i=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[\-=_](.+)/);i&&s.push((t.key||i[1]+"[]")+"="+(t.key&&t.expression?i[1]:i[2]))}),!s.length&&t.key&&s.push(t.key+"="),s.join("&")},toArray:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},i.each(function(){s.push(e(t.item||this).attr(t.attribute||"id")||"")}),s},_intersectsWith:function(e){var t=this.positionAbs.left,i=t+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,a=e.left,o=a+e.width,r=e.top,h=r+e.height,l=this.offset.click.top,u=this.offset.click.left,d="x"===this.options.axis||s+l>r&&h>s+l,c="y"===this.options.axis||t+u>a&&o>t+u,p=d&&c;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?p:t+this.helperProportions.width/2>a&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>n-this.helperProportions.height/2},_intersectsWithPointer:function(e){var t="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,e.top,e.height),i="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,e.left,e.width),s=t&&i,n=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return s?this.floating?a&&"right"===a||"down"===n?2:1:n&&("down"===n?2:1):!1},_intersectsWithSides:function(e){var t=this._isOverAxis(this.positionAbs.top+this.offset.click.top,e.top+e.height/2,e.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,e.left+e.width/2,e.width),s=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&i||"left"===n&&!i:s&&("down"===s&&t||"up"===s&&!t)},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return 0!==e&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return 0!==e&&(e>0?"right":"left")},refresh:function(e){return this._refreshItems(e),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var e=this.options;return e.connectWith.constructor===String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){function i(){r.push(this)}var s,n,a,o,r=[],h=[],l=this._connectWith();if(l&&t)for(s=l.length-1;s>=0;s--)for(a=e(l[s],this.document[0]),n=a.length-1;n>=0;n--)o=e.data(a[n],this.widgetFullName),o&&o!==this&&!o.options.disabled&&h.push([e.isFunction(o.options.items)?o.options.items.call(o.element):e(o.options.items,o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),o]);for(h.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=h.length-1;s>=0;s--)h[s][0].each(i);return e(r)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=e.grep(this.items,function(e){for(var i=0;t.length>i;i++)if(t[i]===e.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[],this.containers=[this];var i,s,n,a,o,r,h,l,u=this.items,d=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],c=this._connectWith();if(c&&this.ready)for(i=c.length-1;i>=0;i--)for(n=e(c[i],this.document[0]),s=n.length-1;s>=0;s--)a=e.data(n[s],this.widgetFullName),a&&a!==this&&!a.options.disabled&&(d.push([e.isFunction(a.options.items)?a.options.items.call(a.element[0],t,{item:this.currentItem}):e(a.options.items,a.element),a]),this.containers.push(a));for(i=d.length-1;i>=0;i--)for(o=d[i][1],r=d[i][0],s=0,l=r.length;l>s;s++)h=e(r[s]),h.data(this.widgetName+"-item",o),u.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(t){this.floating=this.items.length?"x"===this.options.axis||this._isFloating(this.items[0].item):!1,this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,a;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?e(this.options.toleranceElement,s.item):s.item,t||(s.width=n.outerWidth(),s.height=n.outerHeight()),a=n.offset(),s.left=a.left,s.top=a.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)a=this.containers[i].element.offset(),this.containers[i].containerCache.left=a.left,this.containers[i].containerCache.top=a.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(t){t=t||this;var i,s=t.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=t.currentItem[0].nodeName.toLowerCase(),n=e("<"+s+">",t.document[0]).addClass(i||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tbody"===s?t._createTrPlaceholder(t.currentItem.find("tr").eq(0),e("<tr>",t.document[0]).appendTo(n)):"tr"===s?t._createTrPlaceholder(t.currentItem,n):"img"===s&&n.attr("src",t.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(e,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10)))}}),t.placeholder=e(s.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),s.placeholder.update(t,t.placeholder)},_createTrPlaceholder:function(t,i){var s=this;t.children().each(function(){e("<td>&#160;</td>",s.document[0]).attr("colspan",e(this).attr("colspan")||1).appendTo(i)})},_contactContainers:function(t){var i,s,n,a,o,r,h,l,u,d,c=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!e.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(c&&e.contains(this.containers[i].element[0],c.element[0]))continue;c=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",t,this._uiHash(this)),this.containers[i].containerCache.over=0);if(c)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",t,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(n=1e4,a=null,u=c.floating||this._isFloating(this.currentItem),o=u?"left":"top",r=u?"width":"height",d=u?"clientX":"clientY",s=this.items.length-1;s>=0;s--)e.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(h=this.items[s].item.offset()[o],l=!1,t[d]-h>this.items[s][r]/2&&(l=!0),n>Math.abs(t[d]-h)&&(n=Math.abs(t[d]-h),a=this.items[s],this.direction=l?"up":"down"));if(!a&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return this.currentContainer.containerCache.over||(this.containers[p]._trigger("over",t,this._uiHash()),this.currentContainer.containerCache.over=1),void 0;a?this._rearrange(t,a,null,!0):this._rearrange(t,null,this.containers[p].element,!0),this._trigger("change",t,this._uiHash()),this.containers[p]._trigger("change",t,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",t,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||e("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==this.document[0]&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===this.document[0].body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,"document"===n.containment?this.document.width():this.window.width()-this.helperProportions.width-this.margins.left,("document"===n.containment?this.document.width():this.window.height()||this.document[0].body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(t=e(n.containment)[0],i=e(n.containment).offset(),s="hidden"!==e(t).css("overflow"),this.containment=[i.left+(parseInt(e(t).css("borderLeftWidth"),10)||0)+(parseInt(e(t).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(e(t).css("borderTopWidth"),10)||0)+(parseInt(e(t).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(e(t).css("borderLeftWidth"),10)||0)-(parseInt(e(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(e(t).css("borderTopWidth"),10)||0)-(parseInt(e(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,a=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():a?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():a?0:n.scrollLeft())*s}},_generatePosition:function(t){var i,s,n=this.options,a=t.pageX,o=t.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(a=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(a=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/n.grid[1])*n.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((a-this.originalPageX)/n.grid[0])*n.grid[0],a=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:a-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(e,t,i,s){i?i[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(e,t){function i(e,t,i){return function(s){i._trigger(e,s,t._uiHash(t))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!t&&n.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||t||n.push(function(e){this._trigger("update",e,this._uiHash())}),this!==this.currentContainer&&(t||(n.push(function(e){this._trigger("remove",e,this._uiHash())}),n.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)t||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,t||this._trigger("beforeStop",e,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.cancelHelperRemoval||(this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null),!t){for(s=0;n.length>s;s++)n[s].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!this.cancelHelperRemoval},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var i=t||this;return{helper:i.helper,placeholder:i.placeholder||e([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:t?t.element:null}}}),e.widget("ui.spinner",{version:"1.11.4",defaultElement:"<input>",widgetEventPrefix:"spin",options:{culture:null,icons:{down:"ui-icon-triangle-1-s",up:"ui-icon-triangle-1-n"},incremental:!0,max:null,min:null,numberFormat:null,page:10,step:1,change:null,spin:null,start:null,stop:null},_create:function(){this._setOption("max",this.options.max),this._setOption("min",this.options.min),this._setOption("step",this.options.step),""!==this.value()&&this._value(this.element.val(),!0),this._draw(),this._on(this._events),this._refresh(),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_getCreateOptions:function(){var t={},i=this.element;return e.each(["min","max","step"],function(e,s){var n=i.attr(s);void 0!==n&&n.length&&(t[s]=n)}),t},_events:{keydown:function(e){this._start(e)&&this._keydown(e)&&e.preventDefault()},keyup:"_stop",focus:function(){this.previous=this.element.val()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,void 0):(this._stop(),this._refresh(),this.previous!==this.element.val()&&this._trigger("change",e),void 0)},mousewheel:function(e,t){if(t){if(!this.spinning&&!this._start(e))return!1;this._spin((t>0?1:-1)*this.options.step,e),clearTimeout(this.mousewheelTimer),this.mousewheelTimer=this._delay(function(){this.spinning&&this._stop(e)},100),e.preventDefault()}},"mousedown .ui-spinner-button":function(t){function i(){var e=this.element[0]===this.document[0].activeElement;e||(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s}))}var s;s=this.element[0]===this.document[0].activeElement?this.previous:this.element.val(),t.preventDefault(),i.call(this),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur,i.call(this)}),this._start(t)!==!1&&this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t)},"mouseup .ui-spinner-button":"_stop","mouseenter .ui-spinner-button":function(t){return e(t.currentTarget).hasClass("ui-state-active")?this._start(t)===!1?!1:(this._repeat(null,e(t.currentTarget).hasClass("ui-spinner-up")?1:-1,t),void 0):void 0},"mouseleave .ui-spinner-button":"_stop"},_draw:function(){var e=this.uiSpinner=this.element.addClass("ui-spinner-input").attr("autocomplete","off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());this.element.attr("role","spinbutton"),this.buttons=e.find(".ui-spinner-button").attr("tabIndex",-1).button().removeClass("ui-corner-all"),this.buttons.height()>Math.ceil(.5*e.height())&&e.height()>0&&e.height(e.height()),this.options.disabled&&this.disable()},_keydown:function(t){var i=this.options,s=e.ui.keyCode;switch(t.keyCode){case s.UP:return this._repeat(null,1,t),!0;case s.DOWN:return this._repeat(null,-1,t),!0;case s.PAGE_UP:return this._repeat(null,i.page,t),!0;case s.PAGE_DOWN:return this._repeat(null,-i.page,t),!0}return!1},_uiSpinnerHtml:function(){return"<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"},_buttonHtml:function(){return"<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon "+this.options.icons.up+"'>&#9650;</span>"+"</a>"+"<a class='ui-spinner-button ui-spinner-down ui-corner-br'>"+"<span class='ui-icon "+this.options.icons.down+"'>&#9660;</span>"+"</a>"},_start:function(e){return this.spinning||this._trigger("start",e)!==!1?(this.counter||(this.counter=1),this.spinning=!0,!0):!1},_repeat:function(e,t,i){e=e||500,clearTimeout(this.timer),this.timer=this._delay(function(){this._repeat(40,t,i)},e),this._spin(t*this.options.step,i)},_spin:function(e,t){var i=this.value()||0;this.counter||(this.counter=1),i=this._adjustValue(i+e*this._increment(this.counter)),this.spinning&&this._trigger("spin",t,{value:i})===!1||(this._value(i),this.counter++)},_increment:function(t){var i=this.options.incremental;return i?e.isFunction(i)?i(t):Math.floor(t*t*t/5e4-t*t/500+17*t/200+1):1},_precision:function(){var e=this._precisionOf(this.options.step);return null!==this.options.min&&(e=Math.max(e,this._precisionOf(this.options.min))),e},_precisionOf:function(e){var t=""+e,i=t.indexOf(".");return-1===i?0:t.length-i-1},_adjustValue:function(e){var t,i,s=this.options;return t=null!==s.min?s.min:0,i=e-t,i=Math.round(i/s.step)*s.step,e=t+i,e=parseFloat(e.toFixed(this._precision())),null!==s.max&&e>s.max?s.max:null!==s.min&&s.min>e?s.min:e},_stop:function(e){this.spinning&&(clearTimeout(this.timer),clearTimeout(this.mousewheelTimer),this.counter=0,this.spinning=!1,this._trigger("stop",e))},_setOption:function(e,t){if("culture"===e||"numberFormat"===e){var i=this._parse(this.element.val());return this.options[e]=t,this.element.val(this._format(i)),void 0}("max"===e||"min"===e||"step"===e)&&"string"==typeof t&&(t=this._parse(t)),"icons"===e&&(this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(t.up),this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(t.down)),this._super(e,t),"disabled"===e&&(this.widget().toggleClass("ui-state-disabled",!!t),this.element.prop("disabled",!!t),this.buttons.button(t?"disable":"enable"))},_setOptions:h(function(e){this._super(e)}),_parse:function(e){return"string"==typeof e&&""!==e&&(e=window.Globalize&&this.options.numberFormat?Globalize.parseFloat(e,10,this.options.culture):+e),""===e||isNaN(e)?null:e},_format:function(e){return""===e?"":window.Globalize&&this.options.numberFormat?Globalize.format(e,this.options.numberFormat,this.options.culture):e},_refresh:function(){this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":this._parse(this.element.val())})},isValid:function(){var e=this.value();return null===e?!1:e===this._adjustValue(e)},_value:function(e,t){var i;""!==e&&(i=this._parse(e),null!==i&&(t||(i=this._adjustValue(i)),e=this._format(i))),this.element.val(e),this._refresh()},_destroy:function(){this.element.removeClass("ui-spinner-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.uiSpinner.replaceWith(this.element)},stepUp:h(function(e){this._stepUp(e)}),_stepUp:function(e){this._start()&&(this._spin((e||1)*this.options.step),this._stop())},stepDown:h(function(e){this._stepDown(e)}),_stepDown:function(e){this._start()&&(this._spin((e||1)*-this.options.step),this._stop())},pageUp:h(function(e){this._stepUp((e||1)*this.options.page)}),pageDown:h(function(e){this._stepDown((e||1)*this.options.page)}),value:function(e){return arguments.length?(h(this._value).call(this,e),void 0):this._parse(this.element.val())},widget:function(){return this.uiSpinner}}),e.widget("ui.tabs",{version:"1.11.4",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_isLocal:function(){var e=/#.*$/;return function(t){var i,s;t=t.cloneNode(!1),i=t.href.replace(e,""),s=location.href.replace(e,"");try{i=decodeURIComponent(i)}catch(n){}try{s=decodeURIComponent(s)}catch(n){}return t.hash.length>1&&i===s}}(),_create:function(){var t=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible),this._processTabs(),i.active=this._initialActive(),e.isArray(i.disabled)&&(i.disabled=e.unique(i.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):e(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var t=this.options.active,i=this.options.collapsible,s=location.hash.substring(1);return null===t&&(s&&this.tabs.each(function(i,n){return e(n).attr("aria-controls")===s?(t=i,!1):void 0}),null===t&&(t=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===t||-1===t)&&(t=this.tabs.length?0:!1)),t!==!1&&(t=this.tabs.index(this.tabs.eq(t)),-1===t&&(t=i?!1:0)),!i&&t===!1&&this.anchors.length&&(t=0),t},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(t){var i=e(this.document[0].activeElement).closest("li"),s=this.tabs.index(i),n=!0;if(!this._handlePageNav(t)){switch(t.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:s++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:n=!1,s--;break;case e.ui.keyCode.END:s=this.anchors.length-1;break;case e.ui.keyCode.HOME:s=0;break;case e.ui.keyCode.SPACE:return t.preventDefault(),clearTimeout(this.activating),this._activate(s),void 0;case e.ui.keyCode.ENTER:return t.preventDefault(),clearTimeout(this.activating),this._activate(s===this.options.active?!1:s),void 0;default:return}t.preventDefault(),clearTimeout(this.activating),s=this._focusNextTab(s,n),t.ctrlKey||t.metaKey||(i.attr("aria-selected","false"),this.tabs.eq(s).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",s)},this.delay))}},_panelKeydown:function(t){this._handlePageNav(t)||t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(t){return t.altKey&&t.keyCode===e.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):t.altKey&&t.keyCode===e.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):void 0},_findNextTab:function(t,i){function s(){return t>n&&(t=0),0>t&&(t=n),t}for(var n=this.tabs.length-1;-1!==e.inArray(s(),this.options.disabled);)t=i?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,t){return"active"===e?(this._activate(t),void 0):"disabled"===e?(this._setupDisabled(t),void 0):(this._super(e,t),"collapsible"===e&&(this.element.toggleClass("ui-tabs-collapsible",t),t||this.options.active!==!1||this._activate(0)),"event"===e&&this._setupEvents(t),"heightStyle"===e&&this._setupHeightStyle(t),void 0)},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,i=this.tablist.children(":has(a[href])");t.disabled=e.map(i.filter(".ui-state-disabled"),function(e){return i.index(e)}),this._processTabs(),t.active!==!1&&this.anchors.length?this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active):(t.active=!1,this.active=e()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false","aria-expanded":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this,i=this.tabs,s=this.anchors,n=this.panels;
this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist").delegate("> li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(i,s){var n,a,o,r=e(s).uniqueId().attr("id"),h=e(s).closest("li"),l=h.attr("aria-controls");t._isLocal(s)?(n=s.hash,o=n.substring(1),a=t.element.find(t._sanitizeSelector(n))):(o=h.attr("aria-controls")||e({}).uniqueId()[0].id,n="#"+o,a=t.element.find(n),a.length||(a=t._createPanel(o),a.insertAfter(t.panels[i-1]||t.tablist)),a.attr("aria-live","polite")),a.length&&(t.panels=t.panels.add(a)),l&&h.data("ui-tabs-aria-controls",l),h.attr({"aria-controls":o,"aria-labelledby":r}),a.attr("aria-labelledby",r)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel"),i&&(this._off(i.not(this.tabs)),this._off(s.not(this.anchors)),this._off(n.not(this.panels)))},_getList:function(){return this.tablist||this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var i,s=0;i=this.tabs[s];s++)t===!0||-1!==e.inArray(s,t)?e(i).addClass("ui-state-disabled").attr("aria-disabled","true"):e(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var i={};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(!0,this.anchors,{click:function(e){e.preventDefault()}}),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var i,s=this.element.parent();"fill"===t?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),s=t.css("position");"absolute"!==s&&"fixed"!==s&&(i-=t.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===t&&(i=0,this.panels.each(function(){i=Math.max(i,e(this).height("").height())}).height(i))},_eventHandler:function(t){var i=this.options,s=this.active,n=e(t.currentTarget),a=n.closest("li"),o=a[0]===s[0],r=o&&i.collapsible,h=r?e():this._getPanelForTab(a),l=s.length?this._getPanelForTab(s):e(),u={oldTab:s,oldPanel:l,newTab:r?e():a,newPanel:h};t.preventDefault(),a.hasClass("ui-state-disabled")||a.hasClass("ui-tabs-loading")||this.running||o&&!i.collapsible||this._trigger("beforeActivate",t,u)===!1||(i.active=r?!1:this.tabs.index(a),this.active=o?e():a,this.xhr&&this.xhr.abort(),l.length||h.length||e.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(a),t),this._toggle(t,u))},_toggle:function(t,i){function s(){a.running=!1,a._trigger("activate",t,i)}function n(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),o.length&&a.options.show?a._show(o,a.options.show,s):(o.show(),s())}var a=this,o=i.newPanel,r=i.oldPanel;this.running=!0,r.length&&this.options.hide?this._hide(r,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),n()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),r.hide(),n()),r.attr("aria-hidden","true"),i.oldTab.attr({"aria-selected":"false","aria-expanded":"false"}),o.length&&r.length?i.oldTab.attr("tabIndex",-1):o.length&&this.tabs.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),o.attr("aria-hidden","false"),i.newTab.attr({"aria-selected":"true","aria-expanded":"true",tabIndex:0})},_activate:function(t){var i,s=this._findActive(t);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tablist.unbind(this.eventNamespace),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),i=t.data("ui-tabs-aria-controls");i?t.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(t){var i=this.options.disabled;i!==!1&&(void 0===t?i=!1:(t=this._getIndex(t),i=e.isArray(i)?e.map(i,function(e){return e!==t?e:null}):e.map(this.tabs,function(e,i){return i!==t?i:null})),this._setupDisabled(i))},disable:function(t){var i=this.options.disabled;if(i!==!0){if(void 0===t)i=!0;else{if(t=this._getIndex(t),-1!==e.inArray(t,i))return;i=e.isArray(i)?e.merge([t],i).sort():[t]}this._setupDisabled(i)}},load:function(t,i){t=this._getIndex(t);var s=this,n=this.tabs.eq(t),a=n.find(".ui-tabs-anchor"),o=this._getPanelForTab(n),r={tab:n,panel:o},h=function(e,t){"abort"===t&&s.panels.stop(!1,!0),n.removeClass("ui-tabs-loading"),o.removeAttr("aria-busy"),e===s.xhr&&delete s.xhr};this._isLocal(a[0])||(this.xhr=e.ajax(this._ajaxSettings(a,i,r)),this.xhr&&"canceled"!==this.xhr.statusText&&(n.addClass("ui-tabs-loading"),o.attr("aria-busy","true"),this.xhr.done(function(e,t,n){setTimeout(function(){o.html(e),s._trigger("load",i,r),h(n,t)},1)}).fail(function(e,t){setTimeout(function(){h(e,t)},1)})))},_ajaxSettings:function(t,i,s){var n=this;return{url:t.attr("href"),beforeSend:function(t,a){return n._trigger("beforeLoad",i,e.extend({jqXHR:t,ajaxSettings:a},s))}}},_getPanelForTab:function(t){var i=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}}),e.widget("ui.tooltip",{version:"1.11.4",options:{content:function(){var t=e(this).attr("title")||"";return e("<a>").text(t).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_addDescribedBy:function(t,i){var s=(t.attr("aria-describedby")||"").split(/\s+/);s.push(i),t.data("ui-tooltip-id",i).attr("aria-describedby",e.trim(s.join(" ")))},_removeDescribedBy:function(t){var i=t.data("ui-tooltip-id"),s=(t.attr("aria-describedby")||"").split(/\s+/),n=e.inArray(i,s);-1!==n&&s.splice(n,1),t.removeData("ui-tooltip-id"),s=e.trim(s.join(" ")),s?t.attr("aria-describedby",s):t.removeAttr("aria-describedby")},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable(),this.liveRegion=e("<div>").attr({role:"log","aria-live":"assertive","aria-relevant":"additions"}).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body)},_setOption:function(t,i){var s=this;return"disabled"===t?(this[i?"_disable":"_enable"](),this.options[t]=i,void 0):(this._super(t,i),"content"===t&&e.each(this.tooltips,function(e,t){s._updateContent(t.element)}),void 0)},_disable:function(){var t=this;e.each(this.tooltips,function(i,s){var n=e.Event("blur");n.target=n.currentTarget=s.element[0],t.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var t=e(this);t.is("[title]")&&t.data("ui-tooltip-title",t.attr("title")).removeAttr("title")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var t=e(this);t.data("ui-tooltip-title")&&t.attr("title",t.data("ui-tooltip-title"))})},open:function(t){var i=this,s=e(t?t.target:this.element).closest(this.options.items);s.length&&!s.data("ui-tooltip-id")&&(s.attr("title")&&s.data("ui-tooltip-title",s.attr("title")),s.data("ui-tooltip-open",!0),t&&"mouseover"===t.type&&s.parents().each(function(){var t,s=e(this);s.data("ui-tooltip-open")&&(t=e.Event("blur"),t.target=t.currentTarget=this,i.close(t,!0)),s.attr("title")&&(s.uniqueId(),i.parents[this.id]={element:this,title:s.attr("title")},s.attr("title",""))}),this._registerCloseHandlers(t,s),this._updateContent(s,t))},_updateContent:function(e,t){var i,s=this.options.content,n=this,a=t?t.type:null;return"string"==typeof s?this._open(t,e,s):(i=s.call(e[0],function(i){n._delay(function(){e.data("ui-tooltip-open")&&(t&&(t.type=a),this._open(t,e,i))})}),i&&this._open(t,e,i),void 0)},_open:function(t,i,s){function n(e){l.of=e,o.is(":hidden")||o.position(l)}var a,o,r,h,l=e.extend({},this.options.position);if(s){if(a=this._find(i))return a.tooltip.find(".ui-tooltip-content").html(s),void 0;i.is("[title]")&&(t&&"mouseover"===t.type?i.attr("title",""):i.removeAttr("title")),a=this._tooltip(i),o=a.tooltip,this._addDescribedBy(i,o.attr("id")),o.find(".ui-tooltip-content").html(s),this.liveRegion.children().hide(),s.clone?(h=s.clone(),h.removeAttr("id").find("[id]").removeAttr("id")):h=s,e("<div>").html(h).appendTo(this.liveRegion),this.options.track&&t&&/^mouse/.test(t.type)?(this._on(this.document,{mousemove:n}),n(t)):o.position(e.extend({of:i},this.options.position)),o.hide(),this._show(o,this.options.show),this.options.show&&this.options.show.delay&&(r=this.delayedShow=setInterval(function(){o.is(":visible")&&(n(l.of),clearInterval(r))},e.fx.interval)),this._trigger("open",t,{tooltip:o})}},_registerCloseHandlers:function(t,i){var s={keyup:function(t){if(t.keyCode===e.ui.keyCode.ESCAPE){var s=e.Event(t);s.currentTarget=i[0],this.close(s,!0)}}};i[0]!==this.element[0]&&(s.remove=function(){this._removeTooltip(this._find(i).tooltip)}),t&&"mouseover"!==t.type||(s.mouseleave="close"),t&&"focusin"!==t.type||(s.focusout="close"),this._on(!0,i,s)},close:function(t){var i,s=this,n=e(t?t.currentTarget:this.element),a=this._find(n);return a?(i=a.tooltip,a.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&!n.attr("title")&&n.attr("title",n.data("ui-tooltip-title")),this._removeDescribedBy(n),a.hiding=!0,i.stop(!0),this._hide(i,this.options.hide,function(){s._removeTooltip(e(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),t&&"mouseleave"===t.type&&e.each(this.parents,function(t,i){e(i.element).attr("title",i.title),delete s.parents[t]}),a.closing=!0,this._trigger("close",t,{tooltip:i}),a.hiding||(a.closing=!1)),void 0):(n.removeData("ui-tooltip-open"),void 0)},_tooltip:function(t){var i=e("<div>").attr("role","tooltip").addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||"")),s=i.uniqueId().attr("id");return e("<div>").addClass("ui-tooltip-content").appendTo(i),i.appendTo(this.document[0].body),this.tooltips[s]={element:t,tooltip:i}},_find:function(e){var t=e.data("ui-tooltip-id");return t?this.tooltips[t]:null},_removeTooltip:function(e){e.remove(),delete this.tooltips[e.attr("id")]},_destroy:function(){var t=this;e.each(this.tooltips,function(i,s){var n=e.Event("blur"),a=s.element;n.target=n.currentTarget=a[0],t.close(n,!0),e("#"+i).remove(),a.data("ui-tooltip-title")&&(a.attr("title")||a.attr("title",a.data("ui-tooltip-title")),a.removeData("ui-tooltip-title"))}),this.liveRegion.remove()}})})
	
	
    ,function(e, s, t, w) {
        "use strict";

        function l(e, t, n) {
            return setTimeout(c(e, n), t)
        }

        function n(e, t, n) {
            return !!Array.isArray(e) && (o(e, n[t], n), !0)
        }

        function o(e, t, n) {
            var i;
            if (e)
                if (e.forEach) e.forEach(t, n);
                else if (e.length !== w)
                for (i = 0; i < e.length;) t.call(n, e[i], i, e), i++;
            else
                for (i in e) e.hasOwnProperty(i) && t.call(n, e[i], i, e)
        }

        function r(e, t, n) {
            for (var i = Object.keys(t), o = 0; o < i.length;)(!n || n && e[i[o]] === w) && (e[i[o]] = t[i[o]]), o++;
            return e
        }

        function i(e, t) {
            return r(e, t, !0)
        }

        function a(e, t, n) {
            var i, o = t.prototype;
            (i = e.prototype = Object.create(o)).constructor = e, i._super = o, n && r(i, n)
        }

        function c(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }

        function u(e, t) {
            return typeof e == K ? e.apply(t && t[0] || w, t) : e
        }

        function d(e, t) {
            return e === w ? t : e
        }

        function f(t, e, n) {
            o(m(e), function(e) {
                t.addEventListener(e, n, !1)
            })
        }

        function p(t, e, n) {
            o(m(e), function(e) {
                t.removeEventListener(e, n, !1)
            })
        }

        function x(e, t) {
            for (; e;) {
                if (e == t) return !0;
                e = e.parentNode
            }
            return !1
        }

        function h(e, t) {
            return -1 < e.indexOf(t)
        }

        function m(e) {
            return e.trim().split(/\s+/g)
        }

        function v(e, t, n) {
            if (e.indexOf && !n) return e.indexOf(t);
            for (var i = 0; i < e.length;) {
                if (n && e[i][n] == t || !n && e[i] === t) return i;
                i++
            }
            return -1
        }

        function g(e) {
            return Array.prototype.slice.call(e, 0)
        }

        function y(e, n, t) {
            for (var i = [], o = [], r = 0; r < e.length;) {
                var a = n ? e[r][n] : e[r];
                v(o, a) < 0 && i.push(e[r]), o[r] = a, r++
            }
            return t && (i = n ? i.sort(function(e, t) {
                return e[n] > t[n]
            }) : i.sort()), i
        }

        function b(e, t) {
            for (var n, i, o = t[0].toUpperCase() + t.slice(1), r = 0; r < Y.length;) {
                if ((i = (n = Y[r]) ? n + o : t) in e) return i;
                r++
            }
            return w
        }

        function C(e) {
            var t = e.ownerDocument;
            return t.defaultView || t.parentWindow
        }

        function S(t, e) {
            var n = this;
            this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function(e) {
                u(t.options.enable, [t]) && n.handler(e)
            }, this.init()
        }

        function k(e, t, n) {
            var i = n.pointers.length,
                o = n.changedPointers.length,
                r = t & le && 0 == i - o,
                a = t & (ce | ue) && 0 == i - o;
            n.isFirst = !!r, n.isFinal = !!a, r && (e.session = {}), n.eventType = t,
                function(e, t) {
                    var n = e.session,
                        i = t.pointers,
                        o = i.length;
                    n.firstInput || (n.firstInput = T(t)), 1 < o && !n.firstMultiple ? n.firstMultiple = T(t) : 1 === o && (n.firstMultiple = !1);
                    var r, a, s, l, c, u, d, f, p, h, m = n.firstInput,
                        v = n.firstMultiple,
                        g = v ? v.center : m.center,
                        y = t.center = E(i);
                    t.timeStamp = ee(), t.deltaTime = t.timeStamp - m.timeStamp, t.angle = N(g, y), t.distance = O(g, y), c = n, d = (u = t).center, f = c.offsetDelta || {}, p = c.prevDelta || {}, h = c.prevInput || {}, (u.eventType === le || h.eventType === ce) && (p = c.prevDelta = {
                            x: h.deltaX || 0,
                            y: h.deltaY || 0
                        }, f = c.offsetDelta = {
                            x: d.x,
                            y: d.y
                        }), u.deltaX = p.x + (d.x - f.x), u.deltaY = p.y + (d.y - f.y), t.offsetDirection = A(t.deltaX, t.deltaY), t.scale = v ? (s = v.pointers, O((l = i)[0], l[1], we) / O(s[0], s[1], we)) : 1, t.rotation = v ? (r = v.pointers, N((a = i)[1], a[0], we) - N(r[1], r[0], we)) : 0,
                        function(e, t) {
                            var n, i, o, r, a, s = e.lastInterval || t,
                                l = t.timeStamp - s.timeStamp;
                            if (t.eventType != ue && (se < l || s.velocity === w)) {
                                var c = s.deltaX - t.deltaX,
                                    u = s.deltaY - t.deltaY,
                                    d = {
                                        x: c / (a = l) || 0,
                                        y: u / a || 0
                                    };
                                o = d.y, n = Z(i = d.x) > Z(d.y) ? d.x : d.y, r = A(c, u), e.lastInterval = t
                            } else n = s.velocity, i = s.velocityX, o = s.velocityY, r = s.direction;
                            t.velocity = n, t.velocityX = i, t.velocityY = o, t.direction = r
                        }(n, t);
                    var b = e.element;
                    x(t.srcEvent.target, b) && (b = t.srcEvent.target), t.target = b
                }(e, n), e.emit("hammer.input", n), e.recognize(n), e.session.prevInput = n
        }

        function T(e) {
            for (var t = [], n = 0; n < e.pointers.length;) t[n] = {
                clientX: J(e.pointers[n].clientX),
                clientY: J(e.pointers[n].clientY)
            }, n++;
            return {
                timeStamp: ee(),
                pointers: t,
                center: E(t),
                deltaX: e.deltaX,
                deltaY: e.deltaY
            }
        }

        function E(e) {
            var t = e.length;
            if (1 === t) return {
                x: J(e[0].clientX),
                y: J(e[0].clientY)
            };
            for (var n = 0, i = 0, o = 0; o < t;) n += e[o].clientX, i += e[o].clientY, o++;
            return {
                x: J(n / t),
                y: J(i / t)
            }
        }

        function A(e, t) {
            return e === t ? de : Z(e) >= Z(t) ? 0 < e ? fe : pe : 0 < t ? he : me
        }

        function O(e, t, n) {
            n || (n = be);
            var i = t[n[0]] - e[n[0]],
                o = t[n[1]] - e[n[1]];
            return Math.sqrt(i * i + o * o)
        }

        function N(e, t, n) {
            n || (n = be);
            var i = t[n[0]] - e[n[0]],
                o = t[n[1]] - e[n[1]];
            return 180 * Math.atan2(o, i) / Math.PI
        }

        function j() {
            this.evEl = Ce, this.evWin = Se, this.allow = !0, this.pressed = !1, S.apply(this, arguments)
        }

        function _() {
            this.evEl = Ee, this.evWin = Ae, S.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function P() {
            this.evTarget = "touchstart", this.evWin = "touchstart touchmove touchend touchcancel", this.started = !1, S.apply(this, arguments)
        }

        function M() {
            this.evTarget = je, this.targetIds = {}, S.apply(this, arguments)
        }

        function D() {
            S.apply(this, arguments);
            var e = c(this.handler, this);
            this.touch = new M(this.manager, e), this.mouse = new j(this.manager, e)
        }

        function L(e, t) {
            this.manager = e, this.set(t)
        }

        function I(e) {
            this.id = te++, this.manager = null, this.options = i(e || {}, this.defaults), this.options.enable = d(this.options.enable, !0), this.state = qe, this.simultaneous = {}, this.requireFail = []
        }

        function R(e) {
            return e == me ? "down" : e == he ? "up" : e == fe ? "left" : e == pe ? "right" : ""
        }

        function q(e, t) {
            var n = t.manager;
            return n ? n.get(e) : e
        }

        function B() {
            I.apply(this, arguments)
        }

        function F() {
            B.apply(this, arguments), this.pX = null, this.pY = null
        }

        function W() {
            B.apply(this, arguments)
        }

        function H() {
            I.apply(this, arguments), this._timer = null, this._input = null
        }

        function $() {
            B.apply(this, arguments)
        }

        function z() {
            B.apply(this, arguments)
        }

        function V() {
            I.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function Q(e, t) {
            return (t = t || {}).recognizers = d(t.recognizers, Q.defaults.preset), new X(e, t)
        }

        function X(e, t) {
            t = t || {}, this.options = i(t, Q.defaults), this.options.inputTarget = this.options.inputTarget || e, this.handlers = {}, this.session = {}, this.recognizers = [], this.element = e, this.input = new(this.options.inputClass || (ie ? _ : oe ? M : ne ? D : j))(this, k), this.touchAction = new L(this, this.options.touchAction), U(this, !0), o(t.recognizers, function(e) {
                var t = this.add(new e[0](e[1]));
                e[2] && t.recognizeWith(e[2]), e[3] && t.requireFailure(e[3])
            }, this)
        }

        function U(e, n) {
            var i = e.element;
            o(e.options.cssProps, function(e, t) {
                i.style[b(i.style, t)] = n ? e : ""
            })
        }
        var Y = ["", "webkit", "moz", "MS", "ms", "o"],
            G = s.createElement("div"),
            K = "function",
            J = Math.round,
            Z = Math.abs,
            ee = Date.now,
            te = 1,
            ne = "ontouchstart" in e,
            ie = b(e, "PointerEvent") !== w,
            oe = ne && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),
            re = "touch",
            ae = "mouse",
            se = 25,
            le = 1,
            ce = 4,
            ue = 8,
            de = 1,
            fe = 2,
            pe = 4,
            he = 8,
            me = 16,
            ve = fe | pe,
            ge = he | me,
            ye = ve | ge,
            be = ["x", "y"],
            we = ["clientX", "clientY"];
        S.prototype = {
            handler: function() {},
            init: function() {
                this.evEl && f(this.element, this.evEl, this.domHandler), this.evTarget && f(this.target, this.evTarget, this.domHandler), this.evWin && f(C(this.element), this.evWin, this.domHandler)
            },
            destroy: function() {
                this.evEl && p(this.element, this.evEl, this.domHandler), this.evTarget && p(this.target, this.evTarget, this.domHandler), this.evWin && p(C(this.element), this.evWin, this.domHandler)
            }
        };
        var xe = {
                mousedown: le,
                mousemove: 2,
                mouseup: ce
            },
            Ce = "mousedown",
            Se = "mousemove mouseup";
        a(j, S, {
            handler: function(e) {
                var t = xe[e.type];
                t & le && 0 === e.button && (this.pressed = !0), 2 & t && 1 !== e.which && (t = ce), this.pressed && this.allow && (t & ce && (this.pressed = !1), this.callback(this.manager, t, {
                    pointers: [e],
                    changedPointers: [e],
                    pointerType: ae,
                    srcEvent: e
                }))
            }
        });
        var ke = {
                pointerdown: le,
                pointermove: 2,
                pointerup: ce,
                pointercancel: ue,
                pointerout: ue
            },
            Te = {
                2: re,
                3: "pen",
                4: ae,
                5: "kinect"
            },
            Ee = "pointerdown",
            Ae = "pointermove pointerup pointercancel";
        e.MSPointerEvent && (Ee = "MSPointerDown", Ae = "MSPointerMove MSPointerUp MSPointerCancel"), a(_, S, {
            handler: function(e) {
                var t = this.store,
                    n = !1,
                    i = e.type.toLowerCase().replace("ms", ""),
                    o = ke[i],
                    r = Te[e.pointerType] || e.pointerType,
                    a = r == re,
                    s = v(t, e.pointerId, "pointerId");
                o & le && (0 === e.button || a) ? s < 0 && (t.push(e), s = t.length - 1) : o & (ce | ue) && (n = !0), s < 0 || (t[s] = e, this.callback(this.manager, o, {
                    pointers: t,
                    changedPointers: [e],
                    pointerType: r,
                    srcEvent: e
                }), n && t.splice(s, 1))
            }
        });
        var Oe = {
            touchstart: le,
            touchmove: 2,
            touchend: ce,
            touchcancel: ue
        };
        a(P, S, {
            handler: function(e) {
                var t = Oe[e.type];
                if (t === le && (this.started = !0), this.started) {
                    var n = function(e, t) {
                        var n = g(e.touches),
                            i = g(e.changedTouches);
                        return t & (ce | ue) && (n = y(n.concat(i), "identifier", !0)), [n, i]
                    }.call(this, e, t);
                    t & (ce | ue) && 0 == n[0].length - n[1].length && (this.started = !1), this.callback(this.manager, t, {
                        pointers: n[0],
                        changedPointers: n[1],
                        pointerType: re,
                        srcEvent: e
                    })
                }
            }
        });
        var Ne = {
                touchstart: le,
                touchmove: 2,
                touchend: ce,
                touchcancel: ue
            },
            je = "touchstart touchmove touchend touchcancel";
        a(M, S, {
            handler: function(e) {
                var t = Ne[e.type],
                    n = function(e, t) {
                        var n = g(e.touches),
                            i = this.targetIds;
                        if (t & (2 | le) && 1 === n.length) return i[n[0].identifier] = !0, [n, n];
                        var o, r, a = g(e.changedTouches),
                            s = [],
                            l = this.target;
                        if (r = n.filter(function(e) {
                                return x(e.target, l)
                            }), t === le)
                            for (o = 0; o < r.length;) i[r[o].identifier] = !0, o++;
                        for (o = 0; o < a.length;) i[a[o].identifier] && s.push(a[o]), t & (ce | ue) && delete i[a[o].identifier], o++;
                        return s.length ? [y(r.concat(s), "identifier", !0), s] : void 0
                    }.call(this, e, t);
                n && this.callback(this.manager, t, {
                    pointers: n[0],
                    changedPointers: n[1],
                    pointerType: re,
                    srcEvent: e
                })
            }
        }), a(D, S, {
            handler: function(e, t, n) {
                var i = n.pointerType == re,
                    o = n.pointerType == ae;
                if (i) this.mouse.allow = !1;
                else if (o && !this.mouse.allow) return;
                t & (ce | ue) && (this.mouse.allow = !0), this.callback(e, t, n)
            },
            destroy: function() {
                this.touch.destroy(), this.mouse.destroy()
            }
        });
        var _e = b(G.style, "touchAction"),
            Pe = _e !== w,
            Me = "compute",
            De = "manipulation",
            Le = "none",
            Ie = "pan-x",
            Re = "pan-y";
        L.prototype = {
            set: function(e) {
                e == Me && (e = this.compute()), Pe && (this.manager.element.style[_e] = e), this.actions = e.toLowerCase().trim()
            },
            update: function() {
                this.set(this.manager.options.touchAction)
            },
            compute: function() {
                var t = [];
                return o(this.manager.recognizers, function(e) {
                        u(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
                    }),
                    function(e) {
                        if (h(e, Le)) return Le;
                        var t = h(e, Ie),
                            n = h(e, Re);
                        return t && n ? Ie + " " + Re : t || n ? t ? Ie : Re : h(e, De) ? De : "auto"
                    }(t.join(" "))
            },
            preventDefaults: function(e) {
                if (!Pe) {
                    var t = e.srcEvent,
                        n = e.offsetDirection;
                    if (this.manager.session.prevented) return void t.preventDefault();
                    var i = this.actions,
                        o = h(i, Le),
                        r = h(i, Re),
                        a = h(i, Ie);
                    return o || r && n & ve || a && n & ge ? this.preventSrc(t) : void 0
                }
            },
            preventSrc: function(e) {
                this.manager.session.prevented = !0, e.preventDefault()
            }
        };
        var qe = 1;
        I.prototype = {
            defaults: {},
            set: function(e) {
                return r(this.options, e), this.manager && this.manager.touchAction.update(), this
            },
            recognizeWith: function(e) {
                if (n(e, "recognizeWith", this)) return this;
                var t = this.simultaneous;
                return t[(e = q(e, this)).id] || (t[e.id] = e).recognizeWith(this), this
            },
            dropRecognizeWith: function(e) {
                return n(e, "dropRecognizeWith", this) || (e = q(e, this), delete this.simultaneous[e.id]), this
            },
            requireFailure: function(e) {
                if (n(e, "requireFailure", this)) return this;
                var t = this.requireFail;
                return -1 === v(t, e = q(e, this)) && (t.push(e), e.requireFailure(this)), this
            },
            dropRequireFailure: function(e) {
                if (n(e, "dropRequireFailure", this)) return this;
                e = q(e, this);
                var t = v(this.requireFail, e);
                return -1 < t && this.requireFail.splice(t, 1), this
            },
            hasRequireFailures: function() {
                return 0 < this.requireFail.length
            },
            canRecognizeWith: function(e) {
                return !!this.simultaneous[e.id]
            },
            emit: function(n) {
                function e(e) {
                    var t;
                    i.manager.emit(i.options.event + (e ? 16 & (t = o) ? "cancel" : 8 & t ? "end" : 4 & t ? "move" : 2 & t ? "start" : "" : ""), n)
                }
                var i = this,
                    o = this.state;
                o < 8 && e(!0), e(), 8 <= o && e(!0)
            },
            tryEmit: function(e) {
                return this.canEmit() ? this.emit(e) : void(this.state = 32)
            },
            canEmit: function() {
                for (var e = 0; e < this.requireFail.length;) {
                    if (!(this.requireFail[e].state & (32 | qe))) return !1;
                    e++
                }
                return !0
            },
            recognize: function(e) {
                var t = r({}, e);
                return u(this.options.enable, [this, t]) ? (56 & this.state && (this.state = qe), this.state = this.process(t), void(30 & this.state && this.tryEmit(t))) : (this.reset(), void(this.state = 32))
            },
            process: function() {},
            getTouchAction: function() {},
            reset: function() {}
        }, a(B, I, {
            defaults: {
                pointers: 1
            },
            attrTest: function(e) {
                var t = this.options.pointers;
                return 0 === t || e.pointers.length === t
            },
            process: function(e) {
                var t = this.state,
                    n = e.eventType,
                    i = 6 & t,
                    o = this.attrTest(e);
                return i && (n & ue || !o) ? 16 | t : i || o ? n & ce ? 8 | t : 2 & t ? 4 | t : 2 : 32
            }
        }), a(F, B, {
            defaults: {
                event: "pan",
                threshold: 10,
                pointers: 1,
                direction: ye
            },
            getTouchAction: function() {
                var e = this.options.direction,
                    t = [];
                return e & ve && t.push(Re), e & ge && t.push(Ie), t
            },
            directionTest: function(e) {
                var t = this.options,
                    n = !0,
                    i = e.distance,
                    o = e.direction,
                    r = e.deltaX,
                    a = e.deltaY;
                return o & t.direction || (t.direction & ve ? (o = 0 === r ? de : r < 0 ? fe : pe, n = r != this.pX, i = Math.abs(e.deltaX)) : (o = 0 === a ? de : a < 0 ? he : me, n = a != this.pY, i = Math.abs(e.deltaY))), e.direction = o, n && i > t.threshold && o & t.direction
            },
            attrTest: function(e) {
                return B.prototype.attrTest.call(this, e) && (2 & this.state || !(2 & this.state) && this.directionTest(e))
            },
            emit: function(e) {
                this.pX = e.deltaX, this.pY = e.deltaY;
                var t = R(e.direction);
                t && this.manager.emit(this.options.event + t, e), this._super.emit.call(this, e)
            }
        }), a(W, B, {
            defaults: {
                event: "pinch",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [Le]
            },
            attrTest: function(e) {
                return this._super.attrTest.call(this, e) && (Math.abs(e.scale - 1) > this.options.threshold || 2 & this.state)
            },
            emit: function(e) {
                if (this._super.emit.call(this, e), 1 !== e.scale) {
                    var t = e.scale < 1 ? "in" : "out";
                    this.manager.emit(this.options.event + t, e)
                }
            }
        }), a(H, I, {
            defaults: {
                event: "press",
                pointers: 1,
                time: 500,
                threshold: 5
            },
            getTouchAction: function() {
                return ["auto"]
            },
            process: function(e) {
                var t = this.options,
                    n = e.pointers.length === t.pointers,
                    i = e.distance < t.threshold,
                    o = e.deltaTime > t.time;
                if (this._input = e, !i || !n || e.eventType & (ce | ue) && !o) this.reset();
                else if (e.eventType & le) this.reset(), this._timer = l(function() {
                    this.state = 8, this.tryEmit()
                }, t.time, this);
                else if (e.eventType & ce) return 8;
                return 32
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function(e) {
                8 === this.state && (e && e.eventType & ce ? this.manager.emit(this.options.event + "up", e) : (this._input.timeStamp = ee(), this.manager.emit(this.options.event, this._input)))
            }
        }), a($, B, {
            defaults: {
                event: "rotate",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [Le]
            },
            attrTest: function(e) {
                return this._super.attrTest.call(this, e) && (Math.abs(e.rotation) > this.options.threshold || 2 & this.state)
            }
        }), a(z, B, {
            defaults: {
                event: "swipe",
                threshold: 10,
                velocity: .65,
                direction: ve | ge,
                pointers: 1
            },
            getTouchAction: function() {
                return F.prototype.getTouchAction.call(this)
            },
            attrTest: function(e) {
                var t, n = this.options.direction;
                return n & (ve | ge) ? t = e.velocity : n & ve ? t = e.velocityX : n & ge && (t = e.velocityY), this._super.attrTest.call(this, e) && n & e.direction && e.distance > this.options.threshold && Z(t) > this.options.velocity && e.eventType & ce
            },
            emit: function(e) {
                var t = R(e.direction);
                t && this.manager.emit(this.options.event + t, e), this.manager.emit(this.options.event, e)
            }
        }), a(V, I, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 2,
                posThreshold: 10
            },
            getTouchAction: function() {
                return [De]
            },
            process: function(e) {
                var t = this.options,
                    n = e.pointers.length === t.pointers,
                    i = e.distance < t.threshold,
                    o = e.deltaTime < t.time;
                if (this.reset(), e.eventType & le && 0 === this.count) return this.failTimeout();
                if (i && o && n) {
                    if (e.eventType != ce) return this.failTimeout();
                    var r = !this.pTime || e.timeStamp - this.pTime < t.interval,
                        a = !this.pCenter || O(this.pCenter, e.center) < t.posThreshold;
                    if (this.pTime = e.timeStamp, this.pCenter = e.center, a && r ? this.count += 1 : this.count = 1, this._input = e, 0 == this.count % t.taps) return this.hasRequireFailures() ? (this._timer = l(function() {
                        this.state = 8, this.tryEmit()
                    }, t.interval, this), 2) : 8
                }
                return 32
            },
            failTimeout: function() {
                return this._timer = l(function() {
                    this.state = 32
                }, this.options.interval, this), 32
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function() {
                8 == this.state && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), Q.VERSION = "2.0.4", Q.defaults = {
            domEvents: !1,
            touchAction: Me,
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [
                [$, {
                    enable: !1
                }],
                [W, {
                        enable: !1
                    },
                    ["rotate"]
                ],
                [z, {
                    direction: ve
                }],
                [F, {
                        direction: ve
                    },
                    ["swipe"]
                ],
                [V],
                [V, {
                        event: "doubletap",
                        taps: 2
                    },
                    ["tap"]
                ],
                [H]
            ],
            cssProps: {
                userSelect: "default",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        }, X.prototype = {
            set: function(e) {
                return r(this.options, e), e.touchAction && this.touchAction.update(), e.inputTarget && (this.input.destroy(), this.input.target = e.inputTarget, this.input.init()), this
            },
            stop: function(e) {
                this.session.stopped = e ? 2 : 1
            },
            recognize: function(e) {
                var t = this.session;
                if (!t.stopped) {
                    this.touchAction.preventDefaults(e);
                    var n, i = this.recognizers,
                        o = t.curRecognizer;
                    (!o || o && 8 & o.state) && (o = t.curRecognizer = null);
                    for (var r = 0; r < i.length;) n = i[r], 2 === t.stopped || o && n != o && !n.canRecognizeWith(o) ? n.reset() : n.recognize(e), !o && 14 & n.state && (o = t.curRecognizer = n), r++
                }
            },
            get: function(e) {
                if (e instanceof I) return e;
                for (var t = this.recognizers, n = 0; n < t.length; n++)
                    if (t[n].options.event == e) return t[n];
                return null
            },
            add: function(e) {
                if (n(e, "add", this)) return this;
                var t = this.get(e.options.event);
                return t && this.remove(t), this.recognizers.push(e), (e.manager = this).touchAction.update(), e
            },
            remove: function(e) {
                if (n(e, "remove", this)) return this;
                var t = this.recognizers;
                return e = this.get(e), t.splice(v(t, e), 1), this.touchAction.update(), this
            },
            on: function(e, t) {
                var n = this.handlers;
                return o(m(e), function(e) {
                    n[e] = n[e] || [], n[e].push(t)
                }), this
            },
            off: function(e, t) {
                var n = this.handlers;
                return o(m(e), function(e) {
                    t ? n[e].splice(v(n[e], t), 1) : delete n[e]
                }), this
            },
            emit: function(e, t) {
                var n, i, o;
                this.options.domEvents && (n = e, i = t, (o = s.createEvent("Event")).initEvent(n, !0, !0), (o.gesture = i).target.dispatchEvent(o));
                var r = this.handlers[e] && this.handlers[e].slice();
                if (r && r.length) {
                    t.type = e, t.preventDefault = function() {
                        t.srcEvent.preventDefault()
                    };
                    for (var a = 0; a < r.length;) r[a](t), a++
                }
            },
            destroy: function() {
                this.element && U(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, r(Q, {
            INPUT_START: le,
            INPUT_MOVE: 2,
            INPUT_END: ce,
            INPUT_CANCEL: ue,
            STATE_POSSIBLE: qe,
            STATE_BEGAN: 2,
            STATE_CHANGED: 4,
            STATE_ENDED: 8,
            STATE_RECOGNIZED: 8,
            STATE_CANCELLED: 16,
            STATE_FAILED: 32,
            DIRECTION_NONE: de,
            DIRECTION_LEFT: fe,
            DIRECTION_RIGHT: pe,
            DIRECTION_UP: he,
            DIRECTION_DOWN: me,
            DIRECTION_HORIZONTAL: ve,
            DIRECTION_VERTICAL: ge,
            DIRECTION_ALL: ye,
            Manager: X,
            Input: S,
            TouchAction: L,
            TouchInput: M,
            MouseInput: j,
            PointerEventInput: _,
            TouchMouseInput: D,
            SingleTouchInput: P,
            Recognizer: I,
            AttrRecognizer: B,
            Tap: V,
            Pan: F,
            Swipe: z,
            Pinch: W,
            Rotate: $,
            Press: H,
            on: f,
            off: p,
            each: o,
            merge: i,
            extend: r,
            inherit: a,
            bindFn: c,
            prefixed: b
        }), typeof define == K && define.amd ? define(function() {
            return Q
        }) : "undefined" != typeof module && module.exports ? module.exports = Q : e.Hammer = Q
    }(window, document),
    function(e) {
        "function" == typeof define && define.amd ? define(["jquery", "hammerjs"], e) : "object" == typeof exports ? e(require("jquery"), require("hammerjs")) : e(jQuery, Hammer)
    }(function(i, o) {
        var n;
        i.fn.hammer = function(n) {
            return this.each(function() {
                var e, t;
                e = n, (t = i(this)).data("hammer") || t.data("hammer", new o(t[0], e))
            })
        }, o.Manager.prototype.emit = (n = o.Manager.prototype.emit, function(e, t) {
            n.call(this, e, t), i(this.element).trigger({
                type: e,
                gesture: t
            })
        })
    }), window.Materialize = {}, Materialize.guid = function() {
        function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return function() {
            return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
        }
    }(), Materialize.elementOrParentIsFixed = function(e) {
        var t = $(e),
            n = !1;
        return t.add(t.parents()).each(function() {
            return "fixed" === $(this).css("position") ? !(n = !0) : void 0
        }), n
    }, Vel = $ ? $.Velocity : Velocity,
    function(l) {
        l.fn.collapsible = function(s) {
            return s = l.extend({
                accordion: void 0
            }, s), this.each(function() {
                function n(e) {
                    void 0 !== e.parent().data() && (t = a.find("> li > .collapsible-header"), e.parent().data().hasOwnProperty("nosub") ? (e.hasClass("active2") ? e.parent().addClass("active") : e.parent().removeClass("active"), e.parent().hasClass("active") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }), t.not(e).removeClass("active").parent().removeClass("active")) : e.hasClass("active2") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }), t.not(e).parent().children(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }))
                }

                function i(e) {
                    void 0 !== e.parent().data() && (e.parent().data().hasOwnProperty("nosub") ? (e.hasClass("active2") ? e.parent().addClass("active") : e.parent().removeClass("active"), e.parent().hasClass("active") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    })) : e.hasClass("active2") ? e.siblings(".collapsible-body").stop(!0, !1).slideDown({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }) : e.siblings(".collapsible-body").stop(!0, !1).slideUp({
                        duration: 350,
                        easing: "easeOutQuart",
                        queue: !1,
                        complete: function() {
                            l(this).css("height", "")
                        }
                    }))
                }

                function o(e) {
                    return 0 < r(e).length
                }

                function r(e) {
                    return e.closest("li > .collapsible-header")
                }
                var a = l(this),
                    t = l(this).find("> li > .collapsible-header"),
                    e = a.data("collapsible");
                a.off("click.collapse", ".collapsible-header"), t.off("click.collapse"), s.accordion || "accordion" === e || void 0 === e ? ((t = a.find("> li > .collapsible-header")).on("click.collapse", function(e) {
                    var t = l(e.target);
                    a.find("> li > .collapsible-header").each(function() {
                        "none" == l(this).siblings(".collapsible-body").css("display") && (l(this).removeClass("active2"), l(this).removeClass("active"))
                    }), o(t) && (t = r(t)), t.hasClass("active2"), 0 < t.siblings(".collapsible-body").length && (t.toggleClass("active2"), n(t), t.hasClass("active2") ? t.addClass("active") : t.removeClass("active"))
                }), n(t.filter(".active").first())) : t.each(function() {
                    l(this).on("click.collapse", function(e) {
                        var t = l(e.target);
                        a.find("> li > .collapsible-header").each(function() {
                            "none" == l(this).siblings(".collapsible-body").css("display") && (l(this).removeClass("active2"), l(this).removeClass("active"))
                        }), o(t) && (t = r(t)), t.toggleClass("active2"), i(t), t.hasClass("active2") ? t.addClass("active") : t.removeClass("active")
                    }), l(this).hasClass("active") && i(l(this))
                })
            })
        }, l(document).ready(function() {
            l(".collapsible").collapsible()
        })
    }(jQuery),
    function(b) {
        b.fn.scrollTo = function(e) {
            return b(this).scrollTop(b(this).scrollTop() - b(this).offset().top + b(e).offset().top), this
        }, b.fn.dropdown = function(e) {
            var t = {
                inDuration: 300,
                outDuration: 225,
                constrainWidth: !0,
                hover: !1,
                gutter: 0,
                belowOrigin: !1,
                alignment: "right",
                stopPropagation: !1
            };
            return "open" === e ? (this.each(function() {
                b(this).trigger("open")
            }), !1) : "close" === e ? (this.each(function() {
                b(this).trigger("close")
            }), !1) : void this.each(function() {
                function p() {
                    void 0 !== m.data("induration") && (v.inDuration = m.data("induration")), void 0 !== m.data("outduration") && (v.outDuration = m.data("outduration")), void 0 !== m.data("constrainwidth") && (v.constrainWidth = m.data("constrainwidth")), void 0 !== m.data("hover") && (v.hover = m.data("hover")), void 0 !== m.data("gutter") && (v.gutter = m.data("gutter")), void 0 !== m.data("beloworigin") && (v.belowOrigin = m.data("beloworigin")), void 0 !== m.data("alignment") && (v.alignment = m.data("alignment")), void 0 !== m.data("stoppropagation") && (v.stopPropagation = m.data("stoppropagation"))
                }

                function n(e) {
                    "focus" === e && (g = !0), p(), y.addClass("active"), m.addClass("active"), y.css("display", "table"), !0 === v.constrainWidth ? y.css("width", m.outerWidth()) : y.css("white-space", "nowrap");
                    var t, n = window.innerHeight;
                    t = "BUTTON" == m.prop("nodeName") ? m.innerHeight() : m.closest("ul").innerHeight();
                    var i = m.offset().left,
                        o = m.offset().top - b(window).scrollTop(),
                        r = v.alignment,
                        a = 0,
                        s = 0,
                        l = 0;
                    !0 === v.belowOrigin && (l = t);
                    var c = 0,
                        u = 0,
                        d = m.parent();
                    if (d.is("body") || (d[0].scrollHeight > d[0].clientHeight && (c = d[0].scrollTop), d[0].scrollWidth > d[0].clientWidth && (u = d[0].scrollLeft)), i + y.innerWidth() > b(window).width() ? r = "right" : i - y.innerWidth() + m.innerWidth() < 0 && (r = "left"), o + y.innerHeight() > n)
                        if (o + t - y.innerHeight() < 0) {
                            var f = n - o - l;
                            y.css("max-height", f)
                        } else l || (l += t), l -= y.innerHeight();
                    "left" === r ? (a = v.gutter, s = m.position().left + a) : "right" === r && (s = m.position().left + m.outerWidth() - y.outerWidth() + (a = -v.gutter)), y.css({
                        position: "absolute",
                        top: m.position().top + l + c,
                        left: s + u
                    }), y.stop(!0, !0).css("opacity", 0).slideDown({
                        queue: !1,
                        duration: v.inDuration,
                        easing: "easeOutCubic",
                        complete: function() {
                            b(this).css("height", "")
                        }
                    }).animate({
                        opacity: 1
                    }, {
                        queue: !1,
                        duration: v.inDuration,
                        easing: "easeOutSine"
                    }), b(document).bind("click." + y.attr("id") + " touchstart." + y.attr("id"), function(e) {
                        y.is(e.target) || m.is(e.target) || m.find(e.target).length || (h(), b(document).unbind("click." + y.attr("id") + " touchstart." + y.attr("id")))
                    })
                }

                function h() {
                    g = !1, y.fadeOut(v.outDuration), y.removeClass("active"), m.removeClass("active"), b(document).unbind("click." + y.attr("id") + " touchstart." + y.attr("id")), setTimeout(function() {
                        y.css("max-height", "")
                    }, v.outDuration)
                }
                var m = b(this),
                    v = b.extend({}, t, e),
                    g = !1,
                    y = b("#" + m.attr("data-activates"));
                if (p(), m.after(y), v.hover) {
                    var i = !1;
                    m.unbind("click." + m.attr("id")), m.on("mouseenter", function(e) {
                        !1 === i && (n(), i = !0)
                    }), m.on("mouseleave", function(e) {
                        var t = e.toElement || e.relatedTarget;
                        b(t).closest(".dropdown-content").is(y) || (y.stop(!0, !0), h(), i = !1)
                    }), y.on("mouseleave", function(e) {
                        var t = e.toElement || e.relatedTarget;
                        b(t).closest(".dropdown-button").is(m) || (y.stop(!0, !0), h(), i = !1)
                    })
                } else m.unbind("click." + m.attr("id")), m.bind("click." + m.attr("id"), function(e) {
                    g || (m[0] != e.currentTarget || m.hasClass("active") || 0 !== b(e.target).closest(".dropdown-content").length ? m.hasClass("active") && (h(), b(document).unbind("click." + y.attr("id") + " touchstart." + y.attr("id"))) : (e.preventDefault(), v.stopPropagation && e.stopPropagation(), n("click")))
                });
                m.on("open", function(e, t) {
                    n(t)
                }), m.on("close", h)
            })
        }, b(document).ready(function() {
            b(".dropdown-button").dropdown()
        })
    }(jQuery),
    function(u) {
        var d = 0,
            f = 0;
        u.fn.extend({
            openModal: function(t) {
                u("body").css("overflow", "hidden");
                var e = "materialize-lean-overlay-" + ++f,
                    n = u(this),
                    i = u('<div class="lean-overlay"></div>'),
                    o = ++d;
                if (i.attr("id", e).css("z-index", 2e3 + 2 * o), n.data("overlay-id", e).css("z-index", 2e3 + 2 * o + 1), u("body").append(i), (t = u.extend({
                        opacity: .5,
                        in_duration: 350,
                        out_duration: 250,
                        ready: void 0,
                        complete: void 0,
                        dismissible: !0,
                        starting_top: "4%",
                        end_top: "10%"
                    }, t)).dismissible && (i.click(function() {
                        n.closeModal(t)
                    }), u(document).on("keyup.leanModal" + e, function(e) {
                        27 === e.keyCode && n.closeModal(t)
                    })), n.find(".modal-close").on("click.close", function(e) {
                        n.closeModal(t)
                    }), i.css({
                        display: "block",
                        opacity: 0
                    }), n.css({
                        display: "block",
                        opacity: 0
                    }), i.velocity({
                        opacity: t.opacity
                    }, {
                        duration: t.in_duration,
                        queue: !1,
                        ease: "easeOutCubic"
                    }), n.data("associated-overlay", i[0]), n.hasClass("modal-fixed-footer")) {
                    var r = 0,
                        a = n.find(".modal-header");
                    0 !== a.length && (r += a.outerHeight());
                    var s = n.find(".modal-footer");
                    0 !== s.length && (r += s.outerHeight());
                    var l = Math.ceil(r),
                        c = n.find(".modal-content");
                    0 !== c.length && c.css("height", "calc(100% - " + l + "px)")
                }
                n.hasClass("bottom-sheet") ? n.velocity({
                    bottom: "0",
                    opacity: 1
                }, {
                    duration: t.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof t.ready && t.ready()
                    }
                }) : n.hasClass("top-sheet") ? n.velocity({
                    top: "0",
                    opacity: 1
                }, {
                    duration: t.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof t.ready && t.ready()
                    }
                }) : (u.Velocity.hook(n, "scaleX", .7), n.css({
                    top: t.starting_top
                }), n.velocity({
                    top: t.end_top,
                    opacity: 1,
                    scaleX: "1"
                }, {
                    duration: t.in_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        "function" == typeof t.ready && t.ready()
                    }
                }))
            }
        }), u.fn.extend({
            closeModal: function(e) {
                var t = u(this),
                    n = t.data("overlay-id"),
                    i = u("#" + n);
                e = u.extend({
                    out_duration: 250,
                    complete: void 0
                }, e), u("body").css("overflow", ""), t.find(".modal-close").off("click.close"), u(document).off("keyup.leanModal" + n), i.velocity({
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutQuart"
                }), t.hasClass("bottom-sheet") ? t.velocity({
                    bottom: "-100%",
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        i.css({
                            display: "none"
                        }), "function" == typeof e.complete && e.complete(), i.remove(), d--
                    }
                }) : t.hasClass("top-sheet") ? t.velocity({
                    top: "-100%",
                    opacity: 0
                }, {
                    duration: e.out_duration,
                    queue: !1,
                    ease: "easeOutCubic",
                    complete: function() {
                        i.css({
                            display: "none"
                        }), "function" == typeof e.complete && e.complete(), i.remove(), d--
                    }
                }) : t.velocity({
                    top: e.starting_top,
                    opacity: 0,
                    scaleX: .7
                }, {
                    duration: e.out_duration,
                    complete: function() {
                        u(this).css("display", "none"), "function" == typeof e.complete && e.complete(), i.remove(), d--
                    }
                })
            }
        }), u.fn.extend({
            leanModal: function(e) {
                return this.each(function() {
                    var n = u.extend({
                        starting_top: "4%"
                    }, e);
                    u(this).click(function(e) {
                        n.starting_top = (u(this).offset().top - u(window).scrollTop()) / 1.15;
                        var t = u(this).attr("href") || "#" + u(this).data("target");
                        u(t).openModal(n), e.preventDefault()
                    })
                })
            }
        })
    }(jQuery),
    function(p) {
        p.fn.materialbox = function() {
            return this.each(function() {
                function c() {
                    d = !1;
                    var e = f.parent(".material-placeholder"),
                        t = (window.innerWidth, window.innerHeight, f.data("width")),
                        n = f.data("height");
                    f.velocity("stop", !0), p("#materialbox-overlay").velocity("stop", !0), p(".materialbox-caption").velocity("stop", !0), p("#materialbox-overlay").velocity({
                        opacity: 0
                    }, {
                        duration: i,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            u = !1, p(this).remove()
                        }
                    }), f.velocity({
                        width: t,
                        height: n,
                        left: 0,
                        top: 0
                    }, {
                        duration: i,
                        queue: !1,
                        easing: "easeOutQuad"
                    }), p(".materialbox-caption").velocity({
                        opacity: 0
                    }, {
                        duration: i,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            e.css({
                                height: "",
                                width: "",
                                position: "",
                                top: "",
                                left: ""
                            }), f.css({
                                height: "",
                                top: "",
                                left: "",
                                width: "",
                                "max-width": "",
                                position: "",
                                "z-index": ""
                            }), f.removeClass("active"), d = !0, p(this).remove()
                        }
                    })
                }
                if (!p(this).hasClass("initialized")) {
                    p(this).addClass("initialized");
                    var u = !1,
                        d = !0,
                        i = 200,
                        f = p(this),
                        e = p("<div></div>").addClass("material-placeholder");
                    f.wrap(e), f.on("click", function() {
                        var e = f.parent(".material-placeholder"),
                            t = window.innerWidth,
                            n = window.innerHeight,
                            i = f.width(),
                            o = f.height();
                        if (!1 === d) return c(), !1;
                        if (u && !0 === d) return c(), !1;
                        d = !1, f.addClass("active"), u = !0, e.css({
                            width: e[0].getBoundingClientRect().width,
                            height: e[0].getBoundingClientRect().height,
                            position: "relative",
                            top: 0,
                            left: 0
                        }), f.css({
                            position: "absolute",
                            "z-index": 1e3
                        }).data("width", i).data("height", o);
                        var r = p('<div id="materialbox-overlay"></div>').css({
                            opacity: 0
                        }).click(function() {
                            !0 === d && c()
                        });
                        if (p("body").append(r), r.velocity({
                                opacity: 1
                            }, {
                                duration: 275,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), "" !== f.data("caption")) {
                            var a = p('<div class="materialbox-caption"></div>');
                            a.text(f.data("caption")), p("body").append(a), a.css({
                                display: "inline"
                            }), a.velocity({
                                opacity: 1
                            }, {
                                duration: 275,
                                queue: !1,
                                easing: "easeOutQuad"
                            })
                        }
                        var s = 0,
                            l = 0;
                        o / n < i / t ? l = (s = .9 * t) * (o / i) : (s = .9 * n * (i / o), l = .9 * n), f.hasClass("responsive-img") ? f.velocity({
                            "max-width": s,
                            width: i
                        }, {
                            duration: 0,
                            queue: !1,
                            complete: function() {
                                f.css({
                                    left: 0,
                                    top: 0
                                }).velocity({
                                    height: l,
                                    width: s,
                                    left: p(document).scrollLeft() + t / 2 - f.parent(".material-placeholder").offset().left - s / 2,
                                    top: p(document).scrollTop() + n / 2 - f.parent(".material-placeholder").offset().top - l / 2
                                }, {
                                    duration: 275,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        d = !0
                                    }
                                })
                            }
                        }) : f.css("left", 0).css("top", 0).velocity({
                            height: l,
                            width: s,
                            left: p(document).scrollLeft() + t / 2 - f.parent(".material-placeholder").offset().left - s / 2,
                            top: p(document).scrollTop() + n / 2 - f.parent(".material-placeholder").offset().top - l / 2
                        }, {
                            duration: 275,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                d = !0
                            }
                        })
                    }), p(window).scroll(function() {
                        u && c()
                    }), p(document).keyup(function(e) {
                        27 === e.keyCode && !0 === d && u && c()
                    })
                }
            })
        }, p(document).ready(function() {
            p(".materialboxed").materialbox()
        })
    }(jQuery),
    function(f) {
        f.fn.parallax = function() {
            var d = f(window).width();
            return this.each(function(e) {
                function t(e) {
                    var t;
                    t = d < 601 ? 0 < u.height() ? u.height() : u.children("img").height() : 0 < u.height() ? u.height() : 500;
                    var n = u.children("img").first(),
                        i = n.height() - t,
                        o = u.offset().top + t,
                        r = u.offset().top,
                        a = f(window).scrollTop(),
                        s = window.innerHeight,
                        l = (a + s - r) / (t + s),
                        c = Math.round(i * l);
                    e && n.css("display", "block"), a < o && r < a + s && n.css("transform", "translate3D(-50%," + c + "px, 0)")
                }
                var u = f(this);
                u.addClass("parallax"), u.children("img").one("load", function() {
                    t(!0)
                }).each(function() {
                    this.complete && f(this).load()
                }), f(window).scroll(function() {
                    d = f(window).width(), t(!1)
                }), f(window).resize(function() {
                    d = f(window).width(), t(!1)
                })
            })
        }
    }(jQuery),
    function(u) {
        var t = {
            init: function() {
                return this.each(function() {
                    var n = u(this);
                    u(window).width(), "true" != n.attr("forcestyle") && n.width("100%");
                    var i, o, r = n.find("li.tab a"),
                        a = n.width(),
                        s = n.find("li").first().outerWidth(),
                        l = 0;
                    0 === (i = u(r.filter('[href="' + location.hash + '"]'))).length && (i = u(this).find("li.tab a.active").first()), 0 === i.length && (i = u(this).find("li.tab a").first()), i.addClass("active"), (l = r.index(i)) < 0 && (l = 0), o = u(i[0].hash), n.append('<div class="indicator"></div>');
                    var c = n.find(".indicator");
                    n.is(":visible") && (c.css({
                        right: a - (l + 1) * s
                    }), c.css({
                        left: l * s
                    })), u(window).resize(function() {
                        a = n.width(), s = n.find("li").first().outerWidth(), l < 0 && (l = 0), 0 !== s && 0 !== a && (c.css({
                            right: a - (l + 1) * s
                        }), c.css({
                            left: l * s
                        }))
                    }), r.not(i).each(function() {
                        u(this.hash).hide()
                    }), n.on("click", "a", function(e) {
                        if (u(this).parent().hasClass("disabled")) e.preventDefault();
                        else {
                            a = n.width(), s = n.find("li").first().outerWidth(), i.removeClass("active"), o.hide(), i = u(this), o = u(this.hash), r = n.find("li.tab a"), i.addClass("active");
                            var t = l;
                            (l = r.index(u(this))) < 0 && (l = 0), o.show(), 0 <= l - t ? (c.velocity({
                                right: a - (l + 1) * s
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), c.velocity({
                                left: l * s
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                delay: 90
                            })) : (c.velocity({
                                left: l * s
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), c.velocity({
                                right: a - (l + 1) * s
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                delay: 90
                            })), e.preventDefault(), resizecells()
                        }
                    })
                })
            },
            select_tab: function(e) {
                this.find('a[href="#' + e + '"]').trigger("click")
            }
        };
        u.fn.tabs = function(e) {
            return t[e] ? t[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void u.error("Method " + e + " does not exist on jQuery.tooltip") : t.init.apply(this, arguments)
        }, u(document).ready(function() {
            u("ul.tabs").tabs()
        })
    }(jQuery),
    function(o) {
        o.fn.tooltip = function(n) {
            var f = null,
                p = !1,
                i = null;
            return "remove" === n ? (this.each(function() {
                o("#" + o(this).attr("data-tooltip-id")).remove()
            }), !1) : (n = o.extend({
                delay: 350
            }, n), this.each(function() {
                var e = Materialize.guid(),
                    c = o(this);
                c.attr("data-tooltip-id", e);
                var t = o("<span></span>").text(c.attr("data-tooltip")),
                    u = o("<div></div>");
                u.addClass("material-tooltip no-print").append(t).appendTo(o("body")).attr("id", e);
                var d = o("<div></div>").addClass("backdrop");
                d.appendTo(u), d.css({
                    top: 0,
                    left: 0
                }), c.off("mouseenter.tooltip mouseleave.tooltip"), c.on({
                    "mouseenter.tooltip": function(e) {
                        var l = c.data("delay");
                        l = void 0 === l || "" === l ? n.delay : l, f = 0, i = setInterval(function() {
                            if ((f += 10) >= l && !1 === p) {
                                p = !0, u.css({
                                    display: "block",
                                    left: "0px",
                                    top: "0px"
                                }), u.children("span").text(c.attr("data-tooltip"));
                                var e = c.outerWidth(),
                                    t = c.outerHeight(),
                                    n = c.attr("data-position"),
                                    i = u.outerHeight(),
                                    o = u.outerWidth(),
                                    r = "0px",
                                    a = "0px",
                                    s = 8;
                                "top" === n ? (u.css({
                                    top: c.offset().top - i - 5,
                                    left: c.offset().left + e / 2 - o / 2
                                }), r = "-10px", d.css({
                                    borderRadius: "14px 14px 0 0",
                                    transformOrigin: "50% 90%",
                                    marginTop: i,
                                    marginLeft: o / 2 - d.width() / 2
                                })) : "left" === n ? (u.css({
                                    top: c.offset().top + t / 2 - i / 2,
                                    left: c.offset().left - o - 5
                                }), a = "-10px", d.css({
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "14px 0 0 14px",
                                    transformOrigin: "95% 50%",
                                    marginTop: i / 2,
                                    marginLeft: o
                                })) : "right" === n ? (u.css({
                                    top: c.offset().top + t / 2 - i / 2,
                                    left: c.offset().left + e + 5
                                }), a = "+10px", d.css({
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "0 14px 14px 0",
                                    transformOrigin: "5% 50%",
                                    marginTop: i / 2,
                                    marginLeft: "0px"
                                })) : (u.css({
                                    top: c.offset().top + c.outerHeight() + 5,
                                    left: c.offset().left + e / 2 - o / 2
                                }), r = "+10px", d.css({
                                    marginLeft: o / 2 - d.width() / 2
                                })), (s = o / 8) < 8 && (s = 8), ("right" === n || "left" === n) && (s = o / 10) < 6 && (s = 6), u.velocity({
                                    marginTop: r,
                                    marginLeft: a
                                }, {
                                    duration: 350,
                                    queue: !1
                                }).velocity({
                                    opacity: 1
                                }, {
                                    duration: 300,
                                    delay: 50,
                                    queue: !1
                                }), d.css({
                                    display: "block"
                                }).velocity({
                                    opacity: 1
                                }, {
                                    duration: 55,
                                    delay: 0,
                                    queue: !1
                                }).velocity({
                                    scale: s
                                }, {
                                    duration: 300,
                                    delay: 0,
                                    queue: !1,
                                    easing: "easeInOutQuad"
                                })
                            }
                        }, 10)
                    },
                    "mouseleave.tooltip": function() {
                        clearInterval(i), f = 0, u.velocity({
                            opacity: 0,
                            marginTop: 0,
                            marginLeft: 0
                        }, {
                            duration: 225,
                            queue: !1,
                            delay: 225
                        }), d.velocity({
                            opacity: 0,
                            scale: 1
                        }, {
                            duration: 225,
                            delay: 275,
                            queue: !1,
                            complete: function() {
                                d.css("display", "none"), u.css("display", "none"), p = !1
                            }
                        })
                    }
                })
            }))
        }, o(document).ready(function() {
            o(".tooltipped").tooltip()
        })
    }(jQuery),
    function(n) {
        "use strict";

        function v(e) {
            var t = "";
            for (var n in e) e.hasOwnProperty(n) && (t += n + ":" + e[n] + ";");
            return t
        }

        function t(e) {
            var t = function(e) {
                if (!1 === l.allowEvent(e)) return null;
                for (var t = null, n = e.target || e.srcElement; null !== n.parentElement;) {
                    if (!(n instanceof SVGElement || -1 === n.className.indexOf("waves-effect"))) {
                        t = n;
                        break
                    }
                    if (n.classList.contains("waves-effect")) {
                        t = n;
                        break
                    }
                    n = n.parentElement
                }
                return t
            }(e);
            null !== t && (g.show(e, t), "ontouchstart" in n && (t.addEventListener("touchend", g.hide, !1), t.addEventListener("touchcancel", g.hide, !1)), t.addEventListener("mouseup", g.hide, !1), t.addEventListener("mouseleave", g.hide, !1))
        }
        var e = e || {},
            i = document.querySelectorAll.bind(document),
            g = {
                duration: 750,
                show: function(e, t) {
                    if (2 === e.button) return !1;
                    var n = t || this,
                        i = document.createElement("div");
                    i.className = "waves-ripple", n.appendChild(i);
                    var o, r, a, s, l, c, u, d = (c = {
                            top: 0,
                            left: 0
                        }, r = (u = (o = n) && o.ownerDocument).documentElement, void 0 !== o.getBoundingClientRect && (c = o.getBoundingClientRect()), a = null !== (l = s = u) && l === l.window ? s : 9 === s.nodeType && s.defaultView, {
                            top: c.top + a.pageYOffset - r.clientTop,
                            left: c.left + a.pageXOffset - r.clientLeft
                        }),
                        f = e.pageY - d.top,
                        p = e.pageX - d.left,
                        h = "scale(" + n.clientWidth / 100 * 10 + ")";
                    "touches" in e && (f = e.touches[0].pageY - d.top, p = e.touches[0].pageX - d.left), i.setAttribute("data-hold", Date.now()), i.setAttribute("data-scale", h), i.setAttribute("data-x", p), i.setAttribute("data-y", f);
                    var m = {
                        top: f + "px",
                        left: p + "px"
                    };
                    i.className = i.className + " waves-notransition", i.setAttribute("style", v(m)), i.className = i.className.replace("waves-notransition", ""), m["-webkit-transform"] = h, m["-moz-transform"] = h, m["-ms-transform"] = h, m["-o-transform"] = h, m.transform = h, m.opacity = "1", m["-webkit-transition-duration"] = g.duration + "ms", m["-moz-transition-duration"] = g.duration + "ms", m["-o-transition-duration"] = g.duration + "ms", m["transition-duration"] = g.duration + "ms", m["-webkit-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", m["-moz-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", m["-o-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", m["transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)", i.setAttribute("style", v(m))
                },
                hide: function(e) {
                    l.touchup(e);
                    var t = this,
                        n = (t.clientWidth, null),
                        i = t.getElementsByClassName("waves-ripple");
                    if (!(0 < i.length)) return !1;
                    var o = (n = i[i.length - 1]).getAttribute("data-x"),
                        r = n.getAttribute("data-y"),
                        a = n.getAttribute("data-scale"),
                        s = 350 - (Date.now() - Number(n.getAttribute("data-hold")));
                    s < 0 && (s = 0), setTimeout(function() {
                        var e = {
                            top: r + "px",
                            left: o + "px",
                            opacity: "0",
                            "-webkit-transition-duration": g.duration + "ms",
                            "-moz-transition-duration": g.duration + "ms",
                            "-o-transition-duration": g.duration + "ms",
                            "transition-duration": g.duration + "ms",
                            "-webkit-transform": a,
                            "-moz-transform": a,
                            "-ms-transform": a,
                            "-o-transform": a,
                            transform: a
                        };
                        n.setAttribute("style", v(e)), setTimeout(function() {
                            try {
                                t.removeChild(n)
                            } catch (e) {
                                return !1
                            }
                        }, g.duration)
                    }, s)
                },
                wrapInput: function(e) {
                    for (var t = 0; t < e.length; t++) {
                        var n = e[t];
                        if ("input" === n.tagName.toLowerCase()) {
                            var i = n.parentNode;
                            if ("i" === i.tagName.toLowerCase() && -1 !== i.className.indexOf("waves-effect")) continue;
                            var o = document.createElement("i");
                            o.className = n.className + " waves-input-wrapper";
                            var r = n.getAttribute("style");
                            r || (r = ""), o.setAttribute("style", r), n.className = "waves-button-input", n.removeAttribute("style"), i.replaceChild(o, n), o.appendChild(n)
                        }
                    }
                }
            },
            l = {
                touches: 0,
                allowEvent: function(e) {
                    var t = !0;
                    return "touchstart" === e.type ? l.touches += 1 : "touchend" === e.type || "touchcancel" === e.type ? setTimeout(function() {
                        0 < l.touches && (l.touches -= 1)
                    }, 500) : "mousedown" === e.type && 0 < l.touches && (t = !1), t
                },
                touchup: function(e) {
                    l.allowEvent(e)
                }
            };
        e.displayEffect = function(e) {
            "duration" in (e = e || {}) && (g.duration = e.duration), g.wrapInput(i(".waves-effect")), "ontouchstart" in n && document.body.addEventListener("touchstart", t, !1), document.body.addEventListener("mousedown", t, !1)
        }, e.attach = function(e) {
            "input" === e.tagName.toLowerCase() && (g.wrapInput([e]), e = e.parentElement), "ontouchstart" in n && e.addEventListener("touchstart", t, !1), e.addEventListener("mousedown", t, !1)
        }, n.Waves = e, document.addEventListener("DOMContentLoaded", function() {
            e.displayEffect()
        }, !1)
    }(window), Materialize.toast = function(e, t, a, s) {
        a = a || "";
        var n = document.getElementById("toast-container");
        null === n && ((n = document.createElement("div")).id = "toast-container", document.body.appendChild(n));
        var i = function(e) {
            var i = document.createElement("div");
            if (i.classList.add("toast"), a)
                for (var t = a.split(" "), n = 0, o = t.length; n < o; n++) i.classList.add(t[n]);
            ("object" == typeof HTMLElement ? e instanceof HTMLElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName) ? i.appendChild(e): e instanceof jQuery ? i.appendChild(e[0]) : i.innerHTML = e;
            var r = new Hammer(i, {
                prevent_default: !1
            });
            return r.on("pan", function(e) {
                var t = e.deltaX;
                i.classList.contains("panning") || i.classList.add("panning");
                var n = 1 - Math.abs(t / 80);
                n < 0 && (n = 0), Vel(i, {
                    left: t,
                    opacity: n
                }, {
                    duration: 50,
                    queue: !1,
                    easing: "easeOutQuad"
                })
            }), r.on("panend", function(e) {
                var t = e.deltaX;
                80 < Math.abs(t) ? Vel(i, {
                    marginTop: "-40px"
                }, {
                    duration: 375,
                    easing: "easeOutExpo",
                    queue: !1,
                    complete: function() {
                        "function" == typeof s && s(), i.parentNode.removeChild(i)
                    }
                }) : (i.classList.remove("panning"), Vel(i, {
                    left: 0,
                    opacity: 1
                }, {
                    duration: 300,
                    easing: "easeOutExpo",
                    queue: !1
                }))
            }), i
        }(e);
        e && n.appendChild(i), i.style.top = "35px", i.style.opacity = 0, Vel(i, {
            top: "0px",
            opacity: 1
        }, {
            duration: 300,
            easing: "easeOutCubic",
            queue: !1
        });
        var o = t,
            r = setInterval(function() {
                null === i.parentNode && window.clearInterval(r), i.classList.contains("panning") || (o -= 20), o <= 0 && (Vel(i, {
                    opacity: 0,
                    marginTop: "-40px"
                }, {
                    duration: 375,
                    easing: "easeOutExpo",
                    queue: !1,
                    complete: function() {
                        "function" == typeof s && s(), this[0].parentNode.removeChild(this[0])
                    }
                }), window.clearInterval(r))
            }, 20)
    },
    function(c) {
        var t = {
            init: function(l) {
                l = c.extend({
                    menuWidth: 240,
                    edge: "left",
                    closeOnClick: !1
                }, l), c(this).each(function() {
                    function r(e) {
                        s = !1, c("body").css("overflow", ""), c("#sidenav-overlay").velocity({
                            opacity: 0
                        }, {
                            duration: 150,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                c(this).remove()
                            }
                        }), "left" === l.edge ? (n.css({
                            width: "",
                            right: "",
                            left: "0"
                        }), a.velocity({
                            left: -1 * (l.menuWidth + 10)
                        }, {
                            duration: 150,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                !0 === e && (a.removeAttr("style"), a.css("width", l.menuWidth))
                            }
                        })) : (n.css({
                            width: "",
                            right: "0",
                            left: ""
                        }), a.velocity({
                            right: -1 * (l.menuWidth + 10)
                        }, {
                            duration: 150,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                !0 === e && (a.removeAttr("style"), a.css("width", l.menuWidth))
                            }
                        }))
                    }
                    var e = c(this),
                        a = c("#" + e.attr("data-activates"));
                    240 != l.menuWidth && a.css("width", l.menuWidth);
                    var n = c('<div class="drag-target"></div>');
                    c("body").append(n), "left" == l.edge ? (a.css("left", -1 * (l.menuWidth + 10)), n.css({
                        left: 0
                    })) : (a.addClass("right-aligned").css("right", -1 * (l.menuWidth + 10)).css("left", ""), n.css({
                        right: 0
                    })), a.hasClass("fixed") && 992 < window.innerWidth && a.css("left", 0), a.hasClass("fixed") && c(window).resize(function() {
                        992 < window.innerWidth ? 0 !== c("#sidenav-overlay").css("opacity") && s ? r(!0) : (a.removeAttr("style"), a.css("width", l.menuWidth)) : !1 === s && ("left" === l.edge ? a.css("left", -1 * (l.menuWidth + 10)) : a.css("right", -1 * (l.menuWidth + 10)))
                    }), !0 === l.closeOnClick && a.on("click.itemclick", "a:not(.collapsible-header)", function() {
                        r()
                    });
                    var s = !1;
                    n.on("click", function() {
                        r()
                    }), n.hammer({
                        prevent_default: !1
                    }).bind("pan", function(e) {
                        if ("touch" == e.gesture.pointerType) {
                            var t, n = (e.gesture.direction, e.gesture.center.x);
                            if (e.gesture.center.y, e.gesture.velocityX, c("body").css("overflow", "hidden"), 0 === c("#sidenav-overlay").length) {
                                var i = c('<div id="sidenav-overlay"></div>');
                                i.css("opacity", 0).click(function() {
                                    r()
                                }), c("body").append(i)
                            }
                            if ("left" === l.edge && (n > l.menuWidth ? n = l.menuWidth : n < 0 && (n = 0)), "left" === l.edge) n < l.menuWidth / 2 ? s = !1 : n >= l.menuWidth / 2 && (s = !0), a.css("left", n - l.menuWidth);
                            else {
                                n < window.innerWidth - l.menuWidth / 2 ? s = !0 : n >= window.innerWidth - l.menuWidth / 2 && (s = !1);
                                var o = -1 * (n - l.menuWidth / 2);
                                0 < o && (o = 0), a.css("right", o)
                            }
                            t = "left" === l.edge ? n / l.menuWidth : Math.abs((n - window.innerWidth) / l.menuWidth), c("#sidenav-overlay").velocity({
                                opacity: t
                            }, {
                                duration: 20,
                                queue: !1,
                                easing: "easeOutQuad"
                            })
                        }
                    }).bind("panend", function(e) {
                        if ("touch" == e.gesture.pointerType) {
                            var t = e.gesture.velocityX;
                            "left" === l.edge ? s && t <= .3 || t < -.5 ? (a.velocity({
                                left: 0
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), c("#sidenav-overlay").velocity({
                                opacity: 1
                            }, {
                                duration: 20,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), n.css({
                                width: "50%",
                                right: 0,
                                left: ""
                            })) : (!s || .3 < t) && (c("body").css("overflow", ""), a.velocity({
                                left: -1 * (l.menuWidth + 10)
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), c("#sidenav-overlay").velocity({
                                opacity: 0
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    c(this).remove()
                                }
                            }), n.css({
                                width: "10px",
                                right: "",
                                left: 0
                            })) : s && -.3 <= t || .5 < t ? (a.velocity({
                                right: 0
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), c("#sidenav-overlay").velocity({
                                opacity: 1
                            }, {
                                duration: 20,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), n.css({
                                width: "50%",
                                right: "",
                                left: 0
                            })) : (!s || t < -.3) && (c("body").css("overflow", ""), a.velocity({
                                right: -1 * (l.menuWidth + 10)
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), c("#sidenav-overlay").velocity({
                                opacity: 0
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    c(this).remove()
                                }
                            }), n.css({
                                width: "10px",
                                right: 0,
                                left: ""
                            }))
                        }
                    }), e.click(function() {
                        if ($(".extrasidebar").abmsideNav("hide"), !0 === s) s = !1, r();
                        else {
                            c("body").css("overflow", "hidden"), c("body").append(n), "left" === l.edge ? (n.css({
                                width: "50%",
                                right: 0,
                                left: ""
                            }), a.velocity({
                                left: 0
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad"
                            })) : (n.css({
                                width: "50%",
                                right: "",
                                left: 0
                            }), a.velocity({
                                right: 0
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), a.css("left", ""));
                            var e = c('<div id="sidenav-overlay"></div>');
                            e.css("opacity", 0).click(function() {
                                s = !1, r(), e.velocity({
                                    opacity: 0
                                }, {
                                    duration: 150,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        c(this).remove()
                                    }
                                })
                            }), c("body").append(e), e.velocity({
                                opacity: 1
                            }, {
                                duration: 150,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    s = !0
                                }
                            })
                        }
                        return !1
                    })
                })
            },
            show: function() {
                this.trigger("click")
            },
            hide: function() {
                c("#sidenav-overlay").trigger("click")
            }
        };
        c.fn.sideNav = function(e) {
            return t[e] ? t[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void c.error("Method " + e + " does not exist on jQuery.sideNav") : t.init.apply(this, arguments)
        }
    }(jQuery),
    function(r) {
        function a() {
            ++h;
            var a, s, l, c, u, e = d.scrollTop(),
                t = d.scrollLeft(),
                n = t + d.width(),
                i = e + d.height(),
                o = (a = e + m.top + 200, s = n + m.right, l = i + m.bottom, c = t + m.left, u = r(), r.each(f, function(e, t) {
                    if (0 < t.height()) {
                        var n = t.offset().top,
                            i = t.offset().left,
                            o = i + t.width(),
                            r = n + t.height();
                        !(s < i || o < c || l < n || r < a) && u.push(t)
                    }
                }), u);
            r.each(o, function(e, t) {
                "number" != typeof t.data("scrollSpy:ticks") && t.triggerHandler("scrollSpy:enter"), t.data("scrollSpy:ticks", h)
            }), r.each(p, function(e, t) {
                var n = t.data("scrollSpy:ticks");
                "number" == typeof n && n !== h && (t.triggerHandler("scrollSpy:exit"), t.data("scrollSpy:ticks", null))
            }), p = o
        }

        function t() {
            d.trigger("scrollSpy:winSize")
        }

        function s(n, i, o) {
            var r, a, s, l = null,
                c = 0;
            o || (o = {});
            var u = function() {
                c = !1 === o.leading ? 0 : v(), l = null, s = n.apply(r, a), r = a = null
            };
            return function() {
                var e = v();
                c || !1 !== o.leading || (c = e);
                var t = i - (e - c);
                return r = this, a = arguments, t <= 0 ? (clearTimeout(l), l = null, c = e, s = n.apply(r, a), r = a = null) : l || !1 === o.trailing || (l = setTimeout(u, t)), s
            }
        }
        var d = r(window),
            f = [],
            p = [],
            l = !1,
            h = 0,
            m = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            v = Date.now || function() {
                return (new Date).getTime()
            };
        r.scrollSpy = function(e, t) {
            var n = [];
            (e = r(e)).each(function(e, t) {
                f.push(r(t)), r(t).data("scrollSpy:id", e), r("a[href=#" + r(t).attr("id") + "]").click(function(e) {
                    e.preventDefault();
                    var t = r(this.hash).offset().top + 1;
                    r("html, body").animate({
                        scrollTop: t - 200
                    }, {
                        duration: 400,
                        queue: !1,
                        easing: "easeOutCubic"
                    })
                })
            }), t = t || {
                throttle: 100
            }, m.top = t.offsetTop || 0, m.right = t.offsetRight || 0, m.bottom = t.offsetBottom || 0, m.left = t.offsetLeft || 0;
            var i = s(a, t.throttle || 100),
                o = function() {
                    r(document).ready(i)
                };
            return l || (d.on("scroll", o), d.on("resize", o), l = !0), setTimeout(o, 0), e.on("scrollSpy:enter", function() {
                n = r.grep(n, function(e) {
                    return 0 != e.height()
                });
                var e = r(this);
                n[0] ? (r("a[href=#" + n[0].attr("id") + "]").removeClass("active"), e.data("scrollSpy:id") < n[0].data("scrollSpy:id") ? n.unshift(r(this)) : n.push(r(this))) : n.push(r(this)), r("a[href=#" + n[0].attr("id") + "]").addClass("active")
            }), e.on("scrollSpy:exit", function() {
                if ((n = r.grep(n, function(e) {
                        return 0 != e.height()
                    }))[0]) {
                    r("a[href=#" + n[0].attr("id") + "]").removeClass("active");
                    var t = r(this);
                    (n = r.grep(n, function(e) {
                        return e.attr("id") != t.attr("id")
                    }))[0] && r("a[href=#" + n[0].attr("id") + "]").addClass("active")
                }
            }), e
        }, r.winSizeSpy = function(e) {
            return r.winSizeSpy = function() {
                return d
            }, e = e || {
                throttle: 100
            }, d.on("resize", s(t, e.throttle || 100))
        }, r.fn.scrollSpy = function(e) {
            return r.scrollSpy(r(this), e)
        }
    }(jQuery),
    function(u) {
        u(document).ready(function() {
            function t(e) {
                var t = e.css("font-family"),
                    n = e.css("font-size");
                n && o.css("font-size", n), t && o.css("font-family", t), "off" === e.attr("wrap") && o.css("overflow-wrap", "normal").css("white-space", "pre"), o.text(e.val() + "\n");
                var i = o.html().replace(/\n/g, "<br>");
                o.html(i), e.is(":visible") ? o.css("width", e.width()) : o.css("width", u(window).width() / 2), e.css("height", o.height())
            }
            Materialize.updateTextFields = function() {
                u("input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea").each(function(e, t) {
                    0 < u(t).val().length || void 0 !== u(this).attr("placeholder") || !0 === u(t)[0].validity.badInput || u(t).is(":focus") || u(t).is(":-webkit-autofill") ? u(this).siblings("label").addClass("active") : u(this).siblings("label, i").removeClass("active")
                })
            };
            var n = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
            u("input[autofocus]").siblings("label, i").addClass("active"), u(document).on("change", n, function() {
                (0 !== u(this).val().length || void 0 !== u(this).attr("placeholder")) && u(this).siblings("label").addClass("active"), validate_field(u(this))
            }), u(document).ready(function() {
                Materialize.updateTextFields()
            }), u(document).on("reset", function(e) {
                var t = u(e.target);
                t.is("form") && (t.find(n).removeClass("valid").removeClass("invalid"), t.find(n).each(function() {
                    "" === u(this).attr("value") && u(this).siblings("label, i").removeClass("active")
                }), t.find("select.initialized").each(function() {
                    var e = t.find("option[selected]").text();
                    t.siblings("input.select-dropdown").val(e)
                }))
            }), u(document).on("focus", n, function() {
                var e = u(this);
                if (u(this).parent().addClass("active"), u(this).siblings("label, i").addClass("active"), e.attr("evname")) {
                    var t = $(this).data("b4js"),
                        n = !1,
                        i = $(this).hasClass("notraisefocus");
                    if ("" != t) {
                        var o = 'return _b4jsclasses["' + t + '"].' + _b4jsvars[t + "_B4JSGotFocus"];
                        o = (o = o.replace(/B4JS#!#KEY/g, u.key)).replace(/B4JS#!#KCODE/g, u.keyCode);
                        var r = new Function(o);
                        try {
                            n = r()
                        } catch (e) {}
                    }!1 === n && !i && b4j_raiseEvent("page_parseevent", {
                        eventname: e.attr("evname") + "_gotfocus",
                        eventparams: ""
                    })
                }
            }), u(document).on("blur", n, function() {
                var e = u(this);
                if (u(this).parent().removeClass("active"), 0 === e.val().length && !0 !== e[0].validity.badInput && void 0 === e.attr("placeholder") && e.siblings("label, i").removeClass("active"), 0 === e.val().length && !0 !== e[0].validity.badInput && void 0 !== e.attr("placeholder") && e.siblings("i").removeClass("active"), validate_field(e), e.attr("evname")) {
                    var t = $(this).data("b4js"),
                        n = !1,
                        i = $(this).hasClass("notraisefocus");
                    if ("" != t) {
                        var o = 'return _b4jsclasses["' + t + '"].' + _b4jsvars[t + "_B4JSLostFocus"];
                        o = (o = o.replace(/B4JS#!#KEY/g, u.key)).replace(/B4JS#!#KCODE/g, u.keyCode);
                        var r = new Function(o);
                        try {
                            n = r()
                        } catch (e) {}
                    }!1 === n && !i && b4j_raiseEvent("page_parseevent", {
                        eventname: e.attr("evname") + "_lostfocus",
                        eventparams: ""
                    })
                }
            }), window.validate_field = function(e) {
                var t = void 0 !== e.attr("length"),
                    n = parseInt(e.attr("length")),
                    i = e.val().length;
                0 === e.val().length && !1 === e[0].validity.badInput ? e.hasClass("validate") && (e.removeClass("valid"), e.removeClass("invalid")) : e.hasClass("validate") && (e.is(":valid") && t && i <= n || e.is(":valid") && !t ? (e.removeClass("invalid"), e.addClass("valid")) : (e.removeClass("valid"), e.addClass("invalid")))
            };
            var o = u(".hiddendiv").first();
            o.length || (o = u('<div class="hiddendiv common"></div>'), u("body").append(o));
            var e = ".materialize-textarea";
            u(e).each(function() {
                var e = u(this);
                e.val().length && t(e)
            }), u("body").on("keyup keydown autoresize", e, function() {
                t(u(this))
            }), u(document).on("change", '.file-field input[type="file"]', function() {
                for (var e = u(this).closest(".file-field").find("input.file-path"), t = u(this)[0].files, n = [], i = 0; i < t.length; i++) n.push(t[i].name);
                e.val(n.join(", ")), e.trigger("change")
            });
            var i, r = "input[type=range]",
                a = !1;
            u(r).each(function() {
                var e = u('<span class="thumb"><span class="value"></span></span>');
                u(this).after(e)
            });
            var s = ".range-field";
            u(document).on("change", r, function(e) {
                u(this).siblings(".thumb").find(".value").html(u(this).val())
            }), u(document).on("input mousedown touchstart", r, function(e) {
                var t = u(this).siblings(".thumb");
                t.length <= 0 && (t = u('<span class="thumb"><span class="value"></span></span>'), u(this).append(t)), t.find(".value").html(u(this).val()), a = !0, u(this).addClass("active"), t.hasClass("active") || t.velocity({
                    height: "30px",
                    width: "30px",
                    top: "-20px",
                    marginLeft: "-15px"
                }, {
                    duration: 300,
                    easing: "easeOutExpo"
                }), i = void 0 === e.pageX || null === e.pageX ? e.originalEvent.touches[0].pageX - u(this).offset().left : e.pageX - u(this).offset().left;
                var n = u(this).outerWidth();
                i < 0 ? i = 0 : n < i && (i = n), t.addClass("active").css("left", i), t.find(".value").html(u(this).val())
            }), u(document).on("mouseup touchend", s, function() {
                a = !1, u(this).removeClass("active")
            }), u(document).on("mousemove touchmove", s, function(e) {
                var t, n = u(this).children(".thumb");
                if (a) {
                    n.hasClass("active") || n.velocity({
                        height: "30px",
                        width: "30px",
                        top: "-20px",
                        marginLeft: "-15px"
                    }, {
                        duration: 300,
                        easing: "easeOutExpo"
                    }), t = void 0 === e.pageX || null === e.pageX ? e.originalEvent.touches[0].pageX - u(this).offset().left : e.pageX - u(this).offset().left;
                    var i = u(this).outerWidth();
                    t < 0 ? t = 0 : i < t && (t = i), n.addClass("active").css("left", t), n.find(".value").html(n.siblings(r).val())
                }
            }), u(document).on("mouseout touchleave", s, function() {
                if (!a) {
                    var e = u(this).children(".thumb");
                    e.hasClass("active") && e.velocity({
                        height: "0",
                        width: "0",
                        top: "10px",
                        marginLeft: "-6px"
                    }, {
                        duration: 100
                    }), e.removeClass("active")
                }
            })
        }), u.fn.material_select = function(c) {
            u(this).each(function() {
                if ($select = u(this), !$select.hasClass("browser-default")) {
                    var e = $select.data("select-id");
                    if (e && ($select.parent().find("span.caret").remove(), $select.parent().find("input").remove(), $select.unwrap(), u("ul#select-options-" + e).remove()), "destroy" === c) return void $select.data("select-id", null).removeClass("initialized");
                    var t = Materialize.guid();
                    $select.data("select-id", t);
                    var n = u('<div class="select-wrapper"></div>');
                    n.addClass($select.attr("class"));
                    var i, o = u('<ul id="select-options-' + t + '" class="dropdown-content select-dropdown"></ul>'),
                        r = $select.children("option");
                    i = void 0 !== $select.find("option:selected") ? $select.find("option:selected") : o.first(), r.each(function() {
                        o.append(u('<li class="' + (u(this).is(":disabled") ? "disabled" : "") + '"><span>' + u(this).html() + "</span></li>"))
                    }), o.find("li").each(function(e) {
                        var t = $select;
                        u(this).click(function() {
                            u(this).hasClass("disabled") || (t.find("option").eq(e).prop("selected", !0), t.trigger("change"), t.siblings("input.select-dropdown").val(u(this).text()), void 0 !== c && c())
                        })
                    }), $select.wrap(n);
                    var a = u('<span class="caret">&#9660;</span>');
                    $select.is(":disabled") && a.addClass("disabled");
                    var s = i.html().replace(/"/g, "&quot;"),
                        l = u('<input type="text" class="select-dropdown" readonly="true" ' + ($select.is(":disabled") ? "disabled" : "") + ' data-activates="select-options-' + t + '" value="' + s + '"/>');
                    $select.before(l), l.before(a), u("body").append(o), $select.is(":disabled") || l.dropdown({
                        hover: !1
                    }), $select.attr("tabindex") && u(l[0]).attr("tabindex", $select.attr("tabindex")), $select.addClass("initialized"), l.on("focus", function() {
                        u(this).trigger("open"), i = u(this).val(), selectedOption = o.find("li").filter(function() {
                            return u(this).text().toLowerCase() === i.toLowerCase()
                        })[0], activateOption(o, selectedOption)
                    }), l.on("blur", function() {
                        u(this).trigger("close")
                    }), activateOption = function(e, t) {
                        e.find("li.active").removeClass("active"), u(t).addClass("active"), e.scrollTo(t)
                    }, filterQuery = [], onKeyDown = function(e) {
                        9 != e.which ? 40 != e.which || o.is(":visible") ? (13 != e.which || o.is(":visible")) && (e.preventDefault(), letter = String.fromCharCode(e.which).toLowerCase(), letter && -1 === [9, 13, 27, 38, 40].indexOf(e.which) && (filterQuery.push(letter), string = filterQuery.join(""), newOption = o.find("li").filter(function() {
                            return 0 === u(this).text().toLowerCase().indexOf(string)
                        })[0], newOption && activateOption(o, newOption)), 13 == e.which && (activeOption = o.find("li.active:not(.disabled)")[0], activeOption && (u(activeOption).trigger("click"), l.trigger("close"))), 40 == e.which && (newOption = o.find("li.active").next("li:not(.disabled)")[0], newOption && activateOption(o, newOption)), 27 == e.which && l.trigger("close"), 38 == e.which && (newOption = o.find("li.active").prev("li:not(.disabled)")[0], newOption && activateOption(o, newOption)), setTimeout(function() {
                            filterQuery = []
                        }, 1e3)) : l.trigger("open") : l.trigger("close")
                    }, l.on("keydown", onKeyDown)
                }
            })
        }
    }(jQuery),
    function(f) {
        var t = {
            init: function(d) {
                return d = f.extend({
                    indicators: !0,
                    height: 400,
                    transition: 500,
                    interval: 6e3
                }, d), this.each(function() {
                    function t(e, t) {
                        e.hasClass("center-align") ? e.velocity({
                            opacity: 0,
                            translateY: -100
                        }, {
                            duration: t,
                            queue: !1
                        }) : e.hasClass("right-align") ? e.velocity({
                            opacity: 0,
                            translateX: 100
                        }, {
                            duration: t,
                            queue: !1
                        }) : e.hasClass("left-align") && e.velocity({
                            opacity: 0,
                            translateX: -100
                        }, {
                            duration: t,
                            queue: !1
                        })
                    }

                    function n(e) {
                        e >= s.length ? e = 0 : e < 0 && (e = s.length - 1), (o = a.find(".active").index()) != e && (i = s.eq(o), $caption = i.find(".caption"), i.removeClass("active"), i.velocity({
                            opacity: 0
                        }, {
                            duration: d.transition,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                s.not(".active").velocity({
                                    opacity: 0,
                                    translateX: 0,
                                    translateY: 0
                                }, {
                                    duration: 0,
                                    queue: !1
                                })
                            }
                        }), t($caption, d.transition), d.indicators && l.eq(o).removeClass("active"), s.eq(e).velocity({
                            opacity: 1
                        }, {
                            duration: d.transition,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), s.eq(e).find(".caption").velocity({
                            opacity: 1,
                            translateX: 0,
                            translateY: 0
                        }, {
                            duration: d.transition,
                            delay: d.transition,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), s.eq(e).addClass("active"), d.indicators && l.eq(e).addClass("active"))
                    }
                    var i, r = f(this),
                        a = r.find("ul.slides").first(),
                        s = a.find("li"),
                        o = a.find(".active").index();
                    if (!r.hasClass("running")) {
                        if (r.addClass("running"), -1 != o && (i = s.eq(o)), r.hasClass("fullscreen") || (d.indicators ? r.height(d.height + 40) : r.height(d.height), a.height(d.height)), s.find(".caption").each(function() {
                                t(f(this), 0)
                            }), s.find("img").each(function() {
                                f(this).css("background-image", "url(" + f(this).attr("src") + ")"), f(this).attr("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")
                            }), d.indicators) {
                            var l = f('<ul class="indicators"></ul>');
                            s.each(function(e) {
                                var t = f('<li class="indicator-item"></li>');
                                t.click(function() {
                                    n(a.parent().find(f(this)).index()), clearInterval($interval), $interval = setInterval(function() {
                                        o = a.find(".active").index(), s.length == o + 1 ? o = 0 : o += 1, n(o)
                                    }, d.transition + d.interval)
                                }), l.append(t)
                            }), r.append(l), l = r.find("ul.indicators").find("li.indicator-item")
                        }
                        i ? i.show() : (s.first().addClass("active").velocity({
                            opacity: 1
                        }, {
                            duration: d.transition,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), o = 0, i = s.eq(o), d.indicators && l.eq(o).addClass("active")), i.find("img").each(function() {
                            i.find(".caption").velocity({
                                opacity: 1,
                                translateX: 0,
                                translateY: 0
                            }, {
                                duration: d.transition,
                                queue: !1,
                                easing: "easeOutQuad"
                            })
                        }), $interval = setInterval(function() {
                            n((o = a.find(".active").index()) + 1)
                        }, d.transition + d.interval);
                        var c = !1,
                            u = !1;
                        r.hammer({
                            prevent_default: !1
                        }).bind("pan", function(e) {
                            if ("touch" === e.gesture.pointerType) {
                                clearInterval($interval);
                                var t, n = e.gesture.direction,
                                    i = e.gesture.deltaX,
                                    o = e.gesture.velocityX;
                                $curr_slide = a.find(".active"), $curr_slide.velocity({
                                    translateX: i
                                }, {
                                    duration: 50,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                }), 4 === n && (i > r.innerWidth() / 2 || o < -.65) ? u = !0 : 2 === n && (i < -1 * r.innerWidth() / 2 || .65 < o) && (c = !0), c && (0 === (t = $curr_slide.next()).length && (t = s.first()), t.velocity({
                                    opacity: 1
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                })), u && (0 === (t = $curr_slide.prev()).length && (t = s.last()), t.velocity({
                                    opacity: 1
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                }))
                            }
                        }).bind("panend", function(e) {
                            "touch" === e.gesture.pointerType && ($curr_slide = a.find(".active"), curr_index = a.find(".active").index(), u || c ? c ? (n(curr_index + 1), $curr_slide.velocity({
                                translateX: -1 * r.innerWidth()
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    $curr_slide.velocity({
                                        opacity: 0,
                                        translateX: 0
                                    }, {
                                        duration: 0,
                                        queue: !1
                                    })
                                }
                            })) : u && (n(curr_index - 1), $curr_slide.velocity({
                                translateX: r.innerWidth()
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    $curr_slide.velocity({
                                        opacity: 0,
                                        translateX: 0
                                    }, {
                                        duration: 0,
                                        queue: !1
                                    })
                                }
                            })) : $curr_slide.velocity({
                                translateX: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad"
                            }), u = c = !1, clearInterval($interval), $interval = setInterval(function() {
                                o = a.find(".active").index(), s.length == o + 1 ? o = 0 : o += 1, n(o)
                            }, d.transition + d.interval))
                        }), r.on("sliderPause", function() {
                            clearInterval($interval)
                        }), r.on("sliderStart", function() {
                            clearInterval($interval), $interval = setInterval(function() {
                                o = a.find(".active").index(), s.length == o + 1 ? o = 0 : o += 1, n(o)
                            }, d.transition + d.interval)
                        })
                    }
                })
            },
            pause: function() {
                f(this).trigger("sliderPause")
            },
            start: function() {
                f(this).trigger("sliderStart")
            }
        };
        f.fn.slider = function(e) {
            return t[e] ? t[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void f.error("Method " + e + " does not exist on jQuery.tooltip") : t.init.apply(this, arguments)
        }
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t(document).on("click.card", ".card", function(e) {
                t(this).find("> .card-reveal").length && (t(e.target).is(t(".card-reveal .card-title")) || t(e.target).is(t(".card-reveal .card-title i")) ? t(this).find(".card-reveal").velocity({
                    translateY: 0
                }, {
                    duration: 225,
                    queue: !1,
                    easing: "easeInOutQuad",
                    complete: function() {
                        t(this).css({
                            display: "none"
                        })
                    }
                }) : (t(e.target).is(t(".card .activator")) || t(e.target).is(t(".card .activator i"))) && t(this).find(".card-reveal").css({
                    display: "block"
                }).velocity("stop", !1).velocity({
                    translateY: "-100%"
                }, {
                    duration: 300,
                    queue: !1,
                    easing: "easeInOutQuad"
                }))
            })
        })
    }(jQuery),
    function(t) {
        t(document).ready(function() {
            t(document).on("click.chip", ".chip .material-icons", function(e) {
                t(this).parent().remove()
            })
        })
    }(jQuery),
    function(a) {
        a(document).ready(function() {
            a.fn.pushpin = function(r) {
                return r = a.extend({
                    top: 0,
                    bottom: 1 / 0,
                    offset: 0
                }, r), $index = 0, this.each(function() {
                    function n(e) {
                        e.removeClass("pin-top"), e.removeClass("pinned"), e.removeClass("pin-bottom")
                    }

                    function t(e, t) {
                        e.each(function() {
                            r.top <= t && r.bottom >= t && !a(this).hasClass("pinned") && (n(a(this)), a(this).css("top", r.offset), a(this).addClass("pinned")), t < r.top && !a(this).hasClass("pin-top") && (n(a(this)), a(this).css("top", 0), a(this).addClass("pin-top")), t > r.bottom && !a(this).hasClass("pin-bottom") && (n(a(this)), a(this).addClass("pin-bottom"), a(this).css("top", r.bottom - o))
                        })
                    }
                    var e = Materialize.guid(),
                        i = a(this),
                        o = a(this).offset().top;
                    t(i, a(window).scrollTop()), a(window).on("scroll." + e, function() {
                        var e = a(window).scrollTop() + r.offset;
                        t(i, e)
                    })
                })
            }
        })
    }(jQuery),
    function(d) {
        d(document).ready(function() {
            d.fn.reverse = [].reverse, d(document).on("mouseenter.fixedActionBtn", ".fixed-action-btn:not(.click-to-toggle):not(.toolbar)", function(e) {
                var t = d(this);
                n(t)
            }), d(document).on("mouseleave.fixedActionBtn", ".fixed-action-btn:not(.click-to-toggle):not(.toolbar)", function(e) {
                var t = d(this);
                i(t)
            }), d(document).on("click.fabClickToggle", ".fixed-action-btn.click-to-toggle > a", function(e) {
                var t = d(this).parent();
                t.hasClass("active") ? i(t) : n(t)
            }), d(document).on("click.fabToolbar", ".fixed-action-btn.toolbar > a", function(e) {
                var t = d(this).parent();
                o(t)
            })
        }), d.fn.extend({
            openFAB: function() {
                n(d(this))
            },
            closeFAB: function() {
                i(d(this))
            },
            openToolbar: function() {
                o(d(this))
            },
            closeToolbar: function() {
                f(d(this))
            }
        });
        var n = function(e) {
                var t = e;
                if (!1 === t.hasClass("active")) {
                    var n, i, o = t.hasClass("horizontal"),
                        r = !1;
                    (t.hasClass("fixed-action-btn-down") || t.hasClass("fixed-action-btn-right")) && (r = !0), !0 === o ? i = 40 : n = 40, t.addClass("active"), t.find("ul .btn-floating").velocity({
                        scaleY: ".4",
                        scaleX: ".4",
                        translateY: n + "px",
                        translateX: i + "px"
                    }, {
                        duration: 0
                    });
                    var a = 0;
                    r ? t.find("ul .btn-floating").each(function() {
                        d(this).velocity({
                            opacity: "1",
                            scaleX: "1",
                            scaleY: "1",
                            translateY: "0",
                            translateX: "0"
                        }, {
                            duration: 80,
                            delay: a
                        }), a += 40
                    }) : t.find("ul .btn-floating").reverse().each(function() {
                        d(this).velocity({
                            opacity: "1",
                            scaleX: "1",
                            scaleY: "1",
                            translateY: "0",
                            translateX: "0"
                        }, {
                            duration: 80,
                            delay: a
                        }), a += 40
                    })
                }
            },
            i = function(e) {
                var t, n, i = e;
                !0 === i.hasClass("horizontal") ? n = 40 : t = 40, i.removeClass("active"), i.find("ul .btn-floating").velocity("stop", !0), i.find("ul .btn-floating").velocity({
                    opacity: "0",
                    scaleX: ".4",
                    scaleY: ".4",
                    translateY: t + "px",
                    translateX: n + "px"
                }, {
                    duration: 80
                })
            },
            o = function(t) {
                if ("true" !== t.attr("data-open")) {
                    var e, n, i, o = window.innerWidth,
                        r = window.innerHeight,
                        a = t[0].getBoundingClientRect(),
                        s = t.find("> a").first(),
                        l = t.find("> ul").first(),
                        c = d('<div class="fab-backdrop"></div>'),
                        u = s.css("background-color");
                    s.append(c), e = a.left - o / 2 + a.width / 2, n = r - a.bottom, i = o / c.width(), t.attr("data-origin-bottom", a.bottom), t.attr("data-origin-left", a.left), t.attr("data-origin-width", a.width), t.addClass("active"), t.attr("data-open", !0), t.css({
                        "text-align": "center",
                        width: "100%",
                        bottom: 0,
                        left: 0,
                        transform: "translateX(" + e + "px)",
                        transition: "none"
                    }), s.css({
                        transform: "translateY(" + -n + "px)",
                        transition: "none"
                    }), c.css({
                        "background-color": u
                    }), setTimeout(function() {
                        t.css({
                            transform: "",
                            transition: "transform .2s cubic-bezier(0.550, 0.085, 0.680, 0.530), background-color 0s linear .2s"
                        }), s.css({
                            overflow: "visible",
                            transform: "",
                            transition: "transform .2s"
                        }), setTimeout(function() {
                            t.css({
                                overflow: "hidden",
                                "background-color": u
                            }), c.css({
                                transform: "scale(" + i + ")",
                                transition: "transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)"
                            }), l.find("> li > a").css({
                                opacity: 1
                            }), d(window).on("scroll.fabToolbarClose", function() {
                                f(t), d(window).off("scroll.fabToolbarClose"), d(document).off("click.fabToolbarClose")
                            }), d(document).on("click.fabToolbarClose", function(e) {
                                d(e.target).closest(l).length || (f(t), d(window).off("scroll.fabToolbarClose"), d(document).off("click.fabToolbarClose"))
                            })
                        }, 100)
                    }, 0)
                }
            },
            f = function(e) {
                if ("true" === e.attr("data-open")) {
                    var t, n, i = window.innerWidth,
                        o = window.innerHeight,
                        r = e.attr("data-origin-width"),
                        a = e.attr("data-origin-bottom"),
                        s = e.attr("data-origin-left"),
                        l = e.find("> .btn-floating").first(),
                        c = e.find("> ul").first(),
                        u = e.find(".fab-backdrop"),
                        d = l.css("background-color");
                    t = s - i / 2 + r / 2, n = o - a, u.width(), e.removeClass("active"), e.attr("data-open", !1), e.css({
                        "background-color": "transparent",
                        transition: "none"
                    }), l.css({
                        transition: "none"
                    }), u.css({
                        transform: "scale(0)",
                        "background-color": d
                    }), c.find("> li > a").css({
                        opacity: ""
                    }), setTimeout(function() {
                        u.remove(), e.css({
                            "text-align": "",
                            width: "",
                            bottom: "",
                            left: "",
                            overflow: "",
                            "background-color": "",
                            transform: "translate3d(" + -t + "px,0,0)"
                        }), l.css({
                            overflow: "",
                            transform: "translate3d(0," + n + "px,0)"
                        }), setTimeout(function() {
                            e.css({
                                transform: "translate3d(0,0,0)",
                                transition: "transform .2s"
                            }), l.css({
                                transform: "translate3d(0,0,0)",
                                transition: "transform .2s cubic-bezier(0.550, 0.055, 0.675, 0.190)"
                            })
                        }, 20)
                    }, 200)
                }
            }
    }(jQuery),
    function(s) {
        Materialize.fadeInImage = function(e) {
            var t = s(e);
            t.css({
                opacity: 0
            }), s(t).velocity({
                opacity: 1
            }, {
                duration: 650,
                queue: !1,
                easing: "easeOutSine"
            }), s(t).velocity({
                opacity: 1
            }, {
                duration: 1300,
                queue: !1,
                easing: "swing",
                step: function(e, t) {
                    var n = e / (t.start = 100),
                        i = 150 - (100 - e) / 1.75;
                    i < 100 && (i = 100), 0 <= e && s(this).css({
                        "-webkit-filter": "grayscale(" + n + ")brightness(" + i + "%)",
                        filter: "grayscale(" + n + ")brightness(" + i + "%)"
                    })
                }
            })
        }, Materialize.showStaggeredList = function(e) {
            var t = 0;
            s(e).find("li").velocity({
                translateX: "-100px"
            }, {
                duration: 0
            }), s(e).find("li").each(function() {
                s(this).velocity({
                    opacity: "1",
                    translateX: "0"
                }, {
                    duration: 800,
                    delay: t,
                    easing: [60, 10]
                }), t += 120
            })
        }, s(document).ready(function() {
            var r = !1,
                a = !1;
            s(".dismissable").each(function() {
                s(this).hammer({
                    prevent_default: !1
                }).bind("pan", function(e) {
                    if ("touch" === e.gesture.pointerType) {
                        var t = s(this),
                            n = e.gesture.direction,
                            i = e.gesture.deltaX,
                            o = e.gesture.velocityX;
                        t.velocity({
                            translateX: i
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), 4 === n && (i > t.innerWidth() / 2 || o < -.75) && (r = !0), 2 === n && (i < -1 * t.innerWidth() / 2 || .75 < o) && (a = !0)
                    }
                }).bind("panend", function(e) {
                    if (Math.abs(e.gesture.deltaX) < s(this).innerWidth() / 2 && (r = a = !1), "touch" === e.gesture.pointerType) {
                        var t, n = s(this);
                        r || a ? (t = r ? n.innerWidth() : -1 * n.innerWidth(), n.velocity({
                            translateX: t
                        }, {
                            duration: 100,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                n.css("border", "none"), n.velocity({
                                    height: 0,
                                    padding: 0
                                }, {
                                    duration: 200,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        n.remove()
                                    }
                                })
                            }
                        })) : n.velocity({
                            translateX: 0
                        }, {
                            duration: 100,
                            queue: !1,
                            easing: "easeOutQuad"
                        }), a = r = !1
                    }
                })
            })
        })
    }(jQuery), jQuery, Materialize.scrollFire = function(s) {
        var l = !1;
        window.addEventListener("scroll", function() {
            l = !0
        }), setInterval(function() {
            if (l) {
                l = !1;
                for (var e = window.pageYOffset + window.innerHeight, t = 0; t < s.length; t++) {
                    var n = s[t],
                        i = n.selector,
                        o = n.offset,
                        r = n.callback,
                        a = document.querySelector(i);
                    null !== a && e > a.getBoundingClientRect().top + window.pageYOffset + o && !0 !== n.done && (new Function(r)(), n.done = !0)
                }
            }
        }, 100)
    }, jQuery, Materialize.scrollFireDiv = function(s, l) {
        var c = !1;
        l[0].addEventListener("scroll", function() {
            c = !0
        }), setInterval(function() {
            if (c) {
                c = !1;
                for (var e = l.scrollTop() + l.innerHeight(), t = 0; t < s.length; t++) {
                    var n = s[t],
                        i = n.selector,
                        o = n.offset,
                        r = n.callback,
                        a = document.querySelector(i);
                    null !== a && e > a.getBoundingClientRect().top + l.scrollTop() + o && !0 !== n.done && (new Function(r)(), n.done = !0)
                }
            }
        }, 100)
    },
    function(e) {
        "function" == typeof define && define.amd ? define("picker", ["jquery"], e) : "object" == typeof exports ? module.exports = e(require("jquery")) : this.Picker = e(jQuery)
    }(function(m) {
        function v(i, o, r, e) {
            function a() {
                return v._.node("div", v._.node("div", v._.node("div", v._.node("div", h.component.nodes(u.open), f.box), f.wrap), f.frame), f.holder)
            }

            function s(e) {
                var t = e.keyCode,
                    n = /^(8|46)$/.test(t);
                return 27 == t ? (h.close(), !1) : void((32 == t || n || !u.open && h.component.key[t]) && (e.preventDefault(), e.stopPropagation(), n ? h.clear().close() : h.open()))
            }

            function l(e) {
                e.stopPropagation(), "focus" == e.type && h.$root.addClass(f.focused), h.open()
            }
            if (!i) return v;
            var c = !1,
                u = {
                    id: i.id || "P" + Math.abs(~~(Math.random() * new Date))
                },
                d = r ? m.extend(!0, {}, r.defaults, e) : e || {},
                f = m.extend({}, v.klasses(), d.klass),
                p = m(i),
                t = function() {
                    return this.start()
                },
                h = t.prototype = {
                    constructor: t,
                    $node: p,
                    start: function() {
                        return u && u.start ? h : (u.methods = {}, u.start = !0, u.open = !1, u.type = i.type, i.autofocus = i == y(), i.readOnly = !d.editable, i.id = i.id || u.id, "text" != i.type && (i.type = "text"), h.component = new r(h, d), h.$root = m(v._.node("div", a(), f.picker, 'id="' + i.id + '_root" tabindex="0"')), h.$root.on({
                            keydown: s,
                            focusin: function(e) {
                                h.$root.removeClass(f.focused), e.stopPropagation()
                            },
                            "mousedown click": function(e) {
                                var t = e.target;
                                t != h.$root.children()[0] && (e.stopPropagation(), "mousedown" != e.type || m(t).is("input, select, textarea, button, option") || (e.preventDefault(), h.$root[0].focus()))
                            }
                        }).on({
                            focus: function() {
                                p.addClass(f.target)
                            },
                            blur: function() {
                                p.removeClass(f.target)
                            }
                        }).on("focus.toOpen", l).on("click", "[data-pick], [data-nav], [data-clear], [data-close]", function() {
                            var e = m(this),
                                t = e.data(),
                                n = e.hasClass(f.navDisabled) || e.hasClass(f.disabled),
                                i = y();
                            i = i && (i.type || i.href), (n || i && !m.contains(h.$root[0], i)) && h.$root[0].focus(), !n && t.nav ? h.set("highlight", h.component.item.highlight, {
                                nav: t.nav
                            }) : !n && "pick" in t ? h.set("select", t.pick) : t.clear ? h.clear().close(!0) : t.close && h.close(!0)
                        }), g(h.$root[0], "hidden", !0), d.formatSubmit && (!0 === d.hiddenName ? (n = i.name, i.name = "") : n = (n = ["string" == typeof d.hiddenPrefix ? d.hiddenPrefix : "", "string" == typeof d.hiddenSuffix ? d.hiddenSuffix : "_submit"])[0] + i.name + n[1], h._hidden = m('<input type=hidden name="' + n + '"' + (p.data("value") || i.value ? ' value="' + h.get("select", d.formatSubmit) + '"' : "") + ">")[0], p.on("change." + u.id, function() {
                            h._hidden.value = i.value ? h.get("select", d.formatSubmit) : ""
                        }), d.container ? m(d.container).append(h._hidden) : p.after(h._hidden)), p.data(o, h).addClass(f.input).attr("tabindex", -1).val(p.data("value") ? h.get("select", d.format) : i.value), d.editable || p.on("focus." + u.id + " click." + u.id, function(e) {
                            e.preventDefault(), h.$root[0].focus()
                        }).on("keydown." + u.id, s), g(i, {
                            haspopup: !0,
                            expanded: !1,
                            readonly: !1,
                            owns: i.id + "_root"
                        }), d.container ? m(d.container).append(h.$root) : p.after(h.$root), h.on({
                            start: h.component.onStart,
                            render: h.component.onRender,
                            stop: h.component.onStop,
                            open: h.component.onOpen,
                            close: h.component.onClose,
                            set: h.component.onSet
                        }).on({
                            start: d.onStart,
                            render: d.onRender,
                            stop: d.onStop,
                            open: d.onOpen,
                            close: d.onClose,
                            set: d.onSet
                        }), (e = h.$root.children()[0]).currentStyle ? t = e.currentStyle.position : window.getComputedStyle && (t = getComputedStyle(e).position), c = "fixed" == t, i.autofocus && h.open(), h.trigger("start").trigger("render"));
                        var e, t, n
                    },
                    render: function(e) {
                        return e ? h.$root.html(a()) : h.$root.find("." + f.box).html(h.component.nodes(u.open)), h.trigger("render")
                    },
                    stop: function() {
                        return u.start && (h.close(), h._hidden && h._hidden.parentNode.removeChild(h._hidden), h.$root.remove(), p.removeClass(f.input).removeData(o), setTimeout(function() {
                            p.off("." + u.id)
                        }, 0), i.type = u.type, i.readOnly = !1, h.trigger("stop"), u.methods = {}, u.start = !1), h
                    },
                    open: function(e) {
                        return u.open ? h : (p.addClass(f.active), g(i, "expanded", !0), setTimeout(function() {
                            h.$root.addClass(f.opened), g(h.$root[0], "hidden", !1)
                        }, 0), !1 !== e && (u.open = !0, c && w.css("overflow", "hidden").css("padding-right", "+=" + n()), h.$root[0].focus(), b.on("click." + u.id + " focusin." + u.id, function(e) {
                            var t = e.target;
                            t != i && t != document && 3 != e.which && h.close(t === h.$root.children()[0])
                        }).on("keydown." + u.id, function(e) {
                            var t = e.keyCode,
                                n = h.component.key[t],
                                i = e.target;
                            27 == t ? h.close(!0) : i != h.$root[0] || !n && 13 != t ? m.contains(h.$root[0], i) && 13 == t && (e.preventDefault(), i.click()) : (e.preventDefault(), n ? v._.trigger(h.component.key.go, h, [v._.trigger(n)]) : h.$root.find("." + f.highlighted).hasClass(f.disabled) || h.set("select", h.component.item.highlight).close())
                        })), h.trigger("open"))
                    },
                    close: function(e) {
                        return e && (h.$root.off("focus.toOpen")[0].focus(), setTimeout(function() {
                            h.$root.on("focus.toOpen", l)
                        }, 0)), p.removeClass(f.active), g(i, "expanded", !1), setTimeout(function() {
                            h.$root.removeClass(f.opened + " " + f.focused), g(h.$root[0], "hidden", !0)
                        }, 0), u.open ? (u.open = !1, c && w.css("overflow", "").css("padding-right", "-=" + n()), b.off("." + u.id), h.trigger("close")) : h
                    },
                    clear: function(e) {
                        return h.set("clear", null, e)
                    },
                    set: function(e, t, n) {
                        var i, o, r = m.isPlainObject(e),
                            a = r ? e : {};
                        if (n = r && m.isPlainObject(t) ? t : n || {}, e) {
                            for (i in r || (a[e] = t), a) o = a[i], i in h.component.item && (void 0 === o && (o = null), h.component.set(i, o, n)), ("select" == i || "clear" == i) && p.val("clear" == i ? "" : h.get(i, d.format)).trigger("change");
                            h.render()
                        }
                        return n.muted ? h : h.trigger("set", a)
                    },
                    get: function(e, t) {
                        if (null != u[e = e || "value"]) return u[e];
                        if ("valueSubmit" == e) {
                            if (h._hidden) return h._hidden.value;
                            e = "value"
                        }
                        if ("value" == e) return i.value;
                        if (e in h.component.item) {
                            if ("string" == typeof t) {
                                var n = h.component.get(e);
                                return n ? v._.trigger(h.component.formats.toString, h.component, [t, n]) : ""
                            }
                            return h.component.get(e)
                        }
                    },
                    on: function(e, t, n) {
                        var i, o, r = m.isPlainObject(e),
                            a = r ? e : {};
                        if (e)
                            for (i in r || (a[e] = t), a) o = a[i], n && (i = "_" + i), u.methods[i] = u.methods[i] || [], u.methods[i].push(o);
                        return h
                    },
                    off: function() {
                        var e, t, n = arguments;
                        for (e = 0, namesCount = n.length; e < namesCount; e += 1)(t = n[e]) in u.methods && delete u.methods[t];
                        return h
                    },
                    trigger: function(e, n) {
                        var t = function(e) {
                            var t = u.methods[e];
                            t && t.map(function(e) {
                                v._.trigger(e, h, [n])
                            })
                        };
                        return t("_" + e), t(e), h
                    }
                };
            return new t
        }

        function n() {
            if (w.height() <= i.height()) return 0;
            var e = m('<div style="visibility:hidden;width:100px" />').appendTo("body"),
                t = e[0].offsetWidth;
            e.css("overflow", "scroll");
            var n = m('<div style="width:100%" />').appendTo(e)[0].offsetWidth;
            return e.remove(), t - n
        }

        function g(e, t, n) {
            if (m.isPlainObject(t))
                for (var i in t) o(e, i, t[i]);
            else o(e, t, n)
        }

        function o(e, t, n) {
            e.setAttribute(("role" == t ? "" : "aria-") + t, n)
        }

        function y() {
            try {
                return document.activeElement
            } catch (e) {}
        }
        var i = m(window),
            b = m(document),
            w = m(document.documentElement);
        return v.klasses = function(e) {
            return {
                picker: e = e || "picker",
                opened: e + "--opened",
                focused: e + "--focused",
                input: e + "__input",
                active: e + "__input--active",
                target: e + "__input--target",
                holder: e + "__holder",
                frame: e + "__frame",
                wrap: e + "__wrap",
                box: e + "__box"
            }
        }, v._ = {
            group: function(e) {
                for (var t, n = "", i = v._.trigger(e.min, e); i <= v._.trigger(e.max, e, [i]); i += e.i) t = v._.trigger(e.item, e, [i]), n += v._.node(e.node, t[0], t[1], t[2]);
                return n
            },
            node: function(e, t, n, i) {
                return t ? "<" + e + (n = n ? ' class="' + n + '"' : "") + (i = i ? " " + i : "") + ">" + (t = m.isArray(t) ? t.join("") : t) + "</" + e + ">" : ""
            },
            lead: function(e) {
                return (e < 10 ? "0" : "") + e
            },
            trigger: function(e, t, n) {
                return "function" == typeof e ? e.apply(t, n || []) : e
            },
            digits: function(e) {
                return /\d/.test(e[1]) ? 2 : 1
            },
            isDate: function(e) {
                return -1 < {}.toString.call(e).indexOf("Date") && this.isInteger(e.getDate())
            },
            isInteger: function(e) {
                return -1 < {}.toString.call(e).indexOf("Number") && e % 1 == 0
            },
            ariaAttr: function(e, t) {
                for (var n in m.isPlainObject(e) || (e = {
                        attribute: t
                    }), t = "", e) {
                    var i = ("role" == n ? "" : "aria-") + n;
                    t += null == e[n] ? "" : i + '="' + e[n] + '"'
                }
                return t
            }
        }, v.extend = function(i, o) {
            m.fn[i] = function(e, t) {
                var n = this.data(i);
                return "picker" == e ? n : n && "string" == typeof e ? v._.trigger(n[e], n, [t]) : this.each(function() {
                    m(this).data(i) || new v(this, i, o, e)
                })
            }, m.fn[i].defaults = o.defaults
        }, v
    }),
    function(e) {
        "function" == typeof define && define.amd ? define(["picker", "jquery"], e) : "object" == typeof exports ? module.exports = e(require("./picker.js"), require("jquery")) : e(Picker, jQuery)
    }(function(e, h) {
        function t(t, n) {
            var e, i = this,
                o = t.$node[0],
                r = o.value,
                a = t.$node.data("value"),
                s = a || r,
                l = a ? n.formatSubmit : n.format,
                c = function() {
                    return o.currentStyle ? "rtl" == o.currentStyle.direction : "rtl" == getComputedStyle(t.$root[0]).direction
                };
            i.settings = n, i.$node = t.$node, i.queue = {
                min: "measure create",
                max: "measure create",
                now: "now create",
                select: "parse create validate",
                highlight: "parse navigate create validate",
                view: "parse create validate viewset",
                disable: "deactivate",
                enable: "activate"
            }, i.item = {}, i.item.clear = null, i.item.disable = (n.disable || []).slice(0), i.item.enable = -(!0 === (e = i.item.disable)[0] ? e.shift() : -1), i.set("min", n.min).set("max", n.max).set("now"), s ? i.set("select", s, {
                format: l
            }) : i.set("select", null).set("highlight", i.item.now), i.key = {
                40: 7,
                38: -7,
                39: function() {
                    return c() ? -1 : 1
                },
                37: function() {
                    return c() ? 1 : -1
                },
                go: function(e) {
                    var t = i.item.highlight,
                        n = new Date(t.year, t.month, t.date + e);
                    i.set("highlight", n, {
                        interval: e
                    }), this.render()
                }
            }, t.on("render", function() {
                t.$root.find("." + n.klass.selectMonth).on("change", function() {
                    var e = this.value;
                    e && (t.set("highlight", [t.get("view").year, e, t.get("highlight").date]), t.$root.find("." + n.klass.selectMonth).trigger("focus"))
                }), t.$root.find("." + n.klass.selectYear).on("change", function() {
                    var e = this.value;
                    e && (t.set("highlight", [e, t.get("view").month, t.get("highlight").date]), t.$root.find("." + n.klass.selectYear).trigger("focus"))
                })
            }, 1).on("open", function() {
                var e = "";
                i.disabled(i.get("now")) && (e = ":not(." + n.klass.buttonToday + ")"), t.$root.find("button" + e + ", select").attr("disabled", !1)
            }, 1).on("close", function() {
                t.$root.find("button, select").attr("disabled", !0)
            }, 1)
        }
        var n, g = e._;
        t.prototype.set = function(t, n, i) {
            var o = this,
                e = o.item;
            return null === n ? ("clear" == t && (t = "select"), e[t] = n) : (e["enable" == t ? "disable" : "flip" == t ? "enable" : t] = o.queue[t].split(" ").map(function(e) {
                return n = o[e](t, n, i)
            }).pop(), "select" == t ? o.set("highlight", e.select, i) : "highlight" == t ? o.set("view", e.highlight, i) : t.match(/^(flip|min|max|disable|enable)$/) && (e.select && o.disabled(e.select) && o.set("select", e.select, i), e.highlight && o.disabled(e.highlight) && o.set("highlight", e.highlight, i))), o
        }, t.prototype.get = function(e) {
            return this.item[e]
        }, t.prototype.create = function(e, t, n) {
            var i;
            return (t = void 0 === t ? e : t) == -1 / 0 || t == 1 / 0 ? i = t : h.isPlainObject(t) && g.isInteger(t.pick) ? t = t.obj : h.isArray(t) ? (t = new Date(t[0], t[1], t[2]), t = g.isDate(t) ? t : this.create().obj) : t = g.isInteger(t) || g.isDate(t) ? this.normalize(new Date(t), n) : this.now(e, t, n), {
                year: i || t.getFullYear(),
                month: i || t.getMonth(),
                date: i || t.getDate(),
                day: i || t.getDay(),
                obj: i || t,
                pick: i || t.getTime()
            }
        }, t.prototype.createRange = function(e, t) {
            var n = this,
                i = function(e) {
                    return !0 === e || h.isArray(e) || g.isDate(e) ? n.create(e) : e
                };
            return g.isInteger(e) || (e = i(e)), g.isInteger(t) || (t = i(t)), g.isInteger(e) && h.isPlainObject(t) ? e = [t.year, t.month, t.date + e] : g.isInteger(t) && h.isPlainObject(e) && (t = [e.year, e.month, e.date + t]), {
                from: i(e),
                to: i(t)
            }
        }, t.prototype.withinRange = function(e, t) {
            return e = this.createRange(e.from, e.to), t.pick >= e.from.pick && t.pick <= e.to.pick
        }, t.prototype.overlapRanges = function(e, t) {
            return e = this.createRange(e.from, e.to), t = this.createRange(t.from, t.to), this.withinRange(e, t.from) || this.withinRange(e, t.to) || this.withinRange(t, e.from) || this.withinRange(t, e.to)
        }, t.prototype.now = function(e, t, n) {
            return t = new Date, n && n.rel && t.setDate(t.getDate() + n.rel), this.normalize(t, n)
        }, t.prototype.navigate = function(e, t, n) {
            var i, o, r, a, s = h.isArray(t),
                l = h.isPlainObject(t),
                c = this.item.view;
            if (s || l) {
                for (l ? (o = t.year, r = t.month, a = t.date) : (o = +t[0], r = +t[1], a = +t[2]), n && n.nav && c && c.month !== r && (o = c.year, r = c.month), o = (i = new Date(o, r + (n && n.nav ? n.nav : 0), 1)).getFullYear(), r = i.getMonth(); new Date(o, r, a).getMonth() !== r;) a -= 1;
                t = [o, r, a]
            }
            return t
        }, t.prototype.normalize = function(e) {
            return e.setHours(0, 0, 0, 0), e
        }, t.prototype.measure = function(e, t) {
            return t ? "string" == typeof t ? t = this.parse(e, t) : g.isInteger(t) && (t = this.now(e, t, {
                rel: t
            })) : t = "min" == e ? -1 / 0 : 1 / 0, t
        }, t.prototype.viewset = function(e, t) {
            return this.create([t.year, t.month, 1])
        }, t.prototype.validate = function(e, n, t) {
            var i, o, r, a, s = this,
                l = n,
                c = t && t.interval ? t.interval : 1,
                u = -1 === s.item.enable,
                d = s.item.min,
                f = s.item.max,
                p = u && s.item.disable.filter(function(e) {
                    if (h.isArray(e)) {
                        var t = s.create(e).pick;
                        t < n.pick ? i = !0 : t > n.pick && (o = !0)
                    }
                    return g.isInteger(e)
                }).length;
            if ((!t || !t.nav) && (!u && s.disabled(n) || u && s.disabled(n) && (p || i || o) || !u && (n.pick <= d.pick || n.pick >= f.pick)))
                for (u && !p && (!o && 0 < c || !i && c < 0) && (c *= -1); s.disabled(n) && (1 < Math.abs(c) && (n.month < l.month || n.month > l.month) && (n = l, c = 0 < c ? 1 : -1), n.pick <= d.pick ? (r = !0, c = 1, n = s.create([d.year, d.month, d.date + (n.pick === d.pick ? 0 : -1)])) : n.pick >= f.pick && (a = !0, c = -1, n = s.create([f.year, f.month, f.date + (n.pick === f.pick ? 0 : 1)])), !r || !a);) n = s.create([n.year, n.month, n.date + c]);
            return n
        }, t.prototype.disabled = function(t) {
            var n = this,
                e = n.item.disable.filter(function(e) {
                    return g.isInteger(e) ? t.day === (n.settings.firstDay ? e : e - 1) % 7 : h.isArray(e) || g.isDate(e) ? t.pick === n.create(e).pick : h.isPlainObject(e) ? n.withinRange(e, t) : void 0
                });
            return e = e.length && !e.filter(function(e) {
                return h.isArray(e) && "inverted" == e[3] || h.isPlainObject(e) && e.inverted
            }).length, -1 === n.item.enable ? !e : e || t.pick < n.item.min.pick || t.pick > n.item.max.pick
        }, t.prototype.parse = function(e, i, t) {
            var o = this,
                r = {};
            return i && "string" == typeof i ? (t && t.format || ((t = t || {}).format = o.settings.format), o.formats.toArray(t.format).map(function(e) {
                var t = o.formats[e],
                    n = t ? g.trigger(t, o, [i, r]) : e.replace(/^!/, "").length;
                t && (r[e] = i.substr(0, n)), i = i.substr(n)
            }), [r.yyyy || r.yy, +(r.mm || r.m) - 1, r.dd || r.d]) : i
        }, t.prototype.formats = function() {
            function i(e, t, n) {
                var i = e.match(/\w+/)[0];
                return n.mm || n.m || (n.m = t.indexOf(i) + 1), i.length
            }

            function n(e) {
                return e.match(/\w+/)[0].length
            }
            return {
                d: function(e, t) {
                    return e ? g.digits(e) : t.date
                },
                dd: function(e, t) {
                    return e ? 2 : g.lead(t.date)
                },
                ddd: function(e, t) {
                    return e ? n(e) : this.settings.weekdaysShort[t.day]
                },
                dddd: function(e, t) {
                    return e ? n(e) : this.settings.weekdaysFull[t.day]
                },
                m: function(e, t) {
                    return e ? g.digits(e) : t.month + 1
                },
                mm: function(e, t) {
                    return e ? 2 : g.lead(t.month + 1)
                },
                mmm: function(e, t) {
                    var n = this.settings.monthsShort;
                    return e ? i(e, n, t) : n[t.month]
                },
                mmmm: function(e, t) {
                    var n = this.settings.monthsFull;
                    return e ? i(e, n, t) : n[t.month]
                },
                yy: function(e, t) {
                    return e ? 2 : ("" + t.year).slice(2)
                },
                yyyy: function(e, t) {
                    return e ? 4 : t.year
                },
                toArray: function(e) {
                    return e.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g)
                },
                toString: function(e, t) {
                    var n = this;
                    return n.formats.toArray(e).map(function(e) {
                        return g.trigger(n.formats[e], n, [0, t]) || e.replace(/^!/, "")
                    }).join("")
                }
            }
        }(), t.prototype.isDateExact = function(e, t) {
            return g.isInteger(e) && g.isInteger(t) || "boolean" == typeof e && "boolean" == typeof t ? e === t : (g.isDate(e) || h.isArray(e)) && (g.isDate(t) || h.isArray(t)) ? this.create(e).pick === this.create(t).pick : !(!h.isPlainObject(e) || !h.isPlainObject(t)) && this.isDateExact(e.from, t.from) && this.isDateExact(e.to, t.to)
        }, t.prototype.isDateOverlap = function(e, t) {
            var n = this.settings.firstDay ? 1 : 0;
            return g.isInteger(e) && (g.isDate(t) || h.isArray(t)) ? (e = e % 7 + n) === this.create(t).day + 1 : g.isInteger(t) && (g.isDate(e) || h.isArray(e)) ? (t = t % 7 + n) === this.create(e).day + 1 : !(!h.isPlainObject(e) || !h.isPlainObject(t)) && this.overlapRanges(e, t)
        }, t.prototype.flipEnable = function(e) {
            var t = this.item;
            t.enable = e || (-1 == t.enable ? 1 : -1)
        }, t.prototype.deactivate = function(e, t) {
            var i = this,
                o = i.item.disable.slice(0);
            return "flip" == t ? i.flipEnable() : !1 === t ? (i.flipEnable(1), o = []) : !0 === t ? (i.flipEnable(-1), o = []) : t.map(function(e) {
                for (var t, n = 0; n < o.length; n += 1)
                    if (i.isDateExact(e, o[n])) {
                        t = !0;
                        break
                    } t || (g.isInteger(e) || g.isDate(e) || h.isArray(e) || h.isPlainObject(e) && e.from && e.to) && o.push(e)
            }), o
        }, t.prototype.activate = function(e, t) {
            var r = this,
                a = r.item.disable,
                s = a.length;
            return "flip" == t ? r.flipEnable() : !0 === t ? (r.flipEnable(1), a = []) : !1 === t ? (r.flipEnable(-1), a = []) : t.map(function(e) {
                var t, n, i, o;
                for (i = 0; i < s; i += 1) {
                    if (n = a[i], r.isDateExact(n, e)) {
                        t = a[i] = null, o = !0;
                        break
                    }
                    if (r.isDateOverlap(n, e)) {
                        h.isPlainObject(e) ? (e.inverted = !0, t = e) : h.isArray(e) ? (t = e)[3] || t.push("inverted") : g.isDate(e) && (t = [e.getFullYear(), e.getMonth(), e.getDate(), "inverted"]);
                        break
                    }
                }
                if (t)
                    for (i = 0; i < s; i += 1)
                        if (r.isDateExact(a[i], e)) {
                            a[i] = null;
                            break
                        } if (o)
                    for (i = 0; i < s; i += 1)
                        if (r.isDateOverlap(a[i], e)) {
                            a[i] = null;
                            break
                        } t && a.push(t)
            }), a.filter(function(e) {
                return null != e
            })
        }, t.prototype.nodes = function(c) {
            var t, n, u = this,
                d = u.settings,
                e = u.item,
                a = e.now,
                s = e.select,
                l = e.highlight,
                f = e.view,
                p = e.disable,
                h = e.min,
                m = e.max,
                i = (t = (d.showWeekdaysFull ? d.weekdaysFull : d.weekdaysLetter).slice(0), n = d.weekdaysFull.slice(0), d.firstDay && (t.push(t.shift()), n.push(n.shift())), g.node("thead", g.node("tr", g.group({
                    min: 0,
                    max: 6,
                    i: 1,
                    node: "th",
                    item: function(e) {
                        return [t[e], d.klass.weekdays, 'scope=col title="' + n[e] + '"']
                    }
                })))),
                o = function(e) {
                    return g.node("div", " ", d.klass["nav" + (e ? "Next" : "Prev")] + (e && f.year >= m.year && f.month >= m.month || !e && f.year <= h.year && f.month <= h.month ? " " + d.klass.navDisabled : ""), "data-nav=" + (e || -1) + " " + g.ariaAttr({
                        role: "button",
                        controls: u.$node[0].id + "_table"
                    }) + ' title="' + (e ? d.labelMonthNext : d.labelMonthPrev) + '"')
                },
                r = function(e) {
                    var t = d.showMonthsShort ? d.monthsShort : d.monthsFull;
                    return "short_months" == e && (t = d.monthsShort), d.selectMonths && null == e ? g.node("select", g.group({
                        min: 0,
                        max: 11,
                        i: 1,
                        node: "option",
                        item: function(e) {
                            return [t[e], 0, "value=" + e + (f.month == e ? " selected" : "") + (f.year == h.year && e < h.month || f.year == m.year && e > m.month ? " disabled" : "")]
                        }
                    }), d.klass.selectMonth + " browser-default", (c ? "" : "disabled") + " " + g.ariaAttr({
                        controls: u.$node[0].id + "_table"
                    }) + ' title="' + d.labelMonthSelect + '"') : "short_months" == e ? null != s ? g.node("div", t[s.month]) : g.node("div", t[f.month]) : g.node("div", t[f.month], d.klass.month)
                },
                v = function(e) {
                    var t = f.year,
                        n = !0 === d.selectYears ? 5 : ~~(d.selectYears / 2);
                    if (n) {
                        var i = h.year,
                            o = m.year,
                            r = t - n,
                            a = t + n;
                        if (r < i && (a += i - r, r = i), o < a) {
                            var s = r - i,
                                l = a - o;
                            r -= l < s ? l : s, a = o
                        }
                        if (d.selectYears && null == e) return g.node("select", g.group({
                            min: r,
                            max: a,
                            i: 1,
                            node: "option",
                            item: function(e) {
                                return [e, 0, "value=" + e + (t == e ? " selected" : "")]
                            }
                        }), d.klass.selectYear + " browser-default", (c ? "" : "disabled") + " " + g.ariaAttr({
                            controls: u.$node[0].id + "_table"
                        }) + ' title="' + d.labelYearSelect + '"')
                    }
                    return "raw" == e ? g.node("div", t) : g.node("div", t, d.klass.year)
                };
            return createDayLabel = function() {
                return null != s ? g.node("div", s.date) : g.node("div", a.date)
            }, createWeekdayLabel = function() {
                var e;
                return e = null != s ? s.day : a.day, d.weekdaysFull[e]
            }, g.node("div", g.node("div", createWeekdayLabel(), "picker__weekday-display") + g.node("div", r("short_months"), d.klass.month_display) + g.node("div", createDayLabel(), d.klass.day_display) + g.node("div", v("raw"), d.klass.year_display), d.klass.date_display) + g.node("div", g.node("div", (d.selectYears, r() + v() + o() + o(1)), d.klass.header) + g.node("table", i + g.node("tbody", g.group({
                min: 0,
                max: 5,
                i: 1,
                node: "tr",
                item: function(e) {
                    var t = d.firstDay && 0 === u.create([f.year, f.month, 1]).day ? -7 : 0;
                    return [g.group({
                        min: 7 * e - f.day + t + 1,
                        max: function() {
                            return this.min + 7 - 1
                        },
                        i: 1,
                        node: "td",
                        item: function(e) {
                            e = u.create([f.year, f.month, e + (d.firstDay ? 1 : 0)]);
                            var t, n = s && s.pick == e.pick,
                                i = l && l.pick == e.pick,
                                o = p && u.disabled(e) || e.pick < h.pick || e.pick > m.pick,
                                r = g.trigger(u.formats.toString, u, [d.format, e]);
                            return [g.node("div", e.date, (t = [d.klass.day], t.push(f.month == e.month ? d.klass.infocus : d.klass.outfocus), a.pick == e.pick && t.push(d.klass.now), n && t.push(d.klass.selected), i && t.push(d.klass.highlighted), o && t.push(d.klass.disabled), t.join(" ")), "data-pick=" + e.pick + " " + g.ariaAttr({
                                role: "gridcell",
                                label: r,
                                selected: !(!n || u.$node.val() !== r) || null,
                                activedescendant: !!i || null,
                                disabled: !!o || null
                            })), "", g.ariaAttr({
                                role: "presentation"
                            })]
                        }
                    })]
                }
            })), d.klass.table, 'id="' + u.$node[0].id + '_table" ' + g.ariaAttr({
                role: "grid",
                controls: u.$node[0].id,
                readonly: !0
            })), d.klass.calendar_container) + g.node("div", g.node("button", d.today, "btn-flat picker__today", "type=button data-pick=" + a.pick + (c && !u.disabled(a) ? "" : " disabled") + " " + g.ariaAttr({
                controls: u.$node[0].id
            })) + g.node("button", d.clear, "btn-flat picker__clear", "type=button data-clear=1" + (c ? "" : " disabled") + " " + g.ariaAttr({
                controls: u.$node[0].id
            })) + g.node("button", d.close, "btn-flat picker__close", "type=button data-close=true " + (c ? "" : " disabled") + " " + g.ariaAttr({
                controls: u.$node[0].id
            })), d.klass.footer)
        }, t.defaults = {
            labelMonthNext: "Next month",
            labelMonthPrev: "Previous month",
            labelMonthSelect: "Select a month",
            labelYearSelect: "Select a year",
            monthsFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            weekdaysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            weekdaysLetter: ["S", "M", "T", "W", "T", "F", "S"],
            today: "Today",
            clear: "Clear",
            close: "Close",
            format: "d mmmm, yyyy",
            klass: {
                table: (n = e.klasses().picker + "__") + "table",
                header: n + "header",
                date_display: n + "date-display",
                day_display: n + "day-display",
                month_display: n + "month-display",
                year_display: n + "year-display",
                calendar_container: n + "calendar-container",
                navPrev: n + "nav--prev",
                navNext: n + "nav--next",
                navDisabled: n + "nav--disabled",
                month: n + "month",
                year: n + "year",
                selectMonth: n + "select--month",
                selectYear: n + "select--year",
                weekdays: n + "weekday",
                day: n + "day",
                disabled: n + "day--disabled",
                selected: n + "day--selected",
                highlighted: n + "day--highlighted",
                now: n + "day--today",
                infocus: n + "day--infocus",
                outfocus: n + "day--outfocus",
                footer: n + "footer",
                buttonClear: n + "button--clear",
                buttonToday: n + "button--today",
                buttonClose: n + "button--close"
            }
        }, e.extend("pickadate", t)
    }),
    function(a) {
        function n() {
            var e, t, n, i = +a(this).attr("length"),
                o = +a(this).val().length,
                r = o <= i;
            a(this).parent().find('span[class="character-counter"]').html(o + "/" + i), e = r, n = (t = a(this)).hasClass("invalid"), e && n ? t.removeClass("invalid") : e || n || (t.removeClass("valid"), t.addClass("invalid"))
        }

        function i() {
            a(this).parent().find('span[class="character-counter"]').html("")
        }
        a.fn.characterCounter = function() {
            return this.each(function() {
                var e, t;
                void 0 !== a(this).attr("length") && (a(this).on("input", n), a(this).on("focus", n), a(this).on("blur", i), e = a(this), t = a("<span/>").addClass("character-counter").css("float", "right").css("font-size", ".8rem").css("margin-top", "-1rem").css("height", 1), "textarea" == e[0].type && t.css("margin-top", "-1rem"), e.parent().append(t))
            })
        }, a(document).ready(function() {
            a("input, textarea").characterCounter()
        })
    }(jQuery),
    function(e, r) {
        "use strict";
        var t = function(e) {
                if ("object" != typeof e.document) throw Error("Cookies.js requires a `window` with a `document` object");
                var o = function(e, t, n) {
                    return 1 === arguments.length ? o.get(e) : o.set(e, t, n)
                };
                return o._document = e.document, o._cacheKeyPrefix = "cookey.", o._maxExpireDate = new Date("Fri, 31 Dec 9999 23:59:59 UTC"), o.defaults = {
                    path: "/",
                    secure: !1
                }, o.get = function(e) {
                    return o._cachedDocumentCookie !== o._document.cookie && o._renewCache(), (e = o._cache[o._cacheKeyPrefix + e]) === r ? r : decodeURIComponent(e)
                }, o.set = function(e, t, n) {
                    return (n = o._getExtendedOptions(n)).expires = o._getExpiresDate(t === r ? -1 : n.expires), o._document.cookie = o._generateCookieString(e, t, n), o
                }, o.expire = function(e, t) {
                    return o.set(e, r, t)
                }, o._getExtendedOptions = function(e) {
                    return {
                        path: e && e.path || o.defaults.path,
                        domain: e && e.domain || o.defaults.domain,
                        expires: e && e.expires || o.defaults.expires,
                        secure: e && e.secure !== r ? e.secure : o.defaults.secure
                    }
                }, o._isValidDate = function(e) {
                    return "[object Date]" === Object.prototype.toString.call(e) && !isNaN(e.getTime())
                }, o._getExpiresDate = function(e, t) {
                    if (t = t || new Date, "number" == typeof e ? e = 1 / 0 === e ? o._maxExpireDate : new Date(t.getTime() + 1e3 * e) : "string" == typeof e && (e = new Date(e)), e && !o._isValidDate(e)) throw Error("`expires` parameter cannot be converted to a valid Date instance");
                    return e
                }, o._generateCookieString = function(e, t, n) {
                    return e = (e = (e = e.replace(/[^#$&+\^`|]/g, encodeURIComponent)).replace(/\(/g, "%28").replace(/\)/g, "%29")) + "=" + (t = (t + "").replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent)) + ((n = n || {}).path ? ";path=" + n.path : ""), e += n.domain ? ";domain=" + n.domain : "", (e += n.expires ? ";expires=" + n.expires.toUTCString() : "") + (n.secure ? ";secure" : "")
                }, o._getCacheFromString = function(e) {
                    var t = {};
                    e = e ? e.split("; ") : [];
                    for (var n = 0; n < e.length; n++) {
                        var i = o._getKeyValuePairFromCookieString(e[n]);
                        t[o._cacheKeyPrefix + i.key] === r && (t[o._cacheKeyPrefix + i.key] = i.value)
                    }
                    return t
                }, o._getKeyValuePairFromCookieString = function(e) {
                    var t, n = (n = e.indexOf("=")) < 0 ? e.length : n,
                        i = e.substr(0, n);
                    try {
                        t = decodeURIComponent(i)
                    } catch (e) {
                        console && "function" == typeof console.error && console.error('Could not decode cookie with key "' + i + '"', e)
                    }
                    return {
                        key: t,
                        value: e.substr(n + 1)
                    }
                }, o._renewCache = function() {
                    o._cache = o._getCacheFromString(o._document.cookie), o._cachedDocumentCookie = o._document.cookie
                }, o._areEnabled = function() {
                    var e = "1" === o.set("cookies.js", 1).get("cookies.js");
                    return o.expire("cookies.js"), e
                }, o.enabled = o._areEnabled(), o
            },
            n = "object" == typeof e.document ? t(e) : t;
        "function" == typeof define && define.amd ? define(function() {
            return n
        }) : "object" == typeof exports ? ("object" == typeof module && "object" == typeof module.exports && (exports = module.exports = n), exports.Cookies = n) : e.Cookies = n
    }("undefined" == typeof window ? this : window),
    function(f) {
        f.fn.scrollIntoView = function(e, t, n) {
            var i = f.extend({}, f.fn.scrollIntoView.defaults);
            "object" == f.type(e) ? f.extend(i, e) : "number" == f.type(e) ? f.extend(i, {
                duration: e,
                easing: t,
                complete: n
            }) : 0 == e && (i.smooth = !1);
            var o, r, a = 1 / 0,
                s = 0;
            1 == this.size() ? null == (a = this.get(0).offsetTop) || (s = a + this.get(0).offsetHeight) : this.each(function(e, t) {
                t.offsetTop < a ? a = t.offsetTop : t.offsetTop + t.offsetHeight > s && (s = t.offsetTop + t.offsetHeight)
            }), s -= a;
            for (var l = this.commonAncestor().get(0), c = f(window).height(); l;) {
                var u = l.scrollTop,
                    d = l.clientHeight;
                if (c < d && (d = c), 0 == d && "BODY" == l.tagName && (d = c), l.scrollTop != (null == (l.scrollTop += 1) || l.scrollTop) && null != (l.scrollTop -= 1) || l.scrollTop != (null == (l.scrollTop -= 1) || l.scrollTop) && null != (l.scrollTop += 1)) return o = l, void(void 0 === (r = a <= u ? a : u + d < a + s ? a + s - d : void 0) ? f.isFunction(i.complete) && i.complete.call(o) : i.smooth ? f(o).stop().animate({
                    scrollTop: r
                }, i) : (o.scrollTop = r, f.isFunction(i.complete) && i.complete.call(o)));
                l = l.parentNode
            }
            return this
        }, f.fn.scrollIntoView.defaults = {
            smooth: !0,
            duration: null,
            easing: f.easing && f.easing.easeOutExpo ? "easeOutExpo" : null,
            complete: f.noop(),
            step: null,
            specialEasing: {}
        }, f.fn.isOutOfView = function(r) {
            var a = !0;
            return this.each(function() {
                var e = this.parentNode,
                    t = e.scrollTop,
                    n = e.clientHeight,
                    i = this.offsetTop,
                    o = this.offsetHeight;
                (r ? t + n < i : t + n < i + o) || (r ? i + o < t : i < t) || (a = !1)
            }), a
        }, f.fn.commonAncestor = function() {
            var t = [],
                n = 1 / 0;
            for (f(this).each(function() {
                    var e = f(this).parents();
                    t.push(e), n = Math.min(n, e.length)
                }), e = 0; e < t.length; e++) t[e] = t[e].slice(t[e].length - n);
            for (var e = 0; e < t[0].length; e++) {
                var i = !0;
                for (var o in t)
                    if (t[o][e] != t[0][e]) {
                        i = !1;
                        break
                    } if (i) return f(t[0][e])
            }
            return f([])
        }
    }(jQuery),
    function(s) {
        var t = {
            init: function(a) {
                a = s.extend({
                    menuWidth: 240,
                    menuWidthS: 0,
                    menuWidthM: 0,
                    menuWidthL: 0,
                    edge: "left",
                    closeOnClick: !1
                }, a), s(this).each(function() {
                    function n(e) {
                        switch ($("#devicetype").html()) {
                            case "phone":
                                0 < a.menuWidthS && (a.menuWidth = a.menuWidthS);
                                break;
                            case "tablet":
                                0 < a.menuWidthM && (a.menuWidth = a.menuWidthM);
                                break;
                            default:
                                0 < a.menuWidthL && (a.menuWidth = a.menuWidthL)
                        }
                        if (i.css("width", a.menuWidth), r = !1, s("body").css("overflow", ""), s("#sidenav-overlay-sidebar").velocity({
                                opacity: 0
                            }, {
                                duration: 200,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    s(this).remove()
                                }
                            }), "left" === a.edge) {
                            var t = s("#nav-mobile");
                            t && "0px" == t.css("left") && t.width()
                        }
                        "left" === a.edge ? i.velocity({
                            left: -1 * (a.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                !0 === e && (i.removeAttr("style"), i.css("width", a.menuWidth))
                            }
                        }) : i.velocity({
                            right: -1 * (a.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutCubic",
                            complete: function() {
                                !0 === e && (i.removeAttr("style"), i.css("width", a.menuWidth))
                            }
                        })
                    }
                    var e = s(this),
                        i = s("#" + e.attr("data-activates"));
                    switch ($("#devicetype").html()) {
                        case "phone":
                            0 < a.menuWidthS && (a.menuWidth = a.menuWidthS);
                            break;
                        case "tablet":
                            0 < a.menuWidthM && (a.menuWidth = a.menuWidthM);
                            break;
                        default:
                            0 < a.menuWidthL && (a.menuWidth = a.menuWidthL)
                    }
                    if (i.css("width", a.menuWidth), 240 != a.menuWidth && i.css("width", a.menuWidth), "left" === a.edge) {
                        var o = s("#nav-mobile");
                        o && "0px" == o.css("left") && o.width()
                    }
                    "left" == a.edge ? i.css("left", -1 * (a.menuWidth + 10)) : i.addClass("right-aligned").css("right", -1 * (a.menuWidth + 10)).css("left", ""), i.hasClass("fixed") && 992 < window.innerWidth && i.css("left", 0), i.hasClass("fixed") && s(window).resize(function() {
                        992 < window.innerWidth ? 0 !== s("#sidenav-overlay-sidebar").css("opacity") && r ? n(!0) : (i.removeAttr("style"), i.css("width", a.menuWidth)) : !1 === r && ("left" === a.edge ? i.css("left", -1 * (a.menuWidth + 10)) : i.css("right", -1 * (a.menuWidth + 10)))
                    }), !0 === a.closeOnClick && i.on("click.itemclick", "a:not(.collapsible-header)", function() {
                        n()
                    });
                    var r = !1;
                    e.click(function() {
                        switch ($("#devicetype").html()) {
                            case "phone":
                                0 < a.menuWidthS && (a.menuWidth = a.menuWidthS);
                                break;
                            case "tablet":
                                0 < a.menuWidthM && (a.menuWidth = a.menuWidthM);
                                break;
                            default:
                                0 < a.menuWidthL && (a.menuWidth = a.menuWidthL)
                        }
                        if (i.css("width", a.menuWidth), !0 === r) r = !1, n();
                        else {
                            var e = 0;
                            if ("left" === a.edge && o && "0px" == o.css("left") && (e = o.width()), s("body").css("overflow", "hidden"), "left" === a.edge) {
                                if ("0px" == i.css("left")) return s("#sidenav-overlay-sidebar").trigger("click"), !1;
                                i.velocity({
                                    left: e
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                }), i.css("right", "")
                            } else {
                                if ("0px" == i.css("right")) return s("#sidenav-overlay-sidebar").trigger("click"), !1;
                                i.velocity({
                                    right: 0
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad"
                                }), i.css("left", "")
                            }
                            var t = s('<div id="sidenav-overlay-sidebar"></div>');
                            t.css("opacity", 0).click(function() {
                                r = !1, n(), t.velocity({
                                    opacity: 0
                                }, {
                                    duration: 300,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        s(this).remove();
                                        b4j_raiseEvent("page_parseevent", {
                                            eventname: i.attr('evname') + "_closed",
                                            eventparams: ""
                                        });
                                    }
                                })
                            }), s("body").append(t), t.velocity({
                                opacity: 1
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    r = !0
                                }
                            })
                        }
                        return !1
                    })
                })
            },
            show: function() {
                this.trigger("click")
            },
            hide: function() {
                s("#sidenav-overlay-sidebar").trigger("click")
            }
        };
        s.fn.abmsideNav = function(e) {
            return t[e] ? t[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void s.error("Method " + e + " does not exist on jQuery.abmsideNav") : t.init.apply(this, arguments)
        }
    }(jQuery),
    function() {
        ! function(n) {
            "use strict";
            n.fn.paperCollapse = function(e) {
                var t;
                return t = n.extend({}, n.fn.paperCollapse.defaults, e), n(".collapse-card__heading").each(function() {
                    n(this).hasClass("ccInit") || (n(this).addClass("ccInit"), n(this).add(t.closeHandler).click(function() {
                        n(this).closest(".collapse-card").hasClass("active") ? (t.onHide.call(this), n(this).closest(".collapse-card").removeClass("active"), n(this).closest(".collapse-card").find(".collapse-card__body").stop().slideUp(t.animationDuration, t.onHideComplete)) : (t.onShow.call(this), n(this).closest(".collapse-card").addClass("active"), n(this).closest(".collapse-card").find(".collapse-card__body").stop().slideDown(t.animationDuration, t.onShowComplete))
                    }))
                }), this
            }, n.fn.paperCollapse.defaults = {
                animationDuration: 400,
                easing: "swing",
                closeHandler: ".collapse-card__close_handler",
                onShow: function() {},
                onHide: function() {},
                onShowComplete: function() {
                    resizeAllEditors()
                },
                onHideComplete: function() {}
            }
        }(jQuery)
    }.call(this),
    function() {
        "use strict";

        function t(e) {
            return (e = String(e)).charAt(0).toUpperCase() + e.slice(1)
        }

        function P(e) {
            return e = q(e), /^(?:webOS|i(?:OS|P))/.test(e) ? e : t(e)
        }

        function M(e, t) {
            for (var n in e) s.call(e, n) && t(e[n], n, e)
        }

        function D(e) {
            return null == e ? t(e) : z.call(e).slice(8, -1)
        }

        function L(e, t) {
            var n = null != e ? typeof e[t] : "number";
            return !(/^(?:boolean|number|string|undefined)$/.test(n) || "object" == n && !e[t])
        }

        function I(e) {
            return String(e).replace(/([ -])(?!$)/g, "$1?")
        }

        function R(n, i) {
            var o = null;
            return function(e, t) {
                var n = -1,
                    i = e ? e.length : 0;
                if ("number" == typeof i && -1 < i && i <= r)
                    for (; ++n < i;) t(e[n], n);
                else M(e, t)
            }(n, function(e, t) {
                o = i(o, e, t, n)
            }), o
        }

        function q(e) {
            return String(e).replace(/^ +| +$/g, "")
        }

        function B(s) {
            function e(e) {
                return R(e, function(e, t) {
                    var n = t.pattern || I(t);
                    return !e && (e = RegExp("\\b" + n + " *\\d+[.\\w_]*", "i").exec(s) || RegExp("\\b" + n + "(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)", "i").exec(s)) && ((e = String(t.label && !RegExp(n, "i").test(t.label) ? t.label : e).split("/"))[1] && !/[\d.]+/.test(e[0]) && (e[0] += " " + e[1]), t = t.label || t, e = P(e[0].replace(RegExp(n, "i"), t).replace(RegExp("; *(?:" + t + "[_-])?", "i"), " ").replace(RegExp("(" + t + ")[-_.]?(\\w)", "i"), "$1 $2"))), e
                })
            }
            var t = F,
                n = s && "object" == typeof s && "String" != D(s);
            n && (t = s, s = null);
            var i = t.navigator || {},
                o = i.userAgent || "";
            s || (s = o);
            var r, a, l = n || $ == W,
                c = n ? !!i.likeChrome : /\bChrome\b/.test(s) && !/internal|\n/i.test(z.toString()),
                u = n ? "Object" : "ScriptBridgingProxyObject",
                d = n ? "Object" : "Environment",
                f = n && t.java ? "JavaPackage" : D(t.java),
                p = n ? "Object" : "RuntimeObject",
                h = /\bJava/.test(f) && t.java,
                m = h && D(t.environment) == d,
                v = h ? "a" : "α",
                g = h ? "b" : "β",
                y = t.document || {},
                b = t.operamini || t.opera,
                w = H.test(w = n && b ? b["[[Class]]"] : D(b)) ? w : b = null,
                x = s,
                C = [],
                S = null,
                k = s == o,
                T = k && b && "function" == typeof b.version && b.version(),
                E = R([{
                    label: "EdgeHTML",
                    pattern: "Edge"
                }, "Trident", {
                    label: "WebKit",
                    pattern: "AppleWebKit"
                }, "iCab", "Presto", "NetFront", "Tasman", "KHTML", "Gecko"], function(e, t) {
                    return e || RegExp("\\b" + (t.pattern || I(t)) + "\\b", "i").exec(s) && (t.label || t)
                }),
                A = R(["Adobe AIR", "Arora", "Avant Browser", "Breach", "Camino", "Epiphany", "Fennec", "Flock", "Galeon", "GreenBrowser", "iCab", "Iceweasel", "K-Meleon", "Konqueror", "Lunascape", "Maxthon", {
                    label: "Microsoft Edge",
                    pattern: "Edge"
                }, "Midori", "Nook Browser", "PaleMoon", "PhantomJS", "Raven", "Rekonq", "RockMelt", "SeaMonkey", {
                    label: "Silk",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Sleipnir", "SlimBrowser", {
                    label: "SRWare Iron",
                    pattern: "Iron"
                }, "Sunrise", "Swiftfox", "WebPositive", "Opera Mini", {
                    label: "Opera Mini",
                    pattern: "OPiOS"
                }, "Opera", {
                    label: "Opera",
                    pattern: "OPR"
                }, "Chrome", {
                    label: "Chrome Mobile",
                    pattern: "(?:CriOS|CrMo)"
                }, {
                    label: "Firefox",
                    pattern: "(?:Firefox|Minefield)"
                }, {
                    label: "Firefox Mobile",
                    pattern: "FxiOS"
                }, {
                    label: "IE",
                    pattern: "IEMobile"
                }, {
                    label: "IE",
                    pattern: "MSIE"
                }, "Safari"], function(e, t) {
                    return e || RegExp("\\b" + (t.pattern || I(t)) + "\\b", "i").exec(s) && (t.label || t)
                }),
                O = e([{
                    label: "BlackBerry",
                    pattern: "BB10"
                }, "BlackBerry", {
                    label: "Galaxy S",
                    pattern: "GT-I9000"
                }, {
                    label: "Galaxy S2",
                    pattern: "GT-I9100"
                }, {
                    label: "Galaxy S3",
                    pattern: "GT-I9300"
                }, {
                    label: "Galaxy S4",
                    pattern: "GT-I9500"
                }, "Google TV", "Lumia", "iPad", "iPod", "iPhone", "Kindle", {
                    label: "Kindle Fire",
                    pattern: "(?:Cloud9|Silk-Accelerated)"
                }, "Nexus", "Nook", "PlayBook", "PlayStation 3", "PlayStation 4", "PlayStation Vita", "TouchPad", "Transformer", {
                    label: "Wii U",
                    pattern: "WiiU"
                }, "Wii", "Xbox One", {
                    label: "Xbox 360",
                    pattern: "Xbox"
                }, "Xoom"]),
                N = R({
                    Apple: {
                        iPad: 1,
                        iPhone: 1,
                        iPod: 1
                    },
                    Amazon: {
                        Kindle: 1,
                        "Kindle Fire": 1
                    },
                    Asus: {
                        Transformer: 1
                    },
                    "Barnes & Noble": {
                        Nook: 1
                    },
                    BlackBerry: {
                        PlayBook: 1
                    },
                    Google: {
                        "Google TV": 1,
                        Nexus: 1
                    },
                    HP: {
                        TouchPad: 1
                    },
                    HTC: {},
                    LG: {},
                    Microsoft: {
                        Xbox: 1,
                        "Xbox One": 1
                    },
                    Motorola: {
                        Xoom: 1
                    },
                    Nintendo: {
                        "Wii U": 1,
                        Wii: 1
                    },
                    Nokia: {
                        Lumia: 1
                    },
                    Samsung: {
                        "Galaxy S": 1,
                        "Galaxy S2": 1,
                        "Galaxy S3": 1,
                        "Galaxy S4": 1
                    },
                    Sony: {
                        "PlayStation 4": 1,
                        "PlayStation 3": 1,
                        "PlayStation Vita": 1
                    }
                }, function(e, t, n) {
                    return e || (t[O] || t[/^[a-z]+(?: +[a-z]+\b)*/i.exec(O)] || RegExp("\\b" + I(n) + "(?:\\b|\\w*\\d)", "i").exec(s)) && n
                }),
                j = R(["Windows Phone ", "Android", "CentOS", {
                    label: "Chrome OS",
                    pattern: "CrOS"
                }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "], function(e, t) {
                    var n, i, o, r, a = t.pattern || I(t);
                    return !e && (e = RegExp("\\b" + a + "(?:/[\\d.]+|[ \\w.]*)", "i").exec(s)) && (n = e, i = a, o = t.label || t, r = {
                        "10.0": "10",
                        6.4: "10 Technical Preview",
                        6.3: "8.1",
                        6.2: "8",
                        6.1: "7 / Server 2008 R2",
                        "6.0": "Vista / Server 2008",
                        5.2: "XP 64-bit / Server 2003",
                        5.1: "XP",
                        5.01: "2000 SP1",
                        "5.0": "2000",
                        "4.0": "NT",
                        "4.90": "ME"
                    }, i && o && /^Win/i.test(n) && !/^Windows Phone /i.test(n) && (r = r[/[\d.]+$/.exec(n)]) && (n = "Windows " + r), n = String(n), i && o && (n = n.replace(RegExp(i, "i"), o)), e = P(n.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0])), e
                });
            if (E && (E = [E]), N && !O && (O = e([N])), (r = /\bGoogle TV\b/.exec(O)) && (O = r[0]), /\bSimulator\b/i.test(s) && (O = (O ? O + " " : "") + "Simulator"), "Opera Mini" == A && /\bOPiOS\b/.test(s) && C.push("running in Turbo/Uncompressed mode"), /^iP/.test(O) ? (A || (A = "Safari"), j = "iOS" + ((r = / OS ([\d_]+)/i.exec(s)) ? " " + r[1].replace(/_/g, ".") : "")) : "Konqueror" != A || /buntu/i.test(j) ? N && "Google" != N && (/Chrome/.test(A) && !/\bMobile Safari\b/i.test(s) || /\bVita\b/.test(O)) ? (A = "Android Browser", j = /\bAndroid\b/.test(j) ? j : "Android") : "Silk" == A ? (/\bMobi/i.test(s) || (j = "Android", C.unshift("desktop mode")), /Accelerated *= *true/i.test(s) && C.unshift("accelerated")) : "PaleMoon" == A && (r = /\bFirefox\/([\d.]+)\b/.exec(s)) ? C.push("identifying as Firefox " + r[1]) : "Firefox" == A && (r = /\b(Mobile|Tablet|TV)\b/i.exec(s)) ? (j || (j = "Firefox OS"), O || (O = r[1])) : A && !(r = !/\bMinefield\b/i.test(s) && /\b(?:Firefox|Safari)\b/.exec(A)) || (A && !O && /[\/,]|^[^(]+?\)/.test(s.slice(s.indexOf(r + "/") + 8)) && (A = null), (r = O || N || j) && (O || N || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(j)) && (A = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(j) ? j : r) + " Browser")) : j = "Kubuntu", T || (T = R(["(?:Cloud9|CriOS|CrMo|Edge|FxiOS|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))", "Version", I(A), "(?:Firefox|Minefield|NetFront)"], function(e, t) {
                    return e || (RegExp(t + "(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)", "i").exec(s) || 0)[1] || null
                })), (r = ("iCab" == E && 3 < parseFloat(T) ? "WebKit" : /\bOpera\b/.test(A) && (/\bOPR\b/.test(s) ? "Blink" : "Presto")) || /\b(?:Midori|Nook|Safari)\b/i.test(s) && !/^(?:Trident|EdgeHTML)$/.test(E) && "WebKit" || !E && /\bMSIE\b/i.test(s) && ("Mac OS" == j ? "Tasman" : "Trident") || "WebKit" == E && /\bPlayStation\b(?! Vita\b)/i.test(A) && "NetFront") && (E = [r]), "IE" == A && (r = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(s) || 0)[1]) ? (A += " Mobile", j = "Windows Phone " + (/\+$/.test(r) ? r : r + ".x"), C.unshift("desktop mode")) : /\bWPDesktop\b/i.test(s) ? (A = "IE Mobile", j = "Windows Phone 8.x", C.unshift("desktop mode"), T || (T = (/\brv:([\d.]+)/.exec(s) || 0)[1])) : "IE" != A && "Trident" == E && (r = /\brv:([\d.]+)/.exec(s)) && (A && C.push("identifying as " + A + (T ? " " + T : "")), A = "IE", T = r[1]), k) {
                if (L(t, "global"))
                    if (h && (x = (r = h.lang.System).getProperty("os.arch"), j = j || r.getProperty("os.name") + " " + r.getProperty("os.version")), l && L(t, "system") && (r = [t.system])[0]) {
                        j || (j = r[0].os || null);
                        try {
                            r[1] = t.require("ringo/engine").version, T = r[1].join("."), A = "RingoJS"
                        } catch (s) {
                            r[0].global.system == t.system && (A = "Narwhal")
                        }
                    } else "object" == typeof t.process && (r = t.process) ? (A = "Node.js", x = r.arch, j = r.platform, T = /[\d.]+/.exec(r.version)[0]) : m && (A = "Rhino");
                else D(r = t.runtime) == u ? (A = "Adobe AIR", j = r.flash.system.Capabilities.os) : D(r = t.phantom) == p ? (A = "PhantomJS", T = (r = r.version || null) && r.major + "." + r.minor + "." + r.patch) : "number" == typeof y.documentMode && (r = /\bTrident\/(\d+)/i.exec(s)) && (T = [T, y.documentMode], (r = +r[1] + 4) != T[1] && (C.push("IE " + T[1] + " mode"), E && (E[1] = ""), T[1] = r), T = "IE" == A ? String(T[1].toFixed(1)) : T[0]);
                j = j && P(j)
            }
            T && (r = /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(T) || /(?:alpha|beta)(?: ?\d)?/i.exec(s + ";" + (k && i.appMinorVersion)) || /\bMinefield\b/i.test(s) && "a") && (S = /b/i.test(r) ? "beta" : "alpha", T = T.replace(RegExp(r + "\\+?$"), "") + ("beta" == S ? g : v) + (/\d+\+?/.exec(r) || "")), "Fennec" == A || "Firefox" == A && /\b(?:Android|Firefox OS)\b/.test(j) ? A = "Firefox Mobile" : "Maxthon" == A && T ? T = T.replace(/\.[\d.]+/, ".x") : /\bXbox\b/i.test(O) ? (j = null, "Xbox 360" == O && /\bIEMobile\b/.test(s) && C.unshift("mobile mode")) : !/^(?:Chrome|IE|Opera)$/.test(A) && (!A || O || /Browser|Mobi/.test(A)) || "Windows CE" != j && !/Mobi/i.test(s) ? "IE" == A && k && null === t.external ? C.unshift("platform preview") : (/\bBlackBerry\b/.test(O) || /\bBB10\b/.test(s)) && (r = (RegExp(O.replace(/ +/g, " *") + "/([.\\d]+)", "i").exec(s) || 0)[1] || T) ? (j = ((r = [r, /BB10/.test(s)])[1] ? (O = null, N = "BlackBerry") : "Device Software") + " " + r[0], T = null) : this != M && "Wii" != O && (k && b || /Opera/.test(A) && /\b(?:MSIE|Firefox)\b/i.test(s) || "Firefox" == A && /\bOS X (?:\d+\.){2,}/.test(j) || "IE" == A && (j && !/^Win/.test(j) && 5.5 < T || /\bWindows XP\b/.test(j) && 8 < T || 8 == T && !/\bTrident\b/.test(s))) && !H.test(r = B.call(M, s.replace(H, "") + ";")) && r.name && (r = "ing as " + r.name + ((r = r.version) ? " " + r : ""), H.test(A) ? (/\bIE\b/.test(r) && "Mac OS" == j && (j = null), r = "identify" + r) : (r = "mask" + r, A = w ? P(w.replace(/([a-z])([A-Z])/g, "$1 $2")) : "Opera", /\bIE\b/.test(r) && (j = null), k || (T = null)), E = ["Presto"], C.push(r)) : A += " Mobile", (r = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(s) || 0)[1]) && (r = [parseFloat(r.replace(/\.(\d)$/, ".0$1")), r], "Safari" == A && "+" == r[1].slice(-1) ? (A = "WebKit Nightly", S = "alpha", T = r[1].slice(0, -1)) : T != r[1] && T != (r[2] = (/\bSafari\/([\d.]+\+?)/i.exec(s) || 0)[1]) || (T = null), r[1] = (/\bChrome\/([\d.]+)/i.exec(s) || 0)[1], 537.36 == r[0] && 537.36 == r[2] && 28 <= parseFloat(r[1]) && "WebKit" == E && (E = ["Blink"]), k && (c || r[1]) ? (E && (E[1] = "like Chrome"), r = r[1] || ((r = r[0]) < 530 ? 1 : r < 532 ? 2 : r < 532.05 ? 3 : r < 533 ? 4 : r < 534.03 ? 5 : r < 534.07 ? 6 : r < 534.1 ? 7 : r < 534.13 ? 8 : r < 534.16 ? 9 : r < 534.24 ? 10 : r < 534.3 ? 11 : r < 535.01 ? 12 : r < 535.02 ? "13+" : r < 535.07 ? 15 : r < 535.11 ? 16 : r < 535.19 ? 17 : r < 536.05 ? 18 : r < 536.1 ? 19 : r < 537.01 ? 20 : r < 537.11 ? "21+" : r < 537.13 ? 23 : r < 537.18 ? 24 : r < 537.24 ? 25 : r < 537.36 ? 26 : "Blink" != E ? "27" : "28")) : (E && (E[1] = "like Safari"), r = (r = r[0]) < 400 ? 1 : r < 500 ? 2 : r < 526 ? 3 : r < 533 ? 4 : r < 534 ? "4+" : r < 535 ? 5 : r < 537 ? 6 : r < 538 ? 7 : r < 601 ? 8 : "8"), E && (E[1] += " " + (r += "number" == typeof r ? ".x" : /[.+]/.test(r) ? "" : "+")), "Safari" == A && (!T || 45 < parseInt(T)) && (T = r)), "Opera" == A && (r = /\bzbov|zvav$/.exec(j)) ? (A += " ", C.unshift("desktop mode"), "zvav" == r ? (A += "Mini", T = null) : A += "Mobile", j = j.replace(RegExp(" *" + r + "$"), "")) : "Safari" == A && /\bChrome\b/.exec(E && E[1]) && (C.unshift("desktop mode"), A = "Chrome Mobile", T = null, /\bOS X\b/.test(j) ? (N = "Apple", j = "iOS 4.3+") : j = null), T && 0 == T.indexOf(r = /[\d.]+$/.exec(j)) && -1 < s.indexOf("/" + r + "-") && (j = q(j.replace(r, ""))), E && !/\b(?:Avant|Nook)\b/.test(A) && (/Browser|Lunascape|Maxthon/.test(A) || "Safari" != A && /^iOS/.test(j) && /\bSafari\b/.test(E[1]) || /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(A) && E[1]) && (r = E[E.length - 1]) && C.push(r), C.length && (C = ["(" + C.join("; ") + ")"]), N && O && O.indexOf(N) < 0 && C.push("on " + N), O && C.push((/^on /.test(C[C.length - 1]) ? "" : "on ") + O), j && (j = {
                architecture: 32,
                family: (r = / ([\d.+]+)$/.exec(j) || (a = /^[a-z]+ ([\d.+]+) \//i.exec(j))) && !a ? j.replace(r[0], "") : j,
                version: r ? r[1] : null,
                toString: function() {
                    var e = this.version;
                    return this.family + (e && !a ? " " + e : "") + (64 == this.architecture ? " 64-bit" : "")
                }
            }), (r = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(x)) && !/\bi686\b/i.test(x) && (j && (j.architecture = 64, j.family = j.family.replace(RegExp(" *" + r), "")), A && (/\bWOW64\b/i.test(s) || k && /\w(?:86|32)$/.test(i.cpuClass || i.platform) && !/\bWin64; x64\b/i.test(s)) && C.unshift("32-bit")), s || (s = null);
            var _ = {};
            return _.description = s, _.layout = E && E[0], _.manufacturer = N, _.name = A, _.prerelease = S, _.product = O, _.ua = s, _.version = A && T, _.os = j || {
                architecture: null,
                family: null,
                version: null,
                toString: function() {
                    return "null"
                }
            }, _.parse = B, _.toString = function() {
                return this.description || ""
            }, _.version && C.unshift(T), _.name && C.unshift(A), j && A && (j != String(j).split(" ")[0] || j != A.split(" ")[0] && !O) && C.push(O ? "(" + j + ")" : "on " + j), C.length && (_.description = C.join(" ")), _
        }
        var e = {
                function: !0,
                object: !0
            },
            F = e[typeof window] && window || this,
            W = F,
            n = e[typeof exports] && exports,
            i = e[typeof module] && module && !module.nodeType && module,
            o = n && i && "object" == typeof global && global;
        !o || o.global !== o && o.window !== o && o.self !== o || (F = o);
        var r = Math.pow(2, 53) - 1,
            H = /\bOpera/,
            $ = this,
            a = Object.prototype,
            s = a.hasOwnProperty,
            z = a.toString;
        "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
            return B()
        }) : n && i ? M(B(), function(e, t) {
            n[t] = e
        }) : F.platform = B()
    }.call(this),
    function(e) {
        var p = function() {
            "use strict";
            var d = {
                    DAY: 864e5,
                    HOUR: 36e5,
                    MINUTE: 6e4,
                    SECOND: 1e3,
                    BASELINE_YEAR: 2014,
                    MAX_SCORE: 864e6,
                    AMBIGUITIES: {
                        "America/Denver": ["America/Mazatlan"],
                        "Europe/London": ["Africa/Casablanca"],
                        "America/Chicago": ["America/Mexico_City"],
                        "America/Asuncion": ["America/Campo_Grande", "America/Santiago"],
                        "America/Montevideo": ["America/Sao_Paulo", "America/Santiago"],
                        "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Europe/Helsinki", "Asia/Damascus", "Africa/Cairo", "Asia/Gaza", "Europe/Minsk"],
                        "Pacific/Auckland": ["Pacific/Fiji"],
                        "America/Los_Angeles": ["America/Santa_Isabel"],
                        "America/New_York": ["America/Havana"],
                        "America/Halifax": ["America/Goose_Bay"],
                        "America/Godthab": ["America/Miquelon"],
                        "Asia/Dubai": ["Asia/Yerevan"],
                        "Asia/Jakarta": ["Asia/Krasnoyarsk"],
                        "Asia/Shanghai": ["Asia/Irkutsk", "Australia/Perth"],
                        "Australia/Sydney": ["Australia/Lord_Howe"],
                        "Asia/Tokyo": ["Asia/Yakutsk"],
                        "Asia/Dhaka": ["Asia/Omsk"],
                        "Asia/Baku": ["Asia/Yerevan"],
                        "Australia/Brisbane": ["Asia/Vladivostok"],
                        "Pacific/Noumea": ["Asia/Vladivostok"],
                        "Pacific/Majuro": ["Asia/Kamchatka", "Pacific/Fiji"],
                        "Pacific/Tongatapu": ["Pacific/Apia"],
                        "Asia/Baghdad": ["Europe/Minsk", "Europe/Moscow"],
                        "Asia/Karachi": ["Asia/Yekaterinburg"],
                        "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"]
                    }
                },
                a = function(e) {
                    var t = -e.getTimezoneOffset();
                    return null !== t ? t : 0
                },
                s = function(e) {
                    for (var t = new Date(e, 0, 1, 0, 0, 1, 0).getTime(), n = new Date(e, 12, 31, 23, 59, 59).getTime(), i = t, o = new Date(i).getTimezoneOffset(), r = null, a = null; i < n - 864e5;) {
                        var s = new Date(i),
                            l = s.getTimezoneOffset();
                        l !== o && (l < o && (r = s), o < l && (a = s), o = l), i += 864e5
                    }
                    return !(!r || !a) && {
                        s: c(r).getTime(),
                        e: c(a).getTime()
                    }
                },
                c = function e(t, n, i) {
                    void 0 === n && (n = d.DAY, i = d.HOUR);
                    for (var o = new Date(t.getTime() - n).getTime(), r = t.getTime() + n, a = new Date(o).getTimezoneOffset(), s = o, l = null; s < r - i;) {
                        var c = new Date(s);
                        if (c.getTimezoneOffset() !== a) {
                            l = c;
                            break
                        }
                        s += i
                    }
                    return n === d.DAY ? e(l, d.HOUR, d.MINUTE) : n === d.HOUR ? e(l, d.MINUTE, d.SECOND) : l
                },
                f = function(e, t, n, i) {
                    if ("N/A" !== n) return n;
                    if ("Asia/Beirut" === t) {
                        if ("Africa/Cairo" === i.name && 13983768e5 === e[6].s && 14116788e5 === e[6].e) return 0;
                        if ("Asia/Jerusalem" === i.name && 13959648e5 === e[6].s && 14118588e5 === e[6].e) return 0
                    } else if ("America/Santiago" === t) {
                        if ("America/Asuncion" === i.name && 14124816e5 === e[6].s && 1397358e6 === e[6].e) return 0;
                        if ("America/Campo_Grande" === i.name && 14136912e5 === e[6].s && 13925196e5 === e[6].e) return 0
                    } else if ("America/Montevideo" === t) {
                        if ("America/Sao_Paulo" === i.name && 14136876e5 === e[6].s && 1392516e6 === e[6].e) return 0
                    } else if ("Pacific/Auckland" === t && "Pacific/Fiji" === i.name && 14142456e5 === e[6].s && 13961016e5 === e[6].e) return 0;
                    return n
                };
            return {
                determine: function() {
                    var e, t, n, i, o, r = function() {
                        var e, t;
                        if ("undefined" != typeof Intl && void 0 !== Intl.DateTimeFormat && void 0 !== (e = Intl.DateTimeFormat()) && void 0 !== e.resolvedOptions) return (t = e.resolvedOptions().timeZone) && (-1 < t.indexOf("/") || "UTC" === t) ? t : void 0
                    }();
                    return r || (r = p.olson.timezones[(e = a(new Date(d.BASELINE_YEAR, 0, 2)), t = a(new Date(d.BASELINE_YEAR, 5, 2)), n = e - t, n < 0 ? e + ",1" : 0 < n ? t + ",1,s" : e + ",0")], void 0 !== d.AMBIGUITIES[r] && (i = r, o = function() {
                        for (var e = [], t = 0; t < p.olson.dst_rules.years.length; t++) {
                            var n = s(p.olson.dst_rules.years[t]);
                            e.push(n)
                        }
                        return e
                    }(), r = function(e) {
                        for (var t = 0; t < e.length; t++)
                            if (!1 !== e[t]) return !0;
                        return !1
                    }(o) ? function(i, o) {
                        for (var e = {}, t = p.olson.dst_rules.zones, n = t.length, r = d.AMBIGUITIES[o], a = 0; a < n; a++) {
                            var s = t[a],
                                l = function(e) {
                                    for (var t = 0, n = 0; n < i.length; n++)
                                        if (e.rules[n] && i[n]) {
                                            if (!(i[n].s >= e.rules[n].s && i[n].e <= e.rules[n].e)) {
                                                t = "N/A";
                                                break
                                            }
                                            if (t = 0, t += Math.abs(i[n].s - e.rules[n].s), (t += Math.abs(e.rules[n].e - i[n].e)) > d.MAX_SCORE) {
                                                t = "N/A";
                                                break
                                            }
                                        } return f(i, o, t, e)
                                }(t[a]);
                            "N/A" !== l && (e[s.name] = l)
                        }
                        for (var c in e)
                            if (e.hasOwnProperty(c))
                                for (var u = 0; u < r.length; u++)
                                    if (r[u] === c) return c;
                        return o
                    }(o, i) : i)), {
                        name: function() {
                            return r
                        }
                    }
                }
            }
        }();
        p.olson = p.olson || {}, p.olson.timezones = {
            "-720,0": "Etc/GMT+12",
            "-660,0": "Pacific/Pago_Pago",
            "-660,1,s": "Pacific/Apia",
            "-600,1": "America/Adak",
            "-600,0": "Pacific/Honolulu",
            "-570,0": "Pacific/Marquesas",
            "-540,0": "Pacific/Gambier",
            "-540,1": "America/Anchorage",
            "-480,1": "America/Los_Angeles",
            "-480,0": "Pacific/Pitcairn",
            "-420,0": "America/Phoenix",
            "-420,1": "America/Denver",
            "-360,0": "America/Guatemala",
            "-360,1": "America/Chicago",
            "-360,1,s": "Pacific/Easter",
            "-300,0": "America/Bogota",
            "-300,1": "America/New_York",
            "-270,0": "America/Caracas",
            "-240,1": "America/Halifax",
            "-240,0": "America/Santo_Domingo",
            "-240,1,s": "America/Asuncion",
            "-210,1": "America/St_Johns",
            "-180,1": "America/Godthab",
            "-180,0": "America/Argentina/Buenos_Aires",
            "-180,1,s": "America/Montevideo",
            "-120,0": "America/Noronha",
            "-120,1": "America/Noronha",
            "-60,1": "Atlantic/Azores",
            "-60,0": "Atlantic/Cape_Verde",
            "0,0": "UTC",
            "0,1": "Europe/London",
            "60,1": "Europe/Berlin",
            "60,0": "Africa/Lagos",
            "60,1,s": "Africa/Windhoek",
            "120,1": "Asia/Beirut",
            "120,0": "Africa/Johannesburg",
            "180,0": "Asia/Baghdad",
            "180,1": "Europe/Moscow",
            "210,1": "Asia/Tehran",
            "240,0": "Asia/Dubai",
            "240,1": "Asia/Baku",
            "270,0": "Asia/Kabul",
            "300,1": "Asia/Yekaterinburg",
            "300,0": "Asia/Karachi",
            "330,0": "Asia/Kolkata",
            "345,0": "Asia/Kathmandu",
            "360,0": "Asia/Dhaka",
            "360,1": "Asia/Omsk",
            "390,0": "Asia/Rangoon",
            "420,1": "Asia/Krasnoyarsk",
            "420,0": "Asia/Jakarta",
            "480,0": "Asia/Shanghai",
            "480,1": "Asia/Irkutsk",
            "525,0": "Australia/Eucla",
            "525,1,s": "Australia/Eucla",
            "540,1": "Asia/Yakutsk",
            "540,0": "Asia/Tokyo",
            "570,0": "Australia/Darwin",
            "570,1,s": "Australia/Adelaide",
            "600,0": "Australia/Brisbane",
            "600,1": "Asia/Vladivostok",
            "600,1,s": "Australia/Sydney",
            "630,1,s": "Australia/Lord_Howe",
            "660,1": "Asia/Kamchatka",
            "660,0": "Pacific/Noumea",
            "690,0": "Pacific/Norfolk",
            "720,1,s": "Pacific/Auckland",
            "720,0": "Pacific/Majuro",
            "765,1,s": "Pacific/Chatham",
            "780,0": "Pacific/Tongatapu",
            "780,1,s": "Pacific/Apia",
            "840,0": "Pacific/Kiritimati"
        }, p.olson.dst_rules = {
            years: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
            zones: [{
                name: "Africa/Cairo",
                rules: [{
                    e: 12199572e5,
                    s: 12090744e5
                }, {
                    e: 1250802e6,
                    s: 1240524e6
                }, {
                    e: 12858804e5,
                    s: 12840696e5
                }, !1, !1, !1, {
                    e: 14116788e5,
                    s: 1406844e6
                }]
            }, {
                name: "Africa/Casablanca",
                rules: [{
                    e: 12202236e5,
                    s: 12122784e5
                }, {
                    e: 12508092e5,
                    s: 12438144e5
                }, {
                    e: 1281222e6,
                    s: 12727584e5
                }, {
                    e: 13120668e5,
                    s: 13017888e5
                }, {
                    e: 13489704e5,
                    s: 1345428e6
                }, {
                    e: 13828392e5,
                    s: 13761e8
                }, {
                    e: 14142888e5,
                    s: 14069448e5
                }]
            }, {
                name: "America/Asuncion",
                rules: [{
                    e: 12050316e5,
                    s: 12243888e5
                }, {
                    e: 12364812e5,
                    s: 12558384e5
                }, {
                    e: 12709548e5,
                    s: 12860784e5
                }, {
                    e: 13024044e5,
                    s: 1317528e6
                }, {
                    e: 1333854e6,
                    s: 13495824e5
                }, {
                    e: 1364094e6,
                    s: 1381032e6
                }, {
                    e: 13955436e5,
                    s: 14124816e5
                }]
            }, {
                name: "America/Campo_Grande",
                rules: [{
                    e: 12032172e5,
                    s: 12243888e5
                }, {
                    e: 12346668e5,
                    s: 12558384e5
                }, {
                    e: 12667212e5,
                    s: 1287288e6
                }, {
                    e: 12981708e5,
                    s: 13187376e5
                }, {
                    e: 13302252e5,
                    s: 1350792e6
                }, {
                    e: 136107e7,
                    s: 13822416e5
                }, {
                    e: 13925196e5,
                    s: 14136912e5
                }]
            }, {
                name: "America/Goose_Bay",
                rules: [{
                    e: 122559486e4,
                    s: 120503526e4
                }, {
                    e: 125704446e4,
                    s: 123648486e4
                }, {
                    e: 128909886e4,
                    s: 126853926e4
                }, {
                    e: 13205556e5,
                    s: 129998886e4
                }, {
                    e: 13520052e5,
                    s: 13314456e5
                }, {
                    e: 13834548e5,
                    s: 13628952e5
                }, {
                    e: 14149044e5,
                    s: 13943448e5
                }]
            }, {
                name: "America/Havana",
                rules: [{
                    e: 12249972e5,
                    s: 12056436e5
                }, {
                    e: 12564468e5,
                    s: 12364884e5
                }, {
                    e: 12885012e5,
                    s: 12685428e5
                }, {
                    e: 13211604e5,
                    s: 13005972e5
                }, {
                    e: 13520052e5,
                    s: 13332564e5
                }, {
                    e: 13834548e5,
                    s: 13628916e5
                }, {
                    e: 14149044e5,
                    s: 13943412e5
                }]
            }, {
                name: "America/Mazatlan",
                rules: [{
                    e: 1225008e6,
                    s: 12074724e5
                }, {
                    e: 12564576e5,
                    s: 1238922e6
                }, {
                    e: 1288512e6,
                    s: 12703716e5
                }, {
                    e: 13199616e5,
                    s: 13018212e5
                }, {
                    e: 13514112e5,
                    s: 13332708e5
                }, {
                    e: 13828608e5,
                    s: 13653252e5
                }, {
                    e: 14143104e5,
                    s: 13967748e5
                }]
            }, {
                name: "America/Mexico_City",
                rules: [{
                    e: 12250044e5,
                    s: 12074688e5
                }, {
                    e: 1256454e6,
                    s: 12389184e5
                }, {
                    e: 12885084e5,
                    s: 1270368e6
                }, {
                    e: 1319958e6,
                    s: 13018176e5
                }, {
                    e: 13514076e5,
                    s: 13332672e5
                }, {
                    e: 13828572e5,
                    s: 13653216e5
                }, {
                    e: 14143068e5,
                    s: 13967712e5
                }]
            }, {
                name: "America/Miquelon",
                rules: [{
                    e: 12255984e5,
                    s: 12050388e5
                }, {
                    e: 1257048e6,
                    s: 12364884e5
                }, {
                    e: 12891024e5,
                    s: 12685428e5
                }, {
                    e: 1320552e6,
                    s: 12999924e5
                }, {
                    e: 13520016e5,
                    s: 1331442e6
                }, {
                    e: 13834512e5,
                    s: 13628916e5
                }, {
                    e: 14149008e5,
                    s: 13943412e5
                }]
            }, {
                name: "America/Santa_Isabel",
                rules: [{
                    e: 12250116e5,
                    s: 1207476e6
                }, {
                    e: 12564612e5,
                    s: 12389256e5
                }, {
                    e: 12885156e5,
                    s: 12703752e5
                }, {
                    e: 13199652e5,
                    s: 13018248e5
                }, {
                    e: 13514148e5,
                    s: 13332744e5
                }, {
                    e: 13828644e5,
                    s: 13653288e5
                }, {
                    e: 1414314e6,
                    s: 13967784e5
                }]
            }, {
                name: "America/Santiago",
                rules: [{
                    e: 1206846e6,
                    s: 1223784e6
                }, {
                    e: 1237086e6,
                    s: 12552336e5
                }, {
                    e: 127035e7,
                    s: 12866832e5
                }, {
                    e: 13048236e5,
                    s: 13138992e5
                }, {
                    e: 13356684e5,
                    s: 13465584e5
                }, {
                    e: 1367118e6,
                    s: 13786128e5
                }, {
                    e: 13985676e5,
                    s: 14100624e5
                }]
            }, {
                name: "America/Sao_Paulo",
                rules: [{
                    e: 12032136e5,
                    s: 12243852e5
                }, {
                    e: 12346632e5,
                    s: 12558348e5
                }, {
                    e: 12667176e5,
                    s: 12872844e5
                }, {
                    e: 12981672e5,
                    s: 1318734e6
                }, {
                    e: 13302216e5,
                    s: 13507884e5
                }, {
                    e: 13610664e5,
                    s: 1382238e6
                }, {
                    e: 1392516e6,
                    s: 14136876e5
                }]
            }, {
                name: "Asia/Amman",
                rules: [{
                    e: 1225404e6,
                    s: 12066552e5
                }, {
                    e: 12568536e5,
                    s: 12381048e5
                }, {
                    e: 12883032e5,
                    s: 12695544e5
                }, {
                    e: 13197528e5,
                    s: 13016088e5
                }, !1, !1, {
                    e: 14147064e5,
                    s: 13959576e5
                }]
            }, {
                name: "Asia/Damascus",
                rules: [{
                    e: 12254868e5,
                    s: 120726e7
                }, {
                    e: 125685e7,
                    s: 12381048e5
                }, {
                    e: 12882996e5,
                    s: 12701592e5
                }, {
                    e: 13197492e5,
                    s: 13016088e5
                }, {
                    e: 13511988e5,
                    s: 13330584e5
                }, {
                    e: 13826484e5,
                    s: 1364508e6
                }, {
                    e: 14147028e5,
                    s: 13959576e5
                }]
            }, {
                name: "Asia/Dubai",
                rules: [!1, !1, !1, !1, !1, !1, !1]
            }, {
                name: "Asia/Gaza",
                rules: [{
                    e: 12199572e5,
                    s: 12066552e5
                }, {
                    e: 12520152e5,
                    s: 12381048e5
                }, {
                    e: 1281474e6,
                    s: 126964086e4
                }, {
                    e: 1312146e6,
                    s: 130160886e4
                }, {
                    e: 13481784e5,
                    s: 13330584e5
                }, {
                    e: 13802292e5,
                    s: 1364508e6
                }, {
                    e: 1414098e6,
                    s: 13959576e5
                }]
            }, {
                name: "Asia/Irkutsk",
                rules: [{
                    e: 12249576e5,
                    s: 12068136e5
                }, {
                    e: 12564072e5,
                    s: 12382632e5
                }, {
                    e: 12884616e5,
                    s: 12697128e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Jerusalem",
                rules: [{
                    e: 12231612e5,
                    s: 12066624e5
                }, {
                    e: 1254006e6,
                    s: 1238112e6
                }, {
                    e: 1284246e6,
                    s: 12695616e5
                }, {
                    e: 131751e7,
                    s: 1301616e6
                }, {
                    e: 13483548e5,
                    s: 13330656e5
                }, {
                    e: 13828284e5,
                    s: 13645152e5
                }, {
                    e: 1414278e6,
                    s: 13959648e5
                }]
            }, {
                name: "Asia/Kamchatka",
                rules: [{
                    e: 12249432e5,
                    s: 12067992e5
                }, {
                    e: 12563928e5,
                    s: 12382488e5
                }, {
                    e: 12884508e5,
                    s: 12696984e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Krasnoyarsk",
                rules: [{
                    e: 12249612e5,
                    s: 12068172e5
                }, {
                    e: 12564108e5,
                    s: 12382668e5
                }, {
                    e: 12884652e5,
                    s: 12697164e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Omsk",
                rules: [{
                    e: 12249648e5,
                    s: 12068208e5
                }, {
                    e: 12564144e5,
                    s: 12382704e5
                }, {
                    e: 12884688e5,
                    s: 126972e7
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Vladivostok",
                rules: [{
                    e: 12249504e5,
                    s: 12068064e5
                }, {
                    e: 12564e8,
                    s: 1238256e6
                }, {
                    e: 12884544e5,
                    s: 12697056e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Yakutsk",
                rules: [{
                    e: 1224954e6,
                    s: 120681e7
                }, {
                    e: 12564036e5,
                    s: 12382596e5
                }, {
                    e: 1288458e6,
                    s: 12697092e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Yekaterinburg",
                rules: [{
                    e: 12249684e5,
                    s: 12068244e5
                }, {
                    e: 1256418e6,
                    s: 1238274e6
                }, {
                    e: 12884724e5,
                    s: 12697236e5
                }, !1, !1, !1, !1]
            }, {
                name: "Asia/Yerevan",
                rules: [{
                    e: 1224972e6,
                    s: 1206828e6
                }, {
                    e: 12564216e5,
                    s: 12382776e5
                }, {
                    e: 1288476e6,
                    s: 12697272e5
                }, {
                    e: 13199256e5,
                    s: 13011768e5
                }, !1, !1, !1]
            }, {
                name: "Australia/Lord_Howe",
                rules: [{
                    e: 12074076e5,
                    s: 12231342e5
                }, {
                    e: 12388572e5,
                    s: 12545838e5
                }, {
                    e: 12703068e5,
                    s: 12860334e5
                }, {
                    e: 13017564e5,
                    s: 1317483e6
                }, {
                    e: 1333206e6,
                    s: 13495374e5
                }, {
                    e: 13652604e5,
                    s: 1380987e6
                }, {
                    e: 139671e7,
                    s: 14124366e5
                }]
            }, {
                name: "Australia/Perth",
                rules: [{
                    e: 12068136e5,
                    s: 12249576e5
                }, !1, !1, !1, !1, !1, !1]
            }, {
                name: "Europe/Helsinki",
                rules: [{
                    e: 12249828e5,
                    s: 12068388e5
                }, {
                    e: 12564324e5,
                    s: 12382884e5
                }, {
                    e: 12884868e5,
                    s: 1269738e6
                }, {
                    e: 13199364e5,
                    s: 13011876e5
                }, {
                    e: 1351386e6,
                    s: 13326372e5
                }, {
                    e: 13828356e5,
                    s: 13646916e5
                }, {
                    e: 14142852e5,
                    s: 13961412e5
                }]
            }, {
                name: "Europe/Minsk",
                rules: [{
                    e: 12249792e5,
                    s: 12068352e5
                }, {
                    e: 12564288e5,
                    s: 12382848e5
                }, {
                    e: 12884832e5,
                    s: 12697344e5
                }, !1, !1, !1, !1]
            }, {
                name: "Europe/Moscow",
                rules: [{
                    e: 12249756e5,
                    s: 12068316e5
                }, {
                    e: 12564252e5,
                    s: 12382812e5
                }, {
                    e: 12884796e5,
                    s: 12697308e5
                }, !1, !1, !1, !1]
            }, {
                name: "Pacific/Apia",
                rules: [!1, !1, !1, {
                    e: 13017528e5,
                    s: 13168728e5
                }, {
                    e: 13332024e5,
                    s: 13489272e5
                }, {
                    e: 13652568e5,
                    s: 13803768e5
                }, {
                    e: 13967064e5,
                    s: 14118264e5
                }]
            }, {
                name: "Pacific/Fiji",
                rules: [!1, !1, {
                    e: 12696984e5,
                    s: 12878424e5
                }, {
                    e: 13271544e5,
                    s: 1319292e6
                }, {
                    e: 1358604e6,
                    s: 13507416e5
                }, {
                    e: 139005e7,
                    s: 1382796e6
                }, {
                    e: 14215032e5,
                    s: 14148504e5
                }]
            }, {
                name: "Europe/London",
                rules: [{
                    e: 12249828e5,
                    s: 12068388e5
                }, {
                    e: 12564324e5,
                    s: 12382884e5
                }, {
                    e: 12884868e5,
                    s: 1269738e6
                }, {
                    e: 13199364e5,
                    s: 13011876e5
                }, {
                    e: 1351386e6,
                    s: 13326372e5
                }, {
                    e: 13828356e5,
                    s: 13646916e5
                }, {
                    e: 14142852e5,
                    s: 13961412e5
                }]
            }]
        }, "undefined" != typeof module && void 0 !== module.exports ? module.exports = p : "undefined" != typeof define && null !== define && null != define.amd ? define([], function() {
            return p
        }) : window.jstz = p
    }(),
    function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Sweetalert2 = t()
    }(this, function() {
        "use strict";
        var e = function(e) {
                var t = {};
                for (var n in e) t[e[n]] = "swal2-" + e[n];
                return t
            },
            E = e(["container", "in", "iosfix", "modal", "overlay", "fade", "show", "hide", "noanimation", "close", "title", "content", "spacer", "confirm", "cancel", "icon", "image", "input", "file", "range", "select", "radio", "checkbox", "textarea", "inputerror", "validationerror", "progresssteps", "activeprogressstep", "progresscircle", "progressline", "loading", "styled"]),
            b = e(["success", "warning", "info", "question", "error"]),
            w = {
                title: "",
                titleText: "",
                text: "",
                html: "",
                type: null,
                customClass: "",
                animation: !0,
                allowOutsideClick: !0,
                allowEscapeKey: !0,
                showConfirmButton: !0,
                showCancelButton: !1,
                preConfirm: null,
                confirmButtonText: "OK",
                confirmButtonColor: "#3085d6",
                confirmButtonTextColor: "#000",
                confirmButtonClass: null,
                cancelButtonText: "Cancel",
                cancelButtonColor: "#aaa",
                cancelButtonTextColor: "#000",
                radioTextColor: "#000",
                checkboxTextColor: "#000",
                textareaTextColor: "#000",
                cancelButtonClass: null,
                closeButtonColor: "#cccccc",
                titleColor: "#000",
                contentColor: "#000",
                buttonsStyling: !0,
                reverseButtons: !1,
                focusCancel: !1,
                showCloseButton: !1,
                showLoaderOnConfirm: !1,
                invalidEmail: "Invalid email address",
                imageUrl: null,
                imageWidth: null,
                imageHeight: null,
                imageClass: null,
                timer: null,
                width: 500,
                padding: 20,
                background: "#fff",
                input: null,
                inputPlaceholder: "",
                inputValue: "",
                inputOptions: {},
                inputAutoTrim: !0,
                inputClass: null,
                inputAttributes: {},
                inputValidator: null,
                progressSteps: [],
                currentProgressStep: null,
                progressStepsDistance: "40px",
                onOpen: null,
                onClose: null,
                inputTextClass: "input-field input-fielddefault",
                rtl: !1
            },
            t = ('\n  <div  role="dialog" aria-labelledby="modalTitleId" aria-describedby="modalContentId" class="' + E.modal + '" tabIndex="-1" >\n    <ul class="' + E.progresssteps + '"></ul>\n    <div class="' + E.icon + " " + b.error + '">\n      <span class="x-mark"><span class="line left"></span><span class="line right"></span></span>\n    </div>\n    <div class="' + E.icon + " " + b.question + '">?</div>\n    <div class="' + E.icon + " " + b.warning + '">!</div>\n    <div class="' + E.icon + " " + b.info + '">i</div>\n    <div class="' + E.icon + " " + b.success + '">\n      <span class="line tip"></span> <span class="line long"></span>\n      <div class="placeholder"></div> <div class="fix"></div>\n    </div>\n    <img class="' + E.image + '">\n    <h5 class="' + E.title + '" id="modalTitleId"></h5>\n    <div id="modalContentId" class="' + E.content + '"></div>\n    <div id="swal2text"><input class="' + E.input + '"></div>\n    <input type="file" class="' + E.file + '">\n    <div class="' + E.range + '">\n      <output></output>\n      <input type="range">\n    </div>\n    <select class="' + E.select + '"></select>\n    <div class="' + E.radio + '"></div>\n    <label for="' + E.checkbox + '" class="' + E.checkbox + '">\n      <input type="checkbox">\n    </label>\n    <textarea class="' + E.textarea + '"></textarea>\n    <div class="' + E.validationerror + '"></div>\n    <hr class="' + E.spacer + '">\n    <button type="button" role="button" tabIndex="0" class="' + E.confirm + '">OK</button>\n    <button type="button" role="button" tabIndex="0" class="' + E.cancel + '">Cancel</button>\n    <span class="' + E.close + '">&times;</span>\n  </div>\n').replace(/(^|\n)\s*/g, ""),
            A = void 0,
            n = document.getElementsByClassName(E.container);
        n.length ? A = n[0] : ((A = document.createElement("div")).className = E.container, A.innerHTML = t);
        var O = function(e, t) {
                (e = String(e).replace(/[^0-9a-f]/gi, "")).length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0;
                for (var n = "#", i = 0; i < 3; i++) {
                    var o = parseInt(e.substr(2 * i, 2), 16);
                    n += ("00" + (o = Math.round(Math.min(Math.max(0, o + o * t), 255)).toString(16))).substr(o.length)
                }
                return n
            },
            N = {
                previousWindowKeyDown: null,
                previousActiveElement: null,
                previousBodyPadding: null
            },
            i = function(e) {
                return A.querySelector("." + e)
            },
            j = function() {
                return document.body.querySelector("." + E.modal) || function() {
                    if ("undefined" != typeof document) {
                        if (!document.getElementsByClassName(E.container).length) {
                            document.body.appendChild(A);
                            var e = j(),
                                t = Q(e, E.input),
                                n = Q(e, E.file),
                                i = e.querySelector("." + E.range + " input"),
                                o = e.querySelector("." + E.range + " output"),
                                r = Q(e, E.select),
                                a = e.querySelector("." + E.checkbox + " input"),
                                s = Q(e, E.textarea);
                            return t.oninput = function() {
                                ee.resetValidationError()
                            }, t.onkeydown = function(e) {
                                setTimeout(function() {
                                    13 === e.keyCode && (e.stopPropagation(), ee.clickConfirm())
                                }, 0)
                            }, n.onchange = function() {
                                ee.resetValidationError()
                            }, i.oninput = function() {
                                ee.resetValidationError(), o.value = i.value
                            }, i.onchange = function() {
                                ee.resetValidationError(), i.previousSibling.value = i.value
                            }, r.onchange = function() {
                                ee.resetValidationError()
                            }, a.onchange = function() {
                                ee.resetValidationError()
                            }, s.oninput = function() {
                                ee.resetValidationError()
                            }, e
                        }
                    } else console.error("SweetAlert2 requires document to initialize")
                }()
            },
            _ = function() {
                return i(E.title)
            },
            P = function() {
                return i(E.content)
            },
            M = function() {
                return i(E.image)
            },
            D = function() {
                return i(E.spacer)
            },
            L = function() {
                return i(E.progresssteps)
            },
            I = function() {
                return i(E.validationerror)
            },
            R = function() {
                return i(E.confirm)
            },
            q = function() {
                return i(E.cancel)
            },
            B = function() {
                return i(E.close)
            },
            F = function(e) {
                var t = [R(), q()];
                return e && t.reverse(), t.concat(Array.prototype.slice.call(j().querySelectorAll("button:not([class^=swal2-]), input:not([type=hidden]), textarea, select")))
            },
            W = function(e, t) {
                return !!e.classList && e.classList.contains(t)
            },
            H = function(e) {
                if (e.focus(), "file" !== e.type) {
                    var t = e.value;
                    e.value = "", e.value = t
                }
            },
            z = function(t, e) {
                t && e && e.split(/\s+/).filter(Boolean).forEach(function(e) {
                    t.classList.add(e)
                })
            },
            V = function(t, e) {
                t && e && e.split(/\s+/).filter(Boolean).forEach(function(e) {
                    t.classList.remove(e)
                })
            },
            Q = function(e, t) {
                for (var n = 0; n < e.childNodes.length; n++) {
                    if (W(e.childNodes[n], t)) return e.childNodes[n];
                    if (0 < e.childNodes[n].childNodes.length && W(e.childNodes[n].childNodes[0], t)) return e.childNodes[n].childNodes[0]
                }
            },
            X = function(e, t) {
                t || (t = "block"), e.style.opacity = "", e.style.display = t
            },
            U = function(e) {
                e.style.opacity = "", e.style.display = "none"
            },
            Y = function(e) {
                return e.offsetWidth || e.offsetHeight || e.getClientRects().length
            },
            G = function() {
                var e = document.createElement("div"),
                    t = {
                        WebkitAnimation: "webkitAnimationEnd",
                        OAnimation: "oAnimationEnd oanimationend",
                        msAnimation: "MSAnimationEnd",
                        animation: "animationend"
                    };
                for (var n in t)
                    if (t.hasOwnProperty(n) && void 0 !== e.style[n]) return t[n];
                return !1
            }(),
            K = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
                }
                return e
            },
            r = o({}, w),
            l = [],
            J = void 0,
            Z = function(o) {
                var e = j();
                for (var t in o) w.hasOwnProperty(t) || "extraParams" === t || console.warn('SweetAlert2: Unknown parameter "' + t + '"');
                e.style.width = "number" == typeof o.width ? o.width + "px" : o.width, e.style.padding = o.padding + "px", e.style.background = o.background;
                var n = _(),
                    i = P(),
                    r = R(),
                    a = q(),
                    s = B();
                if (o.rtl ? $(i.parentElement.parentElement).addClass("abmrtl") : $(i.parentElement.parentElement).removeClass("abmrtl"), s.style.color = o.closeButtonColor, n.style.color = o.titleColor, i.style.color = o.contentColor, o.titleText ? n.innerText = o.titleText : n.innerHTML = o.title.split("\n").join("<br>"), o.text || o.html) {
                    if ("object" === K(o.html))
                        if (i.innerHTML = "", 0 in o.html)
                            for (var l = 0; l in o.html; l++) i.appendChild(o.html[l].cloneNode(!0));
                        else i.appendChild(o.html.cloneNode(!0));
                    else o.html ? i.innerHTML = o.html : o.text && (i.textContent = o.text);
                    X(i)
                } else U(i);
                o.showCloseButton ? X(s) : U(s), e.className = E.modal, o.customClass && z(e, o.customClass);
                var c = L(),
                    u = parseInt(null === o.currentProgressStep ? ee.getQueueStep() : o.currentProgressStep, 10);
                o.progressSteps.length ? (X(c), function(e) {
                    for (; e.firstChild;) e.removeChild(e.firstChild)
                }(c), u >= o.progressSteps.length && console.warn("SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"), o.progressSteps.forEach(function(e, t) {
                    var n = document.createElement("li");
                    if (z(n, E.progresscircle), n.innerHTML = e, t === u && z(n, E.activeprogressstep), c.appendChild(n), t !== o.progressSteps.length - 1) {
                        var i = document.createElement("li");
                        z(i, E.progressline), i.style.width = o.progressStepsDistance, c.appendChild(i)
                    }
                })) : U(c);
                for (var d = j().querySelectorAll("." + E.icon), f = 0; f < d.length; f++) U(d[f]);
                if (o.type) {
                    var p = !1;
                    for (var h in b)
                        if (o.type === h) {
                            p = !0;
                            break
                        } if (!p) return console.error("SweetAlert2: Unknown alert type: " + o.type), !1;
                    var m = e.querySelector("." + E.icon + "." + b[o.type]);
                    switch (X(m), o.type) {
                        case "success":
                            z(m, "animate"), z(m.querySelector(".tip"), "animate-success-tip"), z(m.querySelector(".long"), "animate-success-long");
                            break;
                        case "error":
                            z(m, "animate-error-icon"), z(m.querySelector(".x-mark"), "animate-x-mark");
                            break;
                        case "warning":
                            z(m, "pulse-warning")
                    }
                }
                var v, g = M();
                o.imageUrl ? (g.setAttribute("src", o.imageUrl), X(g), o.imageWidth ? g.setAttribute("width", o.imageWidth) : g.removeAttribute("width"), o.imageHeight ? g.setAttribute("height", o.imageHeight) : g.removeAttribute("height"), g.className = E.image, o.imageClass && z(g, o.imageClass)) : U(g), o.showCancelButton ? a.style.display = "inline-block" : U(a), o.showConfirmButton ? (v = r).style.removeProperty ? v.style.removeProperty("display") : v.style.removeAttribute("display") : U(r);
                var y = D();
                o.showConfirmButton || o.showCancelButton ? X(y) : U(y), r.innerHTML = o.confirmButtonText, a.innerHTML = o.cancelButtonText, o.buttonsStyling && (r.style.backgroundColor = o.confirmButtonColor, a.style.backgroundColor = o.cancelButtonColor, r.style.color = o.confirmButtonTextColor, a.style.color = o.cancelButtonTextColor), r.className = E.confirm, z(r, o.confirmButtonClass), a.className = E.cancel, z(a, o.cancelButtonClass), o.buttonsStyling ? (z(r, E.styled), z(a, E.styled)) : (V(r, E.styled), V(a, E.styled), r.style.backgroundColor = r.style.borderLeftColor = r.style.borderRightColor = "", a.style.backgroundColor = a.style.borderLeftColor = a.style.borderRightColor = ""), !0 === o.animation ? V(e, E.noanimation) : z(e, E.noanimation)
            },
            ee = function e() {
                for (var t = arguments.length, n = Array(t), i = 0; i < t; i++) n[i] = arguments[i];
                return e.isVisible() && e.close(),
                    function() {
                        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                        if (void 0 === t[0]) return console.error("SweetAlert2 expects at least 1 attribute!"), !1;
                        var k = o({}, r);
                        switch (K(t[0])) {
                            case "string":
                                k.title = t[0], k.html = t[1], k.type = t[2];
                                break;
                            case "object":
                                o(k, t[0]), k.extraParams = t[0].extraParams, "email" === k.input && null === k.inputValidator && (k.inputValidator = function(n) {
                                    return new Promise(function(e, t) {
                                        /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(n) ? e() : t(k.invalidEmail)
                                    })
                                });
                                break;
                            default:
                                return console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + K(t[0])), !1
                        }
                        Z(k);
                        var T = j();
                        return new Promise(function(n, l) {
                            k.timer && (T.timeout = setTimeout(function() {
                                ee.closeModal(k.onClose), l("timer")
                            }, k.timer));
                            var u = function(e) {
                                if (!(e = e || k.input)) return null;
                                switch (e) {
                                    case "select":
                                    case "textarea":
                                    case "file":
                                        return Q(T, E[e]);
                                    case "checkbox":
                                        return T.querySelector("." + E.checkbox + " input");
                                    case "radio":
                                        return T.querySelector("." + E.radio + " input:checked") || T.querySelector("." + E.radio + " input:first-child");
                                    case "range":
                                        return T.querySelector("." + E.range + " input");
                                    default:
                                        return Q(T, E.input)
                                }
                            };
                            k.input && setTimeout(function() {
                                var e = u();
                                e && H(e)
                            }, 0);
                            for (var c = function(t) {
                                    k.showLoaderOnConfirm && ee.showLoading(), k.preConfirm ? k.preConfirm(t, k.extraParams).then(function(e) {
                                        ee.closeModal(k.onClose), n(e || t)
                                    }, function(e) {
                                        ee.hideLoading(), e && ee.showValidationError(e)
                                    }) : (ee.closeModal(k.onClose), n(t))
                                }, e = function(e) {
                                    var t, n = e || window.event,
                                        i = n.target || n.srcElement,
                                        o = R(),
                                        r = q(),
                                        a = o === i || o.contains(i),
                                        s = r === i || r.contains(i);
                                    switch (n.type) {
                                        case "mouseover":
                                        case "mouseup":
                                            k.buttonsStyling && (a ? o.style.backgroundColor = O(k.confirmButtonColor, -.1) : s && (r.style.backgroundColor = O(k.cancelButtonColor, -.1)));
                                            break;
                                        case "mouseout":
                                            k.buttonsStyling && (a ? o.style.backgroundColor = k.confirmButtonColor : s && (r.style.backgroundColor = k.cancelButtonColor));
                                            break;
                                        case "mousedown":
                                            k.buttonsStyling && (a ? o.style.backgroundColor = O(k.confirmButtonColor, -.2) : s && (r.style.backgroundColor = O(k.cancelButtonColor, -.2)));
                                            break;
                                        case "click":
                                            a && ee.isVisible() ? k.input ? (t = function() {
                                                var e = u();
                                                if (!e) return null;
                                                switch (k.input) {
                                                    case "checkbox":
                                                        return e.checked ? 1 : 0;
                                                    case "radio":
                                                        return e.checked ? e.value : null;
                                                    case "file":
                                                        return e.files.length ? e.files[0] : null;
                                                    default:
                                                        return k.inputAutoTrim ? e.value.trim() : e.value
                                                }
                                            }(), k.inputValidator ? (ee.disableInput(), k.inputValidator(t, k.extraParams).then(function() {
                                                ee.enableInput(), c(t)
                                            }, function(e) {
                                                ee.enableInput(), e && ee.showValidationError(e)
                                            })) : c(t)) : c(!0) : s && ee.isVisible() && (ee.closeModal(k.onClose), l("abmcancel"))
                                    }
                                }, t = T.querySelectorAll("button"), i = 0; i < t.length; i++) t[i].onclick = e, t[i].onmouseover = e, t[i].onmouseout = e, t[i].onmousedown = e;
                            B().onclick = function() {
                                ee.closeModal(k.onClose), l("abmclose")
                            }, A.onclick = function(e) {
                                e.target === A && k.allowOutsideClick && (ee.closeModal(k.onClose), l("abmoverlay"))
                            };
                            var s = R(),
                                d = q();
                            k.reverseButtons ? s.parentNode.insertBefore(d, s) : s.parentNode.insertBefore(s, d);
                            var o, r, f = function(e, t) {
                                for (var n = F(k.focusCancel), i = 0; i < n.length; i++) {
                                    (e += t) === n.length ? e = 0 : -1 === e && (e = n.length - 1);
                                    var o = n[e];
                                    if (Y(o)) return o.focus()
                                }
                            };
                            N.previousWindowKeyDown = window.onkeydown, window.onkeydown = function(e) {
                                var t = e || window.event,
                                    n = t.keyCode || t.which;
                                if (-1 !== [9, 13, 32, 27].indexOf(n)) {
                                    for (var i = t.target || t.srcElement, o = F(k.focusCancel), r = -1, a = 0; a < o.length; a++)
                                        if (i === o[a]) {
                                            r = a;
                                            break
                                        } 9 === n ? (t.shiftKey ? f(r, -1) : f(r, 1), t.stopPropagation(), t.preventDefault()) : 13 === n || 32 === n ? -1 === r && (t.stopPropagation(), t.preventDefault(), function(e) {
                                        if (Y(e))
                                            if ("function" == typeof MouseEvent) {
                                                var t = new MouseEvent("click", {
                                                    view: window,
                                                    bubbles: !1,
                                                    cancelable: !0
                                                });
                                                e.dispatchEvent(t)
                                            } else if (document.createEvent) {
                                            var n = document.createEvent("MouseEvents");
                                            n.initEvent("click", !1, !1), e.dispatchEvent(n)
                                        } else document.createEventObject ? e.fireEvent("onclick") : "function" == typeof e.onclick && e.onclick()
                                    }(k.focusCancel ? d : s)) : 27 === n && !0 === k.allowEscapeKey && (ee.closeModal(k.onClose), l("abmesc"))
                                }
                            }, k.buttonsStyling && (s.style.borderLeftColor = k.confirmButtonColor, s.style.borderRightColor = k.confirmButtonColor), ee.showLoading = ee.enableLoading = function() {
                                X(D()), X(s, "inline-block"), z(s, E.loading), z(T, E.loading), s.disabled = !0, d.disabled = !0
                            }, ee.hideLoading = ee.disableLoading = function() {
                                k.showConfirmButton || (U(s), k.showCancelButton || U(D())), V(s, E.loading), V(T, E.loading), s.disabled = !1, d.disabled = !1
                            }, ee.getTitle = function() {
                                return _()
                            }, ee.getContent = function() {
                                return P()
                            }, ee.getInput = function() {
                                return u()
                            }, ee.getImage = function() {
                                return M()
                            }, ee.getConfirmButton = function() {
                                return R()
                            }, ee.getCancelButton = function() {
                                return q()
                            }, ee.enableButtons = function() {
                                s.disabled = !1, d.disabled = !1
                            }, ee.disableButtons = function() {
                                s.disabled = !0, d.disabled = !0
                            }, ee.enableConfirmButton = function() {
                                s.disabled = !1
                            }, ee.disableConfirmButton = function() {
                                s.disabled = !0
                            }, ee.enableInput = function() {
                                var e = u();
                                if (!e) return !1;
                                if ("radio" === e.type)
                                    for (var t = e.parentNode.parentNode.querySelectorAll("input"), n = 0; n < t.length; n++) t[n].disabled = !1;
                                else e.disabled = !1
                            }, ee.disableInput = function() {
                                var e = u();
                                if (!e) return !1;
                                if (e && "radio" === e.type)
                                    for (var t = e.parentNode.parentNode.querySelectorAll("input"), n = 0; n < t.length; n++) t[n].disabled = !0;
                                else e.disabled = !0
                            }, ee.recalculateHeight = (o = function() {
                                var e = j(),
                                    t = e.style.display;
                                e.style.minHeight = "", X(e), e.style.minHeight = e.scrollHeight + 1 + "px", e.style.display = t
                            }, r = void 0, function() {
                                clearTimeout(r), r = setTimeout(function() {
                                    r = null, o()
                                }, 50)
                            }), ee.showValidationError = function(e) {
                                var t = I();
                                t.innerHTML = e, X(t);
                                var n = u();
                                n && (H(n), z(n, E.inputerror))
                            }, ee.resetValidationError = function() {
                                var e = I();
                                U(e), ee.recalculateHeight();
                                var t = u();
                                t && V(t, E.inputerror)
                            }, ee.getProgressSteps = function() {
                                return k.progressSteps
                            }, ee.setProgressSteps = function(e) {
                                k.progressSteps = e, Z(k)
                            }, ee.showProgressSteps = function() {
                                X(L())
                            }, ee.hideProgressSteps = function() {
                                U(L())
                            }, ee.enableButtons(), ee.hideLoading(), ee.resetValidationError();
                            for (var a = ["input", "file", "range", "select", "radio", "checkbox", "textarea"], p = void 0, h = 0; h < a.length; h++) {
                                var m = E[a[h]],
                                    v = Q(T, m);
                                if (p = u(a[h])) {
                                    for (var g in p.attributes)
                                        if (p.attributes.hasOwnProperty(g)) {
                                            var y = p.attributes[g].name;
                                            "type" !== y && "value" !== y && p.removeAttribute(y)
                                        } for (var b in k.inputAttributes) p.setAttribute(b, k.inputAttributes[b])
                                }
                                v.className = m, k.inputClass && z(v, k.inputClass), U(v)
                            }
                            var w, x, C, S = void 0;
                            ! function() {
                                switch (k.input) {
                                    case "text":
                                    case "email":
                                    case "password":
                                    case "number":
                                    case "tel":
                                        (p = Q(T, E.input)).value = k.inputValue, p.placeholder = k.inputPlaceholder, p.type = k.input, $("#swal2text").attr("class", k.inputTextClass), X(p);
                                        break;
                                    case "file":
                                        (p = Q(T, E.file)).placeholder = k.inputPlaceholder, p.type = k.input, X(p);
                                        break;
                                    case "range":
                                        var e = Q(T, E.range),
                                            t = e.querySelector("input"),
                                            n = e.querySelector("output");
                                        t.value = k.inputValue, t.type = k.input, n.value = k.inputValue, X(e);
                                        break;
                                    case "select":
                                        var i = Q(T, E.select);
                                        if (i.innerHTML = "", k.inputPlaceholder) {
                                            var o = document.createElement("option");
                                            o.innerHTML = k.inputPlaceholder, o.value = "", o.disabled = !0, o.selected = !0, i.appendChild(o)
                                        }
                                        S = function(e) {
                                            for (var t in e) {
                                                var n = document.createElement("option");
                                                n.value = t, n.innerHTML = e[t], k.inputValue === t && (n.selected = !0), i.appendChild(n)
                                            }
                                            X(i), i.focus()
                                        };
                                        break;
                                    case "radio":
                                        var a = Q(T, E.radio);
                                        a.innerHTML = "", S = function(e) {
                                            for (var t in e) {
                                                var n = document.createElement("input"),
                                                    i = document.createElement("label"),
                                                    o = document.createElement("span");
                                                n.type = "radio", n.name = E.radio, n.value = t, k.inputValue === t && (n.checked = !0), o.innerHTML = e[t], o.style.color = k.radioTextColor, i.appendChild(n), i.appendChild(o), i.for = n.id, a.appendChild(i)
                                            }
                                            X(a);
                                            var r = a.querySelectorAll("input");
                                            r.length && r[0].focus()
                                        };
                                        break;
                                    case "checkbox":
                                        var r = Q(T, E.checkbox),
                                            s = u("checkbox");
                                        s.type = "checkbox", s.value = 1, s.id = E.checkbox, s.checked = Boolean(k.inputValue);
                                        var l = r.getElementsByTagName("span");
                                        l.length && r.removeChild(l[0]), (l = document.createElement("span")).style.color = k.checkboxTextColor, l.innerHTML = k.inputPlaceholder, r.appendChild(l), X(r);
                                        break;
                                    case "textarea":
                                        var c = Q(T, E.textarea);
                                        c.value = k.inputValue, c.placeholder = k.inputPlaceholder, c.style.backgroundColor = "transparent", c.style.color = k.textareaTextColor, X(c);
                                        break;
                                    case null:
                                        break;
                                    default:
                                        console.error('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "select", "checkbox", "textarea" or "file", got "' + k.input + '"')
                                }
                            }(), "select" !== k.input && "radio" !== k.input || (k.inputOptions instanceof Promise ? (ee.showLoading(), k.inputOptions.then(function(e) {
                                    ee.hideLoading(), S(e)
                                })) : "object" === K(k.inputOptions) ? S(k.inputOptions) : console.error("SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got " + K(k.inputOptions))), w = k.animation, x = k.onOpen, C = j(), w ? (z(C, E.show), z(A, E.fade), V(C, E.hide)) : V(C, E.fade), X(C), A.style.overflowY = "hidden", G && !W(C, E.noanimation) ? C.addEventListener(G, function e() {
                                    C.removeEventListener(G, e), A.style.overflowY = "auto"
                                }) : A.style.overflowY = "auto", z(document.documentElement, E.in), z(document.body, E.in), z(A, E.in), null === N.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (N.previousBodyPadding = document.body.style.paddingRight, document.body.style.paddingRight = function() {
                                    if ("ontouchstart" in window || navigator.msMaxTouchPoints) return 0;
                                    var e = document.createElement("div");
                                    e.style.width = "50px", e.style.height = "50px", e.style.overflow = "scroll", document.body.appendChild(e);
                                    var t = e.offsetWidth - e.clientWidth;
                                    return document.body.removeChild(e), t
                                }() + "px"),
                                function() {
                                    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && !W(document.body, E.iosfix)) {
                                        var e = document.body.scrollTop;
                                        document.body.style.top = -1 * e + "px", z(document.body, E.iosfix)
                                    }
                                }(), N.previousActiveElement = document.activeElement, null !== x && "function" == typeof x && setTimeout(function() {
                                    x(C)
                                }), f(-1, 1), A.scrollTop = 0, "undefined" == typeof MutationObserver || J || (J = new MutationObserver(ee.recalculateHeight)).observe(T, {
                                    childList: !0,
                                    characterData: !0,
                                    subtree: !0
                                })
                        })
                    }.apply(void 0, n)
            };
        return ee.isVisible = function() {
            var e = j();
            return Y(e)
        }, ee.queue = function(e) {
            l = e;
            var r = j(),
                a = function() {
                    l = [], r.removeAttribute("data-queue-step")
                },
                s = [];
            return new Promise(function(e, o) {
                ! function t(n, i) {
                    n < l.length ? (r.setAttribute("data-queue-step", n), ee(l[n]).then(function(e) {
                        s.push(e), t(n + 1, i)
                    }, function(e) {
                        a(), o(e)
                    })) : (a(), e(s))
                }(0)
            })
        }, ee.getQueueStep = function() {
            return j().getAttribute("data-queue-step")
        }, ee.insertQueueStep = function(e, t) {
            return t && t < l.length ? l.splice(t, 0, e) : l.push(e)
        }, ee.deleteQueueStep = function(e) {
            void 0 !== l[e] && l.splice(e, 1)
        }, ee.close = ee.closeModal = function(e) {
            var t = j();
            V(t, E.show), z(t, E.hide);
            var n = t.querySelector("." + E.icon + "." + b.success);
            V(n, "animate"), V(n.querySelector(".tip"), "animate-success-tip"), V(n.querySelector(".long"), "animate-success-long");
            var i = t.querySelector("." + E.icon + "." + b.error);
            V(i, "animate-error-icon"), V(i.querySelector(".x-mark"), "animate-x-mark");
            var o = t.querySelector("." + E.icon + "." + b.warning);
            V(o, "pulse-warning"),
                function() {
                    var e = j();
                    if (window.onkeydown = N.previousWindowKeyDown, N.previousActiveElement && N.previousActiveElement.focus) {
                        var t = window.scrollX,
                            n = window.scrollY;
                        N.previousActiveElement.focus(), window.scrollTo(t, n)
                    }
                    clearTimeout(e.timeout)
                }();
            var r = function() {
                U(t), t.style.minHeight = "", V(document.documentElement, E.in), V(document.body, E.in), V(A, E.in), null !== N.previousBodyPadding && (document.body.style.paddingRight = N.previousBodyPadding, N.previousBodyPadding = null),
                    function() {
                        if (W(document.body, E.iosfix)) {
                            var e = parseInt(document.body.style.top, 10);
                            V(document.body, E.iosfix), document.body.style.top = "", document.body.scrollTop = -1 * e
                        }
                    }()
            };
            G && !W(t, E.noanimation) ? t.addEventListener(G, function e() {
                t.removeEventListener(G, e), W(t, E.hide) && r()
            }) : r(), null !== e && "function" == typeof e && setTimeout(function() {
                e(t)
            })
        }, ee.clickConfirm = function() {
            return R().click()
        }, ee.clickCancel = function() {
            return q().click()
        }, ee.setDefaults = function(e) {
            if (!e || "object" !== (void 0 === e ? "undefined" : K(e))) return console.error("SweetAlert2: the argument for setDefaults() is required and has to be a object");
            for (var t in e) w.hasOwnProperty(t) || "extraParams" === t || (console.warn('SweetAlert2: Unknown parameter "' + t + '"'), delete e[t]);
            o(r, e)
        }, ee.resetDefaults = function() {
            r = o({}, w)
        }, ee.noop = function() {}, ee.version = "6.3.8", ee.default = ee
    }), window.Sweetalert2 && (window.sweetAlert = window.swal = window.Sweetalert2);
var saveAs = saveAs || function(s) {
    "use strict";
    if (!(void 0 === s || "undefined" != typeof navigator && /MSIE [1-9]\./.test(navigator.userAgent))) {
        var l = function() {
                return s.URL || s.webkitURL || s
            },
            c = s.document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
            u = "download" in c,
            d = /constructor/i.test(s.HTMLElement) || s.safari,
            f = /CriOS\/[\d]+/.test(navigator.userAgent),
            p = function(e) {
                (s.setImmediate || s.setTimeout)(function() {
                    throw e
                }, 0)
            },
            h = function(e) {
                setTimeout(function() {
                    "string" == typeof e ? l().revokeObjectURL(e) : e.remove()
                }, 4e4)
            },
            m = function(e) {
                return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob([String.fromCharCode(65279), e], {
                    type: e.type
                }) : e
            },
            i = function(e, n, t) {
                t || (e = m(e));
                var i, o = this,
                    r = "application/octet-stream" === e.type,
                    a = function() {
                        ! function(e, t, n) {
                            for (var i = (t = [].concat(t)).length; i--;) {
                                var o = e["on" + t[i]];
                                if ("function" == typeof o) try {
                                    o.call(e, e)
                                } catch (e) {
                                    p(e)
                                }
                            }
                        }(o, "writestart progress write writeend".split(" "))
                    };
                if (o.readyState = o.INIT, u) return i = l().createObjectURL(e), void setTimeout(function() {
                    var e, t;
                    c.href = i, c.download = n, e = c, t = new MouseEvent("click"), e.dispatchEvent(t), a(), h(i), o.readyState = o.DONE
                });
                ! function() {
                    if ((f || r && d) && s.FileReader) {
                        var t = new FileReader;
                        return t.onloadend = function() {
                            var e = f ? t.result : t.result.replace(/^data:[^;]*;/, "data:attachment/file;");
                            s.open(e, "_blank") || (s.location.href = e), e = void 0, o.readyState = o.DONE, a()
                        }, t.readAsDataURL(e), o.readyState = o.INIT
                    }
                    i || (i = l().createObjectURL(e)), r ? s.location.href = i : s.open(i, "_blank") || (s.location.href = i), o.readyState = o.DONE, a(), h(i)
                }()
            },
            e = i.prototype;
        return "undefined" != typeof navigator && navigator.msSaveOrOpenBlob ? function(e, t, n) {
            return t = t || e.name || "download", n || (e = m(e)), navigator.msSaveOrOpenBlob(e, t)
        } : (e.abort = function() {}, e.readyState = e.INIT = 0, e.WRITING = 1, e.DONE = 2, e.error = e.onwritestart = e.onprogress = e.onwrite = e.onabort = e.onerror = e.onwriteend = null, function(e, t, n) {
            return new i(e, t || e.name || "download", n)
        })
    }
}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content);
"undefined" != typeof module && module.exports ? module.exports.saveAs = saveAs : "undefined" != typeof define && null !== define && null !== define.amd && define("FileSaver.js", function() {
        return saveAs
    }),
    function(e) {
        if ("undefined" != typeof Worker) i = !0;
        else var i = !1;
        if ("undefined" == typeof console || void 0 === console.error) d = function(e) {};
        else var d = function() {
            console.error.apply(console, arguments)
        };
        var f = function(t) {
                var n;
                try {
                    n = new Blob([t], {
                        type: "application/javascript"
                    })
                } catch (e) {
                    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder, (n = new BlobBuilder).append(t), n = n.getBlob()
                }
                return URL.createObjectURL(n)
            }(function() {
                self.onmessage = function(e) {
                    ! function(e) {
                        var t = [];
                        if (e instanceof Array)
                            for (var n = e.length, i = 0; i < n; i++)
                                if (e[i] instanceof Array) {
                                    if (e[i].length < 1 || 3 < e[i].length) throw new Error("wwpreload: array config (index " + i + ") not valid");
                                    if (void 0 !== e[i][1] && isNaN(e[i][1])) throw new Error("wwpreload: array config (index " + i + ") not valid (callback id)");
                                    t.push(e[i])
                                } else "string" == typeof e[i] && t.push([e[i]]);
                        var s = [];
                        if (0 < t.length) {
                            var l = t.length;
                            for (n = t.length, i = 0; i < n; i++) ! function(e, r) {
                                var a = !1,
                                    t = function(e) {
                                        var t, n, i, o;
                                        a = !0, r && (i = r, o = e ? "error" : "ok", self.postMessage([2, i, o])), 0 == --l && (n = [1], 0 < (t = s).length && n.push(t), self.postMessage(n), self.close())
                                    },
                                    n = new XMLHttpRequest;
                                n.onreadystatechange = function() {
                                    a || 4 === n.readyState && (200 !== n.status ? t(!0) : t())
                                }, n.onload = function() {}, n.onerror = function() {
                                    a || (s.push(e), t(!0))
                                }, n.open("GET", e, !0), n.send()
                            }(t[i][0], t[i][1])
                        }
                    }(e.data, postMessage)
                }
            }.toString().replace(/^function\s*\(\s*\)\s*\{/, "").replace(/\}$/, "")),
            p = {},
            h = 0,
            m = function(e) {
                var t = document.createElement("a");
                return t.href = e, t.protocol + "//" + t.host + t.pathname + t.search
            },
            t = function(e, t, n) {
                if (i) {
                    if (e instanceof Array);
                    else if ("object" == typeof e && e.uri) e = [e];
                    else {
                        if ("string" != typeof e) return void d("preloadww: invalid resource config", e);
                        e = [e]
                    }! function(e, o, t) {
                        for (var n = [], r = [], a = function(e) {
                                "object" == typeof e && e.preventDefault && e.preventDefault(), d("preloadww:", e), t && t(e)
                            }, i = e.length, s = 0; s < i; s++)
                            if (e[s] instanceof Array) {
                                if (e[s].length < 1 || 3 < e[s].length) return a("invalid resource config at index", e[s]);
                                if (e[s][1]) {
                                    if ("function" != typeof e[s][1]) return a("resource onload callback is not a function", e[s]);
                                    c = ++h, p["cb" + c] = e[s][1], e[s][1] = c
                                }
                                r.push(e[s][0]), e[s][0] = m(e[s][0]), n.push(e[s])
                            } else if ("object" == typeof e[s]) {
                            if (!e[s].uri) return a("invalid resource config at index", e[s]);
                            r.push(e[s].uri);
                            var l = [m(e[s].uri)];
                            if (e[s].callback) {
                                if ("function" != typeof e[s].callback) return a("resource onload callback is not a function", e[s]);
                                var c = ++h;
                                p["cb" + c] = e[s].callback, e[s].callback = c, l.push(c), e[s].type && l.push(e[s].type)
                            } else e[s].type && l.push(null, e[s].type);
                            n.push(l)
                        } else "string" == typeof e[s] && (r.push(e[s]), n.push(m(e[s])));
                        if (0 !== n.length) {
                            var u = new Worker(f);
                            u.addEventListener("message", function(e) {
                                var t = e.data;
                                if (t instanceof Array) {
                                    if (1 === parseInt(t[0])) t[1] && d("preloadww:", "failed to load", t[1]), o(r), u && (u.terminate(), u = void 0);
                                    else if (2 === parseInt(t[0])) {
                                        var n = t[1],
                                            i = 1 === parseInt(t[2]) ? "ok" : "error";
                                        void 0 !== p["cb" + n] && (p["cb" + n](i), delete p["cb" + n])
                                    }
                                } else a("invalid response from worker")
                            }), u.addEventListener("error", a), u.postMessage(n)
                        } else a("no resources to preload")
                    }(e, t, n)
                } else d("preloadww: web workers not supported")
            };
        "object" == typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd ? define([], function() {
            return t
        }) : e.preloadww = t
    }("object" == typeof self && self.self === self && self || "object" == typeof global && global.global === global && global || this),
    function(e, t) {
        "object" == typeof exports && "string" != typeof exports.nodeName ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) throw new Error("blobjs requires a window with a document");
            return t(e)
        } : t(e)
    }(window || this, function(e, t) {
        "use strict";
        var n = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (e.URL = e.URL || e.webkitURL, e.Blob && e.URL && !n) try {
            return new e.Blob, "function" == typeof define && define.amd && define("blobjs", [], function() {
                return e.Blob
            }), e.Blob
        } catch (e) {}
        var s = e.BlobBuilder || e.WebKitBlobBuilder || e.MozBlobBuilder || function(e) {
                var s = function(e) {
                        return Object.prototype.toString.call(e).match(/^\[object\s(.*)\]$/)[1]
                    },
                    t = function() {
                        this.data = []
                    },
                    l = function(e, t, n) {
                        this.data = e, this.size = e.length, this.type = t, this.encoding = n
                    },
                    n = t.prototype,
                    i = l.prototype,
                    c = e.FileReaderSync,
                    u = function(e) {
                        this.code = this[this.name = e]
                    },
                    o = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),
                    r = o.length,
                    a = e.URL || e.webkitURL || e,
                    d = a.createObjectURL,
                    f = a.revokeObjectURL,
                    p = a,
                    h = e.btoa,
                    m = e.atob,
                    v = e.ArrayBuffer,
                    g = e.Uint8Array,
                    y = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
                for (l.fake = i.fake = !0; r--;) u.prototype[o[r]] = r + 1;
                return a.createObjectURL || (p = e.URL = function(e) {
                    var t, n = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                    return n.href = e, "origin" in n || ("data:" === n.protocol.toLowerCase() ? n.origin = null : (t = e.match(y), n.origin = t && t[1])), n
                }), p.createObjectURL = function(e) {
                    var t, n = e.type;
                    return null === n && (n = "application/octet-stream"), e instanceof l ? (t = "data:" + n, "base64" === e.encoding ? t + ";base64," + e.data : "URI" === e.encoding ? t + "," + decodeURIComponent(e.data) : h ? t + ";base64," + h(e.data) : t + "," + encodeURIComponent(e.data)) : d ? d.call(a, e) : void 0
                }, p.revokeObjectURL = function(e) {
                    "data:" !== e.substring(0, 5) && f && f.call(a, e)
                }, n.append = function(e) {
                    var t = this.data;
                    if (g && (e instanceof v || e instanceof g)) {
                        for (var n = "", i = new g(e), o = 0, r = i.length; o < r; o++) n += String.fromCharCode(i[o]);
                        t.push(n)
                    } else if ("Blob" === s(e) || "File" === s(e)) {
                        if (!c) throw new u("NOT_READABLE_ERR");
                        var a = new c;
                        t.push(a.readAsBinaryString(e))
                    } else e instanceof l ? "base64" === e.encoding && m ? t.push(m(e.data)) : "URI" === e.encoding ? t.push(decodeURIComponent(e.data)) : "raw" === e.encoding && t.push(e.data) : ("string" != typeof e && (e += ""), t.push(unescape(encodeURIComponent(e))))
                }, n.getBlob = function(e) {
                    return arguments.length || (e = null), new l(this.data.join(""), e, "raw")
                }, n.toString = function() {
                    return "[object BlobBuilder]"
                }, i.slice = function(e, t, n) {
                    var i = arguments.length;
                    return i < 3 && (n = null), new l(this.data.slice(e, 1 < i ? t : this.data.length), n, this.encoding)
                }, i.toString = function() {
                    return "[object Blob]"
                }, i.close = function() {
                    this.size = 0, delete this.data
                }, t
            }(e),
            i = function(e, t) {
                var n = t && t.type || "",
                    i = new s;
                if (e)
                    for (var o = 0, r = e.length; o < r; o++) Uint8Array && e[o] instanceof Uint8Array ? i.append(e[o].buffer) : i.append(e[o]);
                var a = i.getBlob(n);
                return !a.slice && a.webkitSlice && (a.slice = a.webkitSlice), a
            },
            o = Object.getPrototypeOf || function(e) {
                return e.__proto__
            };
        return i.prototype = o(new i), "function" == typeof define && define.amd && define("blobjs", [], function() {
            return i
        }), void 0 === t && (e.Blob = i), i
    }),
    function(o) {
        o.fn.alterClass = function(e, t) {
            if (-1 === e.indexOf("*")) return this.removeClass(e), t ? this.addClass(t) : this;
            var i = new RegExp("\\s" + e.replace(/\*/g, "[A-Za-z0-9-_]+").split(" ").join("\\s|\\s") + "\\s", "g");
            return this.each(function(e, t) {
                for (var n = " " + t.className + " "; i.test(n);) n = n.replace(i, " ");
                t.className = o.trim(n)
            }), t ? this.addClass(t) : this
        }
    }(jQuery),
    function(e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).dragula = e()
    }(function() {
        return function r(a, s, l) {
            function c(t, e) {
                if (!s[t]) {
                    if (!a[t]) {
                        var n = "function" == typeof require && require;
                        if (!e && n) return n(t, !0);
                        if (u) return u(t, !0);
                        var i = new Error("Cannot find module '" + t + "'");
                        throw i.code = "MODULE_NOT_FOUND", i
                    }
                    var o = s[t] = {
                        exports: {}
                    };
                    a[t][0].call(o.exports, function(e) {
                        return c(a[t][1][e] || e)
                    }, o, o.exports, r, a, s, l)
                }
                return s[t].exports
            }
            for (var u = "function" == typeof require && require, e = 0; e < l.length; e++) c(l[e]);
            return c
        }({
            1: [function(e, t, n) {
                "use strict";

                function i(e) {
                    var t = o[e];
                    return t ? t.lastIndex = 0 : o[e] = t = new RegExp("(?:^|\\s)" + e + "(?:\\s|$)", "g"), t
                }
                var o = {};
                t.exports = {
                    add: function(e, t) {
                        var n = e.className;
                        n.length ? i(t).test(n) || (e.className += " " + t) : e.className = t
                    },
                    rm: function(e, t) {
                        e.className = e.className.replace(i(t), " ").trim()
                    }
                }
            }, {}],
            2: [function(e, t, n) {
                (function(o) {
                    "use strict";

                    function z(e, t, n, i) {
                        o.navigator.pointerEnabled ? re[t](e, {
                            mouseup: "pointerup",
                            mousedown: "pointerdown",
                            mousemove: "pointermove"
                        } [n], i) : o.navigator.msPointerEnabled ? re[t](e, {
                            mouseup: "MSPointerUp",
                            mousedown: "MSPointerDown",
                            mousemove: "MSPointerMove"
                        } [n], i) : (re[t](e, {
                            mouseup: "touchend",
                            mousedown: "touchstart",
                            mousemove: "touchmove"
                        } [n], i), re[t](e, n, i))
                    }

                    function V(e) {
                        if (void 0 !== e.touches) return e.touches.length;
                        if (void 0 !== e.which && 0 !== e.which) return e.which;
                        if (void 0 !== e.buttons) return e.buttons;
                        var t = e.button;
                        return void 0 !== t ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : void 0
                    }

                    function Q(e, t) {
                        return void 0 !== o[t] ? o[t] : le.clientHeight ? le[e] : se.body[e]
                    }

                    function X(e, t, n) {
                        var i, o = e || {},
                            r = o.className;
                        return o.className += " gu-hide", i = se.elementFromPoint(t, n), o.className = r, i
                    }

                    function U() {
                        return !1
                    }

                    function Y() {
                        return !0
                    }

                    function G(e) {
                        return e.width || e.right - e.left
                    }

                    function K(e) {
                        return e.height || e.bottom - e.top
                    }

                    function J(e) {
                        return e.parentNode === se ? null : e.parentNode
                    }

                    function Z(e) {
                        return "INPUT" === e.tagName || "TEXTAREA" === e.tagName || "SELECT" === e.tagName || function e(t) {
                            return !!t && "false" !== t.contentEditable && ("true" === t.contentEditable || e(J(t)))
                        }(e)
                    }

                    function ee(t) {
                        return t.nextElementSibling || function() {
                            for (var e = t;
                                (e = e.nextSibling) && 1 !== e.nodeType;);
                            return e
                        }()
                    }

                    function te(e, t) {
                        var n, i = (n = t).targetTouches && n.targetTouches.length ? n.targetTouches[0] : n.changedTouches && n.changedTouches.length ? n.changedTouches[0] : n,
                            o = {
                                pageX: "clientX",
                                pageY: "clientY"
                            };
                        return e in o && !(e in i) && o[e] in i && (e = o[e]), i[e]
                    }

                    function ne(e, t, n) {
                        return ie = i(function() {
                            ne(e, t, n)
                        }), e[n] += .25 * t
                    }
                    var ie, oe = e("contra/emitter"),
                        re = e("crossvent"),
                        ae = e("./classes"),
                        se = document,
                        le = se.documentElement,
                        i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(e) {
                            setTimeout(e, 1e3 / 60)
                        };
                    t.exports = function(e, t) {
                        function a(e) {
                            return -1 !== H.containers.indexOf(e) || W.isContainer(e)
                        }

                        function n(e) {
                            var t = e ? "remove" : "add";
                            z(le, t, "mousedown", c), z(le, t, "mouseup", h)
                        }

                        function s(e) {
                            z(le, e ? "remove" : "add", "mousemove", o)
                        }

                        function l(e) {
                            var t = e ? "remove" : "add";
                            re[t](le, "selectstart", i), re[t](le, "click", i)
                        }

                        function i(e) {
                            L && e.preventDefault()
                        }

                        function c(e) {
                            if (N = e.clientX, j = e.clientY, 1 === V(e) && !e.metaKey && !e.ctrlKey) {
                                var t = e.target,
                                    n = r(t, e);
                                n && (L = n, s(), "mousedown" === e.type && (Z(t) ? t.focus() : e.preventDefault()))
                            }
                        }

                        function o(e) {
                            if (L)
                                if (0 !== V(e)) {
                                    if (void 0 === e.clientX || e.clientX !== N || void 0 === e.clientY || e.clientY !== j) {
                                        if (W.ignoreInputTextSelection) {
                                            var t = te("clientX", e),
                                                n = te("clientY", e);
                                            if (Z(se.elementFromPoint(t, n))) return
                                        }
                                        var i = L;
                                        s(!0), l(), f(), d(i);
                                        var o = (a = E.getBoundingClientRect()).left + Q("scrollLeft", "pageXOffset"),
                                            r = a.top + Q("scrollTop", "pageYOffset");
                                        A = te("pageX", e) - o, O = te("pageY", e) - r, ae.add(M || E, "gu-transit"),
                                            function() {
                                                if (!k) {
                                                    var e = E.getBoundingClientRect();
                                                    (k = E.cloneNode(!0)).style.width = G(e) + "px", k.style.height = K(e) + "px", ae.rm(k, "gu-transit"), ae.add(k, "gu-mirror"), W.mirrorContainer.appendChild(k), z(le, "add", "mousemove", x), ae.add(W.mirrorContainer, "gu-unselectable"), H.emit("cloned", k, E, "mirror")
                                                }
                                            }(), x(e)
                                    }
                                } else h({});
                            var a
                        }

                        function u(e) {
                            return !!$(e).attr("data-dropto")
                        }

                        function r(e, t) {
                            if (t && t.touches) {
                                if (!I) return B = t.touches[0].pageX, F = t.touches[0].pageY, void(I = setTimeout(function() {
                                    c(t)
                                }, 1e3));
                                var n = t.touches[0].pageX,
                                    i = t.touches[0].pageY;
                                if (clearTimeout(I), I = null, 20 < Math.abs(n - B) || 20 < Math.abs(i - F)) return void(F = B = 0);
                                F = B = 0
                            }
                            if (I = null, !(H.dragging && k || a(e))) {
                                for (var o = e; J(e) && !1 === a(J(e)) && !1 === u(J(e));) {
                                    if (W.invalid(e, o)) return;
                                    if (!(e = J(e))) return
                                }
                                u(J(e)) && (e = J(e));
                                var r = J(e);
                                if (r && !W.invalid(e, o) && W.moves(e, r, o, ee(e))) return 1 == W.UseZDepth && $(e).addClass("z-depth-2"), q = $(e).attr("id"), {
                                    item: e,
                                    source: r
                                }
                            }
                        }

                        function d(e) {
                            var t, n;
                            t = e.item, n = e.source, ("boolean" == typeof W.copy ? W.copy : W.copy(t, n)) && (M = e.item.cloneNode(!0), H.emit("cloned", M, e.item, "copy")), T = e.source, E = e.item, _ = P = ee(e.item), H.dragging = !0, H.emit("drag", E, T)
                        }

                        function f() {
                            if (H.dragging) {
                                var e = M || E;
                                m(e, J(e))
                            } else cancelAnimationFrame(ie)
                        }

                        function p() {
                            s(!(L = !1)), l(!0)
                        }

                        function h(e) {
                            if (p(), clearTimeout(I), I = null, "" != q && 1 == W.UseZDepth && $("#" + q).removeClass("z-depth-2"), cancelAnimationFrame(ie), H.dragging) {
                                var t = M || E,
                                    n = te("clientX", e),
                                    i = te("clientY", e),
                                    o = w(X(k, n, i), n, i);
                                o && (M && W.copySortSource || !M || o !== T) ? m(t, o) : W.removeOnSpill ? v() : g()
                            }
                        }

                        function m(e, t) {
                            clearTimeout(I), I = null, "" != q && 1 == W.UseZDepth && $("#" + q).removeClass("z-depth-2"), cancelAnimationFrame(ie);
                            var n = J(e);
                            M && W.copySortSource && t === T && n.removeChild(E), b(t) ? H.emit("cancel", e, T, T) : H.emit("drop", e, t, T, P), y()
                        }

                        function v() {
                            if (clearTimeout(I), I = null, "" != q && 1 == W.UseZDepth && $("#" + q).removeClass("z-depth-2"), H.dragging) {
                                cancelAnimationFrame(ie);
                                var e = M || E,
                                    t = J(e);
                                t && t.removeChild(e), H.emit(M ? "cancel" : "remove", e, t, T), y()
                            }
                        }

                        function g(e) {
                            if (clearTimeout(I), I = null, "" != q && 1 == W.UseZDepth && $("#" + q).removeClass("z-depth-2"), cancelAnimationFrame(ie), H.dragging) {
                                var t = 0 < arguments.length ? e : W.revertOnSpill,
                                    n = M || E,
                                    i = J(n),
                                    o = b(i);
                                !1 === o && t && (M ? i && i.removeChild(M) : T.insertBefore(n, _)), o || t ? H.emit("cancel", n, T, T) : H.emit("drop", n, i, T, P), y()
                            }
                        }

                        function y() {
                            clearTimeout(I), I = null;
                            var e = M || E;
                            cancelAnimationFrame(ie), p(), k && (ae.rm(W.mirrorContainer, "gu-unselectable"), z(le, "remove", "mousemove", x), J(k).removeChild(k), k = null), e && (ae.rm(e, "gu-transit"), 1 == W.UseZDepth && $(e).removeClass("z-depth-2")), D && clearTimeout(D), H.dragging = !1, R && H.emit("out", e, R, T), H.emit("dragend", e), T = E = M = _ = P = D = R = null
                        }

                        function b(e, t) {
                            var n;
                            return n = void 0 !== t ? t : k ? P : ee(M || E), e === T && n === _
                        }

                        function w(n, i, o) {
                            for (var r = n; r && ! function() {
                                    if (!1 === a(r)) return !1;
                                    var e = C(r, n);
                                    if (null == e) return !1;
                                    var t = S(r, e, i, o);
                                    return !!b(r, t) || W.accepts(E, r, T, t)
                                }();) r = J(r);
                            return r
                        }

                        function x(e) {
                            function t(e) {
                                H.emit(e, a, R, T)
                            }
                            if (clearTimeout(I), I = null, k) {
                                0 === V(e) && g(), e.preventDefault();
                                var n = te("clientX", e),
                                    i = te("clientY", e),
                                    o = n - A,
                                    r = i - O;
                                k.style.left = o + "px", k.style.top = r + "px";
                                var a = M || E,
                                    s = X(k, n, i),
                                    l = w(s, n, i),
                                    c = null !== l && l !== R;
                                (c || null === l) && (R && t("out"), R = l, c && t("over"));
                                var u = J(a);
                                if (l !== T || !M || W.copySortSource) {
                                    var d, f = C(l, s);
                                    if (null !== f) d = S(l, f, n, i);
                                    else {
                                        if (!0 !== W.revertOnSpill || M) return void(M && u && u.removeChild(a));
                                        d = _, l = T
                                    }(null === d && c || d !== a && d !== ee(a)) && (P = d, l.insertBefore(a, d), H.emit("shadow", a, l, T)), p = e, $(document.body), v = m = null, p.touches ? (m = p.touches[0].pageX, v = p.touches[0].pageY) : (m = p.pageX, v = p.pageY), cancelAnimationFrame(ie), h = document.scrollingElement || document.documentElement || document.body, v - window.scrollY < 40 ? ne(h, -20, "scrollTop") : window.innerHeight - (v - window.scrollY) < 40 && ne(h, 20, "scrollTop"), m - window.scrollX < 40 ? ne(h, -20, "scrollLeft") : window.innerWidth - (m - window.scrollX) < 40 && ne(h, 20, "scrollLeft")
                                } else u && u.removeChild(a)
                            }
                            var p, h, m, v
                        }

                        function C(e, t) {
                            for (var n = t; n !== e && J(n) !== e;) n = J(n);
                            if (n === le) return null;
                            var i = $(n).attr("id");
                            if (i) {
                                var o = i.indexOf("-"); - 1 < o && (i = i.substring(0, o))
                            }
                            return -1 !== W.headerIDs.indexOf(":" + i + ":") ? null : -1 !== W.footerIDs.indexOf(":" + i + ":") ? null : n
                        }

                        function S(o, e, r, a) {
                            var t, s = "horizontal" === W.direction;
                            return e !== o ? (t = e.getBoundingClientRect(), (s ? r > t.left + G(t) / 2 : a > t.top + K(t) / 2) ? ee(e) : e) : function() {
                                var e, t, n, i = o.children.length;
                                for (e = 0; e < i; e++) {
                                    if (n = (t = o.children[e]).getBoundingClientRect(), s && n.left + n.width / 2 > r) return t;
                                    if (!s && n.top + n.height / 2 > a) return t
                                }
                                return null
                            }()
                        }
                        1 === arguments.length && !1 === Array.isArray(e) && (t = e, e = []);
                        var k, T, E, A, O, N, j, _, P, M, D, L, I, R = null,
                            q = "",
                            B = null,
                            F = null,
                            W = t || {};
                        void 0 === W.moves && (W.moves = Y), void 0 === W.accepts && (W.accepts = Y), void 0 === W.invalid && (W.invalid = function() {
                            return !1
                        }), void 0 === W.containers && (W.containers = e || []), void 0 === W.isContainer && (W.isContainer = U), void 0 === W.copy && (W.copy = !1), void 0 === W.copySortSource && (W.copySortSource = !1), void 0 === W.revertOnSpill && (W.revertOnSpill = !1), void 0 === W.removeOnSpill && (W.removeOnSpill = !1), void 0 === W.direction && (W.direction = "vertical"), void 0 === W.ignoreInputTextSelection && (W.ignoreInputTextSelection = !0), void 0 === W.mirrorContainer && (W.mirrorContainer = se.body), void 0 === W.headerIDs && (W.headerIDs = ":ABMNoHFAlain:"), void 0 === W.footerIDs && (W.footerIDs = ":ABMNoHFAlain:"), void 0 === W.UseZDepth && (W.UseZDepth = !1);
                        var H = oe({
                            containers: W.containers,
                            start: function(e) {
                                var t = r(e);
                                t && d(t)
                            },
                            end: f,
                            cancel: g,
                            remove: v,
                            destroy: function() {
                                n(!0), h({})
                            },
                            canMove: function(e) {
                                return !!r(e)
                            },
                            dragging: !1
                        });
                        return !0 === W.removeOnSpill && H.on("over", function(e) {
                            ae.rm(e, "gu-hide")
                        }).on("out", function(e) {
                            H.dragging && ae.add(e, "gu-hide")
                        }), n(), H
                    }
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {
                "./classes": 1,
                "contra/emitter": 5,
                crossvent: 6
            }],
            3: [function(e, t, n) {
                t.exports = function(e, t) {
                    return Array.prototype.slice.call(e, t)
                }
            }, {}],
            4: [function(e, t, n) {
                "use strict";
                var i = e("ticky");
                t.exports = function(e, t, n) {
                    e && i(function() {
                        e.apply(n || null, t || [])
                    })
                }
            }, {
                ticky: 9
            }],
            5: [function(e, t, n) {
                "use strict";
                var s = e("atoa"),
                    l = e("./debounce");
                t.exports = function(o, e) {
                    var r = e || {},
                        a = {};
                    return void 0 === o && (o = {}), o.on = function(e, t) {
                        return a[e] ? a[e].push(t) : a[e] = [t], o
                    }, o.once = function(e, t) {
                        return t._once = !0, o.on(e, t), o
                    }, o.off = function(e, t) {
                        var n = arguments.length;
                        if (1 === n) delete a[e];
                        else if (0 === n) a = {};
                        else {
                            var i = a[e];
                            if (!i) return o;
                            i.splice(i.indexOf(t), 1)
                        }
                        return o
                    }, o.emit = function() {
                        var e = s(arguments);
                        return o.emitterSnapshot(e.shift()).apply(this, e)
                    }, o.emitterSnapshot = function(i) {
                        var e = (a[i] || []).slice(0);
                        return function() {
                            var t = s(arguments),
                                n = this || o;
                            if ("error" === i && !1 !== r.throws && !e.length) throw 1 === t.length ? t[0] : t;
                            return e.forEach(function(e) {
                                r.async ? l(e, t, n) : e.apply(n, t), e._once && o.off(i, e)
                            }), o
                        }
                    }, o
                }
            }, {
                "./debounce": 4,
                atoa: 3
            }],
            6: [function(n, i, e) {
                (function(c) {
                    "use strict";

                    function u(e, t, n) {
                        var i = function(e, t, n) {
                            var i, o;
                            for (i = 0; i < d.length; i++)
                                if ((o = d[i]).element === e && o.type === t && o.fn === n) return i
                        }(e, t, n);
                        if (i) {
                            var o = d[i].wrapper;
                            return d.splice(i, 1), o
                        }
                    }
                    var r = n("custom-event"),
                        a = n("./eventmap"),
                        s = c.document,
                        e = function(e, t, n, i) {
                            return e.addEventListener(t, n, i)
                        },
                        t = function(e, t, n, i) {
                            return e.removeEventListener(t, n, i)
                        },
                        d = [];
                    c.addEventListener || (e = function(e, t, n) {
                        return e.attachEvent("on" + t, (l = u(i = e, o = t, r = n) || (a = i, s = r, function(e) {
                            var t = e || c.event;
                            t.target = t.target || t.srcElement, t.preventDefault = t.preventDefault || function() {
                                t.returnValue = !1
                            }, t.stopPropagation = t.stopPropagation || function() {
                                t.cancelBubble = !0
                            }, t.which = t.which || t.keyCode, s.call(a, t)
                        }), d.push({
                            wrapper: l,
                            element: i,
                            type: o,
                            fn: r
                        }), l));
                        var i, o, r, a, s, l
                    }, t = function(e, t, n) {
                        var i = u(e, t, n);
                        if (i) return e.detachEvent("on" + t, i)
                    }), i.exports = {
                        add: e,
                        remove: t,
                        fabricate: function(e, t, n) {
                            var i, o = -1 === a.indexOf(t) ? new r(t, {
                                detail: n
                            }) : (s.createEvent ? (i = s.createEvent("Event")).initEvent(t, !0, !0) : s.createEventObject && (i = s.createEventObject()), i);
                            e.dispatchEvent ? e.dispatchEvent(o) : e.fireEvent("on" + t, o)
                        }
                    }
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {
                "./eventmap": 7,
                "custom-event": 8
            }],
            7: [function(e, o, t) {
                (function(e) {
                    "use strict";
                    var t = [],
                        n = "",
                        i = /^on/;
                    for (n in e) i.test(n) && t.push(n.slice(2));
                    o.exports = t
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {}],
            8: [function(e, n, t) {
                (function(e) {
                    var t = e.CustomEvent;
                    n.exports = function() {
                        try {
                            var e = new t("cat", {
                                detail: {
                                    foo: "bar"
                                }
                            });
                            return "cat" === e.type && "bar" === e.detail.foo
                        } catch (e) {}
                        return !1
                    }() ? t : "function" == typeof document.createEvent ? function(e, t) {
                        var n = document.createEvent("CustomEvent");
                        return t ? n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail) : n.initCustomEvent(e, !1, !1, void 0), n
                    } : function(e, t) {
                        var n = document.createEventObject();
                        return n.type = e, t ? (n.bubbles = Boolean(t.bubbles), n.cancelable = Boolean(t.cancelable), n.detail = t.detail) : (n.bubbles = !1, n.cancelable = !1, n.detail = void 0), n
                    }
                }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
            }, {}],
            9: [function(e, t, n) {
                var i;
                i = "function" == typeof setImmediate ? function(e) {
                    setImmediate(e)
                } : function(e) {
                    setTimeout(e, 0)
                }, t.exports = i
            }, {}]
        }, {}, [2])(2)
    }),
    function(e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
    }(function(l) {
        var i = -1,
            o = -1,
            c = function(e) {
                return parseFloat(e) || 0
            },
            u = function(e) {
                var i = null,
                    o = [];
                return l(e).each(function() {
                    var e = l(this),
                        t = e.offset().top - c(e.css("margin-top")),
                        n = 0 < o.length ? o[o.length - 1] : null;
                    null === n ? o.push(e) : Math.floor(Math.abs(i - t)) <= 1 ? o[o.length - 1] = n.add(e) : o.push(e), i = t
                }), o
            },
            d = function(e) {
                var t = {
                    byRow: !0,
                    property: "height",
                    target: null,
                    remove: !1,
                    minHeight: 0
                };
                return "object" == typeof e ? l.extend(t, e) : ("boolean" == typeof e ? t.byRow = e : "remove" === e && (t.remove = !0), t)
            },
            f = l.fn.matchHeight = function(e) {
                var t = d(e);
                if (t.remove) {
                    var n = this;
                    return this.css(t.property, ""), l.each(f._groups, function(e, t) {
                        t.elements = t.elements.not(n)
                    }), this
                }
                return this.length <= 1 && !t.target || (f._groups.push({
                    elements: this,
                    options: t
                }), f._apply(this, t)), this
            };
        f.version = "0.7.2", f._groups = [], f._throttle = 80, f._maintainScroll = !0, f._beforeUpdate = null, f._afterUpdate = null, f._rows = u, f._parse = c, f._parseOptions = d, f._apply = function(e, t) {
            var r = d(t),
                n = l(e),
                i = [n],
                o = l(window).scrollTop(),
                a = l("html").outerHeight(!0),
                s = n.parents().filter(":hidden");
            return s.each(function() {
                var e = l(this);
                e.data("style-cache", e.attr("style"))
            }), s.css("display", "block"), r.byRow && !r.target && (n.each(function() {
                var e = l(this),
                    t = e.css("display");
                "inline-block" !== t && "flex" !== t && "inline-flex" !== t && (t = "block"), e.data("style-cache", e.attr("style")), e.css({
                    display: t,
                    "padding-top": "0",
                    "padding-bottom": "0",
                    "margin-top": "0",
                    "margin-bottom": "0",
                    "border-top-width": "0",
                    "border-bottom-width": "0",
                    height: "100px",
                    overflow: "hidden"
                })
            }), i = u(n), n.each(function() {
                var e = l(this);
                e.attr("style", e.data("style-cache") || "")
            })), l.each(i, function(e, t) {
                var n = l(t),
                    o = 0;
                if (r.target) o = r.target.outerHeight(!1);
                else {
                    if (r.byRow && n.length <= 1) return void n.css(r.property, "");
                    n.each(function() {
                        var e = l(this),
                            t = e.attr("style"),
                            n = e.css("display");
                        "inline-block" !== n && "flex" !== n && "inline-flex" !== n && (n = "block");
                        var i = {
                            display: n
                        };
                        i[r.property] = "", e.css(i), e.outerHeight(!1) > o && (o = e.outerHeight(!1)), t ? e.attr("style", t) : e.css("display", "")
                    })
                }
                n.each(function() {
                    var e = l(this),
                        t = 0;
                    r.target && e.is(r.target) || ("border-box" !== e.css("box-sizing") && (t += c(e.css("border-top-width")) + c(e.css("border-bottom-width")), t += c(e.css("padding-top")) + c(e.css("padding-bottom"))), o < r.minHeight && (o = r.minHeight), e.css(r.property, o - t + "px"))
                })
            }), s.each(function() {
                var e = l(this);
                e.attr("style", e.data("style-cache") || null)
            }), f._maintainScroll && l(window).scrollTop(o / a * l("html").outerHeight(!0)), this
        }, f._applyDataApi = function() {
            var n = {};
            l("[data-match-height], [data-mh]").each(function() {
                var e = l(this),
                    t = e.attr("data-mh") || e.attr("data-match-height");
                n[t] = t in n ? n[t].add(e) : e
            }), l.each(n, function() {
                this.matchHeight(!0)
            })
        };
        var r = function(e) {
            f._beforeUpdate && f._beforeUpdate(e, f._groups), l.each(f._groups, function() {
                f._apply(this.elements, this.options)
            }), f._afterUpdate && f._afterUpdate(e, f._groups)
        };
        f._update = function(e, t) {
            if (t && "resize" === t.type) {
                var n = l(window).width();
                if (n === i) return;
                i = n
            }
            e ? -1 === o && (o = setTimeout(function() {
                r(t), o = -1
            }, f._throttle)) : r(t)
        }, l(f._applyDataApi);
        var e = l.fn.on ? "on" : "bind";
        l(window)[e]("load", function(e) {
            f._update(!1, e)
        }), l(window)[e]("resize orientationchange", function(e) {
            f._update(!0, e)
        })
    }), jQuery.cachedScript = function(e, t) {
        return t = $.extend(t || {}, {
            dataType: "script",
            cache: !0,
            url: e
        }), jQuery.ajax(t)
    };
var _extends = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
        }
        return e
    },
    _createClass = function() {
        function i(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }
        return function(e, t, n) {
            return t && i(e.prototype, t), n && i(e, n), e
        }
    }(),
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    };
! function(t, n, i) {
    "function" == typeof define && define.amd ? define(["jquery"], function(e) {
        return t(n, i, e)
    }) : "object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports ? module.exports = t(n, i, require("jquery")) : t(n, i, jQuery)
}(function(i, s, e) {
    var n = function() {
            function n(e) {
                _classCallCheck(this, n), this.ctx = e, this.ie = !1;
                var t = i.navigator.userAgent;
                (-1 < t.indexOf("MSIE") || -1 < t.indexOf("Trident")) && (this.ie = !0)
            }
            return _createClass(n, [{
                key: "log",
                value: function(e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "debug",
                        n = this.opt.log;
                    this.opt.debug && "object" === (void 0 === n ? "undefined" : _typeof(n)) && "function" == typeof n[t] && n[t]("mark.js: " + e)
                }
            }, {
                key: "escapeStr",
                value: function(e) {
                    return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                }
            }, {
                key: "createRegExp",
                value: function(e) {
                    return "disabled" !== this.opt.wildcards && (e = this.setupWildcardsRegExp(e)), e = this.escapeStr(e), Object.keys(this.opt.synonyms).length && (e = this.createSynonymsRegExp(e)), this.opt.ignoreJoiners && (e = this.setupIgnoreJoinersRegExp(e)), this.opt.diacritics && (e = this.createDiacriticsRegExp(e)), e = this.createMergedBlanksRegExp(e), this.opt.ignoreJoiners && (e = this.createIgnoreJoinersRegExp(e)), "disabled" !== this.opt.wildcards && (e = this.createWildcardsRegExp(e)), this.createAccuracyRegExp(e)
                }
            }, {
                key: "createSynonymsRegExp",
                value: function(e) {
                    var t = this.opt.synonyms,
                        n = this.opt.caseSensitive ? "" : "i";
                    for (var i in t)
                        if (t.hasOwnProperty(i)) {
                            var o = t[i],
                                r = "disabled" !== this.opt.wildcards ? this.setupWildcardsRegExp(i) : this.escapeStr(i),
                                a = "disabled" !== this.opt.wildcards ? this.setupWildcardsRegExp(o) : this.escapeStr(o);
                            "" !== r && "" !== a && (e = e.replace(new RegExp("(" + r + "|" + a + ")", "gm" + n), "(" + r + "|" + a + ")"))
                        } return e
                }
            }, {
                key: "setupWildcardsRegExp",
                value: function(e) {
                    return (e = e.replace(/(?:\\)*\?/g, function(e) {
                        return "\\" === e.charAt(0) ? "?" : ""
                    })).replace(/(?:\\)*\*/g, function(e) {
                        return "\\" === e.charAt(0) ? "*" : ""
                    })
                }
            }, {
                key: "createWildcardsRegExp",
                value: function(e) {
                    var t = "withSpaces" === this.opt.wildcards;
                    return e.replace(/\u0001/g, t ? "[\\S\\s]?" : "\\S?").replace(/\u0002/g, t ? "[\\S\\s]*?" : "\\S*")
                }
            }, {
                key: "setupIgnoreJoinersRegExp",
                value: function(e) {
                    return e.replace(/[^(|)\\]/g, function(e, t, n) {
                        var i = n.charAt(t + 1);
                        return /[(|)\\]/.test(i) || "" === i ? e : e + "\0"
                    })
                }
            }, {
                key: "createIgnoreJoinersRegExp",
                value: function(e) {
                    return e.split("\0").join("[\\u00ad|\\u200b|\\u200c|\\u200d]?")
                }
            }, {
                key: "createDiacriticsRegExp",
                value: function(n) {
                    var i = this.opt.caseSensitive ? "" : "i",
                        e = this.opt.caseSensitive ? ["aàáâãäåāąă", "AÀÁÂÃÄÅĀĄĂ", "cçćč", "CÇĆČ", "dđď", "DĐĎ", "eèéêëěēę", "EÈÉÊËĚĒĘ", "iìíîïī", "IÌÍÎÏĪ", "lł", "LŁ", "nñňń", "NÑŇŃ", "oòóôõöøō", "OÒÓÔÕÖØŌ", "rř", "RŘ", "sšśșş", "SŠŚȘŞ", "tťțţ", "TŤȚŢ", "uùúûüůū", "UÙÚÛÜŮŪ", "yÿý", "YŸÝ", "zžżź", "ZŽŻŹ"] : ["aàáâãäåāąăAÀÁÂÃÄÅĀĄĂ", "cçćčCÇĆČ", "dđďDĐĎ", "eèéêëěēęEÈÉÊËĚĒĘ", "iìíîïīIÌÍÎÏĪ", "lłLŁ", "nñňńNÑŇŃ", "oòóôõöøōOÒÓÔÕÖØŌ", "rřRŘ", "sšśșşSŠŚȘŞ", "tťțţTŤȚŢ", "uùúûüůūUÙÚÛÜŮŪ", "yÿýYŸÝ", "zžżźZŽŻŹ"],
                        o = [];
                    return n.split("").forEach(function(t) {
                        e.every(function(e) {
                            if (-1 !== e.indexOf(t)) {
                                if (-1 < o.indexOf(e)) return !1;
                                n = n.replace(new RegExp("[" + e + "]", "gm" + i), "[" + e + "]"), o.push(e)
                            }
                            return !0
                        })
                    }), n
                }
            }, {
                key: "createMergedBlanksRegExp",
                value: function(e) {
                    return e.replace(/[\s]+/gim, "[\\s]+")
                }
            }, {
                key: "createAccuracyRegExp",
                value: function(e) {
                    var t = this,
                        n = this.opt.accuracy,
                        i = "string" == typeof n ? n : n.value,
                        o = "";
                    switch (("string" == typeof n ? [] : n.limiters).forEach(function(e) {
                        o += "|" + t.escapeStr(e)
                    }), i) {
                        case "partially":
                        default:
                            return "()(" + e + ")";
                        case "complementary":
                            return "()([^" + (o = "\\s" + (o || this.escapeStr("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~¡¿"))) + "]*" + e + "[^" + o + "]*)";
                        case "exactly":
                            return "(^|\\s" + o + ")(" + e + ")(?=$|\\s" + o + ")"
                    }
                }
            }, {
                key: "getSeparatedKeywords",
                value: function(e) {
                    var t = this,
                        n = [];
                    return e.forEach(function(e) {
                        t.opt.separateWordSearch ? e.split(" ").forEach(function(e) {
                            e.trim() && -1 === n.indexOf(e) && n.push(e)
                        }) : e.trim() && -1 === n.indexOf(e) && n.push(e)
                    }), {
                        keywords: n.sort(function(e, t) {
                            return t.length - e.length
                        }),
                        length: n.length
                    }
                }
            }, {
                key: "getTextNodes",
                value: function(e) {
                    var t = this,
                        n = "",
                        i = [];
                    this.iterator.forEachNode(NodeFilter.SHOW_TEXT, function(e) {
                        i.push({
                            start: n.length,
                            end: (n += e.textContent).length,
                            node: e
                        })
                    }, function(e) {
                        return t.matchesExclude(e.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
                    }, function() {
                        e({
                            value: n,
                            nodes: i
                        })
                    })
                }
            }, {
                key: "matchesExclude",
                value: function(e) {
                    return r.matches(e, this.opt.exclude.concat(["script", "style", "title", "head", "html"]))
                }
            }, {
                key: "wrapRangeInTextNode",
                value: function(e, t, n) {
                    var i = this.opt.element ? this.opt.element : "mark",
                        o = e.splitText(t),
                        r = o.splitText(n - t),
                        a = s.createElement(i);
                    return a.setAttribute("data-markjs", "true"), this.opt.className && a.setAttribute("class", this.opt.className), a.textContent = o.textContent, o.parentNode.replaceChild(a, o), r
                }
            }, {
                key: "wrapRangeInMappedTextNode",
                value: function(s, l, c, u, d) {
                    var f = this;
                    s.nodes.every(function(e, n) {
                        var t = s.nodes[n + 1];
                        if (void 0 === t || t.start > l) {
                            if (!u(e.node)) return !1;
                            var i = l - e.start,
                                o = (c > e.end ? e.end : c) - e.start,
                                r = s.value.substr(0, e.start),
                                a = s.value.substr(o + e.start);
                            if (e.node = f.wrapRangeInTextNode(e.node, i, o), s.value = r + a, s.nodes.forEach(function(e, t) {
                                    n <= t && (0 < s.nodes[t].start && t !== n && (s.nodes[t].start -= o), s.nodes[t].end -= o)
                                }), c -= o, d(e.node.previousSibling, e.start), !(c > e.end)) return !1;
                            l = e.end
                        }
                        return !0
                    })
                }
            }, {
                key: "wrapMatches",
                value: function(o, e, r, a, t) {
                    var s = this,
                        l = 0 === e ? 0 : e + 1;
                    this.getTextNodes(function(e) {
                        e.nodes.forEach(function(e) {
                            e = e.node;
                            for (var t = void 0; null !== (t = o.exec(e.textContent)) && "" !== t[l];)
                                if (r(t[l], e)) {
                                    var n = t.index;
                                    if (0 !== l)
                                        for (var i = 1; i < l; i++) n += t[i].length;
                                    e = s.wrapRangeInTextNode(e, n, n + t[l].length), a(e.previousSibling), o.lastIndex = 0
                                }
                        }), t()
                    })
                }
            }, {
                key: "wrapMatchesAcrossElements",
                value: function(r, e, a, s, l) {
                    var c = this,
                        u = 0 === e ? 0 : e + 1;
                    this.getTextNodes(function(e) {
                        for (var t = void 0; null !== (t = r.exec(e.value)) && "" !== t[u];) {
                            var n = t.index;
                            if (0 !== u)
                                for (var i = 1; i < u; i++) n += t[i].length;
                            var o = n + t[u].length;
                            c.wrapRangeInMappedTextNode(e, n, o, function(e) {
                                return a(t[u], e)
                            }, function(e, t) {
                                r.lastIndex = t, s(e)
                            })
                        }
                        l()
                    })
                }
            }, {
                key: "unwrapMatches",
                value: function(e) {
                    for (var t = e.parentNode, n = s.createDocumentFragment(); e.firstChild;) n.appendChild(e.removeChild(e.firstChild));
                    t.replaceChild(n, e), this.ie ? this.normalizeTextNode(t) : t.normalize()
                }
            }, {
                key: "normalizeTextNode",
                value: function(e) {
                    if (e) {
                        if (3 === e.nodeType)
                            for (; e.nextSibling && 3 === e.nextSibling.nodeType;) e.nodeValue += e.nextSibling.nodeValue, e.parentNode.removeChild(e.nextSibling);
                        else this.normalizeTextNode(e.firstChild);
                        this.normalizeTextNode(e.nextSibling)
                    }
                }
            }, {
                key: "markRegExp",
                value: function(e, t) {
                    var n = this;
                    this.opt = t, this.log('Searching with expression "' + e + '"');
                    var i = 0,
                        o = "wrapMatches";
                    this.opt.acrossElements && (o = "wrapMatchesAcrossElements"), this[o](e, this.opt.ignoreGroups, function(e, t) {
                        return n.opt.filter(t, e, i)
                    }, function(e) {
                        i++, n.opt.each(e)
                    }, function() {
                        0 === i && n.opt.noMatch(e), n.opt.done(i)
                    })
                }
            }, {
                key: "mark",
                value: function(e, t) {
                    var o = this;
                    this.opt = t;
                    var r = 0,
                        a = "wrapMatches",
                        n = this.getSeparatedKeywords("string" == typeof e ? [e] : e),
                        s = n.keywords,
                        l = n.length,
                        c = this.opt.caseSensitive ? "" : "i";
                    this.opt.acrossElements && (a = "wrapMatchesAcrossElements"), 0 === l ? this.opt.done(r) : function e(n) {
                        var t = new RegExp(o.createRegExp(n), "gm" + c),
                            i = 0;
                        o.log('Searching with expression "' + t + '"'), o[a](t, 1, function(e, t) {
                            return o.opt.filter(t, n, r, i)
                        }, function(e) {
                            i++, r++, o.opt.each(e)
                        }, function() {
                            0 === i && o.opt.noMatch(n), s[l - 1] === n ? o.opt.done(r) : e(s[s.indexOf(n) + 1])
                        })
                    }(s[0])
                }
            }, {
                key: "unmark",
                value: function(e) {
                    var i = this;
                    this.opt = e;
                    var o = this.opt.element ? this.opt.element : "*";
                    o += "[data-markjs]", this.opt.className && (o += "." + this.opt.className), this.log('Removal selector "' + o + '"'), this.iterator.forEachNode(NodeFilter.SHOW_ELEMENT, function(e) {
                        i.unwrapMatches(e)
                    }, function(e) {
                        var t = r.matches(e, o),
                            n = i.matchesExclude(e);
                        return !t || n ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
                    }, this.opt.done)
                }
            }, {
                key: "opt",
                set: function(e) {
                    this._opt = _extends({}, {
                        element: "",
                        className: "",
                        exclude: [],
                        iframes: !1,
                        iframesTimeout: 5e3,
                        separateWordSearch: !0,
                        diacritics: !0,
                        synonyms: {},
                        accuracy: "partially",
                        acrossElements: !1,
                        caseSensitive: !1,
                        ignoreJoiners: !1,
                        ignoreGroups: 0,
                        wildcards: "disabled",
                        each: function() {},
                        noMatch: function() {},
                        filter: function() {
                            return !0
                        },
                        done: function() {},
                        debug: !1,
                        log: i.console
                    }, e)
                },
                get: function() {
                    return this._opt
                }
            }, {
                key: "iterator",
                get: function() {
                    return this._iterator || (this._iterator = new r(this.ctx, this.opt.iframes, this.opt.exclude, this.opt.iframesTimeout)), this._iterator
                }
            }]), n
        }(),
        r = function() {
            function c(e) {
                var t = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1],
                    n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : [],
                    i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 5e3;
                _classCallCheck(this, c), this.ctx = e, this.iframes = t, this.exclude = n, this.iframesTimeout = i
            }
            return _createClass(c, [{
                key: "getContexts",
                value: function() {
                    var n = [];
                    return (void 0 !== this.ctx && this.ctx ? NodeList.prototype.isPrototypeOf(this.ctx) ? Array.prototype.slice.call(this.ctx) : Array.isArray(this.ctx) ? this.ctx : "string" == typeof this.ctx ? Array.prototype.slice.call(s.querySelectorAll(this.ctx)) : [this.ctx] : []).forEach(function(t) {
                        var e = 0 < n.filter(function(e) {
                            return e.contains(t)
                        }).length; - 1 !== n.indexOf(t) || e || n.push(t)
                    }), n
                }
            }, {
                key: "getIframeContents",
                value: function(e, t) {
                    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : function() {},
                        i = void 0;
                    try {
                        var o = e.contentWindow;
                        if (i = o.document, !o || !i) throw new Error("iframe inaccessible")
                    } catch (e) {
                        n()
                    }
                    i && t(i)
                }
            }, {
                key: "isIframeBlank",
                value: function(e) {
                    var t = "about:blank",
                        n = e.getAttribute("src").trim();
                    return e.contentWindow.location.href === t && n !== t && n
                }
            }, {
                key: "observeIframeLoad",
                value: function(t, n, i) {
                    var o = this,
                        r = !1,
                        a = null,
                        e = function e() {
                            if (!r) {
                                r = !0, clearTimeout(a);
                                try {
                                    o.isIframeBlank(t) || (t.removeEventListener("load", e), o.getIframeContents(t, n, i))
                                } catch (e) {
                                    i()
                                }
                            }
                        };
                    t.addEventListener("load", e), a = setTimeout(e, this.iframesTimeout)
                }
            }, {
                key: "onIframeReady",
                value: function(e, t, n) {
                    try {
                        "complete" === e.contentWindow.document.readyState ? this.isIframeBlank(e) ? this.observeIframeLoad(e, t, n) : this.getIframeContents(e, t, n) : this.observeIframeLoad(e, t, n)
                    } catch (e) {
                        n()
                    }
                }
            }, {
                key: "waitForIframes",
                value: function(e, t) {
                    var n = this,
                        i = 0;
                    this.forEachIframe(e, function() {
                        return !0
                    }, function(e) {
                        i++, n.waitForIframes(e.querySelector("html"), function() {
                            --i || t()
                        })
                    }, function(e) {
                        e || t()
                    })
                }
            }, {
                key: "forEachIframe",
                value: function(e, n, i) {
                    var o = this,
                        t = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : function() {},
                        r = e.querySelectorAll("iframe"),
                        a = r.length,
                        s = 0;
                    r = Array.prototype.slice.call(r);
                    var l = function() {
                        --a <= 0 && t(s)
                    };
                    a || l(), r.forEach(function(t) {
                        c.matches(t, o.exclude) ? l() : o.onIframeReady(t, function(e) {
                            n(t) && (s++, i(e)), l()
                        }, l)
                    })
                }
            }, {
                key: "createIterator",
                value: function(e, t, n) {
                    return s.createNodeIterator(e, t, n, !1)
                }
            }, {
                key: "createInstanceOnIframe",
                value: function(e) {
                    return new c(e.querySelector("html"), this.iframes)
                }
            }, {
                key: "compareNodeIframe",
                value: function(e, t, n) {
                    if (e.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING) {
                        if (null === t) return !0;
                        if (t.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) return !0
                    }
                    return !1
                }
            }, {
                key: "getIteratorNode",
                value: function(e) {
                    var t = e.previousNode();
                    return {
                        prevNode: t,
                        node: null === t ? e.nextNode() : e.nextNode() && e.nextNode()
                    }
                }
            }, {
                key: "checkIframeFilter",
                value: function(e, t, n, i) {
                    var o = !1,
                        r = !1;
                    return i.forEach(function(e, t) {
                        e.val === n && (o = t, r = e.handled)
                    }), this.compareNodeIframe(e, t, n) ? (!1 !== o || r ? !1 === o || r || (i[o].handled = !0) : i.push({
                        val: n,
                        handled: !0
                    }), !0) : (!1 === o && i.push({
                        val: n,
                        handled: !1
                    }), !1)
                }
            }, {
                key: "handleOpenIframes",
                value: function(e, t, n, i) {
                    var o = this;
                    e.forEach(function(e) {
                        e.handled || o.getIframeContents(e.val, function(e) {
                            o.createInstanceOnIframe(e).forEachNode(t, n, i)
                        })
                    })
                }
            }, {
                key: "iterateThroughNodes",
                value: function(t, e, n, i, o) {
                    for (var r = this, a = this.createIterator(e, t, i), s = [], l = [], c = void 0, u = void 0; d = r.getIteratorNode(a), u = d.prevNode, c = d.node;) this.iframes && this.forEachIframe(e, function(e) {
                        return r.checkIframeFilter(c, u, e, s)
                    }, function(e) {
                        r.createInstanceOnIframe(e).forEachNode(t, function(e) {
                            return l.push(e)
                        }, i)
                    }), l.push(c);
                    var d;
                    l.forEach(function(e) {
                        n(e)
                    }), this.iframes && this.handleOpenIframes(s, t, n, i), o()
                }
            }, {
                key: "forEachNode",
                value: function(n, i, o) {
                    var r = this,
                        a = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : function() {},
                        e = this.getContexts(),
                        s = e.length;
                    s || a(), e.forEach(function(e) {
                        var t = function() {
                            r.iterateThroughNodes(n, e, i, o, function() {
                                --s <= 0 && a()
                            })
                        };
                        r.iframes ? r.waitForIframes(e, t) : t()
                    })
                }
            }], [{
                key: "matches",
                value: function(t, e) {
                    var n = "string" == typeof e ? [e] : e,
                        i = t.matches || t.matchesSelector || t.msMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.webkitMatchesSelector;
                    if (i) {
                        var o = !1;
                        return n.every(function(e) {
                            return !i.call(t, e) || !(o = !0)
                        }), o
                    }
                    return !1
                }
            }]), c
        }();
    return e.fn.mark = function(e, t) {
        return new n(this.get()).mark(e, t), this
    }, e.fn.markRegExp = function(e, t) {
        return new n(this.get()).markRegExp(e, t), this
    }, e.fn.unmark = function(e) {
        return new n(this.get()).unmark(e), this
    }, e
}, window, document),
function(e, a, t) {
    "use strict";
    a.fn.rotate = function(n, i) {
        var o = a.extend({}, a.fn.rotate.defaults, i),
            r = 0;
        return n = n || a.fn.rotate.degrees, this.each(function(e, t) {
            a(t).is(":animated") || (r = (t.deg || r) + n, o.step = function(e) {
                a(t).css("transform", "rotate(" + e + "deg)")
            }, o.continious && (o.complete = function() {
                a(t).stop(), a(t).rotate(n, i)
            }), a(t).animate({
                deg: r
            }, o))
        })
    }, a.fn.rotate.degrees = 360, a.fn.rotate.defaults = {
        duration: 1e3,
        easing: "swing",
        complete: function() {},
        continious: !1
    }
}(window, jQuery),
function(o) {
    o.CookiesMessage = function(t) {
        t = o.extend({
            messageText: "We use technical and analytics cookies to ensure that we give you the best experience on our website.",
            messageBg: "#151515",
            messageColor: "#FFFFFF",
            messageLinkColor: "#F0FFAA",
            closeEnable: !0,
            closeColor: "#444444",
            closeBgColor: "#000000",
            acceptEnable: !0,
            acceptText: "Accept & Close",
            infoEnable: !0,
            infoText: "More Info",
            infoUrl: "#",
            cookieExpire: 180
        }, t);
        var n = location.host;
        (function(e) {
            var t = !1;
            if (document.cookie) {
                var n = document.cookie.split(";");
                for (i = 0; i < n.length; i++) {
                    var o = n[i].split("=");
                    o[0].replace(/^\s+|\s+$/g, "") == e && (t = o[1])
                }
            }
            return t
        })(n) || function(e) {
            var t = "";
            1 == e.closeEnable && (t += '<a href="#" id="band-cookies-close" style="background-color:' + e.closeBgColor + ';"><svg version="1.1" id="band-cookies-close-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="248.5 248.5 15 15" enable-background="new 248.5 248.5 15 15" xml:space="preserve" ><polygon id="x-mark-icon" points="263.5,260.876 258.621,255.999 263.499,251.121 260.876,248.5 256,253.377 251.122,248.5 248.5,251.121 253.378,255.999 248.5,260.878 251.121,263.5 256,258.62 260.879,263.499" style="fill:' + e.closeColor + ';"/></svg></a>');
            var n = "";
            1 == e.acceptEnable && (n += '<a href="#" id="band-cookies-ok">' + e.acceptText + "</a>"), 1 == e.infoEnable && (n += '<a href="' + e.infoUrl + '" id="band-cookies-info">' + e.infoText + "</a>");
            var i = '<div id="band-cookies"><p>' + e.messageText + n + "</p>" + t + "</div>";
            o("body").prepend(i), o("#band-cookies").hide().slideDown(), o("#band-cookies").css({
                "background-color": e.messageBg,
                color: e.messageColor
            }), o("#band-cookies p a").css({
                color: e.messageLinkColor
            })
        }(t), o("#band-cookies-ok").on("click", function(e) {
            e.preventDefault(),
                function(e, t, n, i) {
                    var o = new Date;
                    o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3);
                    var r = "expires=" + o.toUTCString();
                    document.cookie = e + "=" + t + "; " + r + "; path=" + i + ";"
                }(n, "Cookies policy accepted", t.cookieExpire, "/"), o("#band-cookies").slideToggle()
        }), o("#band-cookies-close").on("click", function(e) {
            e.preventDefault(), o("#band-cookies").slideToggle()
        })
    }
}(jQuery),
function(e, t) {
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? module.exports = t() : e.salvattore = t()
}(this, function() {
    return window.matchMedia || (window.matchMedia = function() {
            "use strict";
            var t = window.styleMedia || window.media;
            if (!t) {
                var n, i = document.createElement("style"),
                    e = document.getElementsByTagName("script")[0];
                i.type = "text/css", i.id = "matchmediajs-test", e.parentNode.insertBefore(i, e), n = "getComputedStyle" in window && window.getComputedStyle(i, null) || i.currentStyle, t = {
                    matchMedium: function(e) {
                        var t = "@media " + e + "{ #matchmediajs-test { width: 1px; } }";
                        return i.styleSheet ? i.styleSheet.cssText = t : i.textContent = t, "1px" === n.width
                    }
                }
            }
            return function(e) {
                return {
                    matches: t.matchMedium(e || "all"),
                    media: e || "all"
                }
            }
        }()),
        function() {
            "use strict";
            if (window.matchMedia && window.matchMedia("all").addListener) return;
            var s = window.matchMedia,
                o = s("only all").matches,
                r = !1,
                t = 0,
                l = [],
                a = function(e) {
                    clearTimeout(t), t = setTimeout(function() {
                        for (var e = 0, t = l.length; e < t; e++) {
                            var n = l[e].mql,
                                i = l[e].listeners || [],
                                o = s(n.media).matches;
                            if (o !== n.matches) {
                                n.matches = o;
                                for (var r = 0, a = i.length; r < a; r++) i[r].call(window, n)
                            }
                        }
                    }, 30)
                };
            window.matchMedia = function(e) {
                var t = s(e),
                    i = [],
                    n = 0;
                return t.addListener = function(e) {
                    o && (r || (r = !0, window.addEventListener("resize", a, !0)), 0 === n && (n = l.push({
                        mql: t,
                        listeners: i
                    })), i.push(e))
                }, t.removeListener = function(e) {
                    for (var t = 0, n = i.length; t < n; t++) i[t] === e && i.splice(t, 1)
                }, t
            }
        }(),
        function() {
            "use strict";
            for (var r = 0, e = ["ms", "moz", "webkit", "o"], t = 0; t < e.length && !window.requestAnimationFrame; ++t) window.requestAnimationFrame = window[e[t] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[t] + "CancelAnimationFrame"] || window[e[t] + "CancelRequestAnimationFrame"];
            window.requestAnimationFrame || (window.requestAnimationFrame = function(e, t) {
                var n = (new Date).getTime(),
                    i = Math.max(0, 16 - (n - r)),
                    o = window.setTimeout(function() {
                        e(n + i)
                    }, i);
                return r = n + i, o
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
                clearTimeout(e)
            })
        }(), "function" != typeof window.CustomEvent && function() {
            "use strict";

            function e(e, t) {
                t = t || {
                    bubbles: !1,
                    cancelable: !1,
                    detail: void 0
                };
                var n = document.createEvent("CustomEvent");
                return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n
            }
            e.prototype = window.Event.prototype, window.CustomEvent = e
        }(),
        function(s, c, e) {
            "use strict";
            var u = {},
                i = [],
                o = [],
                r = [],
                d = function(e, t, n) {
                    e.dataset ? e.dataset[t] = n : e.setAttribute("data-" + t, n)
                };
            return u.obtainGridSettings = function(e) {
                var t = s.getComputedStyle(e, ":before").getPropertyValue("content").slice(1, -1),
                    n = t.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/),
                    i = 1,
                    o = [];
                return n ? (i = n[1], o = (o = n[2]) ? o.split(".") : ["column"]) : (n = t.match(/^\s*\.(.+)\s+(\d+)\s*$/)) && (o = n[1], (i = n[2]) && (i = i.split("."))), {
                    numberOfColumns: i,
                    columnClasses: o
                }
            }, u.addColumns = function(e, t) {
                for (var n, i = u.obtainGridSettings(e), o = i.numberOfColumns, r = i.columnClasses, a = new Array(+o), s = c.createDocumentFragment(), l = o; 0 != l--;) n = "[data-columns] > *:nth-child(" + o + "n-" + l + ")", a.push(t.querySelectorAll(n));
                a.forEach(function(e) {
                    var t = c.createElement("div"),
                        n = c.createDocumentFragment();
                    t.className = r.join(" "), Array.prototype.forEach.call(e, function(e) {
                        n.appendChild(e)
                    }), t.appendChild(n), s.appendChild(t)
                }), e.appendChild(s), d(e, "columns", o)
            }, u.removeColumns = function(e) {
                var t = c.createRange();
                t.selectNodeContents(e);
                var n = Array.prototype.filter.call(t.extractContents().childNodes, function(e) {
                        return e instanceof s.HTMLElement
                    }),
                    i = n.length,
                    o = n[0].childNodes.length,
                    r = new Array(o * i);
                Array.prototype.forEach.call(n, function(e, n) {
                    Array.prototype.forEach.call(e.children, function(e, t) {
                        r[t * i + n] = e
                    })
                });
                var a = c.createElement("div");
                return d(a, "columns", 0), r.filter(function(e) {
                    return !!e
                }).forEach(function(e) {
                    a.appendChild(e)
                }), a
            }, u.recreateColumns = function(t) {
                s.requestAnimationFrame(function() {
                    u.addColumns(t, u.removeColumns(t));
                    var e = new CustomEvent("columnsChange");
                    t.dispatchEvent(e)
                })
            }, u.mediaQueryChange = function(e) {
                e.matches && Array.prototype.forEach.call(i, u.recreateColumns)
            }, u.getCSSRules = function(e) {
                var t;
                try {
                    t = e.sheet.cssRules || e.sheet.rules
                } catch (e) {
                    return []
                }
                return t || []
            }, u.getStylesheets = function() {
                var n = Array.prototype.slice.call(c.querySelectorAll("style"));
                return n.forEach(function(e, t) {
                    "text/css" !== e.type && "" !== e.type && n.splice(t, 1)
                }), Array.prototype.concat.call(n, Array.prototype.slice.call(c.querySelectorAll("link[rel='stylesheet']")))
            }, u.mediaRuleHasColumnsSelector = function(e) {
                var t, n;
                try {
                    t = e.length
                } catch (e) {
                    t = 0
                }
                for (; t--;)
                    if ((n = e[t]).selectorText && n.selectorText.match(/\[data-columns\](.*)::?before$/)) return !0;
                return !1
            }, u.scanMediaQueries = function() {
                var t = [];
                if (s.matchMedia) {
                    u.getStylesheets().forEach(function(e) {
                        Array.prototype.forEach.call(u.getCSSRules(e), function(e) {
                            try {
                                e.media && e.cssRules && u.mediaRuleHasColumnsSelector(e.cssRules) && t.push(e)
                            } catch (e) {}
                        })
                    });
                    var n = o.filter(function(e) {
                        return -1 === t.indexOf(e)
                    });
                    r.filter(function(e) {
                        return -1 !== n.indexOf(e.rule)
                    }).forEach(function(e) {
                        e.mql.removeListener(u.mediaQueryChange)
                    }), r = r.filter(function(e) {
                        return -1 === n.indexOf(e.rule)
                    }), t.filter(function(e) {
                        return -1 == o.indexOf(e)
                    }).forEach(function(e) {
                        var t = s.matchMedia(e.media.mediaText);
                        t.addListener(u.mediaQueryChange), r.push({
                            rule: e,
                            mql: t
                        })
                    }), o.length = 0, o = t
                }
            }, u.rescanMediaQueries = function() {
                0 == i.length && u.init(), u.scanMediaQueries(), Array.prototype.forEach.call(i, u.recreateColumns)
            }, u.nextElementColumnIndex = function(e, t) {
                var n, i, o = e.children,
                    r = o.length,
                    a = 0,
                    s = 0;
                for (i = 0; i < r; i++) n = o[i].children.length + (t[i].children || t[i].childNodes).length, 0 === a && (a = n), n < a && (s = i, a = n);
                return s
            }, u.createFragmentsList = function(e) {
                for (var t = new Array(e), n = 0; n !== e;) t[n] = c.createDocumentFragment(), n++;
                return t
            }, u.appendElements = function(n, e) {
                var t = n.children,
                    i = t.length,
                    o = u.createFragmentsList(i);
                Array.prototype.forEach.call(e, function(e) {
                    var t = u.nextElementColumnIndex(n, o);
                    o[t].appendChild(e)
                }), Array.prototype.forEach.call(t, function(e, t) {
                    e.appendChild(o[t])
                })
            }, u.prependElements = function(e, t) {
                var n = e.children,
                    i = n.length,
                    o = u.createFragmentsList(i),
                    r = i - 1;
                t.forEach(function(e) {
                    var t = o[r];
                    t.insertBefore(e, t.firstChild), 0 === r ? r = i - 1 : r--
                }), Array.prototype.forEach.call(n, function(e, t) {
                    e.insertBefore(o[t], e.firstChild)
                });
                for (var a = c.createDocumentFragment(), s = t.length % i; 0 != s--;) a.appendChild(e.lastChild);
                e.insertBefore(a, e.firstChild)
            }, u.registerGrid = function(e) {
                if ("none" !== s.getComputedStyle(e).display) {
                    var t = c.createRange();
                    t.selectNodeContents(e);
                    var n = c.createElement("div");
                    n.appendChild(t.extractContents()), d(n, "columns", 0), u.addColumns(e, n), i.push(e)
                }
            }, u.init = function() {
                var e = c.createElement("style");
                e.innerHTML = "[data-columns]::before{display:block;visibility:hidden;position:absolute;font-size:1px;}", c.head.appendChild(e);
                var t = c.querySelectorAll("[data-columns]");
                Array.prototype.forEach.call(t, u.registerGrid), u.scanMediaQueries()
            }, u.init(), {
                appendElements: u.appendElements,
                prependElements: u.prependElements,
                registerGrid: u.registerGrid,
                recreateColumns: u.recreateColumns,
                rescanMediaQueries: u.rescanMediaQueries,
                init: u.init,
                append_elements: u.appendElements,
                prepend_elements: u.prependElements,
                register_grid: u.registerGrid,
                recreate_columns: u.recreateColumns,
                rescan_media_queries: u.rescanMediaQueries
            }
        }(window, window.document)
});