webpackJsonp([0], {
    1444: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }

        function s(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function r(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        }

        function o(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }
        e.__esModule = !0;
        var a = i(4),
            l = n(a),
            h = i(6),
            u = n(h),
            c = i(8),
            p = n(c),
            f = i(12),
            _ = n(f),
            d = i(166),
            m = function(t) {
                function e() {
                    return s(this, e), r(this, t.apply(this, arguments))
                }
                return o(e, t), e.prototype.isStatic = function() {
                    return this.context.router && this.context.router.staticContext
                }, e.prototype.componentWillMount = function() {
                    (0, _.default)(this.context.router, "You should not use <Redirect> outside a <Router>"), this.isStatic() && this.perform()
                }, e.prototype.componentDidMount = function() {
                    this.isStatic() || this.perform()
                }, e.prototype.componentDidUpdate = function(t) {
                    var e = (0, d.createLocation)(t.to),
                        i = (0, d.createLocation)(this.props.to);
                    if ((0, d.locationsAreEqual)(e, i)) return void(0, p.default)(!1, "You tried to redirect to the same route you're currently on: \"" + i.pathname + i.search + '"');
                    this.perform()
                }, e.prototype.perform = function() {
                    var t = this.context.router.history,
                        e = this.props,
                        i = e.push,
                        n = e.to;
                    i ? t.push(n) : t.replace(n)
                }, e.prototype.render = function() {
                    return null
                }, e
            }(l.default.Component);
        m.propTypes = {
            push: u.default.bool,
            from: u.default.string,
            to: u.default.oneOfType([u.default.string, u.default.object]).isRequired
        }, m.defaultProps = {
            push: !1
        }, m.contextTypes = {
            router: u.default.shape({
                history: u.default.shape({
                    push: u.default.func.isRequired,
                    replace: u.default.func.isRequired
                }).isRequired,
                staticContext: u.default.object
            }).isRequired
        }, e.default = m
    },
    1453: function(t, e, i) {
        "use strict";
        var n = t.exports = function(t) {
            this.data = t
        };
        n.isCompatible = function(t) {
            return t && "object" == typeof t && "byteLength" in t
        }, n.fromResponseData = function(t) {
            return new n(new DataView(t))
        }, n.prototype = {
            get version() {
                return this.data.getInt32(0, !0)
            },
            get is_8_bit() {
                return !!this.data.getUint32(4, !0)
            },
            get is_16_bit() {
                return !this.is_8_bit
            },
            get sample_rate() {
                return this.data.getInt32(8, !0)
            },
            get scale() {
                return this.data.getInt32(12, !0)
            },
            get length() {
                return this.data.getUint32(16, !0)
            },
            at: function(t) {
                return Math.round(this.data.getInt8(20 + t))
            }
        }
    },
    1454: function(t, e, i) {
        "use strict";
        t.exports = {
            arraybuffer: i(1453),
            object: i(1455)
        }
    },
    1455: function(t, e, i) {
        "use strict";
        var n = t.exports = function(t) {
            this.data = t
        };
        n.isCompatible = function(t) {
            return t && "object" == typeof t && "sample_rate" in t || "string" == typeof t && "sample_rate" in JSON.parse(t)
        }, n.fromResponseData = function(t) {
            return new n("string" == typeof t ? JSON.parse(t) : t)
        }, n.prototype = {
            get version() {
                return this.data.version || 1
            },
            get is_8_bit() {
                return 8 === this.data.bits
            },
            get is_16_bit() {
                return !this.is_8_bit
            },
            get sample_rate() {
                return this.data.sample_rate
            },
            get scale() {
                return this.data.samples_per_pixel
            },
            get length() {
                return this.data.length
            },
            at: function(t) {
                return Math.round(this.data.data[t])
            }
        }
    },
    1456: function(t, e, i) {
        "use strict";
        var n = i(1458),
            s = i(1457),
            r = t.exports = function(t, e) {
                this.adapter = e.fromResponseData(t), this.segments = {}, this.points = {}, this.offset(0, this.adapter.length)
            };
        r.create = function(t) {
            var e = null,
                i = null;
            if (t && "object" == typeof t && ("responseText" in t || "response" in t) && (i = "responseType" in t ? t.response : t.responseText || t.response), Object.keys(r.adapters).some(function(n) {
                    if (r.adapters[n].isCompatible(i || t)) return e = r.adapters[n], !0
                }), null === e) throw new TypeError("Could not detect a WaveformData adapter from the input.");
            return new r(i || t, e)
        }, r.prototype = {
            offset: function(t, e) {
                var i = this.adapter.length;
                if (e < 0) throw new RangeError("End point must be non-negative [" + Number(e) + " < 0]");
                if (e <= t) throw new RangeError("We can't end prior to the starting point [" + Number(e) + " <= " + Number(t) + "]");
                if (t < 0) throw new RangeError("Start point must be non-negative [" + Number(t) + " < 0]");
                if (t >= i) throw new RangeError("Start point must be within range [" + Number(t) + " >= " + i + "]");
                e > i && (e = i), this.offset_start = t, this.offset_end = e, this.offset_length = e - t
            },
            set_segment: function(t, e, i) {
                return void 0 !== i && null !== i && 0 !== i.length || (i = "default"), this.segments[i] = new n(this, t, e), this.segments[i]
            },
            set_point: function(t, e) {
                return void 0 !== e && null !== e && 0 !== e.length || (e = "default"), this.points[e] = new s(this, t), this.points[e]
            },
            remove_point: function(t) {
                this.points[t] && delete this.points[t]
            },
            resample: function(t) {
                "number" == typeof t && (t = {
                    width: t
                }), t.input_index = "number" == typeof t.input_index ? t.input_index : null, t.output_index = "number" == typeof t.output_index ? t.output_index : null, t.scale = "number" == typeof t.scale ? t.scale : null, t.width = "number" == typeof t.width ? t.width : null;
                var e = Boolean(t.input_index) || Boolean(t.output_index);
                if (null !== t.input_index && t.input_index >= 0 == !1) throw new RangeError("options.input_index should be a positive integer value. [" + t.input_index + "]");
                if (null !== t.output_index && t.output_index >= 0 == !1) throw new RangeError("options.output_index should be a positive integer value. [" + t.output_index + "]");
                if (null !== t.width && t.width > 0 == !1) throw new RangeError("options.width should be a strictly positive integer value. [" + t.width + "]");
                if (null !== t.scale && t.scale > 0 == !1) throw new RangeError("options.scale should be a strictly positive integer value. [" + t.scale + "]");
                if (!t.scale && !t.width) throw new RangeError("You should provide either a resampling scale or a width in pixel the data should fit in.");
                var i = ["width", "scale", "output_index", "input_index"].reduce(function(e, i) {
                    return e + (null === t[i] ? 0 : 1)
                }, 0);
                if (e && 4 !== i) throw new Error("Some partial resampling options are missing. You provided " + i + " of them over 4.");
                var n = [],
                    s = t.scale || Math.floor(this.duration * this.adapter.sample_rate / t.width),
                    o = this.adapter.scale,
                    a = this.adapter.length,
                    l = t.input_index || 0,
                    h = t.output_index || 0,
                    u = a ? this.min_sample(l) : 0,
                    c = a ? this.max_sample(l) : 0;
                if (s < o) throw new Error("Zoom level " + s + " too low, minimum: " + o);
                for (var p, f, _, d, m, y = function(t) {
                        return Math.floor(t * s)
                    }, v = function(t, e) {
                        n.push(t, e)
                    }; l < a;) {
                    for (; Math.floor(y(h) / o) <= l;) h && v(u, c), m = l, h++, p = y(h), f = y(h - 1), p !== f && (u = 127, c = -128);
                    for (p = y(h), _ = Math.floor(p / o), _ > a && (_ = a); l < _;) d = this.min_sample(l), d < u && (u = d), d = this.max_sample(l), d > c && (c = d), l++;
                    if (e && n.length / 2 >= t.width) break
                }
                return e ? n.length / 2 > t.width && l !== m && v(u, c) : l !== m && v(u, c), new r({
                    version: this.adapter.version,
                    samples_per_pixel: s,
                    length: n.length / 2,
                    data: n,
                    sample_rate: this.adapter.sample_rate
                }, r.adapters.object)
            },
            get min() {
                return this.offsetValues(this.offset_start, this.offset_length, 0)
            },
            get max() {
                return this.offsetValues(this.offset_start, this.offset_length, 1)
            },
            offsetValues: function(t, e, i) {
                var n = this.adapter,
                    s = [];
                i += 2 * t;
                for (var r = 0; r < e; r++) s.push(n.at(2 * r + i));
                return s
            },
            get duration() {
                return this.adapter.length * this.adapter.scale / this.adapter.sample_rate
            },
            get offset_duration() {
                return this.offset_length * this.adapter.scale / this.adapter.sample_rate
            },
            get pixels_per_second() {
                return this.adapter.sample_rate / this.adapter.scale
            },
            get seconds_per_pixel() {
                return this.adapter.scale / this.adapter.sample_rate
            },
            at: function(t) {
                return this.adapter.at(t)
            },
            at_time: function(t) {
                return Math.floor(t * this.adapter.sample_rate / this.adapter.scale)
            },
            time: function(t) {
                return t * this.seconds_per_pixel
            },
            in_offset: function(t) {
                return t >= this.offset_start && t < this.offset_end
            },
            min_sample: function(t) {
                return this.adapter.at(2 * t)
            },
            max_sample: function(t) {
                return this.adapter.at(2 * t + 1)
            }
        }, r.adapters = {}, r.adapter = function(t) {
            this.data = t
        }
    },
    1457: function(t, e, i) {
        "use strict";
        (t.exports = function(t, e) {
            this.context = t, this.timeStamp = e
        }).prototype = {
            get visible() {
                return this.context.in_offset(this.timeStamp)
            }
        }
    },
    1458: function(t, e, i) {
        "use strict";
        (t.exports = function(t, e, i) {
            this.context = t, this.start = e, this.end = i
        }).prototype = {
            get offset_start() {
                return this.start < this.context.offset_start && this.end > this.context.offset_start ? this.context.offset_start : this.start >= this.context.offset_start && this.start < this.context.offset_end ? this.start : null
            },
            get offset_end() {
                return this.end > this.context.offset_start && this.end <= this.context.offset_end ? this.end : this.end > this.context.offset_end && this.start < this.context.offset_end ? this.context.offset_end : null
            },
            get offset_length() {
                return this.offset_end - this.offset_start
            },
            get length() {
                return this.end - this.start
            },
            get visible() {
                return this.context.in_offset(this.start) || this.context.in_offset(this.end) || this.context.offset_start > this.start && this.context.offset_start < this.end
            },
            get min() {
                return this.visible ? this.context.offsetValues(this.offset_start, this.offset_length, 0) : []
            },
            get max() {
                return this.visible ? this.context.offsetValues(this.offset_start, this.offset_length, 1) : []
            }
        }
    },
    1459: function(t, e, i) {
        "use strict";
        var n = i(1456);
        n.adapters = i(1454), t.exports = n
    },
    382: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }

        function s(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function r(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        }

        function o(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }

        function a(t) {
            return {
                objectUrl: F.getStagedObjectUrl(t),
                trakName: F.getTrakName(t)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.RecorderRoute = void 0;
        var l = Object.assign || function(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var i = arguments[e];
                    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n])
                }
                return t
            },
            h = function() {
                var t = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
                return function(e, i, n, s) {
                    var r = e && e.defaultProps,
                        o = arguments.length - 3;
                    if (i || 0 === o || (i = {}), i && r)
                        for (var a in r) void 0 === i[a] && (i[a] = r[a]);
                    else i || (i = r || {});
                    if (1 === o) i.children = s;
                    else if (o > 1) {
                        for (var l = Array(o), h = 0; h < o; h++) l[h] = arguments[h + 3];
                        i.children = l
                    }
                    return {
                        $$typeof: t,
                        type: e,
                        key: void 0 === n ? null : "" + n,
                        ref: null,
                        props: i,
                        _owner: null
                    }
                }
            }(),
            u = function() {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function(e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }(),
            c = i(4),
            p = n(c),
            f = i(162),
            _ = n(f),
            d = i(50),
            m = i(153),
            y = i(393),
            v = n(y),
            b = i(168),
            g = n(b),
            S = i(167),
            w = n(S),
            A = i(1444),
            T = n(A),
            x = i(160),
            M = n(x),
            k = i(461),
            R = n(k),
            O = i(466),
            E = n(O),
            P = i(465),
            B = n(P),
            C = i(84),
            F = function(t) {
                if (t && t.__esModule) return t;
                var e = {};
                if (null != t)
                    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e.default = t, e
            }(C),
            q = i(477),
            j = n(q),
            L = function(t) {
                function e(t) {
                    s(this, e);
                    var i = r(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                    return i.state = {
                        isClient: !1
                    }, i
                }
                return o(e, t), u(e, [{
                    key: "componentDidMount",
                    value: function() {
                        this.setState({
                            isClient: !0
                        })
                    }
                }, {
                    key: "render",
                    value: function() {
                        var t = this,
                            e = this.props.trakName || "";
                        return h("div", {
                            className: j.default.container
                        }, void 0, h(_.default, {}, void 0, h("title", {}, void 0, e + "::recorder - " + (0, M.default)("appTitle"))), this.state.isClient ? h(g.default, {}, void 0, h(w.default, {
                            exact: !0,
                            path: this.props.match.url,
                            render: function(e) {
                                return p.default.createElement(R.default, l({}, e, {
                                    addItemToNavBar: t.props.addItemToNavBar
                                }))
                            }
                        }), this.props.objectUrl ? [h(w.default, {
                            path: this.props.match.url + "/staging",
                            render: function(e) {
                                return p.default.createElement(E.default, l({}, e, {
                                    addItemToNavBar: t.props.addItemToNavBar
                                }))
                            }
                        }, 1), h(w.default, {
                            path: this.props.match.url + "/cleanup",
                            render: function(e) {
                                return p.default.createElement(B.default, l({}, e, {
                                    addItemToNavBar: t.props.addItemToNavBar
                                }))
                            }
                        }, 2)] : h(T.default, {
                            to: {
                                pathname: "" + this.props.match.url
                            }
                        })) : h("div", {
                            className: j.default.loadingMessage
                        }, void 0, "!!Loading!!"))
                    }
                }]), e
            }(p.default.Component);
        e.RecorderRoute = L, e.default = (0, d.compose)((0, v.default)(j.default), (0, m.connect)(a))(L)
    },
    384: function(t, e) {
        function i(t) {
            return new Int8Array(t)
        }

        function n(t) {
            return new Int16Array(t)
        }

        function s(t) {
            return new Int32Array(t)
        }

        function r(t) {
            return new Float32Array(t)
        }

        function o(t) {
            return new Float64Array(t)
        }

        function a(t) {
            if (1 == t.length) return r(t[0]);
            var e = t[0];
            t = t.slice(1);
            for (var i = [], n = 0; n < e; n++) i.push(a(t));
            return i
        }

        function l(t) {
            if (1 == t.length) return s(t[0]);
            var e = t[0];
            t = t.slice(1);
            for (var i = [], n = 0; n < e; n++) i.push(l(t));
            return i
        }

        function h(t) {
            if (1 == t.length) return n(t[0]);
            var e = t[0];
            t = t.slice(1);
            for (var i = [], s = 0; s < e; s++) i.push(h(t));
            return i
        }

        function u(t) {
            if (1 == t.length) return new Array(t[0]);
            var e = t[0];
            t = t.slice(1);
            for (var i = [], n = 0; n < e; n++) i.push(u(t));
            return i
        }

        function c(t) {
            this.ordinal = t
        }

        function p(t) {
            this.ordinal = t
        }
        var f = {};
        f.fill = function(t, e, i, n) {
            if (2 == arguments.length)
                for (var s = 0; s < t.length; s++) t[s] = arguments[1];
            else
                for (var s = e; s < i; s++) t[s] = n
        };
        var _ = {};
        _.arraycopy = function(t, e, i, n, s) {
            for (var r = e + s; e < r;) i[n++] = t[e++]
        };
        var d = {};
        d.SQRT2 = 1.4142135623730951, d.FAST_LOG10 = function(t) {
            return Math.log10(t)
        }, d.FAST_LOG10_X = function(t, e) {
            return Math.log10(t) * e
        }, c.short_block_allowed = new c(0), c.short_block_coupled = new c(1), c.short_block_dispensed = new c(2), c.short_block_forced = new c(3);
        var m = {};
        m.MAX_VALUE = 3.4028235e38, p.vbr_off = new p(0), p.vbr_mt = new p(1), p.vbr_rh = new p(2), p.vbr_abr = new p(3), p.vbr_mtrh = new p(4), p.vbr_default = p.vbr_mtrh;
        var y = function(t) {};
        t.exports = {
            System: _,
            VbrMode: p,
            Float: m,
            ShortBlock: c,
            Util: d,
            Arrays: f,
            new_array_n: u,
            new_byte: i,
            new_double: o,
            new_float: r,
            new_float_n: a,
            new_int: s,
            new_int_n: l,
            new_short: n,
            new_short_n: h,
            assert: y
        }
    },
    385: function(t, e) {
        e.f = {}.propertyIsEnumerable
    },
    386: function(t, e, i) {
        var n = i(18),
            s = i(26),
            r = i(149),
            o = i(387),
            a = i(47).f;
        t.exports = function(t) {
            var e = s.Symbol || (s.Symbol = r ? {} : n.Symbol || {});
            "_" == t.charAt(0) || t in e || a(e, t, {
                value: o.f(t)
            })
        }
    },
    387: function(t, e, i) {
        e.f = i(16)
    },
    388: function(t, e, i) {
        function n() {
            function t(t) {
                var e, i;
                if (0 == t.ATH.useAdjust) return void(t.ATH.adjust = 1);
                if (i = t.loudness_sq[0][0], e = t.loudness_sq[1][0], 2 == t.channels_out ? (i += t.loudness_sq[0][1], e += t.loudness_sq[1][1]) : (i += i, e += e), 2 == t.mode_gr && (i = Math.max(i, e)), i *= .5, (i *= t.ATH.aaSensitivityP) > .03125) t.ATH.adjust >= 1 ? t.ATH.adjust = 1 : t.ATH.adjust < t.ATH.adjustLimit && (t.ATH.adjust = t.ATH.adjustLimit), t.ATH.adjustLimit = 1;
                else {
                    var n = 31.98 * i + 625e-6;
                    t.ATH.adjust >= n ? (t.ATH.adjust *= .075 * n + .925, t.ATH.adjust < n && (t.ATH.adjust = n)) : t.ATH.adjustLimit >= n ? t.ATH.adjust = n : t.ATH.adjust < t.ATH.adjustLimit && (t.ATH.adjust = t.ATH.adjustLimit), t.ATH.adjustLimit = n
                }
            }

            function e(t) {
                var e, i;
                for (c(0 <= t.bitrate_index && t.bitrate_index < 16), c(0 <= t.mode_ext && t.mode_ext < 4), t.bitrate_stereoMode_Hist[t.bitrate_index][4]++, t.bitrate_stereoMode_Hist[15][4]++, 2 == t.channels_out && (t.bitrate_stereoMode_Hist[t.bitrate_index][t.mode_ext]++, t.bitrate_stereoMode_Hist[15][t.mode_ext]++), e = 0; e < t.mode_gr; ++e)
                    for (i = 0; i < t.channels_out; ++i) {
                        var n = 0 | t.l3_side.tt[e][i].block_type;
                        0 != t.l3_side.tt[e][i].mixed_block_flag && (n = 4), t.bitrate_blockType_Hist[t.bitrate_index][n]++, t.bitrate_blockType_Hist[t.bitrate_index][5]++, t.bitrate_blockType_Hist[15][n]++, t.bitrate_blockType_Hist[15][5]++
                    }
            }

            function s(t, e) {
                var i, s, r = t.internal_flags;
                if (0 == r.lame_encode_frame_init) {
                    var o, a, h = l(2014),
                        u = l(2014);
                    for (r.lame_encode_frame_init = 1, o = 0, a = 0; o < 286 + 576 * (1 + r.mode_gr); ++o) o < 576 * r.mode_gr ? (h[o] = 0, 2 == r.channels_out && (u[o] = 0)) : (h[o] = e[0][a], 2 == r.channels_out && (u[o] = e[1][a]), ++a);
                    for (s = 0; s < r.mode_gr; s++)
                        for (i = 0; i < r.channels_out; i++) r.l3_side.tt[s][i].block_type = n.SHORT_TYPE;
                    g.mdct_sub48(r, h, u), c(576 >= n.FFTOFFSET), c(r.mf_size >= n.BLKSIZE + t.framesize - n.FFTOFFSET), c(r.mf_size >= 512 + t.framesize - 32)
                }
            }
            var p = i(487),
                f = i(484),
                _ = n.FFTOFFSET,
                d = n.MPG_MD_MS_LR,
                m = null;
            this.psy = null;
            var y = null,
                v = null,
                b = null;
            this.setModules = function(t, e, i, n) {
                m = t, this.psy = e, y = e, v = n, b = i
            };
            var g = new p;
            this.lame_encode_mp3_frame = function(i, l, c, p, S, w) {
                var A, T = a([2, 2]);
                T[0][0] = new f, T[0][1] = new f, T[1][0] = new f, T[1][1] = new f;
                var x = a([2, 2]);
                x[0][0] = new f, x[0][1] = new f, x[1][0] = new f, x[1][1] = new f;
                var M, k, R, O, E = [null, null],
                    P = i.internal_flags,
                    B = h([2, 4]),
                    C = [.5, .5],
                    F = [
                        [0, 0],
                        [0, 0]
                    ],
                    q = [
                        [0, 0],
                        [0, 0]
                    ];
                if (E[0] = l, E[1] = c, 0 == P.lame_encode_frame_init && s(i, E), P.padding = 0, (P.slot_lag -= P.frac_SpF) < 0 && (P.slot_lag += i.out_samplerate, P.padding = 1), 0 != P.psymodel) {
                    var j = [null, null],
                        L = 0,
                        I = u(2);
                    for (O = 0; O < P.mode_gr; O++) {
                        for (R = 0; R < P.channels_out; R++) j[R] = E[R], L = 576 + 576 * O - n.FFTOFFSET;
                        if (0 != (i.VBR == o.vbr_mtrh || i.VBR == o.vbr_mt ? y.L3psycho_anal_vbr(i, j, L, O, T, x, F[O], q[O], B[O], I) : y.L3psycho_anal_ns(i, j, L, O, T, x, F[O], q[O], B[O], I))) return -4;
                        for (i.mode == MPEGMode.JOINT_STEREO && (C[O] = B[O][2] + B[O][3], C[O] > 0 && (C[O] = B[O][3] / C[O])), R = 0; R < P.channels_out; R++) {
                            var N = P.l3_side.tt[O][R];
                            N.block_type = I[R], N.mixed_block_flag = 0
                        }
                    }
                } else
                    for (O = 0; O < P.mode_gr; O++)
                        for (R = 0; R < P.channels_out; R++) P.l3_side.tt[O][R].block_type = n.NORM_TYPE, P.l3_side.tt[O][R].mixed_block_flag = 0, q[O][R] = F[O][R] = 700;
                if (t(P), g.mdct_sub48(P, E[0], E[1]), P.mode_ext = n.MPG_MD_LR_LR, i.force_ms) P.mode_ext = n.MPG_MD_MS_LR;
                else if (i.mode == MPEGMode.JOINT_STEREO) {
                    var D = 0,
                        V = 0;
                    for (O = 0; O < P.mode_gr; O++)
                        for (R = 0; R < P.channels_out; R++) D += q[O][R], V += F[O][R];
                    if (D <= 1 * V) {
                        var U = P.l3_side.tt[0],
                            G = P.l3_side.tt[P.mode_gr - 1];
                        U[0].block_type == U[1].block_type && G[0].block_type == G[1].block_type && (P.mode_ext = n.MPG_MD_MS_LR)
                    }
                }
                if (P.mode_ext == d ? (M = x, k = q) : (M = T, k = F), i.analysis && null != P.pinfo)
                    for (O = 0; O < P.mode_gr; O++)
                        for (R = 0; R < P.channels_out; R++) P.pinfo.ms_ratio[O] = P.ms_ratio[O], P.pinfo.ms_ener_ratio[O] = C[O], P.pinfo.blocktype[O][R] = P.l3_side.tt[O][R].block_type, P.pinfo.pe[O][R] = k[O][R], r.arraycopy(P.l3_side.tt[O][R].xr, 0, P.pinfo.xr[O][R], 0, 576), P.mode_ext == d && (P.pinfo.ers[O][R] = P.pinfo.ers[O][R + 2], r.arraycopy(P.pinfo.energy[O][R + 2], 0, P.pinfo.energy[O][R], 0, P.pinfo.energy[O][R].length));
                if (i.VBR == o.vbr_off || i.VBR == o.vbr_abr) {
                    var H, X;
                    for (H = 0; H < 18; H++) P.nsPsy.pefirbuf[H] = P.nsPsy.pefirbuf[H + 1];
                    for (X = 0, O = 0; O < P.mode_gr; O++)
                        for (R = 0; R < P.channels_out; R++) X += k[O][R];
                    for (P.nsPsy.pefirbuf[18] = X, X = P.nsPsy.pefirbuf[9], H = 0; H < 9; H++) X += (P.nsPsy.pefirbuf[H] + P.nsPsy.pefirbuf[18 - H]) * n.fircoef[H];
                    for (X = 3350 * P.mode_gr * P.channels_out / X, O = 0; O < P.mode_gr; O++)
                        for (R = 0; R < P.channels_out; R++) k[O][R] *= X
                }
                if (P.iteration_loop.iteration_loop(i, k, C, M), m.format_bitstream(i), A = m.copy_buffer(P, p, S, w, 1), i.bWriteVbrTag && v.addVbrFrame(i), i.analysis && null != P.pinfo) {
                    for (R = 0; R < P.channels_out; R++) {
                        var Y;
                        for (Y = 0; Y < _; Y++) P.pinfo.pcmdata[R][Y] = P.pinfo.pcmdata[R][Y + i.framesize];
                        for (Y = _; Y < 1600; Y++) P.pinfo.pcmdata[R][Y] = E[R][Y - _]
                    }
                    b.set_frame_pinfo(i, M)
                }
                return e(P), A
            }
        }
        var s = i(384),
            r = s.System,
            o = s.VbrMode,
            a = (s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n),
            l = (s.new_byte, s.new_double, s.new_float),
            h = s.new_float_n,
            u = s.new_int,
            c = (s.new_int_n, s.assert);
        n.ENCDELAY = 576, n.POSTDELAY = 1152, n.MDCTDELAY = 48, n.FFTOFFSET = 224 + n.MDCTDELAY, n.DECDELAY = 528, n.SBLIMIT = 32, n.CBANDS = 64, n.SBPSY_l = 21, n.SBPSY_s = 12, n.SBMAX_l = 22, n.SBMAX_s = 13, n.PSFB21 = 6, n.PSFB12 = 6, n.BLKSIZE = 1024, n.HBLKSIZE = n.BLKSIZE / 2 + 1, n.BLKSIZE_s = 256, n.HBLKSIZE_s = n.BLKSIZE_s / 2 + 1, n.NORM_TYPE = 0, n.START_TYPE = 1, n.SHORT_TYPE = 2, n.STOP_TYPE = 3, n.MPG_MD_LR_LR = 0, n.MPG_MD_LR_I = 1, n.MPG_MD_MS_LR = 2, n.MPG_MD_MS_I = 3, n.fircoef = [-.1039435, -.1892065, 5 * -.0432472, -.155915, 3.898045e-17, .0467745 * 5, .50455, .756825, .187098 * 5], t.exports = n
    },
    389: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }
        e.__esModule = !0;
        var s = i(399),
            r = n(s),
            o = i(398),
            a = n(o),
            l = "function" == typeof a.default && "symbol" == typeof r.default ? function(t) {
                return typeof t
            } : function(t) {
                return t && "function" == typeof a.default && t.constructor === a.default && t !== a.default.prototype ? "symbol" : typeof t
            };
        e.default = "function" == typeof a.default && "symbol" === l(r.default) ? function(t) {
            return void 0 === t ? "undefined" : l(t)
        } : function(t) {
            return t && "function" == typeof a.default && t.constructor === a.default && t !== a.default.prototype ? "symbol" : void 0 === t ? "undefined" : l(t)
        }
    },
    390: function(t, e, i) {
        var n = i(385),
            s = i(81),
            r = i(49),
            o = i(152),
            a = i(36),
            l = i(155),
            h = Object.getOwnPropertyDescriptor;
        e.f = i(35) ? h : function(t, e) {
            if (t = r(t), e = o(e, !0), l) try {
                return h(t, e)
            } catch (t) {}
            if (a(t, e)) return s(!n.f.call(t, e), t[e])
        }
    },
    391: function(t, e, i) {
        var n = i(157),
            s = i(87).concat("length", "prototype");
        e.f = Object.getOwnPropertyNames || function(t) {
            return n(t, s)
        }
    },
    392: function(t, e) {
        e.f = Object.getOwnPropertySymbols
    },
    393: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }

        function s() {
            for (var t = arguments.length, e = Array(t), i = 0; i < t; i++) e[i] = arguments[i];
            return function(t) {
                var i = function(i) {
                        function n() {
                            return (0, l.default)(this, n), (0, p.default)(this, (n.__proto__ || (0, o.default)(n)).apply(this, arguments))
                        }
                        return (0, _.default)(n, i), (0, u.default)(n, [{
                            key: "componentWillMount",
                            value: function() {
                                this.removeCss = this.context.insertCss.apply(void 0, e)
                            }
                        }, {
                            key: "componentWillUnmount",
                            value: function() {
                                setTimeout(this.removeCss, 0)
                            }
                        }, {
                            key: "render",
                            value: function() {
                                return m.default.createElement(t, this.props)
                            }
                        }]), n
                    }(d.Component),
                    n = t.displayName || t.name || "Component";
                return i.displayName = "WithStyles(" + n + ")", i.contextTypes = S, i.ComposedComponent = t, (0, g.default)(i, t)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var r = i(396),
            o = n(r),
            a = i(400),
            l = n(a),
            h = i(401),
            u = n(h),
            c = i(403),
            p = n(c),
            f = i(402),
            _ = n(f),
            d = i(4),
            m = n(d),
            y = i(6),
            v = n(y),
            b = i(425),
            g = n(b),
            S = {
                insertCss: v.default.func
            };
        e.default = s
    },
    394: function(t, e, i) {
        t.exports = {
            default: i(404),
            __esModule: !0
        }
    },
    395: function(t, e, i) {
        t.exports = {
            default: i(405),
            __esModule: !0
        }
    },
    396: function(t, e, i) {
        t.exports = {
            default: i(406),
            __esModule: !0
        }
    },
    397: function(t, e, i) {
        t.exports = {
            default: i(407),
            __esModule: !0
        }
    },
    398: function(t, e, i) {
        t.exports = {
            default: i(408),
            __esModule: !0
        }
    },
    399: function(t, e, i) {
        t.exports = {
            default: i(409),
            __esModule: !0
        }
    },
    400: function(t, e, i) {
        "use strict";
        e.__esModule = !0, e.default = function(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }
    },
    401: function(t, e, i) {
        "use strict";
        e.__esModule = !0;
        var n = i(395),
            s = function(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }(n);
        e.default = function() {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), (0, s.default)(t, n.key, n)
                }
            }
            return function(e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }()
    },
    402: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }
        e.__esModule = !0;
        var s = i(397),
            r = n(s),
            o = i(394),
            a = n(o),
            l = i(389),
            h = n(l);
        e.default = function(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + (void 0 === e ? "undefined" : (0, h.default)(e)));
            t.prototype = (0, a.default)(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (r.default ? (0, r.default)(t, e) : t.__proto__ = e)
        }
    },
    403: function(t, e, i) {
        "use strict";
        e.__esModule = !0;
        var n = i(389),
            s = function(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }(n);
        e.default = function(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" !== (void 0 === e ? "undefined" : (0, s.default)(e)) && "function" != typeof e ? t : e
        }
    },
    404: function(t, e, i) {
        i(416);
        var n = i(26).Object;
        t.exports = function(t, e) {
            return n.create(t, e)
        }
    },
    405: function(t, e, i) {
        i(417);
        var n = i(26).Object;
        t.exports = function(t, e, i) {
            return n.defineProperty(t, e, i)
        }
    },
    406: function(t, e, i) {
        i(418), t.exports = i(26).Object.getPrototypeOf
    },
    407: function(t, e, i) {
        i(419), t.exports = i(26).Object.setPrototypeOf
    },
    408: function(t, e, i) {
        i(421), i(420), i(422), i(423), t.exports = i(26).Symbol
    },
    409: function(t, e, i) {
        i(90), i(91), t.exports = i(387).f("iterator")
    },
    410: function(t, e, i) {
        var n = i(151),
            s = i(392),
            r = i(385);
        t.exports = function(t) {
            var e = n(t),
                i = s.f;
            if (i)
                for (var o, a = i(t), l = r.f, h = 0; a.length > h;) l.call(t, o = a[h++]) && e.push(o);
            return e
        }
    },
    411: function(t, e, i) {
        var n = i(86);
        t.exports = Array.isArray || function(t) {
            return "Array" == n(t)
        }
    },
    412: function(t, e, i) {
        var n = i(82)("meta"),
            s = i(48),
            r = i(36),
            o = i(47).f,
            a = 0,
            l = Object.isExtensible || function() {
                return !0
            },
            h = !i(80)(function() {
                return l(Object.preventExtensions({}))
            }),
            u = function(t) {
                o(t, n, {
                    value: {
                        i: "O" + ++a,
                        w: {}
                    }
                })
            },
            c = function(t, e) {
                if (!s(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
                if (!r(t, n)) {
                    if (!l(t)) return "F";
                    if (!e) return "E";
                    u(t)
                }
                return t[n].i
            },
            p = function(t, e) {
                if (!r(t, n)) {
                    if (!l(t)) return !0;
                    if (!e) return !1;
                    u(t)
                }
                return t[n].w
            },
            f = function(t) {
                return h && _.NEED && l(t) && !r(t, n) && u(t), t
            },
            _ = t.exports = {
                KEY: n,
                NEED: !1,
                fastKey: c,
                getWeak: p,
                onFreeze: f
            }
    },
    413: function(t, e, i) {
        var n = i(49),
            s = i(391).f,
            r = {}.toString,
            o = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
            a = function(t) {
                try {
                    return s(t)
                } catch (t) {
                    return o.slice()
                }
            };
        t.exports.f = function(t) {
            return o && "[object Window]" == r.call(t) ? a(t) : s(n(t))
        }
    },
    414: function(t, e, i) {
        var n = i(148),
            s = i(26),
            r = i(80);
        t.exports = function(t, e) {
            var i = (s.Object || {})[t] || Object[t],
                o = {};
            o[t] = e(i), n(n.S + n.F * r(function() {
                i(1)
            }), "Object", o)
        }
    },
    415: function(t, e, i) {
        var n = i(48),
            s = i(37),
            r = function(t, e) {
                if (s(t), !n(e) && null !== e) throw TypeError(e + ": can't set as prototype!")
            };
        t.exports = {
            set: Object.setPrototypeOf || ("__proto__" in {} ? function(t, e, n) {
                try {
                    n = i(154)(Function.call, i(390).f(Object.prototype, "__proto__").set, 2), n(t, []), e = !(t instanceof Array)
                } catch (t) {
                    e = !0
                }
                return function(t, i) {
                    return r(t, i), e ? t.__proto__ = i : n(t, i), t
                }
            }({}, !1) : void 0),
            check: r
        }
    },
    416: function(t, e, i) {
        var n = i(148);
        n(n.S, "Object", {
            create: i(150)
        })
    },
    417: function(t, e, i) {
        var n = i(148);
        n(n.S + n.F * !i(35), "Object", {
            defineProperty: i(47).f
        })
    },
    418: function(t, e, i) {
        var n = i(159),
            s = i(156);
        i(414)("getPrototypeOf", function() {
            return function(t) {
                return s(n(t))
            }
        })
    },
    419: function(t, e, i) {
        var n = i(148);
        n(n.S, "Object", {
            setPrototypeOf: i(415).set
        })
    },
    420: function(t, e) {},
    421: function(t, e, i) {
        "use strict";
        var n = i(18),
            s = i(36),
            r = i(35),
            o = i(148),
            a = i(158),
            l = i(412).KEY,
            h = i(80),
            u = i(89),
            c = i(88),
            p = i(82),
            f = i(16),
            _ = i(387),
            d = i(386),
            m = i(410),
            y = i(411),
            v = i(37),
            b = i(48),
            g = i(49),
            S = i(152),
            w = i(81),
            A = i(150),
            T = i(413),
            x = i(390),
            M = i(47),
            k = i(151),
            R = x.f,
            O = M.f,
            E = T.f,
            P = n.Symbol,
            B = n.JSON,
            C = B && B.stringify,
            F = f("_hidden"),
            q = f("toPrimitive"),
            j = {}.propertyIsEnumerable,
            L = u("symbol-registry"),
            I = u("symbols"),
            N = u("op-symbols"),
            D = Object.prototype,
            V = "function" == typeof P,
            U = n.QObject,
            G = !U || !U.prototype || !U.prototype.findChild,
            H = r && h(function() {
                return 7 != A(O({}, "a", {
                    get: function() {
                        return O(this, "a", {
                            value: 7
                        }).a
                    }
                })).a
            }) ? function(t, e, i) {
                var n = R(D, e);
                n && delete D[e], O(t, e, i), n && t !== D && O(D, e, n)
            } : O,
            X = function(t) {
                var e = I[t] = A(P.prototype);
                return e._k = t, e
            },
            Y = V && "symbol" == typeof P.iterator ? function(t) {
                return "symbol" == typeof t
            } : function(t) {
                return t instanceof P
            },
            z = function(t, e, i) {
                return t === D && z(N, e, i), v(t), e = S(e, !0), v(i), s(I, e) ? (i.enumerable ? (s(t, F) && t[F][e] && (t[F][e] = !1), i = A(i, {
                    enumerable: w(0, !1)
                })) : (s(t, F) || O(t, F, w(1, {})), t[F][e] = !0), H(t, e, i)) : O(t, e, i)
            },
            W = function(t, e) {
                v(t);
                for (var i, n = m(e = g(e)), s = 0, r = n.length; r > s;) z(t, i = n[s++], e[i]);
                return t
            },
            Q = function(t, e) {
                return void 0 === e ? A(t) : W(A(t), e)
            },
            Z = function(t) {
                var e = j.call(this, t = S(t, !0));
                return !(this === D && s(I, t) && !s(N, t)) && (!(e || !s(this, t) || !s(I, t) || s(this, F) && this[F][t]) || e)
            },
            K = function(t, e) {
                if (t = g(t), e = S(e, !0), t !== D || !s(I, e) || s(N, e)) {
                    var i = R(t, e);
                    return !i || !s(I, e) || s(t, F) && t[F][e] || (i.enumerable = !0), i
                }
            },
            J = function(t) {
                for (var e, i = E(g(t)), n = [], r = 0; i.length > r;) s(I, e = i[r++]) || e == F || e == l || n.push(e);
                return n
            },
            $ = function(t) {
                for (var e, i = t === D, n = E(i ? N : g(t)), r = [], o = 0; n.length > o;) !s(I, e = n[o++]) || i && !s(D, e) || r.push(I[e]);
                return r
            };
        V || (P = function() {
            if (this instanceof P) throw TypeError("Symbol is not a constructor!");
            var t = p(arguments.length > 0 ? arguments[0] : void 0),
                e = function(i) {
                    this === D && e.call(N, i), s(this, F) && s(this[F], t) && (this[F][t] = !1), H(this, t, w(1, i))
                };
            return r && G && H(D, t, {
                configurable: !0,
                set: e
            }), X(t)
        }, a(P.prototype, "toString", function() {
            return this._k
        }), x.f = K, M.f = z, i(391).f = T.f = J, i(385).f = Z, i(392).f = $, r && !i(149) && a(D, "propertyIsEnumerable", Z, !0), _.f = function(t) {
            return X(f(t))
        }), o(o.G + o.W + o.F * !V, {
            Symbol: P
        });
        for (var tt = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), et = 0; tt.length > et;) f(tt[et++]);
        for (var it = k(f.store), nt = 0; it.length > nt;) d(it[nt++]);
        o(o.S + o.F * !V, "Symbol", {
            for: function(t) {
                return s(L, t += "") ? L[t] : L[t] = P(t)
            },
            keyFor: function(t) {
                if (!Y(t)) throw TypeError(t + " is not a symbol!");
                for (var e in L)
                    if (L[e] === t) return e
            },
            useSetter: function() {
                G = !0
            },
            useSimple: function() {
                G = !1
            }
        }), o(o.S + o.F * !V, "Object", {
            create: Q,
            defineProperty: z,
            defineProperties: W,
            getOwnPropertyDescriptor: K,
            getOwnPropertyNames: J,
            getOwnPropertySymbols: $
        }), B && o(o.S + o.F * (!V || h(function() {
            var t = P();
            return "[null]" != C([t]) || "{}" != C({
                a: t
            }) || "{}" != C(Object(t))
        })), "JSON", {
            stringify: function(t) {
                for (var e, i, n = [t], s = 1; arguments.length > s;) n.push(arguments[s++]);
                if (i = e = n[1], (b(e) || void 0 !== t) && !Y(t)) return y(e) || (e = function(t, e) {
                    if ("function" == typeof i && (e = i.call(this, t, e)), !Y(e)) return e
                }), n[1] = e, C.apply(B, n)
            }
        }), P.prototype[q] || i(27)(P.prototype, q, P.prototype.valueOf), c(P, "Symbol"), c(Math, "Math", !0), c(n.JSON, "JSON", !0)
    },
    422: function(t, e, i) {
        i(386)("asyncIterator")
    },
    423: function(t, e, i) {
        i(386)("observable")
    },
    425: function(t, e, i) {
        "use strict";
        var n = {
                childContextTypes: !0,
                contextTypes: !0,
                defaultProps: !0,
                displayName: !0,
                getDefaultProps: !0,
                mixins: !0,
                propTypes: !0,
                type: !0
            },
            s = {
                name: !0,
                length: !0,
                prototype: !0,
                caller: !0,
                arguments: !0,
                arity: !0
            },
            r = "function" == typeof Object.getOwnPropertySymbols;
        t.exports = function(t, e, i) {
            if ("string" != typeof e) {
                var o = Object.getOwnPropertyNames(e);
                r && (o = o.concat(Object.getOwnPropertySymbols(e)));
                for (var a = 0; a < o.length; ++a)
                    if (!(n[o[a]] || s[o[a]] || i && i[o[a]])) try {
                        t[o[a]] = e[o[a]]
                    } catch (t) {}
            }
            return t
        }
    },
    426: function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(19);
        e.default = (0, n.asyncComponent)({
            resolve: function() {
                return i.e(6).then(i.bind(null, 436))
            },
            serverMode: "defer"
        })
    },
    427: function(t, e, i) {
        var n = i(388),
            s = {};
        s.SFBMAX = 3 * n.SBMAX_s, t.exports = s
    },
    428: function(t, e, i) {
        function n() {
            function t() {
                this.write_timing = 0, this.ptr = 0, this.buf = r(e)
            }
            var e = 40;
            this.Class_ID = 0, this.lame_encode_frame_init = 0, this.iteration_init_init = 0, this.fill_buffer_resample_init = 0, this.mfbuf = l([2, n.MFSIZE]), this.mode_gr = 0, this.channels_in = 0, this.channels_out = 0, this.resample_ratio = 0, this.mf_samples_to_encode = 0, this.mf_size = 0, this.VBR_min_bitrate = 0, this.VBR_max_bitrate = 0, this.bitrate_index = 0, this.samplerate_index = 0, this.mode_ext = 0, this.lowpass1 = 0, this.lowpass2 = 0, this.highpass1 = 0, this.highpass2 = 0, this.noise_shaping = 0, this.noise_shaping_amp = 0, this.substep_shaping = 0, this.psymodel = 0, this.noise_shaping_stop = 0, this.subblock_gain = 0, this.use_best_huffman = 0, this.full_outer_loop = 0, this.l3_side = new c, this.ms_ratio = a(2), this.padding = 0, this.frac_SpF = 0, this.slot_lag = 0, this.tag_spec = null, this.nMusicCRC = 0, this.OldValue = h(2), this.CurrentStep = h(2), this.masking_lower = 0, this.bv_scf = h(576), this.pseudohalf = h(y.SFBMAX), this.sfb21_extra = !1, this.inbuf_old = new Array(2), this.blackfilt = new Array(2 * n.BPC + 1), this.itime = o(2), this.sideinfo_len = 0, this.sb_sample = l([2, 2, 18, m.SBLIMIT]), this.amp_filter = a(32), this.header = new Array(n.MAX_HEADER_BUF), this.h_ptr = 0, this.w_ptr = 0, this.ancillary_flag = 0, this.ResvSize = 0, this.ResvMax = 0, this.scalefac_band = new p, this.minval_l = a(m.CBANDS), this.minval_s = a(m.CBANDS), this.nb_1 = l([4, m.CBANDS]), this.nb_2 = l([4, m.CBANDS]), this.nb_s1 = l([4, m.CBANDS]), this.nb_s2 = l([4, m.CBANDS]), this.s3_ss = null, this.s3_ll = null, this.decay = 0, this.thm = new Array(4), this.en = new Array(4), this.tot_ener = a(4), this.loudness_sq = l([2, 2]), this.loudness_sq_save = a(2), this.mld_l = a(m.SBMAX_l), this.mld_s = a(m.SBMAX_s), this.bm_l = h(m.SBMAX_l), this.bo_l = h(m.SBMAX_l), this.bm_s = h(m.SBMAX_s), this.bo_s = h(m.SBMAX_s), this.npart_l = 0, this.npart_s = 0, this.s3ind = u([m.CBANDS, 2]), this.s3ind_s = u([m.CBANDS, 2]), this.numlines_s = h(m.CBANDS), this.numlines_l = h(m.CBANDS), this.rnumlines_l = a(m.CBANDS), this.mld_cb_l = a(m.CBANDS), this.mld_cb_s = a(m.CBANDS), this.numlines_s_num1 = 0, this.numlines_l_num1 = 0, this.pe = a(4), this.ms_ratio_s_old = 0, this.ms_ratio_l_old = 0, this.ms_ener_ratio_old = 0, this.blocktype_old = h(2), this.nsPsy = new f, this.VBR_seek_table = new _, this.ATH = null, this.PSY = null, this.nogap_total = 0, this.nogap_current = 0, this.decode_on_the_fly = !0, this.findReplayGain = !0, this.findPeakSample = !0, this.PeakSample = 0, this.RadioGain = 0, this.AudiophileGain = 0, this.rgdata = null, this.noclipGainChange = 0, this.noclipScale = 0, this.bitrate_stereoMode_Hist = u([16, 5]), this.bitrate_blockType_Hist = u([16, 6]), this.pinfo = null, this.hip = null, this.in_buffer_nsamples = 0, this.in_buffer_0 = null, this.in_buffer_1 = null, this.iteration_loop = null;
            for (var i = 0; i < this.en.length; i++) this.en[i] = new d;
            for (var i = 0; i < this.thm.length; i++) this.thm[i] = new d;
            for (var i = 0; i < this.header.length; i++) this.header[i] = new t
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte),
            o = s.new_double,
            a = s.new_float,
            l = s.new_float_n,
            h = s.new_int,
            u = s.new_int_n,
            c = (s.assert, i(483)),
            p = i(445),
            f = i(488),
            _ = i(495),
            d = i(441),
            m = i(388),
            y = i(427);
        n.MFSIZE = 3456 + m.ENCDELAY - m.MDCTDELAY, n.MAX_HEADER_BUF = 256, n.MAX_BITS_PER_CHANNEL = 4095, n.MAX_BITS_PER_GRANULE = 7680, n.BPC = 320, t.exports = n
    },
    429: function(t, e, i) {
        var n;
        ! function(s, r) {
            void 0 !== (n = function() {
                return r()
            }.call(e, i, e, t)) && (t.exports = n)
        }(0, function() {
            "use strict";

            function t(t) {
                t(e)
            }
            var e;
            return function(t) {
                e = t()
            }(function() {
                var t = function(t, e) {
                    this.isUndef(t) || 1 === t ? this.input = this.context.createGain() : t > 1 && (this.input = new Array(t)), this.isUndef(e) || 1 === e ? this.output = this.context.createGain() : e > 1 && (this.output = new Array(t))
                };
                t.prototype.set = function(e, i, n) {
                    if (this.isObject(e)) n = i;
                    else if (this.isString(e)) {
                        var s = {};
                        s[e] = i, e = s
                    }
                    t: for (var r in e) {
                        i = e[r];
                        var o = this;
                        if (-1 !== r.indexOf(".")) {
                            for (var a = r.split("."), l = 0; l < a.length - 1; l++)
                                if ((o = o[a[l]]) instanceof t) {
                                    a.splice(0, l + 1);
                                    var h = a.join(".");
                                    o.set(h, i);
                                    continue t
                                }
                            r = a[a.length - 1]
                        }
                        var u = o[r];
                        this.isUndef(u) || (t.Signal && u instanceof t.Signal || t.Param && u instanceof t.Param ? u.value !== i && (this.isUndef(n) ? u.value = i : u.rampTo(i, n)) : u instanceof AudioParam ? u.value !== i && (u.value = i) : u instanceof t ? u.set(i) : u !== i && (o[r] = i))
                    }
                    return this
                }, t.prototype.get = function(e) {
                    this.isUndef(e) ? e = this._collectDefaults(this.constructor) : this.isString(e) && (e = [e]);
                    for (var i = {}, n = 0; n < e.length; n++) {
                        var s = e[n],
                            r = this,
                            o = i;
                        if (-1 !== s.indexOf(".")) {
                            for (var a = s.split("."), l = 0; l < a.length - 1; l++) {
                                var h = a[l];
                                o[h] = o[h] || {}, o = o[h], r = r[h]
                            }
                            s = a[a.length - 1]
                        }
                        var u = r[s];
                        this.isObject(e[s]) ? o[s] = u.get() : t.Signal && u instanceof t.Signal ? o[s] = u.value : t.Param && u instanceof t.Param ? o[s] = u.value : u instanceof AudioParam ? o[s] = u.value : u instanceof t ? o[s] = u.get() : this.isFunction(u) || this.isUndef(u) || (o[s] = u)
                    }
                    return i
                }, t.prototype._collectDefaults = function(t) {
                    var e = [];
                    if (this.isUndef(t.defaults) || (e = Object.keys(t.defaults)), !this.isUndef(t._super))
                        for (var i = this._collectDefaults(t._super), n = 0; n < i.length; n++) - 1 === e.indexOf(i[n]) && e.push(i[n]);
                    return e
                }, t.prototype.toString = function() {
                    for (var e in t) {
                        var i = e[0].match(/^[A-Z]$/),
                            n = t[e] === this.constructor;
                        if (this.isFunction(t[e]) && i && n) return e
                    }
                    return "Tone"
                }, Object.defineProperty(t.prototype, "numberOfInputs", {
                    get: function() {
                        return this.input ? this.isArray(this.input) ? this.input.length : 1 : 0
                    }
                }), Object.defineProperty(t.prototype, "numberOfOutputs", {
                    get: function() {
                        return this.output ? this.isArray(this.output) ? this.output.length : 1 : 0
                    }
                }), t.prototype.dispose = function() {
                    return this.isUndef(this.input) || (this.input instanceof AudioNode && this.input.disconnect(), this.input = null), this.isUndef(this.output) || (this.output instanceof AudioNode && this.output.disconnect(), this.output = null), this
                }, t.prototype.connect = function(t, e, i) {
                    return Array.isArray(this.output) ? (e = this.defaultArg(e, 0), this.output[e].connect(t, 0, i)) : this.output.connect(t, e, i), this
                }, t.prototype.disconnect = function(t, e, i) {
                    this.isArray(this.output) ? this.isNumber(t) ? this.output[t].disconnect() : (e = this.defaultArg(e, 0), this.output[e].disconnect(t, 0, i)) : this.output.disconnect.apply(this.output, arguments)
                }, t.prototype.connectSeries = function() {
                    if (arguments.length > 1)
                        for (var t = arguments[0], e = 1; e < arguments.length; e++) {
                            var i = arguments[e];
                            t.connect(i), t = i
                        }
                    return this
                }, t.prototype.chain = function() {
                    if (arguments.length > 0)
                        for (var t = this, e = 0; e < arguments.length; e++) {
                            var i = arguments[e];
                            t.connect(i), t = i
                        }
                    return this
                }, t.prototype.fan = function() {
                    if (arguments.length > 0)
                        for (var t = 0; t < arguments.length; t++) this.connect(arguments[t]);
                    return this
                }, AudioNode.prototype.chain = t.prototype.chain, AudioNode.prototype.fan = t.prototype.fan, t.prototype.defaultArg = function(t, e) {
                    if (this.isObject(t) && this.isObject(e)) {
                        var i = {};
                        for (var n in t) i[n] = this.defaultArg(e[n], t[n]);
                        for (var s in e) i[s] = this.defaultArg(t[s], e[s]);
                        return i
                    }
                    return this.isUndef(t) ? e : t
                }, t.prototype.optionsObject = function(t, e, i) {
                    var n = {};
                    if (1 === t.length && this.isObject(t[0])) n = t[0];
                    else
                        for (var s = 0; s < e.length; s++) n[e[s]] = t[s];
                    return this.isUndef(i) ? n : this.defaultArg(n, i)
                }, t.prototype.isUndef = function(t) {
                    return void 0 === t
                }, t.prototype.isFunction = function(t) {
                    return "function" == typeof t
                }, t.prototype.isNumber = function(t) {
                    return "number" == typeof t
                }, t.prototype.isObject = function(t) {
                    return "[object Object]" === Object.prototype.toString.call(t) && t.constructor === Object
                }, t.prototype.isBoolean = function(t) {
                    return "boolean" == typeof t
                }, t.prototype.isArray = function(t) {
                    return Array.isArray(t)
                }, t.prototype.isString = function(t) {
                    return "string" == typeof t
                }, t.noOp = function() {}, t.prototype._readOnly = function(t) {
                    if (Array.isArray(t))
                        for (var e = 0; e < t.length; e++) this._readOnly(t[e]);
                    else Object.defineProperty(this, t, {
                        writable: !1,
                        enumerable: !0
                    })
                }, t.prototype._writable = function(t) {
                    if (Array.isArray(t))
                        for (var e = 0; e < t.length; e++) this._writable(t[e]);
                    else Object.defineProperty(this, t, {
                        writable: !0
                    })
                }, t.State = {
                    Started: "started",
                    Stopped: "stopped",
                    Paused: "paused"
                }, t.prototype.equalPowerScale = function(t) {
                    var e = .5 * Math.PI;
                    return Math.sin(t * e)
                }, t.prototype.dbToGain = function(t) {
                    return Math.pow(2, t / 6)
                }, t.prototype.gainToDb = function(t) {
                    return Math.log(t) / Math.LN10 * 20
                }, t.prototype.intervalToFrequencyRatio = function(t) {
                    return Math.pow(2, t / 12)
                }, t.prototype.now = function() {
                    return t.context.now()
                }, t.now = function() {
                    return t.context.now()
                }, t.extend = function(e, i) {
                    function n() {}
                    t.prototype.isUndef(i) && (i = t), n.prototype = i.prototype, e.prototype = new n, e.prototype.constructor = e, e._super = i
                };
                var e;
                return Object.defineProperty(t, "context", {
                    get: function() {
                        return e
                    },
                    set: function(i) {
                        e = t.Context && i instanceof t.Context ? i : new t.Context(i), t.Context && t.Context.emit("init", e)
                    }
                }), Object.defineProperty(t.prototype, "context", {
                    get: function() {
                        return t.context
                    }
                }), t.setContext = function(e) {
                    t.context = e
                }, Object.defineProperty(t.prototype, "blockTime", {
                    get: function() {
                        return 128 / this.context.sampleRate
                    }
                }), Object.defineProperty(t.prototype, "sampleTime", {
                    get: function() {
                        return 1 / this.context.sampleRate
                    }
                }), Object.defineProperty(t, "supported", {
                    get: function() {
                        var t = window.hasOwnProperty("AudioContext") || window.hasOwnProperty("webkitAudioContext"),
                            e = window.hasOwnProperty("Promise"),
                            i = window.hasOwnProperty("Worker");
                        return t && e && i
                    }
                }), t.version = "r10", window.TONE_SILENCE_VERSION_LOGGING || console.log("%c * Tone.js " + t.version + " * ", "background: #000; color: #fff"), t
            }), t(function(t) {
                return t.SignalBase = function() {}, t.extend(t.SignalBase), t.SignalBase.prototype.connect = function(e, i, n) {
                    return t.Signal && t.Signal === e.constructor || t.Param && t.Param === e.constructor || t.TimelineSignal && t.TimelineSignal === e.constructor ? (e._param.cancelScheduledValues(0), e._param.value = 0, e.overridden = !0) : e instanceof AudioParam && (e.cancelScheduledValues(0), e.value = 0), t.prototype.connect.call(this, e, i, n), this
                }, t.SignalBase
            }), t(function(t) {
                return t.WaveShaper = function(t, e) {
                    this._shaper = this.input = this.output = this.context.createWaveShaper(), this._curve = null, Array.isArray(t) ? this.curve = t : isFinite(t) || this.isUndef(t) ? this._curve = new Float32Array(this.defaultArg(t, 1024)) : this.isFunction(t) && (this._curve = new Float32Array(this.defaultArg(e, 1024)), this.setMap(t))
                }, t.extend(t.WaveShaper, t.SignalBase), t.WaveShaper.prototype.setMap = function(t) {
                    for (var e = 0, i = this._curve.length; e < i; e++) {
                        var n = e / (i - 1) * 2 - 1;
                        this._curve[e] = t(n, e)
                    }
                    return this._shaper.curve = this._curve, this
                }, Object.defineProperty(t.WaveShaper.prototype, "curve", {
                    get: function() {
                        return this._shaper.curve
                    },
                    set: function(t) {
                        this._curve = new Float32Array(t), this._shaper.curve = this._curve
                    }
                }), Object.defineProperty(t.WaveShaper.prototype, "oversample", {
                    get: function() {
                        return this._shaper.oversample
                    },
                    set: function(t) {
                        if (-1 === ["none", "2x", "4x"].indexOf(t)) throw new RangeError("Tone.WaveShaper: oversampling must be either 'none', '2x', or '4x'");
                        this._shaper.oversample = t
                    }
                }), t.WaveShaper.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._shaper.disconnect(), this._shaper = null, this._curve = null, this
                }, t.WaveShaper
            }), t(function(t) {
                return t.TimeBase = function(e, i) {
                    if (!(this instanceof t.TimeBase)) return new t.TimeBase(e, i);
                    if (this._expr = this._noOp, e instanceof t.TimeBase) this.copy(e);
                    else if (!this.isUndef(i) || this.isNumber(e)) {
                        i = this.defaultArg(i, this._defaultUnits);
                        var n = this._primaryExpressions[i].method;
                        this._expr = n.bind(this, e)
                    } else this.isString(e) ? this.set(e) : this.isUndef(e) && (this._expr = this._defaultExpr())
                }, t.extend(t.TimeBase), t.TimeBase.prototype.set = function(t) {
                    return this._expr = this._parseExprString(t), this
                }, t.TimeBase.prototype.clone = function() {
                    var t = new this.constructor;
                    return t.copy(this), t
                }, t.TimeBase.prototype.copy = function(t) {
                    var e = t._expr();
                    return this.set(e)
                }, t.TimeBase.prototype._primaryExpressions = {
                    n: {
                        regexp: /^(\d+)n/i,
                        method: function(t) {
                            return t = parseInt(t), 1 === t ? this._beatsToUnits(this._timeSignature()) : this._beatsToUnits(4 / t)
                        }
                    },
                    t: {
                        regexp: /^(\d+)t/i,
                        method: function(t) {
                            return t = parseInt(t), this._beatsToUnits(8 / (3 * parseInt(t)))
                        }
                    },
                    m: {
                        regexp: /^(\d+)m/i,
                        method: function(t) {
                            return this._beatsToUnits(parseInt(t) * this._timeSignature())
                        }
                    },
                    i: {
                        regexp: /^(\d+)i/i,
                        method: function(t) {
                            return this._ticksToUnits(parseInt(t))
                        }
                    },
                    hz: {
                        regexp: /^(\d+(?:\.\d+)?)hz/i,
                        method: function(t) {
                            return this._frequencyToUnits(parseFloat(t))
                        }
                    },
                    tr: {
                        regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
                        method: function(t, e, i) {
                            var n = 0;
                            return t && "0" !== t && (n += this._beatsToUnits(this._timeSignature() * parseFloat(t))), e && "0" !== e && (n += this._beatsToUnits(parseFloat(e))), i && "0" !== i && (n += this._beatsToUnits(parseFloat(i) / 4)), n
                        }
                    },
                    s: {
                        regexp: /^(\d+(?:\.\d+)?s)/,
                        method: function(t) {
                            return this._secondsToUnits(parseFloat(t))
                        }
                    },
                    samples: {
                        regexp: /^(\d+)samples/,
                        method: function(t) {
                            return parseInt(t) / this.context.sampleRate
                        }
                    },
                    default: {
                        regexp: /^(\d+(?:\.\d+)?)/,
                        method: function(t) {
                            return this._primaryExpressions[this._defaultUnits].method.call(this, t)
                        }
                    }
                }, t.TimeBase.prototype._binaryExpressions = {
                    "+": {
                        regexp: /^\+/,
                        precedence: 2,
                        method: function(t, e) {
                            return t() + e()
                        }
                    },
                    "-": {
                        regexp: /^\-/,
                        precedence: 2,
                        method: function(t, e) {
                            return t() - e()
                        }
                    },
                    "*": {
                        regexp: /^\*/,
                        precedence: 1,
                        method: function(t, e) {
                            return t() * e()
                        }
                    },
                    "/": {
                        regexp: /^\//,
                        precedence: 1,
                        method: function(t, e) {
                            return t() / e()
                        }
                    }
                }, t.TimeBase.prototype._unaryExpressions = {
                    neg: {
                        regexp: /^\-/,
                        method: function(t) {
                            return -t()
                        }
                    }
                }, t.TimeBase.prototype._syntaxGlue = {
                    "(": {
                        regexp: /^\(/
                    },
                    ")": {
                        regexp: /^\)/
                    }
                }, t.TimeBase.prototype._tokenize = function(t) {
                    for (var e = -1, i = []; t.length > 0;) {
                        t = t.trim();
                        var n = function(t, e) {
                            for (var i = ["_binaryExpressions", "_unaryExpressions", "_primaryExpressions", "_syntaxGlue"], n = 0; n < i.length; n++) {
                                var s = e[i[n]];
                                for (var r in s) {
                                    var o = s[r],
                                        a = o.regexp,
                                        l = t.match(a);
                                    if (null !== l) return {
                                        method: o.method,
                                        precedence: o.precedence,
                                        regexp: o.regexp,
                                        value: l[0]
                                    }
                                }
                            }
                            throw new SyntaxError("Tone.TimeBase: Unexpected token " + t)
                        }(t, this);
                        i.push(n), t = t.substr(n.value.length)
                    }
                    return {
                        next: function() {
                            return i[++e]
                        },
                        peek: function() {
                            return i[e + 1]
                        }
                    }
                }, t.TimeBase.prototype._matchGroup = function(t, e, i) {
                    if (!this.isUndef(t))
                        for (var n in e) {
                            var s = e[n];
                            if (s.regexp.test(t.value)) {
                                if (this.isUndef(i)) return s;
                                if (s.precedence === i) return s
                            }
                        }
                    return !1
                }, t.TimeBase.prototype._parseBinary = function(t, e) {
                    this.isUndef(e) && (e = 2);
                    var i;
                    i = e < 0 ? this._parseUnary(t) : this._parseBinary(t, e - 1);
                    for (var n = t.peek(); n && this._matchGroup(n, this._binaryExpressions, e);) n = t.next(), i = n.method.bind(this, i, this._parseBinary(t, e - 1)), n = t.peek();
                    return i
                }, t.TimeBase.prototype._parseUnary = function(t) {
                    var e, i;
                    e = t.peek();
                    var n = this._matchGroup(e, this._unaryExpressions);
                    return n ? (e = t.next(), i = this._parseUnary(t), n.method.bind(this, i)) : this._parsePrimary(t)
                }, t.TimeBase.prototype._parsePrimary = function(t) {
                    var e, i;
                    if (e = t.peek(), this.isUndef(e)) throw new SyntaxError("Tone.TimeBase: Unexpected end of expression");
                    if (this._matchGroup(e, this._primaryExpressions)) {
                        e = t.next();
                        var n = e.value.match(e.regexp);
                        return e.method.bind(this, n[1], n[2], n[3])
                    }
                    if (e && "(" === e.value) {
                        if (t.next(), i = this._parseBinary(t), !(e = t.next()) || ")" !== e.value) throw new SyntaxError("Expected )");
                        return i
                    }
                    throw new SyntaxError("Tone.TimeBase: Cannot process token " + e.value)
                }, t.TimeBase.prototype._parseExprString = function(t) {
                    this.isString(t) || (t = t.toString());
                    var e = this._tokenize(t);
                    return this._parseBinary(e)
                }, t.TimeBase.prototype._noOp = function() {
                    return 0
                }, t.TimeBase.prototype._defaultExpr = function() {
                    return this._noOp
                }, t.TimeBase.prototype._defaultUnits = "s", t.TimeBase.prototype._frequencyToUnits = function(t) {
                    return 1 / t
                }, t.TimeBase.prototype._beatsToUnits = function(e) {
                    return 60 / t.Transport.bpm.value * e
                }, t.TimeBase.prototype._secondsToUnits = function(t) {
                    return t
                }, t.TimeBase.prototype._ticksToUnits = function(e) {
                    return e * (this._beatsToUnits(1) / t.Transport.PPQ)
                }, t.TimeBase.prototype._timeSignature = function() {
                    return t.Transport.timeSignature
                }, t.TimeBase.prototype._pushExpr = function(e, i, n) {
                    return e instanceof t.TimeBase || (e = new this.constructor(e, n)), this._expr = this._binaryExpressions[i].method.bind(this, this._expr, e._expr), this
                }, t.TimeBase.prototype.add = function(t, e) {
                    return this._pushExpr(t, "+", e)
                }, t.TimeBase.prototype.sub = function(t, e) {
                    return this._pushExpr(t, "-", e)
                }, t.TimeBase.prototype.mult = function(t, e) {
                    return this._pushExpr(t, "*", e)
                }, t.TimeBase.prototype.div = function(t, e) {
                    return this._pushExpr(t, "/", e)
                }, t.TimeBase.prototype.valueOf = function() {
                    return this._expr()
                }, t.TimeBase.prototype.dispose = function() {
                    this._expr = null
                }, t.TimeBase
            }), t(function(t) {
                return t.Time = function(e, i) {
                    if (!(this instanceof t.Time)) return new t.Time(e, i);
                    this._plusNow = !1, t.TimeBase.call(this, e, i)
                }, t.extend(t.Time, t.TimeBase), t.Time.prototype._unaryExpressions = Object.create(t.TimeBase.prototype._unaryExpressions), t.Time.prototype._unaryExpressions.quantize = {
                    regexp: /^@/,
                    method: function(e) {
                        return t.Transport.nextSubdivision(e())
                    }
                }, t.Time.prototype._unaryExpressions.now = {
                    regexp: /^\+/,
                    method: function(t) {
                        return this._plusNow = !0, t()
                    }
                }, t.Time.prototype.quantize = function(t, e) {
                    return e = this.defaultArg(e, 1), this._expr = function(t, e, i) {
                        return t = t(), e = e.toSeconds(), t + (Math.round(t / e) * e - t) * i
                    }.bind(this, this._expr, new this.constructor(t), e), this
                }, t.Time.prototype.addNow = function() {
                    return this._plusNow = !0, this
                }, t.Time.prototype._defaultExpr = function() {
                    return this._plusNow = !0, this._noOp
                }, t.Time.prototype.copy = function(e) {
                    return t.TimeBase.prototype.copy.call(this, e), this._plusNow = e._plusNow, this
                }, t.Time.prototype.toNotation = function() {
                    var t = this.toSeconds(),
                        e = ["1m", "2n", "4n", "8n", "16n", "32n", "64n", "128n"],
                        i = this._toNotationHelper(t, e),
                        n = ["1m", "2n", "2t", "4n", "4t", "8n", "8t", "16n", "16t", "32n", "32t", "64n", "64t", "128n"],
                        s = this._toNotationHelper(t, n);
                    return s.split("+").length < i.split("+").length ? s : i
                }, t.Time.prototype._toNotationHelper = function(t, e) {
                    for (var i = this._notationToUnits(e[e.length - 1]), n = "", s = 0; s < e.length; s++) {
                        var r = this._notationToUnits(e[s]),
                            o = t / r;
                        if (1 - o % 1 < 1e-6 && (o += 1e-6), (o = Math.floor(o)) > 0) {
                            if (n += 1 === o ? e[s] : o.toString() + "*" + e[s], (t -= o * r) < i) break;
                            n += " + "
                        }
                    }
                    return "" === n && (n = "0"), n
                }, t.Time.prototype._notationToUnits = function(t) {
                    for (var e = this._primaryExpressions, i = [e.n, e.t, e.m], n = 0; n < i.length; n++) {
                        var s = i[n],
                            r = t.match(s.regexp);
                        if (r) return s.method.call(this, r[1])
                    }
                }, t.Time.prototype.toBarsBeatsSixteenths = function() {
                    var t = this._beatsToUnits(1),
                        e = this.toSeconds() / t,
                        i = Math.floor(e / this._timeSignature()),
                        n = e % 1 * 4;
                    return e = Math.floor(e) % this._timeSignature(), n = n.toString(), n.length > 3 && (n = parseFloat(n).toFixed(3)), [i, e, n].join(":")
                }, t.Time.prototype.toTicks = function() {
                    var e = this._beatsToUnits(1),
                        i = this.valueOf() / e;
                    return Math.floor(i * t.Transport.PPQ)
                }, t.Time.prototype.toSamples = function() {
                    return this.toSeconds() * this.context.sampleRate
                }, t.Time.prototype.toFrequency = function() {
                    return 1 / this.toSeconds()
                }, t.Time.prototype.toSeconds = function() {
                    return this.valueOf()
                }, t.Time.prototype.toMilliseconds = function() {
                    return 1e3 * this.toSeconds()
                }, t.Time.prototype.valueOf = function() {
                    return this._expr() + (this._plusNow ? this.now() : 0)
                }, t.Time
            }), t(function(t) {
                t.Frequency = function(e, i) {
                    if (!(this instanceof t.Frequency)) return new t.Frequency(e, i);
                    t.TimeBase.call(this, e, i)
                }, t.extend(t.Frequency, t.TimeBase), t.Frequency.prototype._primaryExpressions = Object.create(t.TimeBase.prototype._primaryExpressions), t.Frequency.prototype._primaryExpressions.midi = {
                    regexp: /^(\d+(?:\.\d+)?midi)/,
                    method: function(t) {
                        return this.midiToFrequency(t)
                    }
                }, t.Frequency.prototype._primaryExpressions.note = {
                    regexp: /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,
                    method: function(t, i) {
                        var n = e[t.toLowerCase()],
                            s = n + 12 * (parseInt(i) + 1);
                        return this.midiToFrequency(s)
                    }
                }, t.Frequency.prototype._primaryExpressions.tr = {
                    regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
                    method: function(t, e, i) {
                        var n = 1;
                        return t && "0" !== t && (n *= this._beatsToUnits(this._timeSignature() * parseFloat(t))), e && "0" !== e && (n *= this._beatsToUnits(parseFloat(e))), i && "0" !== i && (n *= this._beatsToUnits(parseFloat(i) / 4)), n
                    }
                }, t.Frequency.prototype.transpose = function(t) {
                    return this._expr = function(t, e) {
                        return t() * this.intervalToFrequencyRatio(e)
                    }.bind(this, this._expr, t), this
                }, t.Frequency.prototype.harmonize = function(t) {
                    return this._expr = function(t, e) {
                        for (var i = t(), n = [], s = 0; s < e.length; s++) n[s] = i * this.intervalToFrequencyRatio(e[s]);
                        return n
                    }.bind(this, this._expr, t), this
                }, t.Frequency.prototype.toMidi = function() {
                    return this.frequencyToMidi(this.valueOf())
                }, t.Frequency.prototype.toNote = function() {
                    var e = this.valueOf(),
                        n = Math.log(e / t.Frequency.A4) / Math.LN2,
                        s = Math.round(12 * n) + 57,
                        r = Math.floor(s / 12);
                    return r < 0 && (s += -12 * r), i[s % 12] + r.toString()
                }, t.Frequency.prototype.toSeconds = function() {
                    return 1 / this.valueOf()
                }, t.Frequency.prototype.toFrequency = function() {
                    return this.valueOf()
                }, t.Frequency.prototype.toTicks = function() {
                    var e = this._beatsToUnits(1),
                        i = this.valueOf() / e;
                    return Math.floor(i * t.Transport.PPQ)
                }, t.Frequency.prototype._frequencyToUnits = function(t) {
                    return t
                }, t.Frequency.prototype._ticksToUnits = function(e) {
                    return 1 / (60 * e / (t.Transport.bpm.value * t.Transport.PPQ))
                }, t.Frequency.prototype._beatsToUnits = function(e) {
                    return 1 / t.TimeBase.prototype._beatsToUnits.call(this, e)
                }, t.Frequency.prototype._secondsToUnits = function(t) {
                    return 1 / t
                }, t.Frequency.prototype._defaultUnits = "hz";
                var e = {
                        cbb: -2,
                        cb: -1,
                        c: 0,
                        "c#": 1,
                        cx: 2,
                        dbb: 0,
                        db: 1,
                        d: 2,
                        "d#": 3,
                        dx: 4,
                        ebb: 2,
                        eb: 3,
                        e: 4,
                        "e#": 5,
                        ex: 6,
                        fbb: 3,
                        fb: 4,
                        f: 5,
                        "f#": 6,
                        fx: 7,
                        gbb: 5,
                        gb: 6,
                        g: 7,
                        "g#": 8,
                        gx: 9,
                        abb: 7,
                        ab: 8,
                        a: 9,
                        "a#": 10,
                        ax: 11,
                        bbb: 9,
                        bb: 10,
                        b: 11,
                        "b#": 12,
                        bx: 13
                    },
                    i = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
                return t.Frequency.A4 = 440, t.Frequency.prototype.midiToFrequency = function(e) {
                    return t.Frequency.A4 * Math.pow(2, (e - 69) / 12)
                }, t.Frequency.prototype.frequencyToMidi = function(e) {
                    return 69 + 12 * Math.log(e / t.Frequency.A4) / Math.LN2
                }, t.Frequency
            }), t(function(t) {
                return t.TransportTime = function(e, i) {
                    if (!(this instanceof t.TransportTime)) return new t.TransportTime(e, i);
                    t.Time.call(this, e, i)
                }, t.extend(t.TransportTime, t.Time), t.TransportTime.prototype._unaryExpressions = Object.create(t.Time.prototype._unaryExpressions), t.TransportTime.prototype._unaryExpressions.quantize = {
                    regexp: /^@/,
                    method: function(e) {
                        var i = this._secondsToTicks(e()),
                            n = Math.ceil(t.Transport.ticks / i);
                        return this._ticksToUnits(n * i)
                    }
                }, t.TransportTime.prototype._secondsToTicks = function(e) {
                    var i = this._beatsToUnits(1),
                        n = e / i;
                    return Math.round(n * t.Transport.PPQ)
                }, t.TransportTime.prototype.valueOf = function() {
                    return this._secondsToTicks(this._expr()) + (this._plusNow ? t.Transport.ticks : 0)
                }, t.TransportTime.prototype.toTicks = function() {
                    return this.valueOf()
                }, t.TransportTime.prototype.toSeconds = function() {
                    return this._expr() + (this._plusNow ? t.Transport.seconds : 0)
                }, t.TransportTime.prototype.toFrequency = function() {
                    return 1 / this.toSeconds()
                }, t.TransportTime
            }), t(function(t) {
                return t.Emitter = function() {
                    this._events = {}
                }, t.extend(t.Emitter), t.Emitter.prototype.on = function(t, e) {
                    for (var i = t.split(/\W+/), n = 0; n < i.length; n++) {
                        var s = i[n];
                        this._events.hasOwnProperty(s) || (this._events[s] = []), this._events[s].push(e)
                    }
                    return this
                }, t.Emitter.prototype.off = function(e, i) {
                    for (var n = e.split(/\W+/), s = 0; s < n.length; s++)
                        if (e = n[s], this._events.hasOwnProperty(e))
                            if (t.prototype.isUndef(i)) this._events[e] = [];
                            else
                                for (var r = this._events[e], o = 0; o < r.length; o++) r[o] === i && r.splice(o, 1);
                    return this
                }, t.Emitter.prototype.emit = function(t) {
                    if (this._events) {
                        var e = Array.apply(null, arguments).slice(1);
                        if (this._events.hasOwnProperty(t))
                            for (var i = this._events[t], n = 0, s = i.length; n < s; n++) i[n].apply(this, e)
                    }
                    return this
                }, t.Emitter.mixin = function(e) {
                    var i = ["on", "off", "emit"];
                    e._events = {};
                    for (var n = 0; n < i.length; n++) {
                        var s = i[n],
                            r = t.Emitter.prototype[s];
                        e[s] = r
                    }
                }, t.Emitter.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._events = null, this
                }, t.Emitter
            }), t(function(t) {
                return !window.hasOwnProperty("AudioContext") && window.hasOwnProperty("webkitAudioContext") && (window.AudioContext = window.webkitAudioContext), t.Context = function(e) {
                    t.Emitter.call(this), e || (e = new window.AudioContext), this._context = e;
                    for (var i in this._context) this._defineProperty(this._context, i);
                    this._latencyHint = "interactive", this._lookAhead = .1, this._updateInterval = this._lookAhead / 3, this._computedUpdateInterval = 0, this._worker = this._createWorker(), this._constants = {}
                }, t.extend(t.Context, t.Emitter), t.Emitter.mixin(t.Context), t.Context.prototype._defineProperty = function(t, e) {
                    this.isUndef(this[e]) && Object.defineProperty(this, e, {
                        get: function() {
                            return "function" == typeof t[e] ? t[e].bind(t) : t[e]
                        },
                        set: function(i) {
                            t[e] = i
                        }
                    })
                }, t.Context.prototype.now = function() {
                    return this._context.currentTime
                }, t.Context.prototype._createWorker = function() {
                    window.URL = window.URL || window.webkitURL;
                    var t = new Blob(["var timeoutTime = " + (1e3 * this._updateInterval).toFixed(1) + ";self.onmessage = function(msg){\ttimeoutTime = parseInt(msg.data);};function tick(){\tsetTimeout(tick, timeoutTime);\tself.postMessage('tick');}tick();"]),
                        e = URL.createObjectURL(t),
                        i = new Worker(e);
                    return i.addEventListener("message", function() {
                        this.emit("tick")
                    }.bind(this)), i.addEventListener("message", function() {
                        var t = this.now();
                        if (this.isNumber(this._lastUpdate)) {
                            var e = t - this._lastUpdate;
                            this._computedUpdateInterval = Math.max(e, .97 * this._computedUpdateInterval)
                        }
                        this._lastUpdate = t
                    }.bind(this)), i
                }, t.Context.prototype.getConstant = function(t) {
                    if (this._constants[t]) return this._constants[t];
                    for (var e = this._context.createBuffer(1, 128, this._context.sampleRate), i = e.getChannelData(0), n = 0; n < i.length; n++) i[n] = t;
                    var s = this._context.createBufferSource();
                    return s.channelCount = 1, s.channelCountMode = "explicit", s.buffer = e, s.loop = !0, s.start(0), this._constants[t] = s, s
                }, Object.defineProperty(t.Context.prototype, "lag", {
                    get: function() {
                        var t = this._computedUpdateInterval - this._updateInterval;
                        return t = Math.max(t, 0)
                    }
                }), Object.defineProperty(t.Context.prototype, "lookAhead", {
                    get: function() {
                        return this._lookAhead
                    },
                    set: function(t) {
                        this._lookAhead = t
                    }
                }), Object.defineProperty(t.Context.prototype, "updateInterval", {
                    get: function() {
                        return this._updateInterval
                    },
                    set: function(e) {
                        this._updateInterval = Math.max(e, t.prototype.blockTime), this._worker.postMessage(Math.max(1e3 * e, 1))
                    }
                }), Object.defineProperty(t.Context.prototype, "latencyHint", {
                    get: function() {
                        return this._latencyHint
                    },
                    set: function(t) {
                        var e = t;
                        if (this._latencyHint = t, this.isString(t)) switch (t) {
                            case "interactive":
                                e = .1, this._context.latencyHint = t;
                                break;
                            case "playback":
                                e = .8, this._context.latencyHint = t;
                                break;
                            case "balanced":
                                e = .25, this._context.latencyHint = t;
                                break;
                            case "fastest":
                                e = .01
                        }
                        this.lookAhead = e, this.updateInterval = e / 3
                    }
                }), t.supported ? (! function() {
                    function e(e, i, s) {
                        if (e.input) Array.isArray(e.input) ? (t.prototype.isUndef(s) && (s = 0), this.connect(e.input[s])) : this.connect(e.input, i, s);
                        else try {
                            e instanceof AudioNode ? n.call(this, e, i, s) : n.call(this, e, i)
                        } catch (t) {
                            throw new Error("error connecting to node: " + e + "\n" + t)
                        }
                    }

                    function i(e, i, n) {
                        if (e && e.input && Array.isArray(e.input)) t.prototype.isUndef(n) && (n = 0), this.disconnect(e.input[n], i, n);
                        else if (e && e.input) this.disconnect(e.input, i, n);
                        else try {
                            s.apply(this, arguments)
                        } catch (t) {
                            throw new Error("error disconnecting node: " + e + "\n" + t)
                        }
                    }
                    var n = AudioNode.prototype.connect,
                        s = AudioNode.prototype.disconnect;
                    AudioNode.prototype.connect !== e && (AudioNode.prototype.connect = e, AudioNode.prototype.disconnect = i)
                }(), t.context = new t.Context) : console.warn("This browser does not support Tone.js"), t.Context
            }), t(function(t) {
                return t.Type = {
                    Default: "number",
                    Time: "time",
                    Frequency: "frequency",
                    TransportTime: "transportTime",
                    Ticks: "ticks",
                    NormalRange: "normalRange",
                    AudioRange: "audioRange",
                    Decibels: "db",
                    Interval: "interval",
                    BPM: "bpm",
                    Positive: "positive",
                    Cents: "cents",
                    Degrees: "degrees",
                    MIDI: "midi",
                    BarsBeatsSixteenths: "barsBeatsSixteenths",
                    Samples: "samples",
                    Hertz: "hertz",
                    Note: "note",
                    Milliseconds: "milliseconds",
                    Seconds: "seconds",
                    Notation: "notation"
                }, t.prototype.toSeconds = function(e) {
                    return this.isNumber(e) ? e : this.isUndef(e) ? this.now() : this.isString(e) ? new t.Time(e).toSeconds() : e instanceof t.TimeBase ? e.toSeconds() : void 0
                }, t.prototype.toFrequency = function(e) {
                    return this.isNumber(e) ? e : this.isString(e) || this.isUndef(e) ? new t.Frequency(e).valueOf() : e instanceof t.TimeBase ? e.toFrequency() : void 0
                }, t.prototype.toTicks = function(e) {
                    return this.isNumber(e) || this.isString(e) ? new t.TransportTime(e).toTicks() : this.isUndef(e) ? t.Transport.ticks : e instanceof t.TimeBase ? e.toTicks() : void 0
                }, t
            }), t(function(t) {
                return t.Param = function() {
                    var e = this.optionsObject(arguments, ["param", "units", "convert"], t.Param.defaults);
                    this._param = this.input = e.param, this.units = e.units, this.convert = e.convert, this.overridden = !1, this._lfo = null, this.isObject(e.lfo) ? this.value = e.lfo : this.isUndef(e.value) || (this.value = e.value)
                }, t.extend(t.Param), t.Param.defaults = {
                    units: t.Type.Default,
                    convert: !0,
                    param: void 0
                }, Object.defineProperty(t.Param.prototype, "value", {
                    get: function() {
                        return this._toUnits(this._param.value)
                    },
                    set: function(e) {
                        if (this.isObject(e)) {
                            if (this.isUndef(t.LFO)) throw new Error("Include 'Tone.LFO' to use an LFO as a Param value.");
                            this._lfo && this._lfo.dispose(), this._lfo = new t.LFO(e).start(), this._lfo.connect(this.input)
                        } else {
                            var i = this._fromUnits(e);
                            this._param.cancelScheduledValues(0), this._param.value = i
                        }
                    }
                }), t.Param.prototype._fromUnits = function(e) {
                    if (!this.convert && !this.isUndef(this.convert)) return e;
                    switch (this.units) {
                        case t.Type.Time:
                            return this.toSeconds(e);
                        case t.Type.Frequency:
                            return this.toFrequency(e);
                        case t.Type.Decibels:
                            return this.dbToGain(e);
                        case t.Type.NormalRange:
                            return Math.min(Math.max(e, 0), 1);
                        case t.Type.AudioRange:
                            return Math.min(Math.max(e, -1), 1);
                        case t.Type.Positive:
                            return Math.max(e, 0);
                        default:
                            return e
                    }
                }, t.Param.prototype._toUnits = function(e) {
                    if (!this.convert && !this.isUndef(this.convert)) return e;
                    switch (this.units) {
                        case t.Type.Decibels:
                            return this.gainToDb(e);
                        default:
                            return e
                    }
                }, t.Param.prototype._minOutput = 1e-5, t.Param.prototype.setValueAtTime = function(t, e) {
                    return t = this._fromUnits(t), e = this.toSeconds(e), e <= this.now() + this.blockTime ? this._param.value = t : this._param.setValueAtTime(t, e), this
                }, t.Param.prototype.setRampPoint = function(t) {
                    t = this.defaultArg(t, this.now());
                    var e = this._param.value;
                    return 0 === e && (e = this._minOutput), this._param.setValueAtTime(e, t), this
                }, t.Param.prototype.linearRampToValueAtTime = function(t, e) {
                    return t = this._fromUnits(t), this._param.linearRampToValueAtTime(t, this.toSeconds(e)), this
                }, t.Param.prototype.exponentialRampToValueAtTime = function(t, e) {
                    return t = this._fromUnits(t), t = Math.max(this._minOutput, t), this._param.exponentialRampToValueAtTime(t, this.toSeconds(e)), this
                }, t.Param.prototype.exponentialRampToValue = function(t, e, i) {
                    return i = this.toSeconds(i), this.setRampPoint(i), this.exponentialRampToValueAtTime(t, i + this.toSeconds(e)), this
                }, t.Param.prototype.linearRampToValue = function(t, e, i) {
                    return i = this.toSeconds(i), this.setRampPoint(i), this.linearRampToValueAtTime(t, i + this.toSeconds(e)), this
                }, t.Param.prototype.setTargetAtTime = function(t, e, i) {
                    return t = this._fromUnits(t), t = Math.max(this._minOutput, t), i = Math.max(this._minOutput, i), this._param.setTargetAtTime(t, this.toSeconds(e), i), this
                }, t.Param.prototype.setValueCurveAtTime = function(t, e, i) {
                    for (var n = 0; n < t.length; n++) t[n] = this._fromUnits(t[n]);
                    return this._param.setValueCurveAtTime(t, this.toSeconds(e), this.toSeconds(i)), this
                }, t.Param.prototype.cancelScheduledValues = function(t) {
                    return this._param.cancelScheduledValues(this.toSeconds(t)), this
                }, t.Param.prototype.rampTo = function(e, i, n) {
                    return i = this.defaultArg(i, 0), this.units === t.Type.Frequency || this.units === t.Type.BPM || this.units === t.Type.Decibels ? this.exponentialRampToValue(e, i, n) : this.linearRampToValue(e, i, n), this
                }, Object.defineProperty(t.Param.prototype, "lfo", {
                    get: function() {
                        return this._lfo
                    }
                }), t.Param.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._param = null, this._lfo && (this._lfo.dispose(), this._lfo = null), this
                }, t.Param
            }), t(function(t) {
                return window.GainNode && !AudioContext.prototype.createGain && (AudioContext.prototype.createGain = AudioContext.prototype.createGainNode), t.Gain = function() {
                    var e = this.optionsObject(arguments, ["gain", "units"], t.Gain.defaults);
                    this.input = this.output = this._gainNode = this.context.createGain(), this.gain = new t.Param({
                        param: this._gainNode.gain,
                        units: e.units,
                        value: e.gain,
                        convert: e.convert
                    }), this._readOnly("gain")
                }, t.extend(t.Gain), t.Gain.defaults = {
                    gain: 1,
                    convert: !0
                }, t.Gain.prototype.dispose = function() {
                    t.Param.prototype.dispose.call(this), this._gainNode.disconnect(), this._gainNode = null, this._writable("gain"), this.gain.dispose(), this.gain = null
                }, t.prototype.createInsOuts = function(e, i) {
                    1 === e ? this.input = new t.Gain : e > 1 && (this.input = new Array(e)), 1 === i ? this.output = new t.Gain : i > 1 && (this.output = new Array(e))
                }, t.Gain
            }), t(function(t) {
                return t.Signal = function() {
                    var e = this.optionsObject(arguments, ["value", "units"], t.Signal.defaults);
                    this.output = this._gain = this.context.createGain(), e.param = this._gain.gain, t.Param.call(this, e), this.input = this._param = this._gain.gain, this.context.getConstant(1).chain(this._gain)
                }, t.extend(t.Signal, t.Param), t.Signal.defaults = {
                    value: 0,
                    units: t.Type.Default,
                    convert: !0
                }, t.Signal.prototype.connect = t.SignalBase.prototype.connect, t.Signal.prototype.dispose = function() {
                    return t.Param.prototype.dispose.call(this), this._param = null, this._gain.disconnect(), this._gain = null, this
                }, t.Signal
            }), t(function(t) {
                return t.Timeline = function() {
                    var e = this.optionsObject(arguments, ["memory"], t.Timeline.defaults);
                    this._timeline = [], this._toRemove = [], this._iterating = !1, this.memory = e.memory
                }, t.extend(t.Timeline), t.Timeline.defaults = {
                    memory: 1 / 0
                }, Object.defineProperty(t.Timeline.prototype, "length", {
                    get: function() {
                        return this._timeline.length
                    }
                }), t.Timeline.prototype.add = function(t) {
                    if (this.isUndef(t.time)) throw new Error("Tone.Timeline: events must have a time attribute");
                    if (this._timeline.length) {
                        var e = this._search(t.time);
                        this._timeline.splice(e + 1, 0, t)
                    } else this._timeline.push(t);
                    if (this.length > this.memory) {
                        var i = this.length - this.memory;
                        this._timeline.splice(0, i)
                    }
                    return this
                }, t.Timeline.prototype.remove = function(t) {
                    if (this._iterating) this._toRemove.push(t);
                    else {
                        var e = this._timeline.indexOf(t); - 1 !== e && this._timeline.splice(e, 1)
                    }
                    return this
                }, t.Timeline.prototype.get = function(t) {
                    var e = this._search(t);
                    return -1 !== e ? this._timeline[e] : null
                }, t.Timeline.prototype.peek = function() {
                    return this._timeline[0]
                }, t.Timeline.prototype.shift = function() {
                    return this._timeline.shift()
                }, t.Timeline.prototype.getAfter = function(t) {
                    var e = this._search(t);
                    return e + 1 < this._timeline.length ? this._timeline[e + 1] : null
                }, t.Timeline.prototype.getBefore = function(t) {
                    var e = this._timeline.length;
                    if (e > 0 && this._timeline[e - 1].time < t) return this._timeline[e - 1];
                    var i = this._search(t);
                    return i - 1 >= 0 ? this._timeline[i - 1] : null
                }, t.Timeline.prototype.cancel = function(t) {
                    if (this._timeline.length > 1) {
                        var e = this._search(t);
                        if (e >= 0)
                            if (this._timeline[e].time === t) {
                                for (var i = e; i >= 0 && this._timeline[i].time === t; i--) e = i;
                                this._timeline = this._timeline.slice(0, e)
                            } else this._timeline = this._timeline.slice(0, e + 1);
                        else this._timeline = []
                    } else 1 === this._timeline.length && this._timeline[0].time >= t && (this._timeline = []);
                    return this
                }, t.Timeline.prototype.cancelBefore = function(t) {
                    if (this._timeline.length) {
                        var e = this._search(t);
                        e >= 0 && (this._timeline = this._timeline.slice(e + 1))
                    }
                    return this
                }, t.Timeline.prototype._search = function(t) {
                    var e = 0,
                        i = this._timeline.length,
                        n = i;
                    if (i > 0 && this._timeline[i - 1].time <= t) return i - 1;
                    for (; e < n;) {
                        var s = Math.floor(e + (n - e) / 2),
                            r = this._timeline[s],
                            o = this._timeline[s + 1];
                        if (r.time === t) {
                            for (var a = s; a < this._timeline.length; a++) {
                                this._timeline[a].time === t && (s = a)
                            }
                            return s
                        }
                        if (r.time < t && o.time > t) return s;
                        r.time > t ? n = s : r.time < t && (e = s + 1)
                    }
                    return -1
                }, t.Timeline.prototype._iterate = function(t, e, i) {
                    this._iterating = !0, e = this.defaultArg(e, 0), i = this.defaultArg(i, this._timeline.length - 1);
                    for (var n = e; n <= i; n++) t(this._timeline[n]);
                    if (this._iterating = !1, this._toRemove.length > 0) {
                        for (var s = 0; s < this._toRemove.length; s++) {
                            var r = this._timeline.indexOf(this._toRemove[s]); - 1 !== r && this._timeline.splice(r, 1)
                        }
                        this._toRemove = []
                    }
                }, t.Timeline.prototype.forEach = function(t) {
                    return this._iterate(t), this
                }, t.Timeline.prototype.forEachBefore = function(t, e) {
                    var i = this._search(t);
                    return -1 !== i && this._iterate(e, 0, i), this
                }, t.Timeline.prototype.forEachAfter = function(t, e) {
                    var i = this._search(t);
                    return this._iterate(e, i + 1), this
                }, t.Timeline.prototype.forEachFrom = function(t, e) {
                    for (var i = this._search(t); i >= 0 && this._timeline[i].time >= t;) i--;
                    return this._iterate(e, i + 1), this
                }, t.Timeline.prototype.forEachAtTime = function(t, e) {
                    var i = this._search(t);
                    return -1 !== i && this._iterate(function(i) {
                        i.time === t && e(i)
                    }, 0, i), this
                }, t.Timeline.prototype.dispose = function() {
                    t.prototype.dispose.call(this), this._timeline = null, this._toRemove = null
                }, t.Timeline
            }), t(function(t) {
                return t.TimelineSignal = function() {
                    var e = this.optionsObject(arguments, ["value", "units"], t.Signal.defaults);
                    this._events = new t.Timeline(10), t.Signal.apply(this, e), e.param = this._param, t.Param.call(this, e), this._initial = this._fromUnits(this._param.value)
                }, t.extend(t.TimelineSignal, t.Param), t.TimelineSignal.Type = {
                    Linear: "linear",
                    Exponential: "exponential",
                    Target: "target",
                    Curve: "curve",
                    Set: "set"
                }, Object.defineProperty(t.TimelineSignal.prototype, "value", {
                    get: function() {
                        var t = this.now(),
                            e = this.getValueAtTime(t);
                        return this._toUnits(e)
                    },
                    set: function(t) {
                        var e = this._fromUnits(t);
                        this._initial = e, this.cancelScheduledValues(), this._param.value = e
                    }
                }), t.TimelineSignal.prototype.setValueAtTime = function(e, i) {
                    return e = this._fromUnits(e), i = this.toSeconds(i), this._events.add({
                        type: t.TimelineSignal.Type.Set,
                        value: e,
                        time: i
                    }), this._param.setValueAtTime(e, i), this
                }, t.TimelineSignal.prototype.linearRampToValueAtTime = function(e, i) {
                    return e = this._fromUnits(e), i = this.toSeconds(i), this._events.add({
                        type: t.TimelineSignal.Type.Linear,
                        value: e,
                        time: i
                    }), this._param.linearRampToValueAtTime(e, i), this
                }, t.TimelineSignal.prototype.exponentialRampToValueAtTime = function(e, i) {
                    i = this.toSeconds(i);
                    var n = this._searchBefore(i);
                    n && 0 === n.value && this.setValueAtTime(this._minOutput, n.time), e = this._fromUnits(e);
                    var s = Math.max(e, this._minOutput);
                    return this._events.add({
                        type: t.TimelineSignal.Type.Exponential,
                        value: s,
                        time: i
                    }), e < this._minOutput ? (this._param.exponentialRampToValueAtTime(this._minOutput, i - this.sampleTime), this.setValueAtTime(0, i)) : this._param.exponentialRampToValueAtTime(e, i), this
                }, t.TimelineSignal.prototype.setTargetAtTime = function(e, i, n) {
                    return e = this._fromUnits(e), e = Math.max(this._minOutput, e), n = Math.max(this._minOutput, n), i = this.toSeconds(i), this._events.add({
                        type: t.TimelineSignal.Type.Target,
                        value: e,
                        time: i,
                        constant: n
                    }), this._param.setTargetAtTime(e, i, n), this
                }, t.TimelineSignal.prototype.setValueCurveAtTime = function(e, i, n, s) {
                    s = this.defaultArg(s, 1);
                    for (var r = new Array(e.length), o = 0; o < r.length; o++) r[o] = this._fromUnits(e[o]) * s;
                    i = this.toSeconds(i), n = this.toSeconds(n), this._events.add({
                        type: t.TimelineSignal.Type.Curve,
                        value: r,
                        time: i,
                        duration: n
                    }), this._param.setValueAtTime(r[0], i);
                    for (var a = 1; a < r.length; a++) {
                        var l = i + a / (r.length - 1) * n;
                        this._param.linearRampToValueAtTime(r[a], l)
                    }
                    return this
                }, t.TimelineSignal.prototype.cancelScheduledValues = function(t) {
                    return t = this.toSeconds(t), this._events.cancel(t), this._param.cancelScheduledValues(t), this
                }, t.TimelineSignal.prototype.setRampPoint = function(e) {
                    e = this.toSeconds(e);
                    var i = this._toUnits(this.getValueAtTime(e)),
                        n = this._searchBefore(e);
                    if (n && n.time === e) this.cancelScheduledValues(e + this.sampleTime);
                    else if (n && n.type === t.TimelineSignal.Type.Curve && n.time + n.duration > e) this.cancelScheduledValues(e), this.linearRampToValueAtTime(i, e);
                    else {
                        var s = this._searchAfter(e);
                        s && (this.cancelScheduledValues(e), s.type === t.TimelineSignal.Type.Linear ? this.linearRampToValueAtTime(i, e) : s.type === t.TimelineSignal.Type.Exponential && this.exponentialRampToValueAtTime(i, e)), this.setValueAtTime(i, e)
                    }
                    return this
                }, t.TimelineSignal.prototype.linearRampToValueBetween = function(t, e, i) {
                    return this.setRampPoint(e), this.linearRampToValueAtTime(t, i), this
                }, t.TimelineSignal.prototype.exponentialRampToValueBetween = function(t, e, i) {
                    return this.setRampPoint(e), this.exponentialRampToValueAtTime(t, i), this
                }, t.TimelineSignal.prototype._searchBefore = function(t) {
                    return this._events.get(t)
                }, t.TimelineSignal.prototype._searchAfter = function(t) {
                    return this._events.getAfter(t)
                }, t.TimelineSignal.prototype.getValueAtTime = function(e) {
                    e = this.toSeconds(e);
                    var i = this._searchAfter(e),
                        n = this._searchBefore(e),
                        s = this._initial;
                    if (null === n) s = this._initial;
                    else if (n.type === t.TimelineSignal.Type.Target) {
                        var r, o = this._events.getBefore(n.time);
                        r = null === o ? this._initial : o.value, s = this._exponentialApproach(n.time, r, n.value, n.constant, e)
                    } else s = n.type === t.TimelineSignal.Type.Curve ? this._curveInterpolate(n.time, n.value, n.duration, e) : null === i ? n.value : i.type === t.TimelineSignal.Type.Linear ? this._linearInterpolate(n.time, n.value, i.time, i.value, e) : i.type === t.TimelineSignal.Type.Exponential ? this._exponentialInterpolate(n.time, n.value, i.time, i.value, e) : n.value;
                    return s
                }, t.TimelineSignal.prototype.connect = t.SignalBase.prototype.connect, t.TimelineSignal.prototype._exponentialApproach = function(t, e, i, n, s) {
                    return i + (e - i) * Math.exp(-(s - t) / n)
                }, t.TimelineSignal.prototype._linearInterpolate = function(t, e, i, n, s) {
                    return e + (s - t) / (i - t) * (n - e)
                }, t.TimelineSignal.prototype._exponentialInterpolate = function(t, e, i, n, s) {
                    return (e = Math.max(this._minOutput, e)) * Math.pow(n / e, (s - t) / (i - t))
                }, t.TimelineSignal.prototype._curveInterpolate = function(t, e, i, n) {
                    var s = e.length;
                    if (n >= t + i) return e[s - 1];
                    if (n <= t) return e[0];
                    var r = (n - t) / i,
                        o = Math.floor((s - 1) * r),
                        a = Math.ceil((s - 1) * r),
                        l = e[o],
                        h = e[a];
                    return a === o ? l : this._linearInterpolate(o, l, a, h, r * (s - 1))
                }, t.TimelineSignal.prototype.dispose = function() {
                    t.Signal.prototype.dispose.call(this), t.Param.prototype.dispose.call(this), this._events.dispose(), this._events = null
                }, t.TimelineSignal
            }), t(function(t) {
                return t.Pow = function(e) {
                    this._exp = this.defaultArg(e, 1), this._expScaler = this.input = this.output = new t.WaveShaper(this._expFunc(this._exp), 8192)
                }, t.extend(t.Pow, t.SignalBase), Object.defineProperty(t.Pow.prototype, "value", {
                    get: function() {
                        return this._exp
                    },
                    set: function(t) {
                        this._exp = t, this._expScaler.setMap(this._expFunc(this._exp))
                    }
                }), t.Pow.prototype._expFunc = function(t) {
                    return function(e) {
                        return Math.pow(Math.abs(e), t)
                    }
                }, t.Pow.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._expScaler.dispose(), this._expScaler = null, this
                }, t.Pow
            }), t(function(t) {
                return t.Envelope = function() {
                        var e = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], t.Envelope.defaults);
                        this.attack = e.attack, this.decay = e.decay, this.sustain = e.sustain, this.release = e.release, this._attackCurve = "linear", this._releaseCurve = "exponential", this._sig = this.output = new t.TimelineSignal, this._sig.setValueAtTime(0, 0), this.attackCurve = e.attackCurve, this.releaseCurve = e.releaseCurve
                    }, t.extend(t.Envelope), t.Envelope.defaults = {
                        attack: .01,
                        decay: .1,
                        sustain: .5,
                        release: 1,
                        attackCurve: "linear",
                        releaseCurve: "exponential"
                    }, Object.defineProperty(t.Envelope.prototype, "value", {
                        get: function() {
                            return this.getValueAtTime(this.now())
                        }
                    }), Object.defineProperty(t.Envelope.prototype, "attackCurve", {
                        get: function() {
                            if (this.isString(this._attackCurve)) return this._attackCurve;
                            if (this.isArray(this._attackCurve)) {
                                for (var e in t.Envelope.Type)
                                    if (t.Envelope.Type[e].In === this._attackCurve) return e;
                                return this._attackCurve
                            }
                        },
                        set: function(e) {
                            if (t.Envelope.Type.hasOwnProperty(e)) {
                                var i = t.Envelope.Type[e];
                                this.isObject(i) ? this._attackCurve = i.In : this._attackCurve = i
                            } else {
                                if (!this.isArray(e)) throw new Error("Tone.Envelope: invalid curve: " + e);
                                this._attackCurve = e
                            }
                        }
                    }), Object.defineProperty(t.Envelope.prototype, "releaseCurve", {
                        get: function() {
                            if (this.isString(this._releaseCurve)) return this._releaseCurve;
                            if (this.isArray(this._releaseCurve)) {
                                for (var e in t.Envelope.Type)
                                    if (t.Envelope.Type[e].Out === this._releaseCurve) return e;
                                return this._releaseCurve
                            }
                        },
                        set: function(e) {
                            if (t.Envelope.Type.hasOwnProperty(e)) {
                                var i = t.Envelope.Type[e];
                                this.isObject(i) ? this._releaseCurve = i.Out : this._releaseCurve = i
                            } else {
                                if (!this.isArray(e)) throw new Error("Tone.Envelope: invalid curve: " + e);
                                this._releaseCurve = e
                            }
                        }
                    }), t.Envelope.prototype.triggerAttack = function(t, e) {
                        t = this.toSeconds(t);
                        var i = this.toSeconds(this.attack),
                            n = i,
                            s = this.toSeconds(this.decay);
                        e = this.defaultArg(e, 1);
                        var r = this.getValueAtTime(t);
                        if (r > 0) {
                            n = (1 - r) / (1 / n)
                        }
                        if ("linear" === this._attackCurve) this._sig.linearRampToValue(e, n, t);
                        else if ("exponential" === this._attackCurve) this._sig.exponentialRampToValue(e, n, t);
                        else if (n > 0) {
                            this._sig.setRampPoint(t);
                            var o = this._attackCurve;
                            if (n < i) {
                                var a = 1 - n / i,
                                    l = Math.floor(a * this._attackCurve.length);
                                o = this._attackCurve.slice(l), o[0] = r
                            }
                            this._sig.setValueCurveAtTime(o, t, n, e)
                        }
                        return this._sig.exponentialRampToValue(e * this.sustain, s, n + t), this
                    }, t.Envelope.prototype.triggerRelease = function(t) {
                        t = this.toSeconds(t);
                        var e = this.getValueAtTime(t);
                        if (e > 0) {
                            var i = this.toSeconds(this.release);
                            if ("linear" === this._releaseCurve) this._sig.linearRampToValue(0, i, t);
                            else if ("exponential" === this._releaseCurve) this._sig.exponentialRampToValue(0, i, t);
                            else {
                                var n = this._releaseCurve;
                                this.isArray(n) && (this._sig.setRampPoint(t), this._sig.setValueCurveAtTime(n, t, i, e))
                            }
                        }
                        return this
                    }, t.Envelope.prototype.getValueAtTime = function(t) {
                        return this._sig.getValueAtTime(t)
                    }, t.Envelope.prototype.triggerAttackRelease = function(t, e, i) {
                        return e = this.toSeconds(e), this.triggerAttack(e, i), this.triggerRelease(e + this.toSeconds(t)), this
                    }, t.Envelope.prototype.cancel = function(t) {
                        return this._sig.cancelScheduledValues(t), this
                    }, t.Envelope.prototype.connect = t.Signal.prototype.connect,
                    function() {
                        function e(t) {
                            for (var e = new Array(t.length), i = 0; i < t.length; i++) e[i] = 1 - t[i];
                            return e
                        }
                        var i, n, s = [];
                        for (i = 0; i < 128; i++) s[i] = Math.sin(i / 127 * (Math.PI / 2));
                        var r = [];
                        for (i = 0; i < 127; i++) {
                            n = i / 127;
                            var o = Math.sin(n * (2 * Math.PI) * 6.4 - Math.PI / 2) + 1;
                            r[i] = o / 10 + .83 * n
                        }
                        r[127] = 1;
                        var a = [];
                        for (i = 0; i < 128; i++) a[i] = Math.ceil(i / 127 * 5) / 5;
                        var l = [];
                        for (i = 0; i < 128; i++) n = i / 127, l[i] = .5 * (1 - Math.cos(Math.PI * n));
                        var h = [];
                        for (i = 0; i < 128; i++) {
                            n = i / 127;
                            var u = 4 * Math.pow(n, 3) + .2,
                                c = Math.cos(u * Math.PI * 2 * n);
                            h[i] = Math.abs(c * (1 - n))
                        }
                        t.Envelope.Type = {
                            linear: "linear",
                            exponential: "exponential",
                            bounce: {
                                In: e(h),
                                Out: h
                            },
                            cosine: {
                                In: s,
                                Out: function(t) {
                                    return t.slice(0).reverse()
                                }(s)
                            },
                            step: {
                                In: a,
                                Out: e(a)
                            },
                            ripple: {
                                In: r,
                                Out: e(r)
                            },
                            sine: {
                                In: l,
                                Out: e(l)
                            }
                        }
                    }(), t.Envelope.prototype.dispose = function() {
                        return t.prototype.dispose.call(this), this._sig.dispose(), this._sig = null, this._attackCurve = null, this._releaseCurve = null, this
                    }, t.Envelope
            }), t(function(t) {
                return t.AmplitudeEnvelope = function() {
                    t.Envelope.apply(this, arguments), this.input = this.output = new t.Gain, this._sig.connect(this.output.gain)
                }, t.extend(t.AmplitudeEnvelope, t.Envelope), t.AmplitudeEnvelope.prototype.dispose = function() {
                    return this.input.dispose(), this.input = null, t.Envelope.prototype.dispose.call(this), this
                }, t.AmplitudeEnvelope
            }), t(function(t) {
                return window.AnalyserNode && !AnalyserNode.prototype.getFloatTimeDomainData && (AnalyserNode.prototype.getFloatTimeDomainData = function(t) {
                    var e = new Uint8Array(t.length);
                    this.getByteTimeDomainData(e);
                    for (var i = 0; i < e.length; i++) t[i] = (e[i] - 128) / 128
                }), t.Analyser = function() {
                    var e = this.optionsObject(arguments, ["type", "size"], t.Analyser.defaults);
                    this._analyser = this.input = this.output = this.context.createAnalyser(), this._type = e.type, this._returnType = e.returnType, this._buffer = null, this.size = e.size, this.type = e.type, this.returnType = e.returnType, this.minDecibels = e.minDecibels, this.maxDecibels = e.maxDecibels
                }, t.extend(t.Analyser), t.Analyser.defaults = {
                    size: 1024,
                    returnType: "byte",
                    type: "fft",
                    smoothing: .8,
                    maxDecibels: -30,
                    minDecibels: -100
                }, t.Analyser.Type = {
                    Waveform: "waveform",
                    FFT: "fft"
                }, t.Analyser.ReturnType = {
                    Byte: "byte",
                    Float: "float"
                }, t.Analyser.prototype.analyse = function() {
                    return this._type === t.Analyser.Type.FFT ? this._returnType === t.Analyser.ReturnType.Byte ? this._analyser.getByteFrequencyData(this._buffer) : this._analyser.getFloatFrequencyData(this._buffer) : this._type === t.Analyser.Type.Waveform && (this._returnType === t.Analyser.ReturnType.Byte ? this._analyser.getByteTimeDomainData(this._buffer) : this._analyser.getFloatTimeDomainData(this._buffer)), this._buffer
                }, Object.defineProperty(t.Analyser.prototype, "size", {
                    get: function() {
                        return this._analyser.frequencyBinCount
                    },
                    set: function(t) {
                        this._analyser.fftSize = 2 * t, this.type = this._type
                    }
                }), Object.defineProperty(t.Analyser.prototype, "returnType", {
                    get: function() {
                        return this._returnType
                    },
                    set: function(e) {
                        if (e === t.Analyser.ReturnType.Byte) this._buffer = new Uint8Array(this._analyser.frequencyBinCount);
                        else {
                            if (e !== t.Analyser.ReturnType.Float) throw new TypeError("Tone.Analayser: invalid return type: " + e);
                            this._buffer = new Float32Array(this._analyser.frequencyBinCount)
                        }
                        this._returnType = e
                    }
                }), Object.defineProperty(t.Analyser.prototype, "type", {
                    get: function() {
                        return this._type
                    },
                    set: function(e) {
                        if (e !== t.Analyser.Type.Waveform && e !== t.Analyser.Type.FFT) throw new TypeError("Tone.Analyser: invalid type: " + e);
                        this._type = e
                    }
                }), Object.defineProperty(t.Analyser.prototype, "smoothing", {
                    get: function() {
                        return this._analyser.smoothingTimeConstant
                    },
                    set: function(t) {
                        this._analyser.smoothingTimeConstant = t
                    }
                }), Object.defineProperty(t.Analyser.prototype, "minDecibels", {
                    get: function() {
                        return this._analyser.minDecibels
                    },
                    set: function(t) {
                        this._analyser.minDecibels = t
                    }
                }), Object.defineProperty(t.Analyser.prototype, "maxDecibels", {
                    get: function() {
                        return this._analyser.maxDecibels
                    },
                    set: function(t) {
                        this._analyser.maxDecibels = t
                    }
                }), t.Analyser.prototype.dispose = function() {
                    t.prototype.dispose.call(this), this._analyser.disconnect(), this._analyser = null, this._buffer = null
                }, t.Analyser
            }), t(function(t) {
                return t.Compressor = function() {
                    var e = this.optionsObject(arguments, ["threshold", "ratio"], t.Compressor.defaults);
                    this._compressor = this.input = this.output = this.context.createDynamicsCompressor(), this.threshold = new t.Param({
                        param: this._compressor.threshold,
                        units: t.Type.Decibels,
                        convert: !1
                    }), this.attack = new t.Param(this._compressor.attack, t.Type.Time), this.release = new t.Param(this._compressor.release, t.Type.Time), this.knee = new t.Param({
                        param: this._compressor.knee,
                        units: t.Type.Decibels,
                        convert: !1
                    }), this.ratio = new t.Param({
                        param: this._compressor.ratio,
                        convert: !1
                    }), this._readOnly(["knee", "release", "attack", "ratio", "threshold"]), this.set(e)
                }, t.extend(t.Compressor), t.Compressor.defaults = {
                    ratio: 12,
                    threshold: -24,
                    release: .25,
                    attack: .003,
                    knee: 30
                }, t.Compressor.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["knee", "release", "attack", "ratio", "threshold"]), this._compressor.disconnect(), this._compressor = null, this.attack.dispose(), this.attack = null, this.release.dispose(), this.release = null, this.threshold.dispose(), this.threshold = null, this.ratio.dispose(), this.ratio = null, this.knee.dispose(), this.knee = null, this
                }, t.Compressor
            }), t(function(t) {
                return t.Add = function(e) {
                    this.createInsOuts(2, 0), this._sum = this.input[0] = this.input[1] = this.output = new t.Gain, this._param = this.input[1] = new t.Signal(e), this._param.connect(this._sum)
                }, t.extend(t.Add, t.Signal), t.Add.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._sum.dispose(), this._sum = null, this._param.dispose(), this._param = null, this
                }, t.Add
            }), t(function(t) {
                return t.Multiply = function(e) {
                    this.createInsOuts(2, 0), this._mult = this.input[0] = this.output = new t.Gain, this._param = this.input[1] = this.output.gain, this._param.value = this.defaultArg(e, 0)
                }, t.extend(t.Multiply, t.Signal), t.Multiply.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._mult.dispose(), this._mult = null, this._param = null, this
                }, t.Multiply
            }), t(function(t) {
                return t.Negate = function() {
                    this._multiply = this.input = this.output = new t.Multiply(-1)
                }, t.extend(t.Negate, t.SignalBase), t.Negate.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._multiply.dispose(), this._multiply = null, this
                }, t.Negate
            }), t(function(t) {
                return t.Subtract = function(e) {
                    this.createInsOuts(2, 0), this._sum = this.input[0] = this.output = new t.Gain, this._neg = new t.Negate, this._param = this.input[1] = new t.Signal(e), this._param.chain(this._neg, this._sum)
                }, t.extend(t.Subtract, t.Signal), t.Subtract.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._neg.dispose(), this._neg = null, this._sum.disconnect(), this._sum = null, this._param.dispose(), this._param = null, this
                }, t.Subtract
            }), t(function(t) {
                return t.GreaterThanZero = function() {
                    this._thresh = this.output = new t.WaveShaper(function(t) {
                        return t <= 0 ? 0 : 1
                    }, 127), this._scale = this.input = new t.Multiply(1e4), this._scale.connect(this._thresh)
                }, t.extend(t.GreaterThanZero, t.SignalBase), t.GreaterThanZero.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._scale.dispose(), this._scale = null, this._thresh.dispose(), this._thresh = null, this
                }, t.GreaterThanZero
            }), t(function(t) {
                return t.GreaterThan = function(e) {
                    this.createInsOuts(2, 0), this._param = this.input[0] = new t.Subtract(e), this.input[1] = this._param.input[1], this._gtz = this.output = new t.GreaterThanZero, this._param.connect(this._gtz)
                }, t.extend(t.GreaterThan, t.Signal), t.GreaterThan.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._param.dispose(), this._param = null, this._gtz.dispose(), this._gtz = null, this
                }, t.GreaterThan
            }), t(function(t) {
                return t.Abs = function() {
                    this._abs = this.input = this.output = new t.WaveShaper(function(t) {
                        return 0 === t ? 0 : Math.abs(t)
                    }, 127)
                }, t.extend(t.Abs, t.SignalBase), t.Abs.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._abs.dispose(), this._abs = null, this
                }, t.Abs
            }), t(function(t) {
                return t.Modulo = function(e) {
                    this.createInsOuts(1, 0), this._shaper = new t.WaveShaper(Math.pow(2, 16)), this._multiply = new t.Multiply, this._subtract = this.output = new t.Subtract, this._modSignal = new t.Signal(e), this.input.fan(this._shaper, this._subtract), this._modSignal.connect(this._multiply, 0, 0), this._shaper.connect(this._multiply, 0, 1), this._multiply.connect(this._subtract, 0, 1), this._setWaveShaper(e)
                }, t.extend(t.Modulo, t.SignalBase), t.Modulo.prototype._setWaveShaper = function(t) {
                    this._shaper.setMap(function(e) {
                        return Math.floor((e + 1e-4) / t)
                    })
                }, Object.defineProperty(t.Modulo.prototype, "value", {
                    get: function() {
                        return this._modSignal.value
                    },
                    set: function(t) {
                        this._modSignal.value = t, this._setWaveShaper(t)
                    }
                }), t.Modulo.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._shaper.dispose(), this._shaper = null, this._multiply.dispose(), this._multiply = null, this._subtract.dispose(), this._subtract = null, this._modSignal.dispose(), this._modSignal = null, this
                }, t.Modulo
            }), t(function(t) {
                return t.AudioToGain = function() {
                    this._norm = this.input = this.output = new t.WaveShaper(function(t) {
                        return (t + 1) / 2
                    })
                }, t.extend(t.AudioToGain, t.SignalBase), t.AudioToGain.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._norm.dispose(), this._norm = null, this
                }, t.AudioToGain
            }), t(function(t) {
                function e(t, e, i) {
                    var n = new t;
                    return i._eval(e[0]).connect(n, 0, 0), i._eval(e[1]).connect(n, 0, 1), n
                }

                function i(t, e, i) {
                    var n = new t;
                    return i._eval(e[0]).connect(n, 0, 0), n
                }

                function n(t) {
                    return t ? parseFloat(t) : void 0
                }

                function s(t) {
                    return t && t.args ? parseFloat(t.args) : void 0
                }
                return t.Expr = function() {
                    var t = this._replacements(Array.prototype.slice.call(arguments)),
                        e = this._parseInputs(t);
                    this._nodes = [], this.input = new Array(e);
                    for (var i = 0; i < e; i++) this.input[i] = this.context.createGain();
                    var n, s = this._parseTree(t);
                    try {
                        n = this._eval(s)
                    } catch (e) {
                        throw this._disposeNodes(), new Error("Tone.Expr: Could evaluate expression: " + t)
                    }
                    this.output = n
                }, t.extend(t.Expr, t.SignalBase), t.Expr._Expressions = {
                    value: {
                        signal: {
                            regexp: /^\d+\.\d+|^\d+/,
                            method: function(e) {
                                return new t.Signal(n(e))
                            }
                        },
                        input: {
                            regexp: /^\$\d/,
                            method: function(t, e) {
                                return e.input[n(t.substr(1))]
                            }
                        }
                    },
                    glue: {
                        "(": {
                            regexp: /^\(/
                        },
                        ")": {
                            regexp: /^\)/
                        },
                        ",": {
                            regexp: /^,/
                        }
                    },
                    func: {
                        abs: {
                            regexp: /^abs/,
                            method: i.bind(this, t.Abs)
                        },
                        mod: {
                            regexp: /^mod/,
                            method: function(e, i) {
                                var n = s(e[1]),
                                    r = new t.Modulo(n);
                                return i._eval(e[0]).connect(r), r
                            }
                        },
                        pow: {
                            regexp: /^pow/,
                            method: function(e, i) {
                                var n = s(e[1]),
                                    r = new t.Pow(n);
                                return i._eval(e[0]).connect(r), r
                            }
                        },
                        a2g: {
                            regexp: /^a2g/,
                            method: function(e, i) {
                                var n = new t.AudioToGain;
                                return i._eval(e[0]).connect(n), n
                            }
                        }
                    },
                    binary: {
                        "+": {
                            regexp: /^\+/,
                            precedence: 1,
                            method: e.bind(this, t.Add)
                        },
                        "-": {
                            regexp: /^\-/,
                            precedence: 1,
                            method: function(n, s) {
                                return 1 === n.length ? i(t.Negate, n, s) : e(t.Subtract, n, s)
                            }
                        },
                        "*": {
                            regexp: /^\*/,
                            precedence: 0,
                            method: e.bind(this, t.Multiply)
                        }
                    },
                    unary: {
                        "-": {
                            regexp: /^\-/,
                            method: i.bind(this, t.Negate)
                        },
                        "!": {
                            regexp: /^\!/,
                            method: i.bind(this, t.NOT)
                        }
                    }
                }, t.Expr.prototype._parseInputs = function(t) {
                    var e = t.match(/\$\d/g),
                        i = 0;
                    if (null !== e)
                        for (var n = 0; n < e.length; n++) {
                            var s = parseInt(e[n].substr(1)) + 1;
                            i = Math.max(i, s)
                        }
                    return i
                }, t.Expr.prototype._replacements = function(t) {
                    for (var e = t.shift(), i = 0; i < t.length; i++) e = e.replace(/\%/i, t[i]);
                    return e
                }, t.Expr.prototype._tokenize = function(e) {
                    for (var i = -1, n = []; e.length > 0;) {
                        e = e.trim();
                        var s = function(e) {
                            for (var i in t.Expr._Expressions) {
                                var n = t.Expr._Expressions[i];
                                for (var s in n) {
                                    var r = n[s],
                                        o = r.regexp,
                                        a = e.match(o);
                                    if (null !== a) return {
                                        type: i,
                                        value: a[0],
                                        method: r.method
                                    }
                                }
                            }
                            throw new SyntaxError("Tone.Expr: Unexpected token " + e)
                        }(e);
                        n.push(s), e = e.substr(s.value.length)
                    }
                    return {
                        next: function() {
                            return n[++i]
                        },
                        peek: function() {
                            return n[i + 1]
                        }
                    }
                }, t.Expr.prototype._parseTree = function(e) {
                    function i(t, e) {
                        return !u(t) && "glue" === t.type && t.value === e
                    }

                    function n(e, i, n) {
                        var s = t.Expr._Expressions[i];
                        if (!u(e))
                            for (var r in s) {
                                var o = s[r];
                                if (o.regexp.test(e.value)) {
                                    if (u(n)) return !0;
                                    if (o.precedence === n) return !0
                                }
                            }
                        return !1
                    }

                    function s(t) {
                        u(t) && (t = 5);
                        var e;
                        e = t < 0 ? r() : s(t - 1);
                        for (var i = h.peek(); n(i, "binary", t);) i = h.next(), e = {
                            operator: i.value,
                            method: i.method,
                            args: [e, s(t - 1)]
                        }, i = h.peek();
                        return e
                    }

                    function r() {
                        var t, e;
                        return t = h.peek(), n(t, "unary") ? (t = h.next(), e = r(), {
                            operator: t.value,
                            method: t.method,
                            args: [e]
                        }) : o()
                    }

                    function o() {
                        var t, e;
                        if (t = h.peek(), u(t)) throw new SyntaxError("Tone.Expr: Unexpected termination of expression");
                        if ("func" === t.type) return t = h.next(), a(t);
                        if ("value" === t.type) return t = h.next(), {
                            method: t.method,
                            args: t.value
                        };
                        if (i(t, "(")) {
                            if (h.next(), e = s(), t = h.next(), !i(t, ")")) throw new SyntaxError("Expected )");
                            return e
                        }
                        throw new SyntaxError("Tone.Expr: Parse error, cannot process token " + t.value)
                    }

                    function a(t) {
                        var e, n = [];
                        if (e = h.next(), !i(e, "(")) throw new SyntaxError('Tone.Expr: Expected ( in a function call "' + t.value + '"');
                        if (e = h.peek(), i(e, ")") || (n = l()), e = h.next(), !i(e, ")")) throw new SyntaxError('Tone.Expr: Expected ) in a function call "' + t.value + '"');
                        return {
                            method: t.method,
                            args: n,
                            name: name
                        }
                    }

                    function l() {
                        for (var t, e, n = [];;) {
                            if (e = s(), u(e)) break;
                            if (n.push(e), t = h.peek(), !i(t, ",")) break;
                            h.next()
                        }
                        return n
                    }
                    var h = this._tokenize(e),
                        u = this.isUndef.bind(this);
                    return s()
                }, t.Expr.prototype._eval = function(t) {
                    if (!this.isUndef(t)) {
                        var e = t.method(t.args, this);
                        return this._nodes.push(e), e
                    }
                }, t.Expr.prototype._disposeNodes = function() {
                    for (var t = 0; t < this._nodes.length; t++) {
                        var e = this._nodes[t];
                        this.isFunction(e.dispose) ? e.dispose() : this.isFunction(e.disconnect) && e.disconnect(), e = null, this._nodes[t] = null
                    }
                    this._nodes = null
                }, t.Expr.prototype.dispose = function() {
                    t.prototype.dispose.call(this), this._disposeNodes()
                }, t.Expr
            }), t(function(t) {
                return t.EqualPowerGain = function() {
                    this._eqPower = this.input = this.output = new t.WaveShaper(function(t) {
                        return Math.abs(t) < .001 ? 0 : this.equalPowerScale(t)
                    }.bind(this), 4096)
                }, t.extend(t.EqualPowerGain, t.SignalBase), t.EqualPowerGain.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._eqPower.dispose(), this._eqPower = null, this
                }, t.EqualPowerGain
            }), t(function(t) {
                return t.CrossFade = function(e) {
                    this.createInsOuts(2, 1), this.a = this.input[0] = new t.Gain, this.b = this.input[1] = new t.Gain, this.fade = new t.Signal(this.defaultArg(e, .5), t.Type.NormalRange), this._equalPowerA = new t.EqualPowerGain, this._equalPowerB = new t.EqualPowerGain, this._invert = new t.Expr("1 - $0"), this.a.connect(this.output), this.b.connect(this.output), this.fade.chain(this._equalPowerB, this.b.gain), this.fade.chain(this._invert, this._equalPowerA, this.a.gain), this._readOnly("fade")
                }, t.extend(t.CrossFade), t.CrossFade.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable("fade"), this._equalPowerA.dispose(), this._equalPowerA = null, this._equalPowerB.dispose(), this._equalPowerB = null, this.fade.dispose(), this.fade = null, this._invert.dispose(), this._invert = null, this.a.dispose(), this.a = null, this.b.dispose(), this.b = null, this
                }, t.CrossFade
            }), t(function(t) {
                return t.Filter = function() {
                    this.createInsOuts(1, 1);
                    var e = this.optionsObject(arguments, ["frequency", "type", "rolloff"], t.Filter.defaults);
                    this._filters = [], this.frequency = new t.Signal(e.frequency, t.Type.Frequency), this.detune = new t.Signal(0, t.Type.Cents), this.gain = new t.Signal({
                        value: e.gain,
                        convert: !1
                    }), this.Q = new t.Signal(e.Q), this._type = e.type, this._rolloff = e.rolloff, this.rolloff = e.rolloff, this._readOnly(["detune", "frequency", "gain", "Q"])
                }, t.extend(t.Filter), t.Filter.defaults = {
                    type: "lowpass",
                    frequency: 350,
                    rolloff: -12,
                    Q: 1,
                    gain: 0
                }, Object.defineProperty(t.Filter.prototype, "type", {
                    get: function() {
                        return this._type
                    },
                    set: function(t) {
                        if (-1 === ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"].indexOf(t)) throw new TypeError("Tone.Filter: invalid type " + t);
                        this._type = t;
                        for (var e = 0; e < this._filters.length; e++) this._filters[e].type = t
                    }
                }), Object.defineProperty(t.Filter.prototype, "rolloff", {
                    get: function() {
                        return this._rolloff
                    },
                    set: function(t) {
                        t = parseInt(t, 10);
                        var e = [-12, -24, -48, -96],
                            i = e.indexOf(t);
                        if (-1 === i) throw new RangeError("Tone.Filter: rolloff can only be -12, -24, -48 or -96");
                        i += 1, this._rolloff = t, this.input.disconnect();
                        for (var n = 0; n < this._filters.length; n++) this._filters[n].disconnect(), this._filters[n] = null;
                        this._filters = new Array(i);
                        for (var s = 0; s < i; s++) {
                            var r = this.context.createBiquadFilter();
                            r.type = this._type, this.frequency.connect(r.frequency), this.detune.connect(r.detune), this.Q.connect(r.Q), this.gain.connect(r.gain), this._filters[s] = r
                        }
                        var o = [this.input].concat(this._filters).concat([this.output]);
                        this.connectSeries.apply(this, o)
                    }
                }), t.Filter.prototype.dispose = function() {
                    t.prototype.dispose.call(this);
                    for (var e = 0; e < this._filters.length; e++) this._filters[e].disconnect(), this._filters[e] = null;
                    return this._filters = null, this._writable(["detune", "frequency", "gain", "Q"]), this.frequency.dispose(), this.Q.dispose(), this.frequency = null, this.Q = null, this.detune.dispose(), this.detune = null, this.gain.dispose(), this.gain = null, this
                }, t.Filter
            }), t(function(t) {
                return t.MultibandSplit = function() {
                    var e = this.optionsObject(arguments, ["lowFrequency", "highFrequency"], t.MultibandSplit.defaults);
                    this.input = new t.Gain, this.output = new Array(3), this.low = this.output[0] = new t.Filter(0, "lowpass"), this._lowMidFilter = new t.Filter(0, "highpass"), this.mid = this.output[1] = new t.Filter(0, "lowpass"), this.high = this.output[2] = new t.Filter(0, "highpass"), this.lowFrequency = new t.Signal(e.lowFrequency, t.Type.Frequency), this.highFrequency = new t.Signal(e.highFrequency, t.Type.Frequency), this.Q = new t.Signal(e.Q), this.input.fan(this.low, this.high), this.input.chain(this._lowMidFilter, this.mid), this.lowFrequency.connect(this.low.frequency), this.lowFrequency.connect(this._lowMidFilter.frequency), this.highFrequency.connect(this.mid.frequency), this.highFrequency.connect(this.high.frequency), this.Q.connect(this.low.Q), this.Q.connect(this._lowMidFilter.Q), this.Q.connect(this.mid.Q), this.Q.connect(this.high.Q), this._readOnly(["high", "mid", "low", "highFrequency", "lowFrequency"])
                }, t.extend(t.MultibandSplit), t.MultibandSplit.defaults = {
                    lowFrequency: 400,
                    highFrequency: 2500,
                    Q: 1
                }, t.MultibandSplit.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["high", "mid", "low", "highFrequency", "lowFrequency"]), this.low.dispose(), this.low = null, this._lowMidFilter.dispose(), this._lowMidFilter = null, this.mid.dispose(), this.mid = null, this.high.dispose(), this.high = null, this.lowFrequency.dispose(), this.lowFrequency = null, this.highFrequency.dispose(), this.highFrequency = null, this.Q.dispose(), this.Q = null, this
                }, t.MultibandSplit
            }), t(function(t) {
                return t.EQ3 = function() {
                    var e = this.optionsObject(arguments, ["low", "mid", "high"], t.EQ3.defaults);
                    this.output = new t.Gain, this._multibandSplit = this.input = new t.MultibandSplit({
                        lowFrequency: e.lowFrequency,
                        highFrequency: e.highFrequency
                    }), this._lowGain = new t.Gain(e.low, t.Type.Decibels), this._midGain = new t.Gain(e.mid, t.Type.Decibels), this._highGain = new t.Gain(e.high, t.Type.Decibels), this.low = this._lowGain.gain, this.mid = this._midGain.gain, this.high = this._highGain.gain, this.Q = this._multibandSplit.Q, this.lowFrequency = this._multibandSplit.lowFrequency, this.highFrequency = this._multibandSplit.highFrequency, this._multibandSplit.low.chain(this._lowGain, this.output), this._multibandSplit.mid.chain(this._midGain, this.output), this._multibandSplit.high.chain(this._highGain, this.output), this._readOnly(["low", "mid", "high", "lowFrequency", "highFrequency"])
                }, t.extend(t.EQ3), t.EQ3.defaults = {
                    low: 0,
                    mid: 0,
                    high: 0,
                    lowFrequency: 400,
                    highFrequency: 2500
                }, t.EQ3.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["low", "mid", "high", "lowFrequency", "highFrequency"]), this._multibandSplit.dispose(), this._multibandSplit = null, this.lowFrequency = null, this.highFrequency = null, this._lowGain.dispose(), this._lowGain = null, this._midGain.dispose(), this._midGain = null, this._highGain.dispose(), this._highGain = null, this.low = null, this.mid = null, this.high = null, this.Q = null, this
                }, t.EQ3
            }), t(function(t) {
                return t.Scale = function(e, i) {
                    this._outputMin = this.defaultArg(e, 0), this._outputMax = this.defaultArg(i, 1), this._scale = this.input = new t.Multiply(1), this._add = this.output = new t.Add(0), this._scale.connect(this._add), this._setRange()
                }, t.extend(t.Scale, t.SignalBase), Object.defineProperty(t.Scale.prototype, "min", {
                    get: function() {
                        return this._outputMin
                    },
                    set: function(t) {
                        this._outputMin = t, this._setRange()
                    }
                }), Object.defineProperty(t.Scale.prototype, "max", {
                    get: function() {
                        return this._outputMax
                    },
                    set: function(t) {
                        this._outputMax = t, this._setRange()
                    }
                }), t.Scale.prototype._setRange = function() {
                    this._add.value = this._outputMin, this._scale.value = this._outputMax - this._outputMin
                }, t.Scale.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._add.dispose(), this._add = null, this._scale.dispose(), this._scale = null, this
                }, t.Scale
            }), t(function(t) {
                return t.ScaleExp = function(e, i, n) {
                    this._scale = this.output = new t.Scale(e, i), this._exp = this.input = new t.Pow(this.defaultArg(n, 2)), this._exp.connect(this._scale)
                }, t.extend(t.ScaleExp, t.SignalBase), Object.defineProperty(t.ScaleExp.prototype, "exponent", {
                    get: function() {
                        return this._exp.value
                    },
                    set: function(t) {
                        this._exp.value = t
                    }
                }), Object.defineProperty(t.ScaleExp.prototype, "min", {
                    get: function() {
                        return this._scale.min
                    },
                    set: function(t) {
                        this._scale.min = t
                    }
                }), Object.defineProperty(t.ScaleExp.prototype, "max", {
                    get: function() {
                        return this._scale.max
                    },
                    set: function(t) {
                        this._scale.max = t
                    }
                }), t.ScaleExp.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._scale.dispose(), this._scale = null, this._exp.dispose(), this._exp = null, this
                }, t.ScaleExp
            }), t(function(t) {
                return window.DelayNode && !AudioContext.prototype.createDelay && (AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode), t.Delay = function() {
                    var e = this.optionsObject(arguments, ["delayTime", "maxDelay"], t.Delay.defaults);
                    this._delayNode = this.input = this.output = this.context.createDelay(this.toSeconds(e.maxDelay)), this.delayTime = new t.Param({
                        param: this._delayNode.delayTime,
                        units: t.Type.Time,
                        value: e.delayTime
                    }), this._readOnly("delayTime")
                }, t.extend(t.Delay), t.Delay.defaults = {
                    maxDelay: 1,
                    delayTime: 0
                }, t.Delay.prototype.dispose = function() {
                    return t.Param.prototype.dispose.call(this), this._delayNode.disconnect(), this._delayNode = null, this._writable("delayTime"), this.delayTime = null, this
                }, t.Delay
            }), t(function(t) {
                return t.FeedbackCombFilter = function() {
                    var e = this.optionsObject(arguments, ["delayTime", "resonance"], t.FeedbackCombFilter.defaults);
                    this._delay = this.input = this.output = new t.Delay(e.delayTime), this.delayTime = this._delay.delayTime, this._feedback = new t.Gain(e.resonance, t.Type.NormalRange), this.resonance = this._feedback.gain, this._delay.chain(this._feedback, this._delay), this._readOnly(["resonance", "delayTime"])
                }, t.extend(t.FeedbackCombFilter), t.FeedbackCombFilter.defaults = {
                    delayTime: .1,
                    resonance: .5
                }, t.FeedbackCombFilter.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["resonance", "delayTime"]), this._delay.dispose(), this._delay = null, this.delayTime = null, this._feedback.dispose(), this._feedback = null, this.resonance = null, this
                }, t.FeedbackCombFilter
            }), t(function(t) {
                return t.Follower = function() {
                    this.createInsOuts(1, 1);
                    var e = this.optionsObject(arguments, ["attack", "release"], t.Follower.defaults);
                    this._abs = new t.Abs, this._filter = this.context.createBiquadFilter(), this._filter.type = "lowpass", this._filter.frequency.value = 0, this._filter.Q.value = -100, this._frequencyValues = new t.WaveShaper, this._sub = new t.Subtract, this._delay = new t.Delay(this.blockTime), this._mult = new t.Multiply(1e4), this._attack = e.attack, this._release = e.release, this.input.chain(this._abs, this._filter, this.output), this._abs.connect(this._sub, 0, 1), this._filter.chain(this._delay, this._sub), this._sub.chain(this._mult, this._frequencyValues, this._filter.frequency), this._setAttackRelease(this._attack, this._release)
                }, t.extend(t.Follower), t.Follower.defaults = {
                    attack: .05,
                    release: .5
                }, t.Follower.prototype._setAttackRelease = function(e, i) {
                    var n = this.blockTime;
                    e = t.Time(e).toFrequency(), i = t.Time(i).toFrequency(), e = Math.max(e, n), i = Math.max(i, n), this._frequencyValues.setMap(function(t) {
                        return t <= 0 ? e : i
                    })
                }, Object.defineProperty(t.Follower.prototype, "attack", {
                    get: function() {
                        return this._attack
                    },
                    set: function(t) {
                        this._attack = t, this._setAttackRelease(this._attack, this._release)
                    }
                }), Object.defineProperty(t.Follower.prototype, "release", {
                    get: function() {
                        return this._release
                    },
                    set: function(t) {
                        this._release = t, this._setAttackRelease(this._attack, this._release)
                    }
                }), t.Follower.prototype.connect = t.Signal.prototype.connect, t.Follower.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._filter.disconnect(), this._filter = null, this._frequencyValues.disconnect(), this._frequencyValues = null, this._delay.dispose(), this._delay = null, this._sub.disconnect(), this._sub = null, this._abs.dispose(), this._abs = null, this._mult.dispose(), this._mult = null, this._curve = null, this
                }, t.Follower
            }), t(function(t) {
                return t.ScaledEnvelope = function() {
                    var e = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], t.Envelope.defaults);
                    t.Envelope.call(this, e), e = this.defaultArg(e, t.ScaledEnvelope.defaults), this._exp = this.output = new t.Pow(e.exponent), this._scale = this.output = new t.Scale(e.min, e.max), this._sig.chain(this._exp, this._scale)
                }, t.extend(t.ScaledEnvelope, t.Envelope), t.ScaledEnvelope.defaults = {
                    min: 0,
                    max: 1,
                    exponent: 1
                }, Object.defineProperty(t.ScaledEnvelope.prototype, "min", {
                    get: function() {
                        return this._scale.min
                    },
                    set: function(t) {
                        this._scale.min = t
                    }
                }), Object.defineProperty(t.ScaledEnvelope.prototype, "max", {
                    get: function() {
                        return this._scale.max
                    },
                    set: function(t) {
                        this._scale.max = t
                    }
                }), Object.defineProperty(t.ScaledEnvelope.prototype, "exponent", {
                    get: function() {
                        return this._exp.value
                    },
                    set: function(t) {
                        this._exp.value = t
                    }
                }), t.ScaledEnvelope.prototype.dispose = function() {
                    return t.Envelope.prototype.dispose.call(this), this._scale.dispose(), this._scale = null, this._exp.dispose(), this._exp = null, this
                }, t.ScaledEnvelope
            }), t(function(t) {
                return t.FrequencyEnvelope = function() {
                    var e = this.optionsObject(arguments, ["attack", "decay", "sustain", "release"], t.Envelope.defaults);
                    t.ScaledEnvelope.call(this, e), e = this.defaultArg(e, t.FrequencyEnvelope.defaults), this._octaves = e.octaves, this.baseFrequency = e.baseFrequency, this.octaves = e.octaves
                }, t.extend(t.FrequencyEnvelope, t.Envelope), t.FrequencyEnvelope.defaults = {
                    baseFrequency: 200,
                    octaves: 4,
                    exponent: 2
                }, Object.defineProperty(t.FrequencyEnvelope.prototype, "baseFrequency", {
                    get: function() {
                        return this._scale.min
                    },
                    set: function(t) {
                        this._scale.min = this.toFrequency(t), this.octaves = this._octaves
                    }
                }), Object.defineProperty(t.FrequencyEnvelope.prototype, "octaves", {
                    get: function() {
                        return this._octaves
                    },
                    set: function(t) {
                        this._octaves = t, this._scale.max = this.baseFrequency * Math.pow(2, t)
                    }
                }), Object.defineProperty(t.FrequencyEnvelope.prototype, "exponent", {
                    get: function() {
                        return this._exp.value
                    },
                    set: function(t) {
                        this._exp.value = t
                    }
                }), t.FrequencyEnvelope.prototype.dispose = function() {
                    return t.ScaledEnvelope.prototype.dispose.call(this), this
                }, t.FrequencyEnvelope
            }), t(function(t) {
                return t.Gate = function() {
                    this.createInsOuts(1, 1);
                    var e = this.optionsObject(arguments, ["threshold", "attack", "release"], t.Gate.defaults);
                    this._follower = new t.Follower(e.attack, e.release), this._gt = new t.GreaterThan(this.dbToGain(e.threshold)), this.input.connect(this.output), this.input.chain(this._gt, this._follower, this.output.gain)
                }, t.extend(t.Gate), t.Gate.defaults = {
                    attack: .1,
                    release: .1,
                    threshold: -40
                }, Object.defineProperty(t.Gate.prototype, "threshold", {
                    get: function() {
                        return this.gainToDb(this._gt.value)
                    },
                    set: function(t) {
                        this._gt.value = this.dbToGain(t)
                    }
                }), Object.defineProperty(t.Gate.prototype, "attack", {
                    get: function() {
                        return this._follower.attack
                    },
                    set: function(t) {
                        this._follower.attack = t
                    }
                }), Object.defineProperty(t.Gate.prototype, "release", {
                    get: function() {
                        return this._follower.release
                    },
                    set: function(t) {
                        this._follower.release = t
                    }
                }), t.Gate.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._follower.dispose(), this._gt.dispose(), this._follower = null, this._gt = null, this
                }, t.Gate
            }), t(function(t) {
                return t.TimelineState = function(e) {
                    t.Timeline.call(this), this._initial = e
                }, t.extend(t.TimelineState, t.Timeline), t.TimelineState.prototype.getValueAtTime = function(t) {
                    var e = this.get(t);
                    return null !== e ? e.state : this._initial
                }, t.TimelineState.prototype.setStateAtTime = function(t, e) {
                    this.add({
                        state: t,
                        time: e
                    })
                }, t.TimelineState
            }), t(function(t) {
                return t.Clock = function() {
                    t.Emitter.call(this);
                    var e = this.optionsObject(arguments, ["callback", "frequency"], t.Clock.defaults);
                    this.callback = e.callback, this._nextTick = 0, this._lastState = t.State.Stopped, this.frequency = new t.TimelineSignal(e.frequency, t.Type.Frequency), this._readOnly("frequency"), this.ticks = 0, this._state = new t.TimelineState(t.State.Stopped), this._boundLoop = this._loop.bind(this), this.context.on("tick", this._boundLoop)
                }, t.extend(t.Clock, t.Emitter), t.Clock.defaults = {
                    callback: t.noOp,
                    frequency: 1,
                    lookAhead: "auto"
                }, Object.defineProperty(t.Clock.prototype, "state", {
                    get: function() {
                        return this._state.getValueAtTime(this.now())
                    }
                }), t.Clock.prototype.start = function(e, i) {
                    return e = this.toSeconds(e), this._state.getValueAtTime(e) !== t.State.Started && this._state.add({
                        state: t.State.Started,
                        time: e,
                        offset: i
                    }), this
                }, t.Clock.prototype.stop = function(e) {
                    return e = this.toSeconds(e), this._state.cancel(e), this._state.setStateAtTime(t.State.Stopped, e), this
                }, t.Clock.prototype.pause = function(e) {
                    return e = this.toSeconds(e), this._state.getValueAtTime(e) === t.State.Started && this._state.setStateAtTime(t.State.Paused, e), this
                }, t.Clock.prototype._loop = function() {
                    for (var e = this.now(), i = this.context.lookAhead, n = this.context.updateInterval, s = 2 * this.context.lag, r = e + i + n + s; r > this._nextTick && this._state;) {
                        var o = this._state.getValueAtTime(this._nextTick);
                        if (o !== this._lastState) {
                            this._lastState = o;
                            var a = this._state.get(this._nextTick);
                            o === t.State.Started ? (this._nextTick = a.time, this.isUndef(a.offset) || (this.ticks = a.offset), this.emit("start", a.time, this.ticks)) : o === t.State.Stopped ? (this.ticks = 0, this.emit("stop", a.time)) : o === t.State.Paused && this.emit("pause", a.time)
                        }
                        var l = this._nextTick;
                        this.frequency && (this._nextTick += 1 / this.frequency.getValueAtTime(this._nextTick), o === t.State.Started && (this.callback(l), this.ticks++))
                    }
                }, t.Clock.prototype.getStateAtTime = function(t) {
                    return t = this.toSeconds(t), this._state.getValueAtTime(t)
                }, t.Clock.prototype.dispose = function() {
                    t.Emitter.prototype.dispose.call(this), this.context.off("tick", this._boundLoop), this._writable("frequency"), this.frequency.dispose(), this.frequency = null, this._boundLoop = null, this._nextTick = 1 / 0, this.callback = null, this._state.dispose(), this._state = null
                }, t.Clock
            }), t(function(t) {
                t.IntervalTimeline = function() {
                    this._root = null, this._length = 0
                }, t.extend(t.IntervalTimeline), t.IntervalTimeline.prototype.add = function(t) {
                    if (this.isUndef(t.time) || this.isUndef(t.duration)) throw new Error("Tone.IntervalTimeline: events must have time and duration parameters");
                    var i = new e(t.time, t.time + t.duration, t);
                    for (null === this._root ? this._root = i : this._root.insert(i), this._length++; null !== i;) i.updateHeight(), i.updateMax(), this._rebalance(i), i = i.parent;
                    return this
                }, t.IntervalTimeline.prototype.remove = function(t) {
                    if (null !== this._root) {
                        var e = [];
                        this._root.search(t.time, e);
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i];
                            if (n.event === t) {
                                this._removeNode(n), this._length--;
                                break
                            }
                        }
                    }
                    return this
                }, Object.defineProperty(t.IntervalTimeline.prototype, "length", {
                    get: function() {
                        return this._length
                    }
                }), t.IntervalTimeline.prototype.cancel = function(t) {
                    return this.forEachAfter(t, function(t) {
                        this.remove(t)
                    }.bind(this)), this
                }, t.IntervalTimeline.prototype._setRoot = function(t) {
                    this._root = t, null !== this._root && (this._root.parent = null)
                }, t.IntervalTimeline.prototype._replaceNodeInParent = function(t, e) {
                    null !== t.parent ? (t.isLeftChild() ? t.parent.left = e : t.parent.right = e, this._rebalance(t.parent)) : this._setRoot(e)
                }, t.IntervalTimeline.prototype._removeNode = function(t) {
                    if (null === t.left && null === t.right) this._replaceNodeInParent(t, null);
                    else if (null === t.right) this._replaceNodeInParent(t, t.left);
                    else if (null === t.left) this._replaceNodeInParent(t, t.right);
                    else {
                        var e, i, n = t.getBalance();
                        if (n > 0)
                            if (null === t.left.right) e = t.left, e.right = t.right, i = e;
                            else {
                                for (e = t.left.right; null !== e.right;) e = e.right;
                                e.parent.right = e.left, i = e.parent, e.left = t.left, e.right = t.right
                            }
                        else if (null === t.right.left) e = t.right, e.left = t.left, i = e;
                        else {
                            for (e = t.right.left; null !== e.left;) e = e.left;
                            e.parent = e.parent, e.parent.left = e.right, i = e.parent, e.left = t.left, e.right = t.right
                        }
                        null !== t.parent ? t.isLeftChild() ? t.parent.left = e : t.parent.right = e : this._setRoot(e), this._rebalance(i)
                    }
                    t.dispose()
                }, t.IntervalTimeline.prototype._rotateLeft = function(t) {
                    var e = t.parent,
                        i = t.isLeftChild(),
                        n = t.right;
                    t.right = n.left, n.left = t, null !== e ? i ? e.left = n : e.right = n : this._setRoot(n)
                }, t.IntervalTimeline.prototype._rotateRight = function(t) {
                    var e = t.parent,
                        i = t.isLeftChild(),
                        n = t.left;
                    t.left = n.right, n.right = t, null !== e ? i ? e.left = n : e.right = n : this._setRoot(n)
                }, t.IntervalTimeline.prototype._rebalance = function(t) {
                    var e = t.getBalance();
                    e > 1 ? t.left.getBalance() < 0 ? this._rotateLeft(t.left) : this._rotateRight(t) : e < -1 && (t.right.getBalance() > 0 ? this._rotateRight(t.right) : this._rotateLeft(t))
                }, t.IntervalTimeline.prototype.get = function(t) {
                    if (null !== this._root) {
                        var e = [];
                        if (this._root.search(t, e), e.length > 0) {
                            for (var i = e[0], n = 1; n < e.length; n++) e[n].low > i.low && (i = e[n]);
                            return i.event
                        }
                    }
                    return null
                }, t.IntervalTimeline.prototype.forEach = function(t) {
                    if (null !== this._root) {
                        var e = [];
                        null !== this._root && this._root.traverse(function(t) {
                            e.push(t)
                        });
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i].event;
                            n && t(n)
                        }
                    }
                    return this
                }, t.IntervalTimeline.prototype.forEachAtTime = function(t, e) {
                    if (null !== this._root) {
                        var i = [];
                        this._root.search(t, i);
                        for (var n = i.length - 1; n >= 0; n--) {
                            var s = i[n].event;
                            s && e(s)
                        }
                    }
                    return this
                }, t.IntervalTimeline.prototype.forEachAfter = function(t, e) {
                    if (null !== this._root) {
                        var i = [];
                        this._root.searchAfter(t, i);
                        for (var n = i.length - 1; n >= 0; n--) {
                            var s = i[n].event;
                            s && e(s)
                        }
                    }
                    return this
                }, t.IntervalTimeline.prototype.dispose = function() {
                    var t = [];
                    null !== this._root && this._root.traverse(function(e) {
                        t.push(e)
                    });
                    for (var e = 0; e < t.length; e++) t[e].dispose();
                    return t = null, this._root = null, this
                };
                var e = function(t, e, i) {
                    this.event = i, this.low = t, this.high = e, this.max = this.high, this._left = null, this._right = null, this.parent = null, this.height = 0
                };
                return e.prototype.insert = function(t) {
                    t.low <= this.low ? null === this.left ? this.left = t : this.left.insert(t) : null === this.right ? this.right = t : this.right.insert(t)
                }, e.prototype.search = function(t, e) {
                    t > this.max || (null !== this.left && this.left.search(t, e), this.low <= t && this.high > t && e.push(this), this.low > t || null !== this.right && this.right.search(t, e))
                }, e.prototype.searchAfter = function(t, e) {
                    this.low >= t && (e.push(this), null !== this.left && this.left.searchAfter(t, e)), null !== this.right && this.right.searchAfter(t, e)
                }, e.prototype.traverse = function(t) {
                    t(this), null !== this.left && this.left.traverse(t), null !== this.right && this.right.traverse(t)
                }, e.prototype.updateHeight = function() {
                    null !== this.left && null !== this.right ? this.height = Math.max(this.left.height, this.right.height) + 1 : null !== this.right ? this.height = this.right.height + 1 : null !== this.left ? this.height = this.left.height + 1 : this.height = 0
                }, e.prototype.updateMax = function() {
                    this.max = this.high, null !== this.left && (this.max = Math.max(this.max, this.left.max)), null !== this.right && (this.max = Math.max(this.max, this.right.max))
                }, e.prototype.getBalance = function() {
                    var t = 0;
                    return null !== this.left && null !== this.right ? t = this.left.height - this.right.height : null !== this.left ? t = this.left.height + 1 : null !== this.right && (t = -(this.right.height + 1)), t
                }, e.prototype.isLeftChild = function() {
                    return null !== this.parent && this.parent.left === this
                }, Object.defineProperty(e.prototype, "left", {
                    get: function() {
                        return this._left
                    },
                    set: function(t) {
                        this._left = t, null !== t && (t.parent = this), this.updateHeight(), this.updateMax()
                    }
                }), Object.defineProperty(e.prototype, "right", {
                    get: function() {
                        return this._right
                    },
                    set: function(t) {
                        this._right = t, null !== t && (t.parent = this), this.updateHeight(), this.updateMax()
                    }
                }), e.prototype.dispose = function() {
                    this.parent = null, this._left = null, this._right = null, this.event = null
                }, t.IntervalTimeline
            }), t(function(t) {
                t.Transport = function() {
                    t.Emitter.call(this), this.loop = !1, this._loopStart = 0, this._loopEnd = 0, this._ppq = e.defaults.PPQ, this._clock = new t.Clock({
                        callback: this._processTick.bind(this),
                        frequency: 0
                    }), this._bindClockEvents(), this.bpm = this._clock.frequency, this.bpm._toUnits = this._toUnits.bind(this), this.bpm._fromUnits = this._fromUnits.bind(this), this.bpm.units = t.Type.BPM, this.bpm.value = e.defaults.bpm, this._readOnly("bpm"), this._timeSignature = e.defaults.timeSignature, this._scheduledEvents = {}, this._eventID = 0, this._timeline = new t.Timeline, this._repeatedEvents = new t.IntervalTimeline, this._onceEvents = new t.Timeline, this._syncedSignals = [], this._swingTicks = e.defaults.PPQ / 2, this._swingAmount = 0
                }, t.extend(t.Transport, t.Emitter), t.Transport.defaults = {
                    bpm: 120,
                    swing: 0,
                    swingSubdivision: "8n",
                    timeSignature: 4,
                    loopStart: 0,
                    loopEnd: "4m",
                    PPQ: 192
                }, t.Transport.prototype._processTick = function(e) {
                    var i = this._clock.ticks;
                    if (this._swingAmount > 0 && i % this._ppq != 0 && i % (2 * this._swingTicks) != 0) {
                        var n = i % (2 * this._swingTicks) / (2 * this._swingTicks),
                            s = Math.sin(n * Math.PI) * this._swingAmount;
                        e += t.Time(2 * this._swingTicks / 3, "i") * s
                    }
                    this.loop && i === this._loopEnd && (this.emit("loopEnd", e), this._clock.ticks = this._loopStart, i = this._loopStart, this.emit("loopStart", e, this.seconds), this.emit("loop", e)), this._onceEvents.forEachBefore(i, function(t) {
                        t.callback(e), delete this._scheduledEvents[t.id.toString()]
                    }.bind(this)), this._onceEvents.cancelBefore(i), this._timeline.forEachAtTime(i, function(t) {
                        t.callback(e)
                    }), this._repeatedEvents.forEachAtTime(i, function(t) {
                        (i - t.time) % t.interval == 0 && t.callback(e)
                    })
                }, t.Transport.prototype.schedule = function(t, e) {
                    var i = {
                            time: this.toTicks(e),
                            callback: t
                        },
                        n = this._eventID++;
                    return this._scheduledEvents[n.toString()] = {
                        event: i,
                        timeline: this._timeline
                    }, this._timeline.add(i), n
                }, t.Transport.prototype.scheduleRepeat = function(t, e, i, n) {
                    if (e <= 0) throw new Error("Tone.Transport: repeat events must have an interval larger than 0");
                    var s = {
                            time: this.toTicks(i),
                            duration: this.toTicks(this.defaultArg(n, 1 / 0)),
                            interval: this.toTicks(e),
                            callback: t
                        },
                        r = this._eventID++;
                    return this._scheduledEvents[r.toString()] = {
                        event: s,
                        timeline: this._repeatedEvents
                    }, this._repeatedEvents.add(s), r
                }, t.Transport.prototype.scheduleOnce = function(t, e) {
                    var i = this._eventID++,
                        n = {
                            time: this.toTicks(e),
                            callback: t,
                            id: i
                        };
                    return this._scheduledEvents[i.toString()] = {
                        event: n,
                        timeline: this._onceEvents
                    }, this._onceEvents.add(n), i
                }, t.Transport.prototype.clear = function(t) {
                    if (this._scheduledEvents.hasOwnProperty(t)) {
                        var e = this._scheduledEvents[t.toString()];
                        e.timeline.remove(e.event), delete this._scheduledEvents[t.toString()]
                    }
                    return this
                }, t.Transport.prototype.cancel = function(t) {
                    return t = this.defaultArg(t, 0), t = this.toTicks(t), this._timeline.cancel(t), this._onceEvents.cancel(t), this._repeatedEvents.cancel(t), this
                }, t.Transport.prototype._bindClockEvents = function() {
                    this._clock.on("start", function(e, i) {
                        i = t.Time(this._clock.ticks, "i").toSeconds(), this.emit("start", e, i)
                    }.bind(this)), this._clock.on("stop", function(t) {
                        this.emit("stop", t)
                    }.bind(this)), this._clock.on("pause", function(t) {
                        this.emit("pause", t)
                    }.bind(this))
                }, Object.defineProperty(t.Transport.prototype, "state", {
                    get: function() {
                        return this._clock.getStateAtTime(this.now())
                    }
                }), t.Transport.prototype.start = function(t, e) {
                    return this.isUndef(e) || (e = this.toTicks(e)), this._clock.start(t, e), this
                }, t.Transport.prototype.stop = function(t) {
                    return this._clock.stop(t), this
                }, t.Transport.prototype.pause = function(t) {
                    return this._clock.pause(t), this
                }, Object.defineProperty(t.Transport.prototype, "timeSignature", {
                    get: function() {
                        return this._timeSignature
                    },
                    set: function(t) {
                        this.isArray(t) && (t = t[0] / t[1] * 4), this._timeSignature = t
                    }
                }), Object.defineProperty(t.Transport.prototype, "loopStart", {
                    get: function() {
                        return t.TransportTime(this._loopStart, "i").toSeconds()
                    },
                    set: function(t) {
                        this._loopStart = this.toTicks(t)
                    }
                }), Object.defineProperty(t.Transport.prototype, "loopEnd", {
                    get: function() {
                        return t.TransportTime(this._loopEnd, "i").toSeconds()
                    },
                    set: function(t) {
                        this._loopEnd = this.toTicks(t)
                    }
                }), t.Transport.prototype.setLoopPoints = function(t, e) {
                    return this.loopStart = t, this.loopEnd = e, this
                }, Object.defineProperty(t.Transport.prototype, "swing", {
                    get: function() {
                        return this._swingAmount
                    },
                    set: function(t) {
                        this._swingAmount = t
                    }
                }), Object.defineProperty(t.Transport.prototype, "swingSubdivision", {
                    get: function() {
                        return t.Time(this._swingTicks, "i").toNotation()
                    },
                    set: function(t) {
                        this._swingTicks = this.toTicks(t)
                    }
                }), Object.defineProperty(t.Transport.prototype, "position", {
                    get: function() {
                        return t.TransportTime(this.ticks, "i").toBarsBeatsSixteenths()
                    },
                    set: function(t) {
                        var e = this.toTicks(t);
                        this.ticks = e
                    }
                }), Object.defineProperty(t.Transport.prototype, "seconds", {
                    get: function() {
                        return t.TransportTime(this.ticks, "i").toSeconds()
                    },
                    set: function(t) {
                        var e = this.toTicks(t);
                        this.ticks = e
                    }
                }), Object.defineProperty(t.Transport.prototype, "progress", {
                    get: function() {
                        return this.loop ? (this.ticks - this._loopStart) / (this._loopEnd - this._loopStart) : 0
                    }
                }), Object.defineProperty(t.Transport.prototype, "ticks", {
                    get: function() {
                        return this._clock.ticks
                    },
                    set: function(e) {
                        if (this._clock.ticks !== e) {
                            var i = this.now();
                            this.state === t.State.Started ? (this.emit("stop", i), this._clock.ticks = e, this.emit("start", i, this.seconds)) : this._clock.ticks = e
                        }
                    }
                }), Object.defineProperty(t.Transport.prototype, "PPQ", {
                    get: function() {
                        return this._ppq
                    },
                    set: function(t) {
                        var e = this.bpm.value;
                        this._ppq = t, this.bpm.value = e
                    }
                }), Object.defineProperty(t.Transport.prototype, "latencyHint", {
                    get: function() {
                        return t.Clock.latencyHint
                    },
                    set: function(e) {
                        t.Clock.latencyHint = e
                    }
                }), t.Transport.prototype._fromUnits = function(t) {
                    return 1 / (60 / t / this.PPQ)
                }, t.Transport.prototype._toUnits = function(t) {
                    return t / this.PPQ * 60
                }, t.Transport.prototype.nextSubdivision = function(e) {
                    e = this.toSeconds(e);
                    var i;
                    if (this.state !== t.State.Started) return 0;
                    i = this._clock._nextTick;
                    var n = t.Time(this.ticks, "i"),
                        s = e - n % e;
                    return 0 === s && (s = e), i + s
                }, t.Transport.prototype.syncSignal = function(e, i) {
                    i || (i = 0 !== e._param.value ? e._param.value / this.bpm._param.value : 0);
                    var n = new t.Gain(i);
                    return this.bpm.chain(n, e._param), this._syncedSignals.push({
                        ratio: n,
                        signal: e,
                        initial: e._param.value
                    }), e._param.value = 0, this
                }, t.Transport.prototype.unsyncSignal = function(t) {
                    for (var e = this._syncedSignals.length - 1; e >= 0; e--) {
                        var i = this._syncedSignals[e];
                        i.signal === t && (i.ratio.dispose(), i.signal._param.value = i.initial, this._syncedSignals.splice(e, 1))
                    }
                    return this
                }, t.Transport.prototype.dispose = function() {
                    return t.Emitter.prototype.dispose.call(this), this._clock.dispose(), this._clock = null, this._writable("bpm"), this.bpm = null, this._timeline.dispose(), this._timeline = null, this._onceEvents.dispose(), this._onceEvents = null, this._repeatedEvents.dispose(), this._repeatedEvents = null, this
                };
                var e = t.Transport;
                return t.Transport = new e, t.Context.on("init", function(i) {
                    i.Transport instanceof e ? t.Transport = i.Transport : (t.Transport = new e, i.Transport = t.Transport)
                }), t.Transport
            }), t(function(t) {
                return t.Volume = function() {
                    var e = this.optionsObject(arguments, ["volume"], t.Volume.defaults);
                    this.output = this.input = new t.Gain(e.volume, t.Type.Decibels), this._unmutedVolume = e.volume, this.volume = this.output.gain, this._readOnly("volume"), this.mute = e.mute
                }, t.extend(t.Volume), t.Volume.defaults = {
                    volume: 0,
                    mute: !1
                }, Object.defineProperty(t.Volume.prototype, "mute", {
                    get: function() {
                        return this.volume.value === -1 / 0
                    },
                    set: function(t) {
                        !this.mute && t ? (this._unmutedVolume = this.volume.value, this.volume.value = -1 / 0) : this.mute && !t && (this.volume.value = this._unmutedVolume)
                    }
                }), t.Volume.prototype.dispose = function() {
                    return this.input.dispose(), t.prototype.dispose.call(this), this._writable("volume"), this.volume.dispose(), this.volume = null, this
                }, t.Volume
            }), t(function(t) {
                t.Master = function() {
                    this.createInsOuts(1, 1), this._volume = this.output = new t.Volume, this.volume = this._volume.volume, this._readOnly("volume"), this.input.chain(this.output, this.context.destination)
                }, t.extend(t.Master), t.Master.defaults = {
                    volume: 0,
                    mute: !1
                }, Object.defineProperty(t.Master.prototype, "mute", {
                    get: function() {
                        return this._volume.mute
                    },
                    set: function(t) {
                        this._volume.mute = t
                    }
                }), t.Master.prototype.chain = function() {
                    this.input.disconnect(), this.input.chain.apply(this.input, arguments), arguments[arguments.length - 1].connect(this.output)
                }, t.Master.prototype.dispose = function() {
                    t.prototype.dispose.call(this), this._writable("volume"), this._volume.dispose(), this._volume = null, this.volume = null
                }, t.prototype.toMaster = function() {
                    return this.connect(t.Master), this
                }, AudioNode.prototype.toMaster = function() {
                    return this.connect(t.Master), this
                };
                var e = t.Master;
                return t.Master = new e, t.Context.on("init", function(i) {
                    i.Master instanceof e ? t.Master = i.Master : t.Master = new e, i.Master = t.Master
                }), t.Master
            }), t(function(t) {
                return t.Source = function(e) {
                    e = this.defaultArg(e, t.Source.defaults), this._volume = this.output = new t.Volume(e.volume), this.volume = this._volume.volume, this._readOnly("volume"), this._state = new t.TimelineState(t.State.Stopped), this._state.memory = 10, this._synced = !1, this._scheduled = [], this._volume.output.output.channelCount = 2, this._volume.output.output.channelCountMode = "explicit", this.mute = e.mute
                }, t.extend(t.Source), t.Source.defaults = {
                    volume: 0,
                    mute: !1
                }, Object.defineProperty(t.Source.prototype, "state", {
                    get: function() {
                        return this._synced ? t.Transport.state === t.State.Started ? this._state.getValueAtTime(t.Transport.seconds) : t.State.Stopped : this._state.getValueAtTime(this.now())
                    }
                }), Object.defineProperty(t.Source.prototype, "mute", {
                    get: function() {
                        return this._volume.mute
                    },
                    set: function(t) {
                        this._volume.mute = t
                    }
                }), t.Source.prototype._start = t.noOp, t.Source.prototype._stop = t.noOp, t.Source.prototype.start = function(e, i, n) {
                    if (e = this.isUndef(e) && this._synced ? t.Transport.seconds : this.toSeconds(e), this.retrigger || this._state.getValueAtTime(e) !== t.State.Started || this.stop(e), this._state.setStateAtTime(t.State.Started, e), this._synced) {
                        var s = this._state.get(e);
                        s.offset = this.defaultArg(i, 0), s.duration = n;
                        var r = t.Transport.schedule(function(t) {
                            this._start(t, i, n)
                        }.bind(this), e);
                        this._scheduled.push(r)
                    } else this._start.apply(this, arguments);
                    return this
                }, t.Source.prototype.stop = function(e) {
                    if (e = this.isUndef(e) && this._synced ? t.Transport.seconds : this.toSeconds(e), this._state.cancel(e), this._state.setStateAtTime(t.State.Stopped, e), this._synced) {
                        var i = t.Transport.schedule(this._stop.bind(this), e);
                        this._scheduled.push(i)
                    } else this._stop.apply(this, arguments);
                    return this
                }, t.Source.prototype.sync = function() {
                    return this._synced = !0, t.Transport.on("start loopStart", function(e, i) {
                        if (i > 0) {
                            var n = this._state.get(i);
                            if (n && n.state === t.State.Started && n.time !== i) {
                                var s, r = i - this.toSeconds(n.time);
                                n.duration && (s = this.toSeconds(n.duration) - r), this._start(e, this.toSeconds(n.offset) + r, s)
                            }
                        }
                    }.bind(this)), t.Transport.on("stop pause loopEnd", function(e) {
                        this._state.getValueAtTime(t.Transport.seconds) === t.State.Started && this._stop(e)
                    }.bind(this)), this
                }, t.Source.prototype.unsync = function() {
                    this._synced = !1, t.Transport.off("start stop pause loopEnd loopStart");
                    for (var e = 0; e < this._scheduled.length; e++) {
                        var i = this._scheduled[e];
                        t.Transport.clear(i)
                    }
                    return this._scheduled = [], this._state.cancel(0), this
                }, t.Source.prototype.dispose = function() {
                    t.prototype.dispose.call(this), this.unsync(), this._scheduled = null, this._writable("volume"), this._volume.dispose(), this._volume = null, this.volume = null, this._state.dispose(), this._state = null
                }, t.Source
            }), t(function(t) {
                return window.OscillatorNode && !OscillatorNode.prototype.start && (OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn, OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff, OscillatorNode.prototype.setPeriodicWave || (OscillatorNode.prototype.setPeriodicWave = OscillatorNode.prototype.setWaveTable), AudioContext.prototype.createPeriodicWave || (AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable)), t.Oscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "type"], t.Oscillator.defaults);
                    t.Source.call(this, e), this._oscillator = null, this.frequency = new t.Signal(e.frequency, t.Type.Frequency), this.detune = new t.Signal(e.detune, t.Type.Cents), this._wave = null, this._partials = this.defaultArg(e.partials, [1]), this._phase = e.phase, this._type = null, this.type = e.type, this.phase = this._phase, this._readOnly(["frequency", "detune"])
                }, t.extend(t.Oscillator, t.Source), t.Oscillator.defaults = {
                    type: "sine",
                    frequency: 440,
                    detune: 0,
                    phase: 0,
                    partials: []
                }, t.Oscillator.Type = {
                    Sine: "sine",
                    Triangle: "triangle",
                    Sawtooth: "sawtooth",
                    Square: "square",
                    Custom: "custom"
                }, t.Oscillator.prototype._start = function(t) {
                    this._oscillator = this.context.createOscillator(), this._oscillator.setPeriodicWave(this._wave), this._oscillator.connect(this.output), this.frequency.connect(this._oscillator.frequency), this.detune.connect(this._oscillator.detune), this._oscillator.start(this.toSeconds(t))
                }, t.Oscillator.prototype._stop = function(t) {
                    return this._oscillator && (this._oscillator.stop(this.toSeconds(t)), this._oscillator = null), this
                }, t.Oscillator.prototype.syncFrequency = function() {
                    return t.Transport.syncSignal(this.frequency), this
                }, t.Oscillator.prototype.unsyncFrequency = function() {
                    return t.Transport.unsyncSignal(this.frequency), this
                }, Object.defineProperty(t.Oscillator.prototype, "type", {
                    get: function() {
                        return this._type
                    },
                    set: function(t) {
                        var e = this._getRealImaginary(t, this._phase),
                            i = this.context.createPeriodicWave(e[0], e[1]);
                        this._wave = i, null !== this._oscillator && this._oscillator.setPeriodicWave(this._wave), this._type = t
                    }
                }), t.Oscillator.prototype._getRealImaginary = function(e, i) {
                    var n = 2048,
                        s = new Float32Array(n),
                        r = new Float32Array(n),
                        o = 1;
                    if (e === t.Oscillator.Type.Custom) o = this._partials.length + 1, n = o;
                    else {
                        var a = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(e);
                        a && (o = parseInt(a[2]) + 1, e = a[1], o = Math.max(o, 2), n = o)
                    }
                    for (var l = 1; l < n; ++l) {
                        var h, u = 2 / (l * Math.PI);
                        switch (e) {
                            case t.Oscillator.Type.Sine:
                                h = l <= o ? 1 : 0;
                                break;
                            case t.Oscillator.Type.Square:
                                h = 1 & l ? 2 * u : 0;
                                break;
                            case t.Oscillator.Type.Sawtooth:
                                h = u * (1 & l ? 1 : -1);
                                break;
                            case t.Oscillator.Type.Triangle:
                                h = 1 & l ? u * u * 2 * (l - 1 >> 1 & 1 ? -1 : 1) : 0;
                                break;
                            case t.Oscillator.Type.Custom:
                                h = this._partials[l - 1];
                                break;
                            default:
                                throw new TypeError("Tone.Oscillator: invalid type: " + e)
                        }
                        0 !== h ? (s[l] = -h * Math.sin(i * l), r[l] = h * Math.cos(i * l)) : (s[l] = 0, r[l] = 0)
                    }
                    return [s, r]
                }, t.Oscillator.prototype._inverseFFT = function(t, e, i) {
                    for (var n = 0, s = t.length, r = 0; r < s; r++) n += t[r] * Math.cos(r * i) + e[r] * Math.sin(r * i);
                    return n
                }, t.Oscillator.prototype._getInitialValue = function() {
                    for (var t = this._getRealImaginary(this._type, 0), e = t[0], i = t[1], n = 0, s = 2 * Math.PI, r = 0; r < 8; r++) n = Math.max(this._inverseFFT(e, i, r / 8 * s), n);
                    return -this._inverseFFT(e, i, this._phase) / n
                }, Object.defineProperty(t.Oscillator.prototype, "partials", {
                    get: function() {
                        return this._type !== t.Oscillator.Type.Custom ? [] : this._partials
                    },
                    set: function(e) {
                        this._partials = e, this.type = t.Oscillator.Type.Custom
                    }
                }), Object.defineProperty(t.Oscillator.prototype, "phase", {
                    get: function() {
                        return this._phase * (180 / Math.PI)
                    },
                    set: function(t) {
                        this._phase = t * Math.PI / 180, this.type = this._type
                    }
                }), t.Oscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), null !== this._oscillator && (this._oscillator.disconnect(), this._oscillator = null), this._wave = null, this._writable(["frequency", "detune"]), this.frequency.dispose(), this.frequency = null, this.detune.dispose(), this.detune = null, this._partials = null, this
                }, t.Oscillator
            }), t(function(t) {
                return t.Zero = function() {
                    this._gain = this.input = this.output = new t.Gain, this.context.getConstant(0).connect(this._gain)
                }, t.extend(t.Zero), t.Zero.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._gain.dispose(), this._gain = null, this
                }, t.Zero
            }), t(function(t) {
                return t.LFO = function() {
                    var e = this.optionsObject(arguments, ["frequency", "min", "max"], t.LFO.defaults);
                    this._oscillator = new t.Oscillator({
                        frequency: e.frequency,
                        type: e.type
                    }), this.frequency = this._oscillator.frequency, this.amplitude = this._oscillator.volume, this.amplitude.units = t.Type.NormalRange, this.amplitude.value = e.amplitude, this._stoppedSignal = new t.Signal(0, t.Type.AudioRange), this._zeros = new t.Zero, this._stoppedValue = 0, this._a2g = new t.AudioToGain, this._scaler = this.output = new t.Scale(e.min, e.max), this._units = t.Type.Default, this.units = e.units, this._oscillator.chain(this._a2g, this._scaler), this._zeros.connect(this._a2g), this._stoppedSignal.connect(this._a2g), this._readOnly(["amplitude", "frequency"]), this.phase = e.phase
                }, t.extend(t.LFO, t.Oscillator), t.LFO.defaults = {
                    type: "sine",
                    min: 0,
                    max: 1,
                    phase: 0,
                    frequency: "4n",
                    amplitude: 1,
                    units: t.Type.Default
                }, t.LFO.prototype.start = function(t) {
                    return t = this.toSeconds(t), this._stoppedSignal.setValueAtTime(0, t), this._oscillator.start(t), this
                }, t.LFO.prototype.stop = function(t) {
                    return t = this.toSeconds(t), this._stoppedSignal.setValueAtTime(this._stoppedValue, t), this._oscillator.stop(t), this
                }, t.LFO.prototype.sync = function() {
                    return this._oscillator.sync(), this._oscillator.syncFrequency(), this
                }, t.LFO.prototype.unsync = function() {
                    return this._oscillator.unsync(), this._oscillator.unsyncFrequency(), this
                }, Object.defineProperty(t.LFO.prototype, "min", {
                    get: function() {
                        return this._toUnits(this._scaler.min)
                    },
                    set: function(t) {
                        t = this._fromUnits(t), this._scaler.min = t
                    }
                }), Object.defineProperty(t.LFO.prototype, "max", {
                    get: function() {
                        return this._toUnits(this._scaler.max)
                    },
                    set: function(t) {
                        t = this._fromUnits(t), this._scaler.max = t
                    }
                }), Object.defineProperty(t.LFO.prototype, "type", {
                    get: function() {
                        return this._oscillator.type
                    },
                    set: function(t) {
                        this._oscillator.type = t, this._stoppedValue = this._oscillator._getInitialValue(), this._stoppedSignal.value = this._stoppedValue
                    }
                }), Object.defineProperty(t.LFO.prototype, "phase", {
                    get: function() {
                        return this._oscillator.phase
                    },
                    set: function(t) {
                        this._oscillator.phase = t, this._stoppedValue = this._oscillator._getInitialValue(), this._stoppedSignal.value = this._stoppedValue
                    }
                }), Object.defineProperty(t.LFO.prototype, "units", {
                    get: function() {
                        return this._units
                    },
                    set: function(t) {
                        var e = this.min,
                            i = this.max;
                        this._units = t, this.min = e, this.max = i
                    }
                }), Object.defineProperty(t.LFO.prototype, "mute", {
                    get: function() {
                        return this._oscillator.mute
                    },
                    set: function(t) {
                        this._oscillator.mute = t
                    }
                }), Object.defineProperty(t.LFO.prototype, "state", {
                    get: function() {
                        return this._oscillator.state
                    }
                }), t.LFO.prototype.connect = function(e) {
                    return e.constructor !== t.Signal && e.constructor !== t.Param && e.constructor !== t.TimelineSignal || (this.convert = e.convert, this.units = e.units), t.Signal.prototype.connect.apply(this, arguments), this
                }, t.LFO.prototype._fromUnits = t.Param.prototype._fromUnits, t.LFO.prototype._toUnits = t.Param.prototype._toUnits, t.LFO.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["amplitude", "frequency"]), this._oscillator.dispose(), this._oscillator = null, this._stoppedSignal.dispose(), this._stoppedSignal = null, this._zeros.dispose(), this._zeros = null, this._scaler.dispose(), this._scaler = null, this._a2g.dispose(), this._a2g = null, this.frequency = null, this.amplitude = null, this
                }, t.LFO
            }), t(function(t) {
                return t.Limiter = function() {
                    var e = this.optionsObject(arguments, ["threshold"], t.Limiter.defaults);
                    this._compressor = this.input = this.output = new t.Compressor({
                        attack: .001,
                        decay: .001,
                        threshold: e.threshold
                    }), this.threshold = this._compressor.threshold, this._readOnly("threshold")
                }, t.extend(t.Limiter), t.Limiter.defaults = {
                    threshold: -12
                }, t.Limiter.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._compressor.dispose(), this._compressor = null, this._writable("threshold"), this.threshold = null, this
                }, t.Limiter
            }), t(function(t) {
                return t.LowpassCombFilter = function() {
                    this.createInsOuts(1, 1);
                    var e = this.optionsObject(arguments, ["delayTime", "resonance", "dampening"], t.LowpassCombFilter.defaults);
                    this._delay = this.input = new t.Delay(e.delayTime), this.delayTime = this._delay.delayTime, this._lowpass = this.output = this.context.createBiquadFilter(), this._lowpass.Q.value = -3.0102999566398125, this._lowpass.type = "lowpass", this.dampening = new t.Param({
                        param: this._lowpass.frequency,
                        units: t.Type.Frequency,
                        value: e.dampening
                    }), this._feedback = new t.Gain(e.resonance, t.Type.NormalRange), this.resonance = this._feedback.gain, this._delay.chain(this._lowpass, this._feedback, this._delay), this._readOnly(["dampening", "resonance", "delayTime"])
                }, t.extend(t.LowpassCombFilter), t.LowpassCombFilter.defaults = {
                    delayTime: .1,
                    resonance: .5,
                    dampening: 3e3
                }, t.LowpassCombFilter.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["dampening", "resonance", "delayTime"]), this.dampening.dispose(), this.dampening = null, this.resonance.dispose(), this.resonance = null, this._delay.dispose(), this._delay = null, this.delayTime = null, this._lowpass.disconnect(), this._lowpass = null, this._feedback.disconnect(), this._feedback = null, this
                }, t.LowpassCombFilter
            }), t(function(t) {
                return t.Merge = function() {
                    this.createInsOuts(2, 0), this.left = this.input[0] = new t.Gain, this.right = this.input[1] = new t.Gain, this._merger = this.output = this.context.createChannelMerger(2), this.left.connect(this._merger, 0, 0), this.right.connect(this._merger, 0, 1), this.left.channelCount = 1, this.right.channelCount = 1, this.left.channelCountMode = "explicit", this.right.channelCountMode = "explicit"
                }, t.extend(t.Merge), t.Merge.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this.left.dispose(), this.left = null, this.right.dispose(), this.right = null, this._merger.disconnect(), this._merger = null, this
                }, t.Merge
            }), t(function(t) {
                return t.Meter = function() {
                    var e = this.optionsObject(arguments, ["type", "smoothing"], t.Meter.defaults);
                    this.type = e.type, this.input = this.output = this._analyser = new t.Analyser("waveform", 512), this._analyser.returnType = "float", this.smoothing = e.smoothing, this._lastValue = 0
                }, t.extend(t.Meter), t.Meter.Type = {
                    Level: "level",
                    Signal: "signal"
                }, t.Meter.defaults = {
                    smoothing: .8,
                    type: t.Meter.Type.Level
                }, Object.defineProperty(t.Meter.prototype, "value", {
                    get: function() {
                        var e = this._analyser.analyse();
                        if (this.type === t.Meter.Type.Level) {
                            for (var i = 0, n = 0; n < e.length; n++) i += Math.pow(e[n], 2);
                            var s = Math.sqrt(i / e.length);
                            s = Math.max(s, this._lastValue * this.smoothing), this._lastValue = s;
                            var r = s / .35;
                            return Math.sqrt(r)
                        }
                        return e[0]
                    }
                }), t.Meter.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._analyser.dispose(), this._analyser = null, this
                }, t.Meter
            }), t(function(t) {
                return t.Split = function() {
                    this.createInsOuts(0, 2), this._splitter = this.input = this.context.createChannelSplitter(2), this.left = this.output[0] = new t.Gain, this.right = this.output[1] = new t.Gain, this._splitter.connect(this.left, 0, 0), this._splitter.connect(this.right, 1, 0)
                }, t.extend(t.Split), t.Split.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._splitter.disconnect(), this.left.dispose(), this.left = null, this.right.dispose(), this.right = null, this._splitter = null, this
                }, t.Split
            }), t(function(t) {
                return t.MidSideSplit = function() {
                    this.createInsOuts(0, 2), this._split = this.input = new t.Split, this.mid = this.output[0] = new t.Expr("($0 + $1) * $2"), this.side = this.output[1] = new t.Expr("($0 - $1) * $2"), this._split.connect(this.mid, 0, 0), this._split.connect(this.mid, 1, 1), this._split.connect(this.side, 0, 0), this._split.connect(this.side, 1, 1), this.context.getConstant(Math.SQRT1_2).connect(this.mid, 0, 2), this.context.getConstant(Math.SQRT1_2).connect(this.side, 0, 2)
                }, t.extend(t.MidSideSplit), t.MidSideSplit.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this.mid.dispose(), this.mid = null, this.side.dispose(), this.side = null, this._split.dispose(), this._split = null, this
                }, t.MidSideSplit
            }), t(function(t) {
                return t.MidSideMerge = function() {
                    this.createInsOuts(2, 0), this.mid = this.input[0] = new t.Gain, this._left = new t.Expr("($0 + $1) * $2"), this.side = this.input[1] = new t.Gain, this._right = new t.Expr("($0 - $1) * $2"), this._merge = this.output = new t.Merge, this.mid.connect(this._left, 0, 0), this.side.connect(this._left, 0, 1), this.mid.connect(this._right, 0, 0), this.side.connect(this._right, 0, 1), this._left.connect(this._merge, 0, 0), this._right.connect(this._merge, 0, 1), this.context.getConstant(Math.SQRT1_2).connect(this._left, 0, 2), this.context.getConstant(Math.SQRT1_2).connect(this._right, 0, 2)
                }, t.extend(t.MidSideMerge), t.MidSideMerge.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this.mid.dispose(), this.mid = null, this.side.dispose(), this.side = null, this._left.dispose(), this._left = null, this._right.dispose(), this._right = null, this._merge.dispose(), this._merge = null, this
                }, t.MidSideMerge
            }), t(function(t) {
                return t.MidSideCompressor = function(e) {
                    e = this.defaultArg(e, t.MidSideCompressor.defaults), this._midSideSplit = this.input = new t.MidSideSplit, this._midSideMerge = this.output = new t.MidSideMerge, this.mid = new t.Compressor(e.mid), this.side = new t.Compressor(e.side), this._midSideSplit.mid.chain(this.mid, this._midSideMerge.mid), this._midSideSplit.side.chain(this.side, this._midSideMerge.side), this._readOnly(["mid", "side"])
                }, t.extend(t.MidSideCompressor), t.MidSideCompressor.defaults = {
                    mid: {
                        ratio: 3,
                        threshold: -24,
                        release: .03,
                        attack: .02,
                        knee: 16
                    },
                    side: {
                        ratio: 6,
                        threshold: -30,
                        release: .25,
                        attack: .03,
                        knee: 10
                    }
                }, t.MidSideCompressor.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["mid", "side"]), this.mid.dispose(), this.mid = null, this.side.dispose(), this.side = null, this._midSideSplit.dispose(), this._midSideSplit = null, this._midSideMerge.dispose(), this._midSideMerge = null, this
                }, t.MidSideCompressor
            }), t(function(t) {
                return t.Mono = function() {
                    this.createInsOuts(1, 0), this._merge = this.output = new t.Merge, this.input.connect(this._merge, 0, 0), this.input.connect(this._merge, 0, 1), this.input.gain.value = this.dbToGain(-10)
                }, t.extend(t.Mono), t.Mono.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._merge.dispose(), this._merge = null, this
                }, t.Mono
            }), t(function(t) {
                return t.MultibandCompressor = function(e) {
                    e = this.defaultArg(arguments, t.MultibandCompressor.defaults), this._splitter = this.input = new t.MultibandSplit({
                        lowFrequency: e.lowFrequency,
                        highFrequency: e.highFrequency
                    }), this.lowFrequency = this._splitter.lowFrequency, this.highFrequency = this._splitter.highFrequency, this.output = new t.Gain, this.low = new t.Compressor(e.low), this.mid = new t.Compressor(e.mid), this.high = new t.Compressor(e.high), this._splitter.low.chain(this.low, this.output), this._splitter.mid.chain(this.mid, this.output), this._splitter.high.chain(this.high, this.output), this._readOnly(["high", "mid", "low", "highFrequency", "lowFrequency"])
                }, t.extend(t.MultibandCompressor), t.MultibandCompressor.defaults = {
                    low: t.Compressor.defaults,
                    mid: t.Compressor.defaults,
                    high: t.Compressor.defaults,
                    lowFrequency: 250,
                    highFrequency: 2e3
                }, t.MultibandCompressor.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._splitter.dispose(), this._writable(["high", "mid", "low", "highFrequency", "lowFrequency"]), this.low.dispose(), this.mid.dispose(), this.high.dispose(), this._splitter = null, this.low = null, this.mid = null, this.high = null, this.lowFrequency = null, this.highFrequency = null, this
                }, t.MultibandCompressor
            }), t(function(t) {
                return t.Panner = function(e) {
                    this._hasStereoPanner ? (this._panner = this.input = this.output = this.context.createStereoPanner(), this.pan = this._panner.pan) : (this._crossFade = new t.CrossFade, this._merger = this.output = new t.Merge, this._splitter = this.input = new t.Split, this.pan = new t.Signal(0, t.Type.AudioRange), this._zero = new t.Zero, this._a2g = new t.AudioToGain, this._zero.connect(this._a2g), this.pan.chain(this._a2g, this._crossFade.fade), this._splitter.connect(this._crossFade, 0, 0), this._splitter.connect(this._crossFade, 1, 1), this._crossFade.a.connect(this._merger, 0, 0), this._crossFade.b.connect(this._merger, 0, 1)), this.pan.value = this.defaultArg(e, 0), this._readOnly("pan")
                }, t.extend(t.Panner), t.Panner.prototype._hasStereoPanner = t.prototype.isFunction(t.context.createStereoPanner), t.Panner.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable("pan"), this._hasStereoPanner ? (this._panner.disconnect(), this._panner = null, this.pan = null) : (this._zero.dispose(), this._zero = null, this._crossFade.dispose(), this._crossFade = null, this._splitter.dispose(), this._splitter = null, this._merger.dispose(), this._merger = null, this.pan.dispose(), this.pan = null, this._a2g.dispose(), this._a2g = null), this
                }, t.Panner
            }), t(function(t) {
                return t.Panner3D = function() {
                    var e = this.optionsObject(arguments, ["positionX", "positionY", "positionZ"], t.Panner3D.defaults);
                    this._panner = this.input = this.output = this.context.createPanner(), this._panner.panningModel = e.panningModel, this._panner.maxDistance = e.maxDistance, this._panner.distanceModel = e.distanceModel, this._panner.coneOuterGain = e.coneOuterGain, this._panner.coneOuterAngle = e.coneOuterAngle, this._panner.coneInnerAngle = e.coneInnerAngle, this._panner.refDistance = e.refDistance, this._panner.rolloffFactor = e.rolloffFactor, this._orientation = [e.orientationX, e.orientationY, e.orientationZ], this._position = [e.positionX, e.positionY, e.positionZ], this.orientationX = e.orientationX, this.orientationY = e.orientationY, this.orientationZ = e.orientationZ, this.positionX = e.positionX, this.positionY = e.positionY, this.positionZ = e.positionZ
                }, t.extend(t.Panner3D), t.Panner3D.defaults = {
                    positionX: 0,
                    positionY: 0,
                    positionZ: 0,
                    orientationX: 0,
                    orientationY: 0,
                    orientationZ: 0,
                    panningModel: "equalpower",
                    maxDistance: 1e4,
                    distanceModel: "inverse",
                    coneOuterGain: 0,
                    coneOuterAngle: 360,
                    coneInnerAngle: 360,
                    refDistance: 1,
                    rolloffFactor: 1
                }, t.Panner3D.prototype._rampTimeConstant = .01, t.Panner3D.prototype.setPosition = function(t, e, i) {
                    if (this._panner.positionX) {
                        var n = this.now();
                        this._panner.positionX.setTargetAtTime(t, n, this._rampTimeConstant), this._panner.positionY.setTargetAtTime(e, n, this._rampTimeConstant), this._panner.positionZ.setTargetAtTime(i, n, this._rampTimeConstant)
                    } else this._panner.setPosition(t, e, i);
                    return this._position = Array.prototype.slice.call(arguments), this
                }, t.Panner3D.prototype.setOrientation = function(t, e, i) {
                    if (this._panner.orientationX) {
                        var n = this.now();
                        this._panner.orientationX.setTargetAtTime(t, n, this._rampTimeConstant), this._panner.orientationY.setTargetAtTime(e, n, this._rampTimeConstant), this._panner.orientationZ.setTargetAtTime(i, n, this._rampTimeConstant)
                    } else this._panner.setOrientation(t, e, i);
                    return this._orientation = Array.prototype.slice.call(arguments), this
                }, Object.defineProperty(t.Panner3D.prototype, "positionX", {
                    set: function(t) {
                        this._position[0] = t, this.setPosition.apply(this, this._position)
                    },
                    get: function() {
                        return this._position[0]
                    }
                }), Object.defineProperty(t.Panner3D.prototype, "positionY", {
                    set: function(t) {
                        this._position[1] = t, this.setPosition.apply(this, this._position)
                    },
                    get: function() {
                        return this._position[1]
                    }
                }), Object.defineProperty(t.Panner3D.prototype, "positionZ", {
                    set: function(t) {
                        this._position[2] = t, this.setPosition.apply(this, this._position)
                    },
                    get: function() {
                        return this._position[2]
                    }
                }), Object.defineProperty(t.Panner3D.prototype, "orientationX", {
                    set: function(t) {
                        this._orientation[0] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[0]
                    }
                }), Object.defineProperty(t.Panner3D.prototype, "orientationY", {
                    set: function(t) {
                        this._orientation[1] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[1]
                    }
                }), Object.defineProperty(t.Panner3D.prototype, "orientationZ", {
                    set: function(t) {
                        this._orientation[2] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[2]
                    }
                }), t.Panner3D._aliasProperty = function(e) {
                    Object.defineProperty(t.Panner3D.prototype, e, {
                        set: function(t) {
                            this._panner[e] = t
                        },
                        get: function() {
                            return this._panner[e]
                        }
                    })
                }, t.Panner3D._aliasProperty("panningModel"), t.Panner3D._aliasProperty("refDistance"), t.Panner3D._aliasProperty("rolloffFactor"), t.Panner3D._aliasProperty("distanceModel"), t.Panner3D._aliasProperty("coneInnerAngle"), t.Panner3D._aliasProperty("coneOuterAngle"), t.Panner3D._aliasProperty("coneOuterGain"), t.Panner3D._aliasProperty("maxDistance"), t.Panner3D.prototype.dispose = function() {
                    return this._panner.disconnect(), this._panner = null, this._orientation = null, this._position = null, this
                }, t.Panner3D
            }), t(function(t) {
                return t.PanVol = function() {
                    var e = this.optionsObject(arguments, ["pan", "volume"], t.PanVol.defaults);
                    this._panner = this.input = new t.Panner(e.pan), this.pan = this._panner.pan, this._volume = this.output = new t.Volume(e.volume), this.volume = this._volume.volume, this._panner.connect(this._volume), this._readOnly(["pan", "volume"])
                }, t.extend(t.PanVol), t.PanVol.defaults = {
                    pan: .5,
                    volume: 0
                }, t.PanVol.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._writable(["pan", "volume"]), this._panner.dispose(), this._panner = null, this.pan = null, this._volume.dispose(), this._volume = null, this.volume = null, this
                }, t.PanVol
            }), t(function(t) {
                return t.CtrlInterpolate = function() {
                    var e = this.optionsObject(arguments, ["values", "index"], t.CtrlInterpolate.defaults);
                    this.values = e.values, this.index = e.index
                }, t.extend(t.CtrlInterpolate), t.CtrlInterpolate.defaults = {
                    index: 0,
                    values: []
                }, Object.defineProperty(t.CtrlInterpolate.prototype, "value", {
                    get: function() {
                        var t = this.index;
                        t = Math.min(t, this.values.length - 1);
                        var e = Math.floor(t),
                            i = this.values[e],
                            n = this.values[Math.ceil(t)];
                        return this._interpolate(t - e, i, n)
                    }
                }), t.CtrlInterpolate.prototype._interpolate = function(t, e, i) {
                    if (this.isArray(e)) {
                        for (var n = [], s = 0; s < e.length; s++) n[s] = this._interpolate(t, e[s], i[s]);
                        return n
                    }
                    if (this.isObject(e)) {
                        var r = {};
                        for (var o in e) r[o] = this._interpolate(t, e[o], i[o]);
                        return r
                    }
                    return e = this._toNumber(e), i = this._toNumber(i), (1 - t) * e + t * i
                }, t.CtrlInterpolate.prototype._toNumber = function(t) {
                    return this.isNumber(t) ? t : this.toSeconds(t)
                }, t.CtrlInterpolate.prototype.dispose = function() {
                    this.values = null
                }, t.CtrlInterpolate
            }), t(function(t) {
                return t.CtrlMarkov = function(t, e) {
                    this.values = this.defaultArg(t, {}), this.value = this.defaultArg(e, Object.keys(this.values)[0])
                }, t.extend(t.CtrlMarkov), t.CtrlMarkov.prototype.next = function() {
                    if (this.values.hasOwnProperty(this.value)) {
                        var t = this.values[this.value];
                        if (this.isArray(t))
                            for (var e = this._getProbDistribution(t), i = Math.random(), n = 0, s = 0; s < e.length; s++) {
                                var r = e[s];
                                if (i > n && i < n + r) {
                                    var o = t[s];
                                    this.isObject(o) ? this.value = o.value : this.value = o
                                }
                                n += r
                            } else this.value = t
                    }
                    return this.value
                }, t.CtrlMarkov.prototype._getProbDistribution = function(t) {
                    for (var e = [], i = 0, n = !1, s = 0; s < t.length; s++) {
                        var r = t[s];
                        this.isObject(r) ? (n = !0, e[s] = r.probability) : e[s] = 1 / t.length, i += e[s]
                    }
                    if (n)
                        for (var o = 0; o < e.length; o++) e[o] = e[o] / i;
                    return e
                }, t.CtrlMarkov.prototype.dispose = function() {
                    this.values = null
                }, t.CtrlMarkov
            }), t(function(t) {
                return t.CtrlPattern = function() {
                    var e = this.optionsObject(arguments, ["values", "type"], t.CtrlPattern.defaults);
                    this.values = e.values, this.index = 0, this._type = null, this._shuffled = null, this._direction = null, this.type = e.type
                }, t.extend(t.CtrlPattern), t.CtrlPattern.Type = {
                    Up: "up",
                    Down: "down",
                    UpDown: "upDown",
                    DownUp: "downUp",
                    AlternateUp: "alternateUp",
                    AlternateDown: "alternateDown",
                    Random: "random",
                    RandomWalk: "randomWalk",
                    RandomOnce: "randomOnce"
                }, t.CtrlPattern.defaults = {
                    type: t.CtrlPattern.Type.Up,
                    values: []
                }, Object.defineProperty(t.CtrlPattern.prototype, "value", {
                    get: function() {
                        if (0 !== this.values.length) {
                            if (1 === this.values.length) return this.values[0];
                            this.index = Math.min(this.index, this.values.length - 1);
                            var e = this.values[this.index];
                            return this.type === t.CtrlPattern.Type.RandomOnce && (this.values.length !== this._shuffled.length && this._shuffleValues(), e = this.values[this._shuffled[this.index]]), e
                        }
                    }
                }), Object.defineProperty(t.CtrlPattern.prototype, "type", {
                    get: function() {
                        return this._type
                    },
                    set: function(e) {
                        this._type = e, this._shuffled = null, this._type === t.CtrlPattern.Type.Up || this._type === t.CtrlPattern.Type.UpDown || this._type === t.CtrlPattern.Type.RandomOnce || this._type === t.CtrlPattern.Type.AlternateUp ? this.index = 0 : this._type !== t.CtrlPattern.Type.Down && this._type !== t.CtrlPattern.Type.DownUp && this._type !== t.CtrlPattern.Type.AlternateDown || (this.index = this.values.length - 1), this._type === t.CtrlPattern.Type.UpDown || this._type === t.CtrlPattern.Type.AlternateUp ? this._direction = t.CtrlPattern.Type.Up : this._type !== t.CtrlPattern.Type.DownUp && this._type !== t.CtrlPattern.Type.AlternateDown || (this._direction = t.CtrlPattern.Type.Down), this._type === t.CtrlPattern.Type.RandomOnce ? this._shuffleValues() : this._type === t.CtrlPattern.Random && (this.index = Math.floor(Math.random() * this.values.length))
                    }
                }), t.CtrlPattern.prototype.next = function() {
                    var e = this.type;
                    return e === t.CtrlPattern.Type.Up ? ++this.index >= this.values.length && (this.index = 0) : e === t.CtrlPattern.Type.Down ? --this.index < 0 && (this.index = this.values.length - 1) : e === t.CtrlPattern.Type.UpDown || e === t.CtrlPattern.Type.DownUp ? (this._direction === t.CtrlPattern.Type.Up ? this.index++ : this.index--, this.index < 0 ? (this.index = 1, this._direction = t.CtrlPattern.Type.Up) : this.index >= this.values.length && (this.index = this.values.length - 2, this._direction = t.CtrlPattern.Type.Down)) : e === t.CtrlPattern.Type.Random ? this.index = Math.floor(Math.random() * this.values.length) : e === t.CtrlPattern.Type.RandomWalk ? Math.random() < .5 ? (this.index--, this.index = Math.max(this.index, 0)) : (this.index++, this.index = Math.min(this.index, this.values.length - 1)) : e === t.CtrlPattern.Type.RandomOnce ? ++this.index >= this.values.length && (this.index = 0, this._shuffleValues()) : e === t.CtrlPattern.Type.AlternateUp ? (this._direction === t.CtrlPattern.Type.Up ? (this.index += 2, this._direction = t.CtrlPattern.Type.Down) : (this.index -= 1, this._direction = t.CtrlPattern.Type.Up), this.index >= this.values.length && (this.index = 0, this._direction = t.CtrlPattern.Type.Up)) : e === t.CtrlPattern.Type.AlternateDown && (this._direction === t.CtrlPattern.Type.Up ? (this.index += 1, this._direction = t.CtrlPattern.Type.Down) : (this.index -= 2, this._direction = t.CtrlPattern.Type.Up), this.index < 0 && (this.index = this.values.length - 1, this._direction = t.CtrlPattern.Type.Down)), this.value
                }, t.CtrlPattern.prototype._shuffleValues = function() {
                    var t = [];
                    this._shuffled = [];
                    for (var e = 0; e < this.values.length; e++) t[e] = e;
                    for (; t.length > 0;) {
                        var i = t.splice(Math.floor(t.length * Math.random()), 1);
                        this._shuffled.push(i[0])
                    }
                }, t.CtrlPattern.prototype.dispose = function() {
                    this._shuffled = null, this.values = null
                }, t.CtrlPattern
            }), t(function(t) {
                return t.CtrlRandom = function() {
                    var e = this.optionsObject(arguments, ["min", "max"], t.CtrlRandom.defaults);
                    this.min = e.min, this.max = e.max, this.integer = e.integer
                }, t.extend(t.CtrlRandom), t.CtrlRandom.defaults = {
                    min: 0,
                    max: 1,
                    integer: !1
                }, Object.defineProperty(t.CtrlRandom.prototype, "value", {
                    get: function() {
                        var t = this.toSeconds(this.min),
                            e = this.toSeconds(this.max),
                            i = Math.random(),
                            n = i * t + (1 - i) * e;
                        return this.integer && (n = Math.floor(n)), n
                    }
                }), t.CtrlRandom
            }), t(function(t) {
                return window.AudioBuffer && !AudioBuffer.prototype.copyToChannel && (AudioBuffer.prototype.copyToChannel = function(t, e, i) {
                    var n = this.getChannelData(e);
                    i = i || 0;
                    for (var s = 0; s < n.length; s++) n[s + i] = t[s]
                }, AudioBuffer.prototype.copyFromChannel = function(t, e, i) {
                    var n = this.getChannelData(e);
                    i = i || 0;
                    for (var s = 0; s < n.length; s++) t[s] = n[s + i]
                }), t.Buffer = function() {
                    var e = this.optionsObject(arguments, ["url", "onload", "onerror"], t.Buffer.defaults);
                    this._buffer = null, this._reversed = e.reverse, this._xhr = null, e.url instanceof AudioBuffer || e.url instanceof t.Buffer ? (this.set(e.url), e.onload && e.onload(this)) : this.isString(e.url) && this.load(e.url, e.onload, e.onerror)
                }, t.extend(t.Buffer), t.Buffer.defaults = {
                    url: void 0,
                    reverse: !1
                }, t.Buffer.prototype.set = function(e) {
                    return e instanceof t.Buffer ? this._buffer = e.get() : this._buffer = e, this
                }, t.Buffer.prototype.get = function() {
                    return this._buffer
                }, t.Buffer.prototype.load = function(e, i, n) {
                    return new Promise(function(s, r) {
                        this._xhr = t.Buffer.load(e, function(t) {
                            this._xhr = null, this.set(t), s(this), i && i(this)
                        }.bind(this), function(t) {
                            this._xhr = null, r(t), n && n(t)
                        }.bind(this))
                    }.bind(this))
                }, t.Buffer.prototype.dispose = function() {
                    return t.Emitter.prototype.dispose.call(this), this._buffer = null, this._xhr && (t.Buffer._currentDownloads--, this._xhr.abort(), this._xhr = null), this
                }, Object.defineProperty(t.Buffer.prototype, "loaded", {
                    get: function() {
                        return this.length > 0
                    }
                }), Object.defineProperty(t.Buffer.prototype, "duration", {
                    get: function() {
                        return this._buffer ? this._buffer.duration : 0
                    }
                }), Object.defineProperty(t.Buffer.prototype, "length", {
                    get: function() {
                        return this._buffer ? this._buffer.length : 0
                    }
                }), Object.defineProperty(t.Buffer.prototype, "numberOfChannels", {
                    get: function() {
                        return this._buffer ? this._buffer.numberOfChannels : 0
                    }
                }), t.Buffer.prototype.fromArray = function(t) {
                    var e = t[0].length > 0,
                        i = e ? t.length : 1,
                        n = e ? t[0].length : t.length,
                        s = this.context.createBuffer(i, n, this.context.sampleRate);
                    e || 1 !== i || (t = [t]);
                    for (var r = 0; r < i; r++) s.copyToChannel(t[r], r);
                    return this._buffer = s, this
                }, t.Buffer.prototype.toMono = function(t) {
                    if (this.isNumber(t)) this.fromArray(this.toArray(t));
                    else {
                        for (var e = new Float32Array(this.length), i = this.numberOfChannels, n = 0; n < i; n++)
                            for (var s = this.toArray(n), r = 0; r < s.length; r++) e[r] += s[r];
                        e = e.map(function(t) {
                            return t / i
                        }), this.fromArray(e)
                    }
                    return this
                }, t.Buffer.prototype.toArray = function(t) {
                    if (this.isNumber(t)) return this.getChannelData(t);
                    if (1 === this.numberOfChannels) return this.toArray(0);
                    for (var e = [], i = 0; i < this.numberOfChannels; i++) e[i] = this.getChannelData(i);
                    return e
                }, t.Buffer.prototype.getChannelData = function(t) {
                    return this._buffer.getChannelData(t)
                }, t.Buffer.prototype.slice = function(e, i) {
                    i = this.defaultArg(i, this.duration);
                    for (var n = Math.floor(this.context.sampleRate * this.toSeconds(e)), s = Math.floor(this.context.sampleRate * this.toSeconds(i)), r = [], o = 0; o < this.numberOfChannels; o++) r[o] = this.toArray(o).slice(n, s);
                    return (new t.Buffer).fromArray(r)
                }, t.Buffer.prototype._reverse = function() {
                    if (this.loaded)
                        for (var t = 0; t < this.numberOfChannels; t++) Array.prototype.reverse.call(this.getChannelData(t));
                    return this
                }, Object.defineProperty(t.Buffer.prototype, "reverse", {
                    get: function() {
                        return this._reversed
                    },
                    set: function(t) {
                        this._reversed !== t && (this._reversed = t, this._reverse())
                    }
                }), t.Emitter.mixin(t.Buffer), t.Buffer._downloadQueue = [], t.Buffer._currentDownloads = 0, t.Buffer.baseUrl = "", t.Buffer.load = function(e, i, n) {
                    function s(e) {
                        if (!n) throw new Error(e);
                        n(e), t.Buffer.emit("error", e)
                    }

                    function r() {
                        for (var e = 0, i = 0; i < t.Buffer._downloadQueue.length; i++) e += t.Buffer._downloadQueue[i].progress;
                        t.Buffer.emit("progress", e / t.Buffer._downloadQueue.length)
                    }
                    i = i || t.noOp;
                    var o = new XMLHttpRequest;
                    return o.open("GET", t.Buffer.baseUrl + e, !0), o.responseType = "arraybuffer", o.progress = 0, t.Buffer._currentDownloads++, t.Buffer._downloadQueue.push(o), o.addEventListener("load", function() {
                        200 === o.status ? t.context.decodeAudioData(o.response, function(e) {
                            o.progress = 1, r(), i(e), 0 === --t.Buffer._currentDownloads && (t.Buffer._downloadQueue = [], t.Buffer.emit("load"))
                        }, function() {
                            s("Tone.Buffer: could not decode audio data: " + e)
                        }) : s("Tone.Buffer: could not locate file: " + e)
                    }), o.addEventListener("error", s), o.addEventListener("progress", function(t) {
                        t.lengthComputable && (o.progress = t.loaded / t.total * .95, r())
                    }), o.send(), o
                }, t.Buffer.cancelDownloads = function() {
                    return t.Buffer._downloadQueue.forEach(function(t) {
                        t.abort()
                    }), t.Buffer._currentDownloads = 0, t.Buffer
                }, t.Buffer.supportsType = function(t) {
                    var e = t.split(".");
                    return e = e[e.length - 1], "" !== document.createElement("audio").canPlayType("audio/" + e)
                }, t.loaded = function() {
                    function e() {
                        t.Buffer.off("load", i), t.Buffer.off("error", n)
                    }
                    var i, n;
                    return new Promise(function(e, s) {
                        i = function() {
                            e()
                        }, n = function() {
                            s()
                        }, t.Buffer.on("load", i), t.Buffer.on("error", n)
                    }).then(e).catch(function(t) {
                        throw e(), new Error(t)
                    })
                }, t.Buffer
            }), t(function(t) {
                return t.Buffers = function(t, e, i) {
                    this._buffers = {}, this.baseUrl = this.defaultArg(i, ""), t = this._flattenUrls(t), this._loadingCount = 0;
                    for (var n in t) this._loadingCount++, this.add(n, t[n], this._bufferLoaded.bind(this, e))
                }, t.extend(t.Buffers), t.Buffers.prototype.has = function(t) {
                    return this._buffers.hasOwnProperty(t)
                }, t.Buffers.prototype.get = function(t) {
                    if (this.has(t)) return this._buffers[t];
                    throw new Error("Tone.Buffers: no buffer named " + t)
                }, t.Buffers.prototype._bufferLoaded = function(t) {
                    0 === --this._loadingCount && t && t(this)
                }, Object.defineProperty(t.Buffers.prototype, "loaded", {
                    get: function() {
                        var t = !0;
                        for (var e in this._buffers) {
                            var i = this.get(e);
                            t = t && i.loaded
                        }
                        return t
                    }
                }), t.Buffers.prototype.add = function(e, i, n) {
                    return n = this.defaultArg(n, t.noOp), i instanceof t.Buffer ? (this._buffers[e] = i, n(this)) : i instanceof AudioBuffer ? (this._buffers[e] = new t.Buffer(i), n(this)) : this.isString(i) && (this._buffers[e] = new t.Buffer(this.baseUrl + i, n)), this
                }, t.Buffers.prototype._flattenUrls = function(t) {
                    var e = {};
                    for (var i in t)
                        if (t.hasOwnProperty(i))
                            if (this.isObject(t[i])) {
                                var n = this._flattenUrls(t[i]);
                                for (var s in n) n.hasOwnProperty(s) && (e[i + "." + s] = n[s])
                            } else e[i] = t[i];
                    return e
                }, t.Buffers.prototype.dispose = function() {
                    for (var t in this._buffers) this._buffers[t].dispose();
                    return this._buffers = null, this
                }, t.Buffers
            }), t(function(t) {
                var e = {};
                return t.prototype.send = function(i, n) {
                    e.hasOwnProperty(i) || (e[i] = this.context.createGain()), n = this.defaultArg(n, 0);
                    var s = new t.Gain(n, t.Type.Decibels);
                    return this.output.chain(s, e[i]), s
                }, t.prototype.receive = function(t, i) {
                    return e.hasOwnProperty(t) || (e[t] = this.context.createGain()), this.isUndef(i) && (i = this.input), e[t].connect(i), this
                }, t.Context.on("init", function(t) {
                    t.Buses ? e = t.Buses : (e = {}, t.Buses = e)
                }), t
            }), t(function(t) {
                return t.Draw = function() {
                    this._events = new t.Timeline, this.expiration = .25, this.anticipation = .008, this._boundDrawLoop = this._drawLoop.bind(this)
                }, t.extend(t.Draw), t.Draw.prototype.schedule = function(t, e) {
                    return this._events.add({
                        callback: t,
                        time: this.toSeconds(e)
                    }), 1 === this._events.length && requestAnimationFrame(this._boundDrawLoop), this
                }, t.Draw.prototype.cancel = function(t) {
                    return this._events.cancel(this.toSeconds(t)), this
                }, t.Draw.prototype._drawLoop = function() {
                    for (var e = t.now(); this._events.length && this._events.peek().time - this.anticipation <= e;) {
                        var i = this._events.shift();
                        e - i.time <= this.expiration && i.callback()
                    }
                    this._events.length > 0 && requestAnimationFrame(this._boundDrawLoop)
                }, t.Draw = new t.Draw, t.Draw
            }), t(function(t) {
                t.Listener = function() {
                    var t = this.optionsObject(arguments, ["positionX", "positionY", "positionZ"], e.defaults);
                    this._orientation = [t.forwardX, t.forwardY, t.forwardZ, t.upX, t.upY, t.upZ], this._position = [t.positionX, t.positionY, t.positionZ], this.forwardX = t.forwardX, this.forwardY = t.forwardY, this.forwardZ = t.forwardZ, this.upX = t.upX, this.upY = t.upY, this.upZ = t.upZ, this.positionX = t.positionX, this.positionY = t.positionY, this.positionZ = t.positionZ
                }, t.extend(t.Listener), t.Listener.defaults = {
                    positionX: 0,
                    positionY: 0,
                    positionZ: 0,
                    forwardX: 0,
                    forwardY: 0,
                    forwardZ: 1,
                    upX: 0,
                    upY: 1,
                    upZ: 0
                }, t.Listener.prototype._rampTimeConstant = .01, t.Listener.prototype.setPosition = function(t, e, i) {
                    if (this.context.listener.positionX) {
                        var n = this.now();
                        this.context.listener.positionX.setTargetAtTime(t, n, this._rampTimeConstant), this.context.listener.positionY.setTargetAtTime(e, n, this._rampTimeConstant), this.context.listener.positionZ.setTargetAtTime(i, n, this._rampTimeConstant)
                    } else this.context.listener.setPosition(t, e, i);
                    return this._position = Array.prototype.slice.call(arguments), this
                }, t.Listener.prototype.setOrientation = function(t, e, i, n, s, r) {
                    if (this.context.listener.forwardX) {
                        var o = this.now();
                        this.context.listener.forwardX.setTargetAtTime(t, o, this._rampTimeConstant), this.context.listener.forwardY.setTargetAtTime(e, o, this._rampTimeConstant), this.context.listener.forwardZ.setTargetAtTime(i, o, this._rampTimeConstant), this.context.listener.upX.setTargetAtTime(n, o, this._rampTimeConstant), this.context.listener.upY.setTargetAtTime(s, o, this._rampTimeConstant), this.context.listener.upZ.setTargetAtTime(r, o, this._rampTimeConstant)
                    } else this.context.listener.setOrientation(t, e, i, n, s, r);
                    return this._orientation = Array.prototype.slice.call(arguments), this
                }, Object.defineProperty(t.Listener.prototype, "positionX", {
                    set: function(t) {
                        this._position[0] = t, this.setPosition.apply(this, this._position)
                    },
                    get: function() {
                        return this._position[0]
                    }
                }), Object.defineProperty(t.Listener.prototype, "positionY", {
                    set: function(t) {
                        this._position[1] = t, this.setPosition.apply(this, this._position)
                    },
                    get: function() {
                        return this._position[1]
                    }
                }), Object.defineProperty(t.Listener.prototype, "positionZ", {
                    set: function(t) {
                        this._position[2] = t, this.setPosition.apply(this, this._position)
                    },
                    get: function() {
                        return this._position[2]
                    }
                }), Object.defineProperty(t.Listener.prototype, "forwardX", {
                    set: function(t) {
                        this._orientation[0] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[0]
                    }
                }), Object.defineProperty(t.Listener.prototype, "forwardY", {
                    set: function(t) {
                        this._orientation[1] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[1]
                    }
                }), Object.defineProperty(t.Listener.prototype, "forwardZ", {
                    set: function(t) {
                        this._orientation[2] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[2]
                    }
                }), Object.defineProperty(t.Listener.prototype, "upX", {
                    set: function(t) {
                        this._orientation[3] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[3]
                    }
                }), Object.defineProperty(t.Listener.prototype, "upY", {
                    set: function(t) {
                        this._orientation[4] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[4]
                    }
                }), Object.defineProperty(t.Listener.prototype, "upZ", {
                    set: function(t) {
                        this._orientation[5] = t, this.setOrientation.apply(this, this._orientation)
                    },
                    get: function() {
                        return this._orientation[5]
                    }
                }), t.Listener.prototype.dispose = function() {
                    return this._orientation = null, this._position = null, this
                };
                var e = t.Listener;
                return t.Listener = new e, t.Context.on("init", function(i) {
                    i.Listener instanceof e ? t.Listener = i.Listener : t.Listener = new e, i.Listener = t.Listener
                }), t.Listener
            }), t(function(t) {
                return !window.hasOwnProperty("OfflineAudioContext") && window.hasOwnProperty("webkitOfflineAudioContext") && (window.OfflineAudioContext = window.webkitOfflineAudioContext), t.OfflineContext = function(e, i, n) {
                    var s = new OfflineAudioContext(e, i * n, n);
                    t.Context.call(this, s), this._duration = i, this._currentTime = 0, this.lookAhead = this.blockTime, this.updateInterval = this.blockTime
                }, t.extend(t.OfflineContext, t.Context), t.OfflineContext.prototype.now = function() {
                    return this._currentTime
                }, t.OfflineContext.prototype._createWorker = function() {
                    return {
                        postMessage: function() {}
                    }
                }, t.OfflineContext.prototype.render = function() {
                    for (; this._duration - this._currentTime >= 0;) this.emit("tick"), this._currentTime += t.prototype.blockTime;
                    return new Promise(function(t) {
                        this._context.oncomplete = function(e) {
                            t(e.renderedBuffer)
                        }, this._context.startRendering()
                    }.bind(this))
                }, t.OfflineContext
            }), t(function(t) {
                return t.Offline = function(e, i) {
                    var n = t.context.sampleRate,
                        s = t.context,
                        r = new t.OfflineContext(2, i, n);
                    t.context = r, e(t.Transport);
                    var o = r.render();
                    return t.context = s, o.then(function(e) {
                        return new t.Buffer(e)
                    })
                }, t.Offline
            }), t(function(t) {
                return t.Effect = function() {
                    this.createInsOuts(1, 1);
                    var e = this.optionsObject(arguments, ["wet"], t.Effect.defaults);
                    this._dryWet = new t.CrossFade(e.wet), this.wet = this._dryWet.fade, this.effectSend = new t.Gain, this.effectReturn = new t.Gain, this.input.connect(this._dryWet.a), this.input.connect(this.effectSend), this.effectReturn.connect(this._dryWet.b), this._dryWet.connect(this.output), this._readOnly(["wet"])
                }, t.extend(t.Effect), t.Effect.defaults = {
                    wet: 1
                }, t.Effect.prototype.connectEffect = function(t) {
                    return this.effectSend.chain(t, this.effectReturn), this
                }, t.Effect.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._dryWet.dispose(), this._dryWet = null, this.effectSend.dispose(), this.effectSend = null, this.effectReturn.dispose(), this.effectReturn = null, this._writable(["wet"]), this.wet = null, this
                }, t.Effect
            }), t(function(t) {
                return t.AutoFilter = function() {
                    var e = this.optionsObject(arguments, ["frequency", "baseFrequency", "octaves"], t.AutoFilter.defaults);
                    t.Effect.call(this, e), this._lfo = new t.LFO({
                        frequency: e.frequency,
                        amplitude: e.depth
                    }), this.depth = this._lfo.amplitude, this.frequency = this._lfo.frequency, this.filter = new t.Filter(e.filter), this._octaves = 0, this.connectEffect(this.filter), this._lfo.connect(this.filter.frequency), this.type = e.type, this._readOnly(["frequency", "depth"]), this.octaves = e.octaves, this.baseFrequency = e.baseFrequency
                }, t.extend(t.AutoFilter, t.Effect), t.AutoFilter.defaults = {
                    frequency: 1,
                    type: "sine",
                    depth: 1,
                    baseFrequency: 200,
                    octaves: 2.6,
                    filter: {
                        type: "lowpass",
                        rolloff: -12,
                        Q: 1
                    }
                }, t.AutoFilter.prototype.start = function(t) {
                    return this._lfo.start(t), this
                }, t.AutoFilter.prototype.stop = function(t) {
                    return this._lfo.stop(t), this
                }, t.AutoFilter.prototype.sync = function(t) {
                    return this._lfo.sync(t), this
                }, t.AutoFilter.prototype.unsync = function() {
                    return this._lfo.unsync(), this
                }, Object.defineProperty(t.AutoFilter.prototype, "type", {
                    get: function() {
                        return this._lfo.type
                    },
                    set: function(t) {
                        this._lfo.type = t
                    }
                }), Object.defineProperty(t.AutoFilter.prototype, "baseFrequency", {
                    get: function() {
                        return this._lfo.min
                    },
                    set: function(t) {
                        this._lfo.min = this.toFrequency(t), this.octaves = this._octaves
                    }
                }), Object.defineProperty(t.AutoFilter.prototype, "octaves", {
                    get: function() {
                        return this._octaves
                    },
                    set: function(t) {
                        this._octaves = t, this._lfo.max = this.baseFrequency * Math.pow(2, t)
                    }
                }), t.AutoFilter.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._lfo.dispose(), this._lfo = null, this.filter.dispose(), this.filter = null, this._writable(["frequency", "depth"]), this.frequency = null, this.depth = null, this
                }, t.AutoFilter
            }), t(function(t) {
                return t.AutoPanner = function() {
                    var e = this.optionsObject(arguments, ["frequency"], t.AutoPanner.defaults);
                    t.Effect.call(this, e), this._lfo = new t.LFO({
                        frequency: e.frequency,
                        amplitude: e.depth,
                        min: -1,
                        max: 1
                    }), this.depth = this._lfo.amplitude, this._panner = new t.Panner, this.frequency = this._lfo.frequency, this.connectEffect(this._panner), this._lfo.connect(this._panner.pan), this.type = e.type, this._readOnly(["depth", "frequency"])
                }, t.extend(t.AutoPanner, t.Effect), t.AutoPanner.defaults = {
                    frequency: 1,
                    type: "sine",
                    depth: 1
                }, t.AutoPanner.prototype.start = function(t) {
                    return this._lfo.start(t), this
                }, t.AutoPanner.prototype.stop = function(t) {
                    return this._lfo.stop(t), this
                }, t.AutoPanner.prototype.sync = function(t) {
                    return this._lfo.sync(t), this
                }, t.AutoPanner.prototype.unsync = function() {
                    return this._lfo.unsync(), this
                }, Object.defineProperty(t.AutoPanner.prototype, "type", {
                    get: function() {
                        return this._lfo.type
                    },
                    set: function(t) {
                        this._lfo.type = t
                    }
                }), t.AutoPanner.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._lfo.dispose(), this._lfo = null, this._panner.dispose(), this._panner = null, this._writable(["depth", "frequency"]), this.frequency = null, this.depth = null, this
                }, t.AutoPanner
            }), t(function(t) {
                return t.AutoWah = function() {
                    var e = this.optionsObject(arguments, ["baseFrequency", "octaves", "sensitivity"], t.AutoWah.defaults);
                    t.Effect.call(this, e), this.follower = new t.Follower(e.follower), this._sweepRange = new t.ScaleExp(0, 1, .5), this._baseFrequency = e.baseFrequency, this._octaves = e.octaves, this._inputBoost = new t.Gain, this._bandpass = new t.Filter({
                        rolloff: -48,
                        frequency: 0,
                        Q: e.Q
                    }), this._peaking = new t.Filter(0, "peaking"), this._peaking.gain.value = e.gain, this.gain = this._peaking.gain, this.Q = this._bandpass.Q, this.effectSend.chain(this._inputBoost, this.follower, this._sweepRange), this._sweepRange.connect(this._bandpass.frequency), this._sweepRange.connect(this._peaking.frequency), this.effectSend.chain(this._bandpass, this._peaking, this.effectReturn), this._setSweepRange(), this.sensitivity = e.sensitivity, this._readOnly(["gain", "Q"])
                }, t.extend(t.AutoWah, t.Effect), t.AutoWah.defaults = {
                    baseFrequency: 100,
                    octaves: 6,
                    sensitivity: 0,
                    Q: 2,
                    gain: 2,
                    follower: {
                        attack: .3,
                        release: .5
                    }
                }, Object.defineProperty(t.AutoWah.prototype, "octaves", {
                    get: function() {
                        return this._octaves
                    },
                    set: function(t) {
                        this._octaves = t, this._setSweepRange()
                    }
                }), Object.defineProperty(t.AutoWah.prototype, "baseFrequency", {
                    get: function() {
                        return this._baseFrequency
                    },
                    set: function(t) {
                        this._baseFrequency = t, this._setSweepRange()
                    }
                }), Object.defineProperty(t.AutoWah.prototype, "sensitivity", {
                    get: function() {
                        return this.gainToDb(1 / this._inputBoost.gain.value)
                    },
                    set: function(t) {
                        this._inputBoost.gain.value = 1 / this.dbToGain(t)
                    }
                }), t.AutoWah.prototype._setSweepRange = function() {
                    this._sweepRange.min = this._baseFrequency, this._sweepRange.max = Math.min(this._baseFrequency * Math.pow(2, this._octaves), this.context.sampleRate / 2)
                }, t.AutoWah.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this.follower.dispose(), this.follower = null, this._sweepRange.dispose(), this._sweepRange = null, this._bandpass.dispose(), this._bandpass = null, this._peaking.dispose(), this._peaking = null, this._inputBoost.dispose(), this._inputBoost = null, this._writable(["gain", "Q"]), this.gain = null, this.Q = null, this
                }, t.AutoWah
            }), t(function(t) {
                return t.BitCrusher = function() {
                    var e = this.optionsObject(arguments, ["bits"], t.BitCrusher.defaults);
                    t.Effect.call(this, e);
                    var i = 1 / Math.pow(2, e.bits - 1);
                    this._subtract = new t.Subtract, this._modulo = new t.Modulo(i), this._bits = e.bits, this.effectSend.fan(this._subtract, this._modulo), this._modulo.connect(this._subtract, 0, 1), this._subtract.connect(this.effectReturn)
                }, t.extend(t.BitCrusher, t.Effect), t.BitCrusher.defaults = {
                    bits: 4
                }, Object.defineProperty(t.BitCrusher.prototype, "bits", {
                    get: function() {
                        return this._bits
                    },
                    set: function(t) {
                        this._bits = t;
                        var e = 1 / Math.pow(2, t - 1);
                        this._modulo.value = e
                    }
                }), t.BitCrusher.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._subtract.dispose(), this._subtract = null, this._modulo.dispose(), this._modulo = null, this
                }, t.BitCrusher
            }), t(function(t) {
                return t.Chebyshev = function() {
                    var e = this.optionsObject(arguments, ["order"], t.Chebyshev.defaults);
                    t.Effect.call(this, e), this._shaper = new t.WaveShaper(4096), this._order = e.order, this.connectEffect(this._shaper), this.order = e.order, this.oversample = e.oversample
                }, t.extend(t.Chebyshev, t.Effect), t.Chebyshev.defaults = {
                    order: 1,
                    oversample: "none"
                }, t.Chebyshev.prototype._getCoefficient = function(t, e, i) {
                    return i.hasOwnProperty(e) ? i[e] : (i[e] = 0 === e ? 0 : 1 === e ? t : 2 * t * this._getCoefficient(t, e - 1, i) - this._getCoefficient(t, e - 2, i), i[e])
                }, Object.defineProperty(t.Chebyshev.prototype, "order", {
                    get: function() {
                        return this._order
                    },
                    set: function(t) {
                        this._order = t;
                        for (var e = new Array(4096), i = e.length, n = 0; n < i; ++n) {
                            var s = 2 * n / i - 1;
                            e[n] = 0 === s ? 0 : this._getCoefficient(s, t, {})
                        }
                        this._shaper.curve = e
                    }
                }), Object.defineProperty(t.Chebyshev.prototype, "oversample", {
                    get: function() {
                        return this._shaper.oversample
                    },
                    set: function(t) {
                        this._shaper.oversample = t
                    }
                }), t.Chebyshev.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._shaper.dispose(), this._shaper = null, this
                }, t.Chebyshev
            }), t(function(t) {
                return t.StereoEffect = function() {
                    this.createInsOuts(1, 1);
                    var e = this.optionsObject(arguments, ["wet"], t.Effect.defaults);
                    this._dryWet = new t.CrossFade(e.wet), this.wet = this._dryWet.fade, this._split = new t.Split, this.effectSendL = this._split.left, this.effectSendR = this._split.right, this._merge = new t.Merge, this.effectReturnL = this._merge.left, this.effectReturnR = this._merge.right, this.input.connect(this._split), this.input.connect(this._dryWet, 0, 0), this._merge.connect(this._dryWet, 0, 1), this._dryWet.connect(this.output), this._readOnly(["wet"])
                }, t.extend(t.StereoEffect, t.Effect), t.StereoEffect.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._dryWet.dispose(), this._dryWet = null, this._split.dispose(), this._split = null, this._merge.dispose(), this._merge = null, this.effectSendL = null, this.effectSendR = null, this.effectReturnL = null, this.effectReturnR = null, this._writable(["wet"]), this.wet = null, this
                }, t.StereoEffect
            }), t(function(t) {
                return t.FeedbackEffect = function() {
                    var e = this.optionsObject(arguments, ["feedback"]);
                    e = this.defaultArg(e, t.FeedbackEffect.defaults), t.Effect.call(this, e), this._feedbackGain = new t.Gain(e.feedback, t.Type.NormalRange), this.feedback = this._feedbackGain.gain, this.effectReturn.chain(this._feedbackGain, this.effectSend), this._readOnly(["feedback"])
                }, t.extend(t.FeedbackEffect, t.Effect), t.FeedbackEffect.defaults = {
                    feedback: .125
                }, t.FeedbackEffect.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._writable(["feedback"]), this._feedbackGain.dispose(), this._feedbackGain = null, this.feedback = null, this
                }, t.FeedbackEffect
            }), t(function(t) {
                return t.StereoXFeedbackEffect = function() {
                    var e = this.optionsObject(arguments, ["feedback"], t.FeedbackEffect.defaults);
                    t.StereoEffect.call(this, e), this.feedback = new t.Signal(e.feedback, t.Type.NormalRange), this._feedbackLR = new t.Gain, this._feedbackRL = new t.Gain, this.effectReturnL.chain(this._feedbackLR, this.effectSendR), this.effectReturnR.chain(this._feedbackRL, this.effectSendL), this.feedback.fan(this._feedbackLR.gain, this._feedbackRL.gain), this._readOnly(["feedback"])
                }, t.extend(t.StereoXFeedbackEffect, t.FeedbackEffect), t.StereoXFeedbackEffect.prototype.dispose = function() {
                    return t.StereoEffect.prototype.dispose.call(this), this._writable(["feedback"]), this.feedback.dispose(), this.feedback = null, this._feedbackLR.dispose(), this._feedbackLR = null, this._feedbackRL.dispose(), this._feedbackRL = null, this
                }, t.StereoXFeedbackEffect
            }), t(function(t) {
                return t.Chorus = function() {
                    var e = this.optionsObject(arguments, ["frequency", "delayTime", "depth"], t.Chorus.defaults);
                    t.StereoXFeedbackEffect.call(this, e), this._depth = e.depth, this._delayTime = e.delayTime / 1e3, this._lfoL = new t.LFO({
                        frequency: e.frequency,
                        min: 0,
                        max: 1
                    }), this._lfoR = new t.LFO({
                        frequency: e.frequency,
                        min: 0,
                        max: 1,
                        phase: 180
                    }), this._delayNodeL = new t.Delay, this._delayNodeR = new t.Delay, this.frequency = this._lfoL.frequency, this.effectSendL.chain(this._delayNodeL, this.effectReturnL), this.effectSendR.chain(this._delayNodeR, this.effectReturnR), this.effectSendL.connect(this.effectReturnL), this.effectSendR.connect(this.effectReturnR), this._lfoL.connect(this._delayNodeL.delayTime), this._lfoR.connect(this._delayNodeR.delayTime), this._lfoL.start(), this._lfoR.start(), this._lfoL.frequency.connect(this._lfoR.frequency), this.depth = this._depth, this.frequency.value = e.frequency, this.type = e.type, this._readOnly(["frequency"]), this.spread = e.spread
                }, t.extend(t.Chorus, t.StereoXFeedbackEffect), t.Chorus.defaults = {
                    frequency: 1.5,
                    delayTime: 3.5,
                    depth: .7,
                    feedback: .1,
                    type: "sine",
                    spread: 180
                }, Object.defineProperty(t.Chorus.prototype, "depth", {
                    get: function() {
                        return this._depth
                    },
                    set: function(t) {
                        this._depth = t;
                        var e = this._delayTime * t;
                        this._lfoL.min = Math.max(this._delayTime - e, 0), this._lfoL.max = this._delayTime + e, this._lfoR.min = Math.max(this._delayTime - e, 0), this._lfoR.max = this._delayTime + e
                    }
                }), Object.defineProperty(t.Chorus.prototype, "delayTime", {
                    get: function() {
                        return 1e3 * this._delayTime
                    },
                    set: function(t) {
                        this._delayTime = t / 1e3, this.depth = this._depth
                    }
                }), Object.defineProperty(t.Chorus.prototype, "type", {
                    get: function() {
                        return this._lfoL.type
                    },
                    set: function(t) {
                        this._lfoL.type = t, this._lfoR.type = t
                    }
                }), Object.defineProperty(t.Chorus.prototype, "spread", {
                    get: function() {
                        return this._lfoR.phase - this._lfoL.phase
                    },
                    set: function(t) {
                        this._lfoL.phase = 90 - t / 2, this._lfoR.phase = t / 2 + 90
                    }
                }), t.Chorus.prototype.dispose = function() {
                    return t.StereoXFeedbackEffect.prototype.dispose.call(this), this._lfoL.dispose(), this._lfoL = null, this._lfoR.dispose(), this._lfoR = null, this._delayNodeL.dispose(), this._delayNodeL = null, this._delayNodeR.dispose(), this._delayNodeR = null, this._writable("frequency"), this.frequency = null, this
                }, t.Chorus
            }), t(function(t) {
                return t.Convolver = function() {
                    var e = this.optionsObject(arguments, ["url", "onload"], t.Convolver.defaults);
                    t.Effect.call(this, e), this._convolver = this.context.createConvolver(), this._buffer = new t.Buffer, this.isString(e.url) ? this._buffer.load(e.url, function(t) {
                        this.buffer = t, e.onload()
                    }.bind(this)) : e.url && (this.buffer = e.url, e.onload()), this.connectEffect(this._convolver)
                }, t.extend(t.Convolver, t.Effect), t.Convolver.defaults = {
                    onload: t.noOp
                }, Object.defineProperty(t.Convolver.prototype, "buffer", {
                    get: function() {
                        return this._buffer.get()
                    },
                    set: function(t) {
                        this._buffer.set(t), this._convolver.buffer = this._buffer.get()
                    }
                }), t.Convolver.prototype.load = function(t, e) {
                    return this._buffer.load(t, function(t) {
                        this.buffer = t, e && e()
                    }.bind(this))
                }, t.Convolver.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._convolver.disconnect(), this._convolver = null, this._buffer.dispose(), this._buffer = null, this
                }, t.Convolver
            }), t(function(t) {
                return t.Distortion = function() {
                    var e = this.optionsObject(arguments, ["distortion"], t.Distortion.defaults);
                    t.Effect.call(this, e), this._shaper = new t.WaveShaper(4096), this._distortion = e.distortion, this.connectEffect(this._shaper), this.distortion = e.distortion, this.oversample = e.oversample
                }, t.extend(t.Distortion, t.Effect), t.Distortion.defaults = {
                    distortion: .4,
                    oversample: "none"
                }, Object.defineProperty(t.Distortion.prototype, "distortion", {
                    get: function() {
                        return this._distortion
                    },
                    set: function(t) {
                        this._distortion = t;
                        var e = 100 * t,
                            i = Math.PI / 180;
                        this._shaper.setMap(function(t) {
                            return Math.abs(t) < .001 ? 0 : (3 + e) * t * 20 * i / (Math.PI + e * Math.abs(t))
                        })
                    }
                }), Object.defineProperty(t.Distortion.prototype, "oversample", {
                    get: function() {
                        return this._shaper.oversample
                    },
                    set: function(t) {
                        this._shaper.oversample = t
                    }
                }), t.Distortion.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._shaper.dispose(), this._shaper = null, this
                }, t.Distortion
            }), t(function(t) {
                return t.FeedbackDelay = function() {
                    var e = this.optionsObject(arguments, ["delayTime", "feedback"], t.FeedbackDelay.defaults);
                    t.FeedbackEffect.call(this, e), this._delayNode = new t.Delay(e.delayTime), this.delayTime = this._delayNode.delayTime, this.connectEffect(this._delayNode), this._readOnly(["delayTime"])
                }, t.extend(t.FeedbackDelay, t.FeedbackEffect), t.FeedbackDelay.defaults = {
                    delayTime: .25
                }, t.FeedbackDelay.prototype.dispose = function() {
                    return t.FeedbackEffect.prototype.dispose.call(this), this._delayNode.dispose(), this._delayNode = null, this._writable(["delayTime"]), this.delayTime = null, this
                }, t.FeedbackDelay
            }), t(function(t) {
                var e = [1557 / 44100, 1617 / 44100, 1491 / 44100, 1422 / 44100, 1277 / 44100, 1356 / 44100, 1188 / 44100, 1116 / 44100],
                    i = [225, 556, 441, 341];
                return t.Freeverb = function() {
                    var n = this.optionsObject(arguments, ["roomSize", "dampening"], t.Freeverb.defaults);
                    t.StereoEffect.call(this, n), this.roomSize = new t.Signal(n.roomSize, t.Type.NormalRange), this.dampening = new t.Signal(n.dampening, t.Type.Frequency), this._combFilters = [], this._allpassFiltersL = [], this._allpassFiltersR = [];
                    for (var s = 0; s < i.length; s++) {
                        var r = this.context.createBiquadFilter();
                        r.type = "allpass", r.frequency.value = i[s], this._allpassFiltersL.push(r)
                    }
                    for (var o = 0; o < i.length; o++) {
                        var a = this.context.createBiquadFilter();
                        a.type = "allpass", a.frequency.value = i[o], this._allpassFiltersR.push(a)
                    }
                    for (var l = 0; l < e.length; l++) {
                        var h = new t.LowpassCombFilter(e[l]);
                        l < e.length / 2 ? this.effectSendL.chain(h, this._allpassFiltersL[0]) : this.effectSendR.chain(h, this._allpassFiltersR[0]), this.roomSize.connect(h.resonance), this.dampening.connect(h.dampening), this._combFilters.push(h)
                    }
                    this.connectSeries.apply(this, this._allpassFiltersL), this.connectSeries.apply(this, this._allpassFiltersR), this._allpassFiltersL[this._allpassFiltersL.length - 1].connect(this.effectReturnL), this._allpassFiltersR[this._allpassFiltersR.length - 1].connect(this.effectReturnR), this._readOnly(["roomSize", "dampening"])
                }, t.extend(t.Freeverb, t.StereoEffect), t.Freeverb.defaults = {
                    roomSize: .7,
                    dampening: 3e3
                }, t.Freeverb.prototype.dispose = function() {
                    t.StereoEffect.prototype.dispose.call(this);
                    for (var e = 0; e < this._allpassFiltersL.length; e++) this._allpassFiltersL[e].disconnect(), this._allpassFiltersL[e] = null;
                    this._allpassFiltersL = null;
                    for (var i = 0; i < this._allpassFiltersR.length; i++) this._allpassFiltersR[i].disconnect(), this._allpassFiltersR[i] = null;
                    this._allpassFiltersR = null;
                    for (var n = 0; n < this._combFilters.length; n++) this._combFilters[n].dispose(), this._combFilters[n] = null;
                    return this._combFilters = null, this._writable(["roomSize", "dampening"]), this.roomSize.dispose(), this.roomSize = null, this.dampening.dispose(), this.dampening = null, this
                }, t.Freeverb
            }), t(function(t) {
                var e = [.06748, .06404, .08212, .09004],
                    i = [.773, .802, .753, .733],
                    n = [347, 113, 37];
                return t.JCReverb = function() {
                    var s = this.optionsObject(arguments, ["roomSize"], t.JCReverb.defaults);
                    t.StereoEffect.call(this, s), this.roomSize = new t.Signal(s.roomSize, t.Type.NormalRange), this._scaleRoomSize = new t.Scale(-.733, .197), this._allpassFilters = [], this._feedbackCombFilters = [];
                    for (var r = 0; r < n.length; r++) {
                        var o = this.context.createBiquadFilter();
                        o.type = "allpass", o.frequency.value = n[r], this._allpassFilters.push(o)
                    }
                    for (var a = 0; a < e.length; a++) {
                        var l = new t.FeedbackCombFilter(e[a], .1);
                        this._scaleRoomSize.connect(l.resonance), l.resonance.value = i[a], this._allpassFilters[this._allpassFilters.length - 1].connect(l), a < e.length / 2 ? l.connect(this.effectReturnL) : l.connect(this.effectReturnR), this._feedbackCombFilters.push(l)
                    }
                    this.roomSize.connect(this._scaleRoomSize), this.connectSeries.apply(this, this._allpassFilters), this.effectSendL.connect(this._allpassFilters[0]), this.effectSendR.connect(this._allpassFilters[0]), this._readOnly(["roomSize"])
                }, t.extend(t.JCReverb, t.StereoEffect), t.JCReverb.defaults = {
                    roomSize: .5
                }, t.JCReverb.prototype.dispose = function() {
                    t.StereoEffect.prototype.dispose.call(this);
                    for (var e = 0; e < this._allpassFilters.length; e++) this._allpassFilters[e].disconnect(), this._allpassFilters[e] = null;
                    this._allpassFilters = null;
                    for (var i = 0; i < this._feedbackCombFilters.length; i++) this._feedbackCombFilters[i].dispose(), this._feedbackCombFilters[i] = null;
                    return this._feedbackCombFilters = null, this._writable(["roomSize"]), this.roomSize.dispose(), this.roomSize = null, this._scaleRoomSize.dispose(), this._scaleRoomSize = null, this
                }, t.JCReverb
            }), t(function(t) {
                return t.MidSideEffect = function() {
                    t.Effect.apply(this, arguments), this._midSideSplit = new t.MidSideSplit, this._midSideMerge = new t.MidSideMerge, this.midSend = this._midSideSplit.mid, this.sideSend = this._midSideSplit.side, this.midReturn = this._midSideMerge.mid, this.sideReturn = this._midSideMerge.side, this.effectSend.connect(this._midSideSplit), this._midSideMerge.connect(this.effectReturn)
                }, t.extend(t.MidSideEffect, t.Effect), t.MidSideEffect.prototype.dispose = function() {
                    return t.Effect.prototype.dispose.call(this), this._midSideSplit.dispose(), this._midSideSplit = null, this._midSideMerge.dispose(), this._midSideMerge = null, this.midSend = null, this.sideSend = null, this.midReturn = null, this.sideReturn = null, this
                }, t.MidSideEffect
            }), t(function(t) {
                return t.Phaser = function() {
                    var e = this.optionsObject(arguments, ["frequency", "octaves", "baseFrequency"], t.Phaser.defaults);
                    t.StereoEffect.call(this, e), this._lfoL = new t.LFO(e.frequency, 0, 1), this._lfoR = new t.LFO(e.frequency, 0, 1), this._lfoR.phase = 180, this._baseFrequency = e.baseFrequency, this._octaves = e.octaves, this.Q = new t.Signal(e.Q, t.Type.Positive), this._filtersL = this._makeFilters(e.stages, this._lfoL, this.Q), this._filtersR = this._makeFilters(e.stages, this._lfoR, this.Q), this.frequency = this._lfoL.frequency, this.frequency.value = e.frequency, this.effectSendL.connect(this._filtersL[0]), this.effectSendR.connect(this._filtersR[0]), this._filtersL[e.stages - 1].connect(this.effectReturnL), this._filtersR[e.stages - 1].connect(this.effectReturnR), this._lfoL.frequency.connect(this._lfoR.frequency), this.baseFrequency = e.baseFrequency, this.octaves = e.octaves, this._lfoL.start(), this._lfoR.start(), this._readOnly(["frequency", "Q"])
                }, t.extend(t.Phaser, t.StereoEffect), t.Phaser.defaults = {
                    frequency: .5,
                    octaves: 3,
                    stages: 10,
                    Q: 10,
                    baseFrequency: 350
                }, t.Phaser.prototype._makeFilters = function(t, e, i) {
                    for (var n = new Array(t), s = 0; s < t; s++) {
                        var r = this.context.createBiquadFilter();
                        r.type = "allpass", i.connect(r.Q), e.connect(r.frequency), n[s] = r
                    }
                    return this.connectSeries.apply(this, n), n
                }, Object.defineProperty(t.Phaser.prototype, "octaves", {
                    get: function() {
                        return this._octaves
                    },
                    set: function(t) {
                        this._octaves = t;
                        var e = this._baseFrequency * Math.pow(2, t);
                        this._lfoL.max = e, this._lfoR.max = e
                    }
                }), Object.defineProperty(t.Phaser.prototype, "baseFrequency", {
                    get: function() {
                        return this._baseFrequency
                    },
                    set: function(t) {
                        this._baseFrequency = t, this._lfoL.min = t, this._lfoR.min = t, this.octaves = this._octaves
                    }
                }), t.Phaser.prototype.dispose = function() {
                    t.StereoEffect.prototype.dispose.call(this), this._writable(["frequency", "Q"]), this.Q.dispose(), this.Q = null, this._lfoL.dispose(), this._lfoL = null, this._lfoR.dispose(), this._lfoR = null;
                    for (var e = 0; e < this._filtersL.length; e++) this._filtersL[e].disconnect(), this._filtersL[e] = null;
                    this._filtersL = null;
                    for (var i = 0; i < this._filtersR.length; i++) this._filtersR[i].disconnect(), this._filtersR[i] = null;
                    return this._filtersR = null, this.frequency = null, this
                }, t.Phaser
            }), t(function(t) {
                return t.PingPongDelay = function() {
                    var e = this.optionsObject(arguments, ["delayTime", "feedback"], t.PingPongDelay.defaults);
                    t.StereoXFeedbackEffect.call(this, e), this._leftDelay = new t.Delay(0, e.maxDelayTime), this._rightDelay = new t.Delay(0, e.maxDelayTime), this._rightPreDelay = new t.Delay(0, e.maxDelayTime), this.delayTime = new t.Signal(e.delayTime, t.Type.Time), this.effectSendL.chain(this._leftDelay, this.effectReturnL), this.effectSendR.chain(this._rightPreDelay, this._rightDelay, this.effectReturnR), this.delayTime.fan(this._leftDelay.delayTime, this._rightDelay.delayTime, this._rightPreDelay.delayTime), this._feedbackLR.disconnect(), this._feedbackLR.connect(this._rightDelay), this._readOnly(["delayTime"])
                }, t.extend(t.PingPongDelay, t.StereoXFeedbackEffect), t.PingPongDelay.defaults = {
                    delayTime: .25,
                    maxDelayTime: 1
                }, t.PingPongDelay.prototype.dispose = function() {
                    return t.StereoXFeedbackEffect.prototype.dispose.call(this), this._leftDelay.dispose(), this._leftDelay = null, this._rightDelay.dispose(), this._rightDelay = null, this._rightPreDelay.dispose(), this._rightPreDelay = null, this._writable(["delayTime"]), this.delayTime.dispose(), this.delayTime = null, this
                }, t.PingPongDelay
            }), t(function(t) {
                return t.PitchShift = function() {
                    var e = this.optionsObject(arguments, ["pitch"], t.PitchShift.defaults);
                    t.FeedbackEffect.call(this, e), this._frequency = new t.Signal(0), this._delayA = new t.Delay(0, 1), this._lfoA = new t.LFO({
                        min: 0,
                        max: .1,
                        type: "sawtooth"
                    }).connect(this._delayA.delayTime), this._delayB = new t.Delay(0, 1), this._lfoB = new t.LFO({
                        min: 0,
                        max: .1,
                        type: "sawtooth",
                        phase: 180
                    }).connect(this._delayB.delayTime), this._crossFade = new t.CrossFade, this._crossFadeLFO = new t.LFO({
                        min: 0,
                        max: 1,
                        type: "triangle",
                        phase: 90
                    }).connect(this._crossFade.fade), this._feedbackDelay = new t.Delay(e.delayTime), this.delayTime = this._feedbackDelay.delayTime, this._readOnly("delayTime"), this._pitch = e.pitch, this._windowSize = e.windowSize, this._delayA.connect(this._crossFade.a), this._delayB.connect(this._crossFade.b), this._frequency.fan(this._lfoA.frequency, this._lfoB.frequency, this._crossFadeLFO.frequency), this.effectSend.fan(this._delayA, this._delayB), this._crossFade.chain(this._feedbackDelay, this.effectReturn);
                    var i = this.now();
                    this._lfoA.start(i), this._lfoB.start(i), this._crossFadeLFO.start(i), this.windowSize = this._windowSize
                }, t.extend(t.PitchShift, t.FeedbackEffect), t.PitchShift.defaults = {
                    pitch: 0,
                    windowSize: .1,
                    delayTime: 0,
                    feedback: 0
                }, Object.defineProperty(t.PitchShift.prototype, "pitch", {
                    get: function() {
                        return this._pitch
                    },
                    set: function(t) {
                        this._pitch = t;
                        var e = 0;
                        t < 0 ? (this._lfoA.min = 0, this._lfoA.max = this._windowSize, this._lfoB.min = 0, this._lfoB.max = this._windowSize, e = this.intervalToFrequencyRatio(t - 1) + 1) : (this._lfoA.min = this._windowSize, this._lfoA.max = 0, this._lfoB.min = this._windowSize, this._lfoB.max = 0, e = this.intervalToFrequencyRatio(t) - 1), this._frequency.value = e * (1.2 / this._windowSize)
                    }
                }), Object.defineProperty(t.PitchShift.prototype, "windowSize", {
                    get: function() {
                        return this._windowSize
                    },
                    set: function(t) {
                        this._windowSize = this.toSeconds(t), this.pitch = this._pitch
                    }
                }), t.PitchShift.prototype.dispose = function() {
                    return t.FeedbackEffect.prototype.dispose.call(this), this._frequency.dispose(), this._frequency = null, this._delayA.disconnect(), this._delayA = null, this._delayB.disconnect(), this._delayB = null, this._lfoA.dispose(), this._lfoA = null, this._lfoB.dispose(), this._lfoB = null, this._crossFade.dispose(), this._crossFade = null, this._crossFadeLFO.dispose(), this._crossFadeLFO = null, this._writable("delayTime"), this._feedbackDelay.dispose(), this._feedbackDelay = null, this.delayTime = null, this
                }, t.PitchShift
            }), t(function(t) {
                return t.StereoFeedbackEffect = function() {
                    var e = this.optionsObject(arguments, ["feedback"], t.FeedbackEffect.defaults);
                    t.StereoEffect.call(this, e), this.feedback = new t.Signal(e.feedback, t.Type.NormalRange), this._feedbackL = new t.Gain, this._feedbackR = new t.Gain, this.effectReturnL.chain(this._feedbackL, this.effectSendL), this.effectReturnR.chain(this._feedbackR, this.effectSendR), this.feedback.fan(this._feedbackL.gain, this._feedbackR.gain), this._readOnly(["feedback"])
                }, t.extend(t.StereoFeedbackEffect, t.FeedbackEffect), t.StereoFeedbackEffect.prototype.dispose = function() {
                    return t.StereoEffect.prototype.dispose.call(this), this._writable(["feedback"]), this.feedback.dispose(), this.feedback = null, this._feedbackL.dispose(), this._feedbackL = null, this._feedbackR.dispose(), this._feedbackR = null, this
                }, t.StereoFeedbackEffect
            }), t(function(t) {
                return t.StereoWidener = function() {
                    var e = this.optionsObject(arguments, ["width"], t.StereoWidener.defaults);
                    t.MidSideEffect.call(this, e), this.width = new t.Signal(e.width, t.Type.NormalRange), this._midMult = new t.Expr("$0 * ($1 * (1 - $2))"), this._sideMult = new t.Expr("$0 * ($1 * $2)"), this._two = new t.Signal(2), this._two.connect(this._midMult, 0, 1), this.width.connect(this._midMult, 0, 2), this._two.connect(this._sideMult, 0, 1), this.width.connect(this._sideMult, 0, 2), this.midSend.chain(this._midMult, this.midReturn), this.sideSend.chain(this._sideMult, this.sideReturn), this._readOnly(["width"])
                }, t.extend(t.StereoWidener, t.MidSideEffect), t.StereoWidener.defaults = {
                    width: .5
                }, t.StereoWidener.prototype.dispose = function() {
                    return t.MidSideEffect.prototype.dispose.call(this), this._writable(["width"]), this.width.dispose(), this.width = null, this._midMult.dispose(), this._midMult = null, this._sideMult.dispose(), this._sideMult = null, this._two.dispose(), this._two = null, this
                }, t.StereoWidener
            }), t(function(t) {
                return t.Tremolo = function() {
                    var e = this.optionsObject(arguments, ["frequency", "depth"], t.Tremolo.defaults);
                    t.StereoEffect.call(this, e), this._lfoL = new t.LFO({
                        phase: e.spread,
                        min: 1,
                        max: 0
                    }), this._lfoR = new t.LFO({
                        phase: e.spread,
                        min: 1,
                        max: 0
                    }), this._amplitudeL = new t.Gain, this._amplitudeR = new t.Gain, this.frequency = new t.Signal(e.frequency, t.Type.Frequency), this.depth = new t.Signal(e.depth, t.Type.NormalRange), this._readOnly(["frequency", "depth"]), this.effectSendL.chain(this._amplitudeL, this.effectReturnL), this.effectSendR.chain(this._amplitudeR, this.effectReturnR), this._lfoL.connect(this._amplitudeL.gain), this._lfoR.connect(this._amplitudeR.gain), this.frequency.fan(this._lfoL.frequency, this._lfoR.frequency), this.depth.fan(this._lfoR.amplitude, this._lfoL.amplitude), this.type = e.type, this.spread = e.spread
                }, t.extend(t.Tremolo, t.StereoEffect), t.Tremolo.defaults = {
                    frequency: 10,
                    type: "sine",
                    depth: .5,
                    spread: 180
                }, t.Tremolo.prototype.start = function(t) {
                    return this._lfoL.start(t), this._lfoR.start(t), this
                }, t.Tremolo.prototype.stop = function(t) {
                    return this._lfoL.stop(t), this._lfoR.stop(t), this
                }, t.Tremolo.prototype.sync = function(t) {
                    return this._lfoL.sync(t), this._lfoR.sync(t), this
                }, t.Tremolo.prototype.unsync = function() {
                    return this._lfoL.unsync(), this._lfoR.unsync(), this
                }, Object.defineProperty(t.Tremolo.prototype, "type", {
                    get: function() {
                        return this._lfoL.type
                    },
                    set: function(t) {
                        this._lfoL.type = t, this._lfoR.type = t
                    }
                }), Object.defineProperty(t.Tremolo.prototype, "spread", {
                    get: function() {
                        return this._lfoR.phase - this._lfoL.phase
                    },
                    set: function(t) {
                        this._lfoL.phase = 90 - t / 2, this._lfoR.phase = t / 2 + 90
                    }
                }), t.Tremolo.prototype.dispose = function() {
                    return t.StereoEffect.prototype.dispose.call(this), this._writable(["frequency", "depth"]), this._lfoL.dispose(), this._lfoL = null, this._lfoR.dispose(), this._lfoR = null, this._amplitudeL.dispose(), this._amplitudeL = null, this._amplitudeR.dispose(), this._amplitudeR = null, this.frequency = null, this.depth = null, this
                }, t.Tremolo
            }), t(function(t) {
                return t.Vibrato = function() {
                    var e = this.optionsObject(arguments, ["frequency", "depth"], t.Vibrato.defaults);
                    t.Effect.call(this, e), this._delayNode = new t.Delay(0, e.maxDelay), this._lfo = new t.LFO({
                        type: e.type,
                        min: 0,
                        max: e.maxDelay,
                        frequency: e.frequency,
                        phase: -90
                    }).start().connect(this._delayNode.delayTime), this.frequency = this._lfo.frequency, this.depth = this._lfo.amplitude, this.depth.value = e.depth, this._readOnly(["frequency", "depth"]), this.effectSend.chain(this._delayNode, this.effectReturn)
                }, t.extend(t.Vibrato, t.Effect), t.Vibrato.defaults = {
                    maxDelay: .005,
                    frequency: 5,
                    depth: .1,
                    type: "sine"
                }, Object.defineProperty(t.Vibrato.prototype, "type", {
                    get: function() {
                        return this._lfo.type
                    },
                    set: function(t) {
                        this._lfo.type = t
                    }
                }), t.Vibrato.prototype.dispose = function() {
                    t.Effect.prototype.dispose.call(this), this._delayNode.dispose(), this._delayNode = null, this._lfo.dispose(), this._lfo = null, this._writable(["frequency", "depth"]), this.frequency = null, this.depth = null
                }, t.Vibrato
            }), t(function(t) {
                return t.Event = function() {
                    var e = this.optionsObject(arguments, ["callback", "value"], t.Event.defaults);
                    this._loop = e.loop, this.callback = e.callback, this.value = e.value, this._loopStart = this.toTicks(e.loopStart), this._loopEnd = this.toTicks(e.loopEnd), this._state = new t.TimelineState(t.State.Stopped), this._playbackRate = 1, this._startOffset = 0, this.probability = e.probability, this.humanize = e.humanize, this.mute = e.mute, this.playbackRate = e.playbackRate
                }, t.extend(t.Event), t.Event.defaults = {
                    callback: t.noOp,
                    loop: !1,
                    loopEnd: "1m",
                    loopStart: 0,
                    playbackRate: 1,
                    value: null,
                    probability: 1,
                    mute: !1,
                    humanize: !1
                }, t.Event.prototype._rescheduleEvents = function(e) {
                    return e = this.defaultArg(e, -1), this._state.forEachFrom(e, function(e) {
                        var i;
                        if (e.state === t.State.Started) {
                            this.isUndef(e.id) || t.Transport.clear(e.id);
                            var n = e.time + Math.round(this.startOffset / this._playbackRate);
                            if (this._loop) {
                                i = 1 / 0, this.isNumber(this._loop) && (i = this._loop * this._getLoopDuration());
                                var s = this._state.getAfter(n);
                                null !== s && (i = Math.min(i, s.time - n)), i !== 1 / 0 && (this._state.setStateAtTime(t.State.Stopped, n + i + 1), i = t.Time(i, "i"));
                                var r = t.Time(this._getLoopDuration(), "i");
                                e.id = t.Transport.scheduleRepeat(this._tick.bind(this), r, t.TransportTime(n, "i"), i)
                            } else e.id = t.Transport.schedule(this._tick.bind(this), n + "i")
                        }
                    }.bind(this)), this
                }, Object.defineProperty(t.Event.prototype, "state", {
                    get: function() {
                        return this._state.getValueAtTime(t.Transport.ticks)
                    }
                }), Object.defineProperty(t.Event.prototype, "startOffset", {
                    get: function() {
                        return this._startOffset
                    },
                    set: function(t) {
                        this._startOffset = t
                    }
                }), t.Event.prototype.start = function(e) {
                    return e = this.toTicks(e), this._state.getValueAtTime(e) === t.State.Stopped && (this._state.add({
                        state: t.State.Started,
                        time: e,
                        id: void 0
                    }), this._rescheduleEvents(e)), this
                }, t.Event.prototype.stop = function(e) {
                    if (this.cancel(e), e = this.toTicks(e), this._state.getValueAtTime(e) === t.State.Started) {
                        this._state.setStateAtTime(t.State.Stopped, e);
                        var i = this._state.getBefore(e),
                            n = e;
                        null !== i && (n = i.time), this._rescheduleEvents(n)
                    }
                    return this
                }, t.Event.prototype.cancel = function(e) {
                    return e = this.defaultArg(e, -1 / 0), e = this.toTicks(e), this._state.forEachFrom(e, function(e) {
                        t.Transport.clear(e.id)
                    }), this._state.cancel(e), this
                }, t.Event.prototype._tick = function(e) {
                    if (!this.mute && this._state.getValueAtTime(t.Transport.ticks) === t.State.Started) {
                        if (this.probability < 1 && Math.random() > this.probability) return;
                        if (this.humanize) {
                            var i = .02;
                            this.isBoolean(this.humanize) || (i = this.toSeconds(this.humanize)), e += (2 * Math.random() - 1) * i
                        }
                        this.callback(e, this.value)
                    }
                }, t.Event.prototype._getLoopDuration = function() {
                    return Math.round((this._loopEnd - this._loopStart) / this._playbackRate)
                }, Object.defineProperty(t.Event.prototype, "loop", {
                    get: function() {
                        return this._loop
                    },
                    set: function(t) {
                        this._loop = t, this._rescheduleEvents()
                    }
                }), Object.defineProperty(t.Event.prototype, "playbackRate", {
                    get: function() {
                        return this._playbackRate
                    },
                    set: function(t) {
                        this._playbackRate = t, this._rescheduleEvents()
                    }
                }), Object.defineProperty(t.Event.prototype, "loopEnd", {
                    get: function() {
                        return t.TransportTime(this._loopEnd, "i").toNotation()
                    },
                    set: function(t) {
                        this._loopEnd = this.toTicks(t), this._loop && this._rescheduleEvents()
                    }
                }), Object.defineProperty(t.Event.prototype, "loopStart", {
                    get: function() {
                        return t.TransportTime(this._loopStart, "i").toNotation()
                    },
                    set: function(t) {
                        this._loopStart = this.toTicks(t), this._loop && this._rescheduleEvents()
                    }
                }), Object.defineProperty(t.Event.prototype, "progress", {
                    get: function() {
                        if (this._loop) {
                            var e = t.Transport.ticks,
                                i = this._state.get(e);
                            if (null !== i && i.state === t.State.Started) {
                                var n = this._getLoopDuration();
                                return (e - i.time) % n / n
                            }
                            return 0
                        }
                        return 0
                    }
                }), t.Event.prototype.dispose = function() {
                    this.cancel(), this._state.dispose(), this._state = null, this.callback = null, this.value = null
                }, t.Event
            }), t(function(t) {
                return t.Loop = function() {
                    var e = this.optionsObject(arguments, ["callback", "interval"], t.Loop.defaults);
                    this._event = new t.Event({
                        callback: this._tick.bind(this),
                        loop: !0,
                        loopEnd: e.interval,
                        playbackRate: e.playbackRate,
                        probability: e.probability
                    }), this.callback = e.callback, this.iterations = e.iterations
                }, t.extend(t.Loop), t.Loop.defaults = {
                    interval: "4n",
                    callback: t.noOp,
                    playbackRate: 1,
                    iterations: 1 / 0,
                    probability: !0,
                    mute: !1
                }, t.Loop.prototype.start = function(t) {
                    return this._event.start(t), this
                }, t.Loop.prototype.stop = function(t) {
                    return this._event.stop(t), this
                }, t.Loop.prototype.cancel = function(t) {
                    return this._event.cancel(t), this
                }, t.Loop.prototype._tick = function(t) {
                    this.callback(t)
                }, Object.defineProperty(t.Loop.prototype, "state", {
                    get: function() {
                        return this._event.state
                    }
                }), Object.defineProperty(t.Loop.prototype, "progress", {
                    get: function() {
                        return this._event.progress
                    }
                }), Object.defineProperty(t.Loop.prototype, "interval", {
                    get: function() {
                        return this._event.loopEnd
                    },
                    set: function(t) {
                        this._event.loopEnd = t
                    }
                }), Object.defineProperty(t.Loop.prototype, "playbackRate", {
                    get: function() {
                        return this._event.playbackRate
                    },
                    set: function(t) {
                        this._event.playbackRate = t
                    }
                }), Object.defineProperty(t.Loop.prototype, "humanize", {
                    get: function() {
                        return this._event.humanize
                    },
                    set: function(t) {
                        this._event.humanize = t
                    }
                }), Object.defineProperty(t.Loop.prototype, "probability", {
                    get: function() {
                        return this._event.probability
                    },
                    set: function(t) {
                        this._event.probability = t
                    }
                }), Object.defineProperty(t.Loop.prototype, "mute", {
                    get: function() {
                        return this._event.mute
                    },
                    set: function(t) {
                        this._event.mute = t
                    }
                }), Object.defineProperty(t.Loop.prototype, "iterations", {
                    get: function() {
                        return !0 === this._event.loop ? 1 / 0 : this._event.loop
                    },
                    set: function(t) {
                        this._event.loop = t === 1 / 0 || t
                    }
                }), t.Loop.prototype.dispose = function() {
                    this._event.dispose(), this._event = null, this.callback = null
                }, t.Loop
            }), t(function(t) {
                return t.Part = function() {
                    var e = this.optionsObject(arguments, ["callback", "events"], t.Part.defaults);
                    this._loop = e.loop, this._loopStart = this.toTicks(e.loopStart), this._loopEnd = this.toTicks(e.loopEnd), this._playbackRate = e.playbackRate, this._probability = e.probability, this._humanize = e.humanize, this._startOffset = 0, this._state = new t.TimelineState(t.State.Stopped), this._events = [], this.callback = e.callback, this.mute = e.mute;
                    var i = this.defaultArg(e.events, []);
                    if (!this.isUndef(e.events))
                        for (var n = 0; n < i.length; n++) Array.isArray(i[n]) ? this.add(i[n][0], i[n][1]) : this.add(i[n])
                }, t.extend(t.Part, t.Event), t.Part.defaults = {
                    callback: t.noOp,
                    loop: !1,
                    loopEnd: "1m",
                    loopStart: 0,
                    playbackRate: 1,
                    probability: 1,
                    humanize: !1,
                    mute: !1
                }, t.Part.prototype.start = function(e, i) {
                    var n = this.toTicks(e);
                    return this._state.getValueAtTime(n) !== t.State.Started && (i = this._loop ? this.defaultArg(i, this._loopStart) : this.defaultArg(i, 0), i = this.toTicks(i), this._state.add({
                        state: t.State.Started,
                        time: n,
                        offset: i
                    }), this._forEach(function(t) {
                        this._startNote(t, n, i)
                    })), this
                }, t.Part.prototype._startNote = function(e, i, n) {
                    i -= n, this._loop ? e.startOffset >= this._loopStart && e.startOffset < this._loopEnd ? (e.startOffset < n && (i += this._getLoopDuration()), e.start(t.TransportTime(i, "i"))) : e.startOffset < this._loopStart && e.startOffset >= n && (e.loop = !1, e.start(t.TransportTime(i, "i"))) : e.startOffset >= n && e.start(t.TransportTime(i, "i"))
                }, Object.defineProperty(t.Part.prototype, "startOffset", {
                    get: function() {
                        return this._startOffset
                    },
                    set: function(t) {
                        this._startOffset = t, this._forEach(function(t) {
                            t.startOffset += this._startOffset
                        })
                    }
                }), t.Part.prototype.stop = function(e) {
                    var i = this.toTicks(e);
                    return this._state.cancel(i), this._state.setStateAtTime(t.State.Stopped, i), this._forEach(function(t) {
                        t.stop(e)
                    }), this
                }, t.Part.prototype.at = function(e, i) {
                    e = t.TransportTime(e);
                    for (var n = t.Time(1, "i").toSeconds(), s = 0; s < this._events.length; s++) {
                        var r = this._events[s];
                        if (Math.abs(e.toTicks() - r.startOffset) < n) return this.isUndef(i) || (r.value = i), r
                    }
                    return this.isUndef(i) ? null : (this.add(e, i), this._events[this._events.length - 1])
                }, t.Part.prototype.add = function(e, i) {
                    e.hasOwnProperty("time") && (i = e, e = i.time), e = this.toTicks(e);
                    var n;
                    return i instanceof t.Event ? (n = i, n.callback = this._tick.bind(this)) : n = new t.Event({
                        callback: this._tick.bind(this),
                        value: i
                    }), n.startOffset = e, n.set({
                        loopEnd: this.loopEnd,
                        loopStart: this.loopStart,
                        loop: this.loop,
                        humanize: this.humanize,
                        playbackRate: this.playbackRate,
                        probability: this.probability
                    }), this._events.push(n), this._restartEvent(n), this
                }, t.Part.prototype._restartEvent = function(e) {
                    this._state.forEach(function(i) {
                        i.state === t.State.Started ? this._startNote(e, i.time, i.offset) : e.stop(t.TransportTime(i.time, "i"))
                    }.bind(this))
                }, t.Part.prototype.remove = function(e, i) {
                    e.hasOwnProperty("time") && (i = e, e = i.time), e = this.toTicks(e);
                    for (var n = this._events.length - 1; n >= 0; n--) {
                        var s = this._events[n];
                        s instanceof t.Part ? s.remove(e, i) : s.startOffset === e && (this.isUndef(i) || !this.isUndef(i) && s.value === i) && (this._events.splice(n, 1), s.dispose())
                    }
                    return this
                }, t.Part.prototype.removeAll = function() {
                    return this._forEach(function(t) {
                        t.dispose()
                    }), this._events = [], this
                }, t.Part.prototype.cancel = function(t) {
                    return t = this.toTicks(t), this._forEach(function(e) {
                        e.cancel(t)
                    }), this._state.cancel(t), this
                }, t.Part.prototype._forEach = function(e, i) {
                    i = this.defaultArg(i, this);
                    for (var n = this._events.length - 1; n >= 0; n--) {
                        var s = this._events[n];
                        s instanceof t.Part ? s._forEach(e, i) : e.call(i, s)
                    }
                    return this
                }, t.Part.prototype._setAll = function(t, e) {
                    this._forEach(function(i) {
                        i[t] = e
                    })
                }, t.Part.prototype._tick = function(t, e) {
                    this.mute || this.callback(t, e)
                }, t.Part.prototype._testLoopBoundries = function(e) {
                    e.startOffset < this._loopStart || e.startOffset >= this._loopEnd ? e.cancel(0) : e.state === t.State.Stopped && this._restartEvent(e)
                }, Object.defineProperty(t.Part.prototype, "probability", {
                    get: function() {
                        return this._probability
                    },
                    set: function(t) {
                        this._probability = t, this._setAll("probability", t)
                    }
                }), Object.defineProperty(t.Part.prototype, "humanize", {
                    get: function() {
                        return this._humanize
                    },
                    set: function(t) {
                        this._humanize = t, this._setAll("humanize", t)
                    }
                }), Object.defineProperty(t.Part.prototype, "loop", {
                    get: function() {
                        return this._loop
                    },
                    set: function(t) {
                        this._loop = t, this._forEach(function(e) {
                            e._loopStart = this._loopStart, e._loopEnd = this._loopEnd, e.loop = t, this._testLoopBoundries(e)
                        })
                    }
                }), Object.defineProperty(t.Part.prototype, "loopEnd", {
                    get: function() {
                        return t.TransportTime(this._loopEnd, "i").toNotation()
                    },
                    set: function(t) {
                        this._loopEnd = this.toTicks(t), this._loop && this._forEach(function(e) {
                            e.loopEnd = t, this._testLoopBoundries(e)
                        })
                    }
                }), Object.defineProperty(t.Part.prototype, "loopStart", {
                    get: function() {
                        return t.TransportTime(this._loopStart, "i").toNotation()
                    },
                    set: function(t) {
                        this._loopStart = this.toTicks(t), this._loop && this._forEach(function(t) {
                            t.loopStart = this.loopStart, this._testLoopBoundries(t)
                        })
                    }
                }), Object.defineProperty(t.Part.prototype, "playbackRate", {
                    get: function() {
                        return this._playbackRate
                    },
                    set: function(t) {
                        this._playbackRate = t, this._setAll("playbackRate", t)
                    }
                }), Object.defineProperty(t.Part.prototype, "length", {
                    get: function() {
                        return this._events.length
                    }
                }), t.Part.prototype.dispose = function() {
                    return this.removeAll(), this._state.dispose(), this._state = null, this.callback = null, this._events = null, this
                }, t.Part
            }), t(function(t) {
                return t.Pattern = function() {
                    var e = this.optionsObject(arguments, ["callback", "values", "pattern"], t.Pattern.defaults);
                    t.Loop.call(this, e), this._pattern = new t.CtrlPattern({
                        values: e.values,
                        type: e.pattern,
                        index: e.index
                    })
                }, t.extend(t.Pattern, t.Loop), t.Pattern.defaults = {
                    pattern: t.CtrlPattern.Type.Up,
                    values: []
                }, t.Pattern.prototype._tick = function(t) {
                    this.callback(t, this._pattern.value), this._pattern.next()
                }, Object.defineProperty(t.Pattern.prototype, "index", {
                    get: function() {
                        return this._pattern.index
                    },
                    set: function(t) {
                        this._pattern.index = t
                    }
                }), Object.defineProperty(t.Pattern.prototype, "values", {
                    get: function() {
                        return this._pattern.values
                    },
                    set: function(t) {
                        this._pattern.values = t
                    }
                }), Object.defineProperty(t.Pattern.prototype, "value", {
                    get: function() {
                        return this._pattern.value
                    }
                }), Object.defineProperty(t.Pattern.prototype, "pattern", {
                    get: function() {
                        return this._pattern.type
                    },
                    set: function(t) {
                        this._pattern.type = t
                    }
                }), t.Pattern.prototype.dispose = function() {
                    t.Loop.prototype.dispose.call(this), this._pattern.dispose(), this._pattern = null
                }, t.Pattern
            }), t(function(t) {
                return t.Sequence = function() {
                    var e = this.optionsObject(arguments, ["callback", "events", "subdivision"], t.Sequence.defaults),
                        i = e.events;
                    if (delete e.events, t.Part.call(this, e), this._subdivision = this.toTicks(e.subdivision), this.isUndef(e.loopEnd) && !this.isUndef(i) && (this._loopEnd = i.length * this._subdivision), this._loop = !0, !this.isUndef(i))
                        for (var n = 0; n < i.length; n++) this.add(n, i[n])
                }, t.extend(t.Sequence, t.Part), t.Sequence.defaults = {
                    subdivision: "4n"
                }, Object.defineProperty(t.Sequence.prototype, "subdivision", {
                    get: function() {
                        return t.Time(this._subdivision, "i").toNotation()
                    }
                }), t.Sequence.prototype.at = function(e, i) {
                    return this.isArray(i) && this.remove(e), t.Part.prototype.at.call(this, this._indexTime(e), i)
                }, t.Sequence.prototype.add = function(e, i) {
                    if (null === i) return this;
                    if (this.isArray(i)) {
                        var n = Math.round(this._subdivision / i.length);
                        i = new t.Sequence(this._tick.bind(this), i, t.Time(n, "i"))
                    }
                    return t.Part.prototype.add.call(this, this._indexTime(e), i), this
                }, t.Sequence.prototype.remove = function(e, i) {
                    return t.Part.prototype.remove.call(this, this._indexTime(e), i), this
                }, t.Sequence.prototype._indexTime = function(e) {
                    return e instanceof t.TransportTime ? e : t.TransportTime(e * this._subdivision + this.startOffset, "i")
                }, t.Sequence.prototype.dispose = function() {
                    return t.Part.prototype.dispose.call(this), this
                }, t.Sequence
            }), t(function(t) {
                return t.PulseOscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "width"], t.Oscillator.defaults);
                    t.Source.call(this, e), this.width = new t.Signal(e.width, t.Type.NormalRange), this._widthGate = new t.Gain, this._sawtooth = new t.Oscillator({
                        frequency: e.frequency,
                        detune: e.detune,
                        type: "sawtooth",
                        phase: e.phase
                    }), this.frequency = this._sawtooth.frequency, this.detune = this._sawtooth.detune, this._thresh = new t.WaveShaper(function(t) {
                        return t < 0 ? -1 : 1
                    }), this._sawtooth.chain(this._thresh, this.output), this.width.chain(this._widthGate, this._thresh), this._readOnly(["width", "frequency", "detune"])
                }, t.extend(t.PulseOscillator, t.Oscillator), t.PulseOscillator.defaults = {
                    frequency: 440,
                    detune: 0,
                    phase: 0,
                    width: .2
                }, t.PulseOscillator.prototype._start = function(t) {
                    t = this.toSeconds(t), this._sawtooth.start(t), this._widthGate.gain.setValueAtTime(1, t)
                }, t.PulseOscillator.prototype._stop = function(t) {
                    t = this.toSeconds(t), this._sawtooth.stop(t), this._widthGate.gain.setValueAtTime(0, t)
                }, Object.defineProperty(t.PulseOscillator.prototype, "phase", {
                    get: function() {
                        return this._sawtooth.phase
                    },
                    set: function(t) {
                        this._sawtooth.phase = t
                    }
                }), Object.defineProperty(t.PulseOscillator.prototype, "type", {
                    get: function() {
                        return "pulse"
                    }
                }), Object.defineProperty(t.PulseOscillator.prototype, "partials", {
                    get: function() {
                        return []
                    }
                }), t.PulseOscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this._sawtooth.dispose(), this._sawtooth = null, this._writable(["width", "frequency", "detune"]), this.width.dispose(), this.width = null, this._widthGate.dispose(), this._widthGate = null, this._thresh.dispose(), this._thresh = null, this.frequency = null, this.detune = null, this
                }, t.PulseOscillator
            }), t(function(t) {
                return t.PWMOscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "modulationFrequency"], t.PWMOscillator.defaults);
                    t.Source.call(this, e), this._pulse = new t.PulseOscillator(e.modulationFrequency), this._pulse._sawtooth.type = "sine", this._modulator = new t.Oscillator({
                        frequency: e.frequency,
                        detune: e.detune,
                        phase: e.phase
                    }), this._scale = new t.Multiply(2), this.frequency = this._modulator.frequency, this.detune = this._modulator.detune, this.modulationFrequency = this._pulse.frequency, this._modulator.chain(this._scale, this._pulse.width), this._pulse.connect(this.output), this._readOnly(["modulationFrequency", "frequency", "detune"])
                }, t.extend(t.PWMOscillator, t.Oscillator), t.PWMOscillator.defaults = {
                    frequency: 440,
                    detune: 0,
                    phase: 0,
                    modulationFrequency: .4
                }, t.PWMOscillator.prototype._start = function(t) {
                    t = this.toSeconds(t), this._modulator.start(t), this._pulse.start(t)
                }, t.PWMOscillator.prototype._stop = function(t) {
                    t = this.toSeconds(t), this._modulator.stop(t), this._pulse.stop(t)
                }, Object.defineProperty(t.PWMOscillator.prototype, "type", {
                    get: function() {
                        return "pwm"
                    }
                }), Object.defineProperty(t.PWMOscillator.prototype, "partials", {
                    get: function() {
                        return []
                    }
                }), Object.defineProperty(t.PWMOscillator.prototype, "phase", {
                    get: function() {
                        return this._modulator.phase
                    },
                    set: function(t) {
                        this._modulator.phase = t
                    }
                }), t.PWMOscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this._pulse.dispose(), this._pulse = null, this._scale.dispose(), this._scale = null, this._modulator.dispose(), this._modulator = null, this._writable(["modulationFrequency", "frequency", "detune"]), this.frequency = null, this.detune = null, this.modulationFrequency = null, this
                }, t.PWMOscillator
            }), t(function(t) {
                return t.FMOscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "type", "modulationType"], t.FMOscillator.defaults);
                    t.Source.call(this, e), this._carrier = new t.Oscillator(e.frequency, e.type), this.frequency = new t.Signal(e.frequency, t.Type.Frequency), this.detune = this._carrier.detune, this.detune.value = e.detune, this.modulationIndex = new t.Multiply(e.modulationIndex), this.modulationIndex.units = t.Type.Positive, this._modulator = new t.Oscillator(e.frequency, e.modulationType), this.harmonicity = new t.Multiply(e.harmonicity), this.harmonicity.units = t.Type.Positive, this._modulationNode = new t.Gain(0), this.frequency.connect(this._carrier.frequency), this.frequency.chain(this.harmonicity, this._modulator.frequency), this.frequency.chain(this.modulationIndex, this._modulationNode), this._modulator.connect(this._modulationNode.gain), this._modulationNode.connect(this._carrier.frequency), this._carrier.connect(this.output), this.detune.connect(this._modulator.detune), this.phase = e.phase, this._readOnly(["modulationIndex", "frequency", "detune", "harmonicity"])
                }, t.extend(t.FMOscillator, t.Oscillator), t.FMOscillator.defaults = {
                    frequency: 440,
                    detune: 0,
                    phase: 0,
                    modulationIndex: 2,
                    modulationType: "square",
                    harmonicity: 1
                }, t.FMOscillator.prototype._start = function(t) {
                    t = this.toSeconds(t), this._modulator.start(t), this._carrier.start(t)
                }, t.FMOscillator.prototype._stop = function(t) {
                    t = this.toSeconds(t), this._modulator.stop(t), this._carrier.stop(t)
                }, Object.defineProperty(t.FMOscillator.prototype, "type", {
                    get: function() {
                        return this._carrier.type
                    },
                    set: function(t) {
                        this._carrier.type = t
                    }
                }), Object.defineProperty(t.FMOscillator.prototype, "modulationType", {
                    get: function() {
                        return this._modulator.type
                    },
                    set: function(t) {
                        this._modulator.type = t
                    }
                }), Object.defineProperty(t.FMOscillator.prototype, "phase", {
                    get: function() {
                        return this._carrier.phase
                    },
                    set: function(t) {
                        this._carrier.phase = t, this._modulator.phase = t
                    }
                }), Object.defineProperty(t.FMOscillator.prototype, "partials", {
                    get: function() {
                        return this._carrier.partials
                    },
                    set: function(t) {
                        this._carrier.partials = t
                    }
                }), t.FMOscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this._writable(["modulationIndex", "frequency", "detune", "harmonicity"]), this.frequency.dispose(), this.frequency = null, this.detune = null, this.harmonicity.dispose(), this.harmonicity = null, this._carrier.dispose(), this._carrier = null, this._modulator.dispose(), this._modulator = null, this._modulationNode.dispose(), this._modulationNode = null, this.modulationIndex.dispose(), this.modulationIndex = null, this
                }, t.FMOscillator
            }), t(function(t) {
                return t.AMOscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "type", "modulationType"], t.AMOscillator.defaults);
                    t.Source.call(this, e), this._carrier = new t.Oscillator(e.frequency, e.type), this.frequency = this._carrier.frequency, this.detune = this._carrier.detune, this.detune.value = e.detune, this._modulator = new t.Oscillator(e.frequency, e.modulationType), this._modulationScale = new t.AudioToGain, this.harmonicity = new t.Multiply(e.harmonicity), this.harmonicity.units = t.Type.Positive, this._modulationNode = new t.Gain(0), this.frequency.chain(this.harmonicity, this._modulator.frequency), this.detune.connect(this._modulator.detune), this._modulator.chain(this._modulationScale, this._modulationNode.gain), this._carrier.chain(this._modulationNode, this.output), this.phase = e.phase, this._readOnly(["frequency", "detune", "harmonicity"])
                }, t.extend(t.AMOscillator, t.Oscillator), t.AMOscillator.defaults = {
                    frequency: 440,
                    detune: 0,
                    phase: 0,
                    modulationType: "square",
                    harmonicity: 1
                }, t.AMOscillator.prototype._start = function(t) {
                    t = this.toSeconds(t), this._modulator.start(t), this._carrier.start(t)
                }, t.AMOscillator.prototype._stop = function(t) {
                    t = this.toSeconds(t), this._modulator.stop(t), this._carrier.stop(t)
                }, Object.defineProperty(t.AMOscillator.prototype, "type", {
                    get: function() {
                        return this._carrier.type
                    },
                    set: function(t) {
                        this._carrier.type = t
                    }
                }), Object.defineProperty(t.AMOscillator.prototype, "modulationType", {
                    get: function() {
                        return this._modulator.type
                    },
                    set: function(t) {
                        this._modulator.type = t
                    }
                }), Object.defineProperty(t.AMOscillator.prototype, "phase", {
                    get: function() {
                        return this._carrier.phase
                    },
                    set: function(t) {
                        this._carrier.phase = t, this._modulator.phase = t
                    }
                }), Object.defineProperty(t.AMOscillator.prototype, "partials", {
                    get: function() {
                        return this._carrier.partials
                    },
                    set: function(t) {
                        this._carrier.partials = t
                    }
                }), t.AMOscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this._writable(["frequency", "detune", "harmonicity"]), this.frequency = null, this.detune = null, this.harmonicity.dispose(), this.harmonicity = null, this._carrier.dispose(), this._carrier = null, this._modulator.dispose(), this._modulator = null, this._modulationNode.dispose(), this._modulationNode = null, this._modulationScale.dispose(), this._modulationScale = null, this
                }, t.AMOscillator
            }), t(function(t) {
                return t.FatOscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "type", "spread"], t.FatOscillator.defaults);
                    t.Source.call(this, e), this.frequency = new t.Signal(e.frequency, t.Type.Frequency), this.detune = new t.Signal(e.detune, t.Type.Cents), this._oscillators = [], this._spread = e.spread, this._type = e.type, this._phase = e.phase, this._partials = this.defaultArg(e.partials, []), this.count = e.count, this._readOnly(["frequency", "detune"])
                }, t.extend(t.FatOscillator, t.Oscillator), t.FatOscillator.defaults = {
                    frequency: 440,
                    detune: 0,
                    phase: 0,
                    spread: 20,
                    count: 3,
                    type: "sawtooth"
                }, t.FatOscillator.prototype._start = function(t) {
                    t = this.toSeconds(t), this._forEach(function(e) {
                        e.start(t)
                    })
                }, t.FatOscillator.prototype._stop = function(t) {
                    t = this.toSeconds(t), this._forEach(function(e) {
                        e.stop(t)
                    })
                }, t.FatOscillator.prototype._forEach = function(t) {
                    for (var e = 0; e < this._oscillators.length; e++) t.call(this, this._oscillators[e], e)
                }, Object.defineProperty(t.FatOscillator.prototype, "type", {
                    get: function() {
                        return this._type
                    },
                    set: function(t) {
                        this._type = t, this._forEach(function(e) {
                            e.type = t
                        })
                    }
                }), Object.defineProperty(t.FatOscillator.prototype, "spread", {
                    get: function() {
                        return this._spread
                    },
                    set: function(t) {
                        if (this._spread = t, this._oscillators.length > 1) {
                            var e = -t / 2,
                                i = t / (this._oscillators.length - 1);
                            this._forEach(function(t, n) {
                                t.detune.value = e + i * n
                            })
                        }
                    }
                }), Object.defineProperty(t.FatOscillator.prototype, "count", {
                    get: function() {
                        return this._oscillators.length
                    },
                    set: function(e) {
                        if (e = Math.max(e, 1), this._oscillators.length !== e) {
                            this._forEach(function(t) {
                                t.dispose()
                            }), this._oscillators = [];
                            for (var i = 0; i < e; i++) {
                                var n = new t.Oscillator;
                                this.type === t.Oscillator.Type.Custom ? n.partials = this._partials : n.type = this._type, n.phase = this._phase, n.volume.value = -6 - e, this.frequency.connect(n.frequency), this.detune.connect(n.detune), n.connect(this.output), this._oscillators[i] = n
                            }
                            this.spread = this._spread, this.state === t.State.Started && this._forEach(function(t) {
                                t.start()
                            })
                        }
                    }
                }), Object.defineProperty(t.FatOscillator.prototype, "phase", {
                    get: function() {
                        return this._phase
                    },
                    set: function(t) {
                        this._phase = t, this._forEach(function(e) {
                            e.phase = t
                        })
                    }
                }), Object.defineProperty(t.FatOscillator.prototype, "partials", {
                    get: function() {
                        return this._partials
                    },
                    set: function(e) {
                        this._partials = e, this._type = t.Oscillator.Type.Custom, this._forEach(function(t) {
                            t.partials = e
                        })
                    }
                }), t.FatOscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this._writable(["frequency", "detune"]), this.frequency.dispose(), this.frequency = null, this.detune.dispose(), this.detune = null, this._forEach(function(t) {
                        t.dispose()
                    }), this._oscillators = null, this._partials = null, this
                }, t.FatOscillator
            }), t(function(t) {
                t.OmniOscillator = function() {
                    var e = this.optionsObject(arguments, ["frequency", "type"], t.OmniOscillator.defaults);
                    t.Source.call(this, e), this.frequency = new t.Signal(e.frequency, t.Type.Frequency), this.detune = new t.Signal(e.detune, t.Type.Cents), this._sourceType = void 0, this._oscillator = null, this.type = e.type, this._readOnly(["frequency", "detune"]), this.set(e)
                }, t.extend(t.OmniOscillator, t.Oscillator), t.OmniOscillator.defaults = {
                    frequency: 440,
                    detune: 0,
                    type: "sine",
                    phase: 0
                };
                var e = {
                    Pulse: "PulseOscillator",
                    PWM: "PWMOscillator",
                    Osc: "Oscillator",
                    FM: "FMOscillator",
                    AM: "AMOscillator",
                    Fat: "FatOscillator"
                };
                return t.OmniOscillator.prototype._start = function(t) {
                    this._oscillator.start(t)
                }, t.OmniOscillator.prototype._stop = function(t) {
                    this._oscillator.stop(t)
                }, Object.defineProperty(t.OmniOscillator.prototype, "type", {
                    get: function() {
                        var t = "";
                        return this._sourceType === e.FM ? t = "fm" : this._sourceType === e.AM ? t = "am" : this._sourceType === e.Fat && (t = "fat"), t + this._oscillator.type
                    },
                    set: function(t) {
                        "fm" === t.substr(0, 2) ? (this._createNewOscillator(e.FM), this._oscillator.type = t.substr(2)) : "am" === t.substr(0, 2) ? (this._createNewOscillator(e.AM), this._oscillator.type = t.substr(2)) : "fat" === t.substr(0, 3) ? (this._createNewOscillator(e.Fat), this._oscillator.type = t.substr(3)) : "pwm" === t ? this._createNewOscillator(e.PWM) : "pulse" === t ? this._createNewOscillator(e.Pulse) : (this._createNewOscillator(e.Osc), this._oscillator.type = t)
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "partials", {
                    get: function() {
                        return this._oscillator.partials
                    },
                    set: function(t) {
                        this._oscillator.partials = t
                    }
                }), t.OmniOscillator.prototype.set = function(e, i) {
                    return "type" === e ? this.type = i : this.isObject(e) && e.hasOwnProperty("type") && (this.type = e.type), t.prototype.set.apply(this, arguments), this
                }, t.OmniOscillator.prototype._createNewOscillator = function(e) {
                    if (e !== this._sourceType) {
                        this._sourceType = e;
                        var i = t[e],
                            n = this.now() + this.blockTime;
                        if (null !== this._oscillator) {
                            var s = this._oscillator;
                            s.stop(n), setTimeout(function() {
                                s.dispose(), s = null
                            }, 1e3 * this.blockTime)
                        }
                        this._oscillator = new i, this.frequency.connect(this._oscillator.frequency), this.detune.connect(this._oscillator.detune), this._oscillator.connect(this.output), this.state === t.State.Started && this._oscillator.start(n)
                    }
                }, Object.defineProperty(t.OmniOscillator.prototype, "phase", {
                    get: function() {
                        return this._oscillator.phase
                    },
                    set: function(t) {
                        this._oscillator.phase = t
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "width", {
                    get: function() {
                        if (this._sourceType === e.Pulse) return this._oscillator.width
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "count", {
                    get: function() {
                        if (this._sourceType === e.Fat) return this._oscillator.count
                    },
                    set: function(t) {
                        this._sourceType === e.Fat && (this._oscillator.count = t)
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "spread", {
                    get: function() {
                        if (this._sourceType === e.Fat) return this._oscillator.spread
                    },
                    set: function(t) {
                        this._sourceType === e.Fat && (this._oscillator.spread = t)
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "modulationType", {
                    get: function() {
                        if (this._sourceType === e.FM || this._sourceType === e.AM) return this._oscillator.modulationType
                    },
                    set: function(t) {
                        this._sourceType !== e.FM && this._sourceType !== e.AM || (this._oscillator.modulationType = t)
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "modulationIndex", {
                    get: function() {
                        if (this._sourceType === e.FM) return this._oscillator.modulationIndex
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "harmonicity", {
                    get: function() {
                        if (this._sourceType === e.FM || this._sourceType === e.AM) return this._oscillator.harmonicity
                    }
                }), Object.defineProperty(t.OmniOscillator.prototype, "modulationFrequency", {
                    get: function() {
                        if (this._sourceType === e.PWM) return this._oscillator.modulationFrequency
                    }
                }), t.OmniOscillator.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this._writable(["frequency", "detune"]), this.detune.dispose(), this.detune = null, this.frequency.dispose(), this.frequency = null, this._oscillator.dispose(), this._oscillator = null, this._sourceType = null, this
                }, t.OmniOscillator
            }), t(function(t) {
                return t.Instrument = function(e) {
                    e = this.defaultArg(e, t.Instrument.defaults), this._volume = this.output = new t.Volume(e.volume), this.volume = this._volume.volume, this._readOnly("volume")
                }, t.extend(t.Instrument), t.Instrument.defaults = {
                    volume: 0
                }, t.Instrument.prototype.triggerAttack = t.noOp, t.Instrument.prototype.triggerRelease = t.noOp, t.Instrument.prototype.triggerAttackRelease = function(t, e, i, n) {
                    return i = this.isUndef(i) ? this.now() + this.blockTime : this.toSeconds(i), e = this.toSeconds(e), this.triggerAttack(t, i, n), this.triggerRelease(i + e), this
                }, t.Instrument.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._volume.dispose(), this._volume = null, this._writable(["volume"]), this.volume = null, this
                }, t.Instrument
            }), t(function(t) {
                return t.Monophonic = function(e) {
                    e = this.defaultArg(e, t.Monophonic.defaults), t.Instrument.call(this, e), this.portamento = e.portamento
                }, t.extend(t.Monophonic, t.Instrument), t.Monophonic.defaults = {
                    portamento: 0
                }, t.Monophonic.prototype.triggerAttack = function(t, e, i) {
                    return e = this.isUndef(e) ? this.now() + this.blockTime : this.toSeconds(e), this._triggerEnvelopeAttack(e, i), this.setNote(t, e), this
                }, t.Monophonic.prototype.triggerRelease = function(t) {
                    return t = this.isUndef(t) ? this.now() + this.blockTime : this.toSeconds(t), this._triggerEnvelopeRelease(t), this
                }, t.Monophonic.prototype._triggerEnvelopeAttack = function() {}, t.Monophonic.prototype._triggerEnvelopeRelease = function() {}, t.Monophonic.prototype.setNote = function(t, e) {
                    if (e = this.toSeconds(e), this.portamento > 0) {
                        var i = this.frequency.value;
                        this.frequency.setValueAtTime(i, e);
                        var n = this.toSeconds(this.portamento);
                        this.frequency.exponentialRampToValueAtTime(t, e + n)
                    } else this.frequency.setValueAtTime(t, e);
                    return this
                }, t.Monophonic
            }), t(function(t) {
                return t.Synth = function(e) {
                    e = this.defaultArg(e, t.Synth.defaults), t.Monophonic.call(this, e), this.oscillator = new t.OmniOscillator(e.oscillator), this.frequency = this.oscillator.frequency, this.detune = this.oscillator.detune, this.envelope = new t.AmplitudeEnvelope(e.envelope), this.oscillator.chain(this.envelope, this.output), this.oscillator.start(), this._readOnly(["oscillator", "frequency", "detune", "envelope"])
                }, t.extend(t.Synth, t.Monophonic), t.Synth.defaults = {
                    oscillator: {
                        type: "triangle"
                    },
                    envelope: {
                        attack: .005,
                        decay: .1,
                        sustain: .3,
                        release: 1
                    }
                }, t.Synth.prototype._triggerEnvelopeAttack = function(t, e) {
                    return this.envelope.triggerAttack(t, e), this
                }, t.Synth.prototype._triggerEnvelopeRelease = function(t) {
                    return this.envelope.triggerRelease(t), this
                }, t.Synth.prototype.dispose = function() {
                    return t.Monophonic.prototype.dispose.call(this), this._writable(["oscillator", "frequency", "detune", "envelope"]), this.oscillator.dispose(), this.oscillator = null, this.envelope.dispose(), this.envelope = null, this.frequency = null, this.detune = null, this
                }, t.Synth
            }), t(function(t) {
                return t.AMSynth = function(e) {
                    e = this.defaultArg(e, t.AMSynth.defaults), t.Monophonic.call(this, e), this._carrier = new t.Synth, this._carrier.volume.value = -10, this.oscillator = this._carrier.oscillator, this.envelope = this._carrier.envelope.set(e.envelope), this._modulator = new t.Synth, this._modulator.volume.value = -10, this.modulation = this._modulator.oscillator.set(e.modulation), this.modulationEnvelope = this._modulator.envelope.set(e.modulationEnvelope), this.frequency = new t.Signal(440, t.Type.Frequency), this.detune = new t.Signal(e.detune, t.Type.Cents), this.harmonicity = new t.Multiply(e.harmonicity), this.harmonicity.units = t.Type.Positive, this._modulationScale = new t.AudioToGain, this._modulationNode = new t.Gain, this.frequency.connect(this._carrier.frequency), this.frequency.chain(this.harmonicity, this._modulator.frequency), this.detune.fan(this._carrier.detune, this._modulator.detune), this._modulator.chain(this._modulationScale, this._modulationNode.gain), this._carrier.chain(this._modulationNode, this.output), this._readOnly(["frequency", "harmonicity", "oscillator", "envelope", "modulation", "modulationEnvelope", "detune"])
                }, t.extend(t.AMSynth, t.Monophonic), t.AMSynth.defaults = {
                    harmonicity: 3,
                    detune: 0,
                    oscillator: {
                        type: "sine"
                    },
                    envelope: {
                        attack: .01,
                        decay: .01,
                        sustain: 1,
                        release: .5
                    },
                    modulation: {
                        type: "square"
                    },
                    modulationEnvelope: {
                        attack: .5,
                        decay: 0,
                        sustain: 1,
                        release: .5
                    }
                }, t.AMSynth.prototype._triggerEnvelopeAttack = function(t, e) {
                    return t = this.toSeconds(t), this.envelope.triggerAttack(t, e), this.modulationEnvelope.triggerAttack(t, e), this
                }, t.AMSynth.prototype._triggerEnvelopeRelease = function(t) {
                    return this.envelope.triggerRelease(t), this.modulationEnvelope.triggerRelease(t), this
                }, t.AMSynth.prototype.dispose = function() {
                    return t.Monophonic.prototype.dispose.call(this), this._writable(["frequency", "harmonicity", "oscillator", "envelope", "modulation", "modulationEnvelope", "detune"]), this._carrier.dispose(), this._carrier = null, this._modulator.dispose(), this._modulator = null, this.frequency.dispose(), this.frequency = null, this.detune.dispose(), this.detune = null, this.harmonicity.dispose(), this.harmonicity = null, this._modulationScale.dispose(), this._modulationScale = null, this._modulationNode.dispose(), this._modulationNode = null, this.oscillator = null, this.envelope = null, this.modulationEnvelope = null, this.modulation = null, this
                }, t.AMSynth
            }), t(function(t) {
                return t.MonoSynth = function(e) {
                    e = this.defaultArg(e, t.MonoSynth.defaults), t.Monophonic.call(this, e), this.oscillator = new t.OmniOscillator(e.oscillator), this.frequency = this.oscillator.frequency, this.detune = this.oscillator.detune, this.filter = new t.Filter(e.filter), this.filterEnvelope = new t.FrequencyEnvelope(e.filterEnvelope), this.envelope = new t.AmplitudeEnvelope(e.envelope), this.oscillator.chain(this.filter, this.envelope, this.output), this.oscillator.start(), this.filterEnvelope.connect(this.filter.frequency), this._readOnly(["oscillator", "frequency", "detune", "filter", "filterEnvelope", "envelope"])
                }, t.extend(t.MonoSynth, t.Monophonic), t.MonoSynth.defaults = {
                    frequency: "C4",
                    detune: 0,
                    oscillator: {
                        type: "square"
                    },
                    filter: {
                        Q: 6,
                        type: "lowpass",
                        rolloff: -24
                    },
                    envelope: {
                        attack: .005,
                        decay: .1,
                        sustain: .9,
                        release: 1
                    },
                    filterEnvelope: {
                        attack: .06,
                        decay: .2,
                        sustain: .5,
                        release: 2,
                        baseFrequency: 200,
                        octaves: 7,
                        exponent: 2
                    }
                }, t.MonoSynth.prototype._triggerEnvelopeAttack = function(t, e) {
                    return this.envelope.triggerAttack(t, e), this.filterEnvelope.triggerAttack(t), this
                }, t.MonoSynth.prototype._triggerEnvelopeRelease = function(t) {
                    return this.envelope.triggerRelease(t), this.filterEnvelope.triggerRelease(t), this
                }, t.MonoSynth.prototype.dispose = function() {
                    return t.Monophonic.prototype.dispose.call(this), this._writable(["oscillator", "frequency", "detune", "filter", "filterEnvelope", "envelope"]), this.oscillator.dispose(), this.oscillator = null, this.envelope.dispose(), this.envelope = null, this.filterEnvelope.dispose(), this.filterEnvelope = null, this.filter.dispose(), this.filter = null, this.frequency = null, this.detune = null, this
                }, t.MonoSynth
            }), t(function(t) {
                return t.DuoSynth = function(e) {
                    e = this.defaultArg(e, t.DuoSynth.defaults), t.Monophonic.call(this, e), this.voice0 = new t.MonoSynth(e.voice0), this.voice0.volume.value = -10, this.voice1 = new t.MonoSynth(e.voice1), this.voice1.volume.value = -10, this._vibrato = new t.LFO(e.vibratoRate, -50, 50), this._vibrato.start(), this.vibratoRate = this._vibrato.frequency, this._vibratoGain = new t.Gain(e.vibratoAmount, t.Type.Positive), this.vibratoAmount = this._vibratoGain.gain, this.frequency = new t.Signal(440, t.Type.Frequency), this.harmonicity = new t.Multiply(e.harmonicity), this.harmonicity.units = t.Type.Positive, this.frequency.connect(this.voice0.frequency), this.frequency.chain(this.harmonicity, this.voice1.frequency), this._vibrato.connect(this._vibratoGain), this._vibratoGain.fan(this.voice0.detune, this.voice1.detune), this.voice0.connect(this.output), this.voice1.connect(this.output), this._readOnly(["voice0", "voice1", "frequency", "vibratoAmount", "vibratoRate"])
                }, t.extend(t.DuoSynth, t.Monophonic), t.DuoSynth.defaults = {
                    vibratoAmount: .5,
                    vibratoRate: 5,
                    harmonicity: 1.5,
                    voice0: {
                        volume: -10,
                        portamento: 0,
                        oscillator: {
                            type: "sine"
                        },
                        filterEnvelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        },
                        envelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        }
                    },
                    voice1: {
                        volume: -10,
                        portamento: 0,
                        oscillator: {
                            type: "sine"
                        },
                        filterEnvelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        },
                        envelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        }
                    }
                }, t.DuoSynth.prototype._triggerEnvelopeAttack = function(t, e) {
                    return t = this.toSeconds(t), this.voice0.envelope.triggerAttack(t, e), this.voice1.envelope.triggerAttack(t, e), this.voice0.filterEnvelope.triggerAttack(t), this.voice1.filterEnvelope.triggerAttack(t), this
                }, t.DuoSynth.prototype._triggerEnvelopeRelease = function(t) {
                    return this.voice0.triggerRelease(t), this.voice1.triggerRelease(t), this
                }, t.DuoSynth.prototype.dispose = function() {
                    return t.Monophonic.prototype.dispose.call(this), this._writable(["voice0", "voice1", "frequency", "vibratoAmount", "vibratoRate"]), this.voice0.dispose(), this.voice0 = null, this.voice1.dispose(), this.voice1 = null, this.frequency.dispose(), this.frequency = null, this._vibratoGain.dispose(), this._vibratoGain = null, this._vibrato = null, this.harmonicity.dispose(), this.harmonicity = null, this.vibratoAmount.dispose(), this.vibratoAmount = null, this.vibratoRate = null, this
                }, t.DuoSynth
            }), t(function(t) {
                return t.FMSynth = function(e) {
                    e = this.defaultArg(e, t.FMSynth.defaults), t.Monophonic.call(this, e), this._carrier = new t.Synth(e.carrier), this._carrier.volume.value = -10, this.oscillator = this._carrier.oscillator, this.envelope = this._carrier.envelope.set(e.envelope), this._modulator = new t.Synth(e.modulator), this._modulator.volume.value = -10, this.modulation = this._modulator.oscillator.set(e.modulation), this.modulationEnvelope = this._modulator.envelope.set(e.modulationEnvelope), this.frequency = new t.Signal(440, t.Type.Frequency), this.detune = new t.Signal(e.detune, t.Type.Cents), this.harmonicity = new t.Multiply(e.harmonicity), this.harmonicity.units = t.Type.Positive, this.modulationIndex = new t.Multiply(e.modulationIndex), this.modulationIndex.units = t.Type.Positive, this._modulationNode = new t.Gain(0), this.frequency.connect(this._carrier.frequency), this.frequency.chain(this.harmonicity, this._modulator.frequency), this.frequency.chain(this.modulationIndex, this._modulationNode), this.detune.fan(this._carrier.detune, this._modulator.detune), this._modulator.connect(this._modulationNode.gain), this._modulationNode.connect(this._carrier.frequency), this._carrier.connect(this.output), this._readOnly(["frequency", "harmonicity", "modulationIndex", "oscillator", "envelope", "modulation", "modulationEnvelope", "detune"])
                }, t.extend(t.FMSynth, t.Monophonic), t.FMSynth.defaults = {
                    harmonicity: 3,
                    modulationIndex: 10,
                    detune: 0,
                    oscillator: {
                        type: "sine"
                    },
                    envelope: {
                        attack: .01,
                        decay: .01,
                        sustain: 1,
                        release: .5
                    },
                    modulation: {
                        type: "square"
                    },
                    modulationEnvelope: {
                        attack: .5,
                        decay: 0,
                        sustain: 1,
                        release: .5
                    }
                }, t.FMSynth.prototype._triggerEnvelopeAttack = function(t, e) {
                    return t = this.toSeconds(t), this.envelope.triggerAttack(t, e), this.modulationEnvelope.triggerAttack(t), this
                }, t.FMSynth.prototype._triggerEnvelopeRelease = function(t) {
                    return t = this.toSeconds(t), this.envelope.triggerRelease(t), this.modulationEnvelope.triggerRelease(t), this
                }, t.FMSynth.prototype.dispose = function() {
                    return t.Monophonic.prototype.dispose.call(this), this._writable(["frequency", "harmonicity", "modulationIndex", "oscillator", "envelope", "modulation", "modulationEnvelope", "detune"]), this._carrier.dispose(), this._carrier = null, this._modulator.dispose(), this._modulator = null, this.frequency.dispose(), this.frequency = null, this.detune.dispose(), this.detune = null, this.modulationIndex.dispose(), this.modulationIndex = null, this.harmonicity.dispose(), this.harmonicity = null, this._modulationNode.dispose(), this._modulationNode = null, this.oscillator = null, this.envelope = null, this.modulationEnvelope = null, this.modulation = null, this
                }, t.FMSynth
            }), t(function(t) {
                return t.MembraneSynth = function(e) {
                    e = this.defaultArg(e, t.MembraneSynth.defaults), t.Instrument.call(this, e), this.oscillator = new t.OmniOscillator(e.oscillator).start(), this.envelope = new t.AmplitudeEnvelope(e.envelope), this.octaves = e.octaves, this.pitchDecay = e.pitchDecay, this.oscillator.chain(this.envelope, this.output), this._readOnly(["oscillator", "envelope"])
                }, t.extend(t.MembraneSynth, t.Instrument), t.MembraneSynth.defaults = {
                    pitchDecay: .05,
                    octaves: 10,
                    oscillator: {
                        type: "sine"
                    },
                    envelope: {
                        attack: .001,
                        decay: .4,
                        sustain: .01,
                        release: 1.4,
                        attackCurve: "exponential"
                    }
                }, t.MembraneSynth.prototype.triggerAttack = function(t, e, i) {
                    e = this.toSeconds(e), t = this.toFrequency(t);
                    var n = t * this.octaves;
                    return this.oscillator.frequency.setValueAtTime(n, e), this.oscillator.frequency.exponentialRampToValueAtTime(t, e + this.toSeconds(this.pitchDecay)), this.envelope.triggerAttack(e, i), this
                }, t.MembraneSynth.prototype.triggerRelease = function(t) {
                    return this.envelope.triggerRelease(t), this
                }, t.MembraneSynth.prototype.dispose = function() {
                    return t.Instrument.prototype.dispose.call(this), this._writable(["oscillator", "envelope"]), this.oscillator.dispose(), this.oscillator = null, this.envelope.dispose(), this.envelope = null, this
                }, t.MembraneSynth
            }), t(function(t) {
                var e = [1, 1.483, 1.932, 2.546, 2.63, 3.897];
                return t.MetalSynth = function(i) {
                    i = this.defaultArg(i, t.MetalSynth.defaults), t.Instrument.call(this, i), this.frequency = new t.Signal(i.frequency, t.Type.Frequency), this._oscillators = [], this._freqMultipliers = [], this._amplitue = new t.Gain(0).connect(this.output), this._highpass = new t.Filter({
                        type: "highpass",
                        Q: -3.0102999566398125
                    }).connect(this._amplitue), this._octaves = i.octaves, this._filterFreqScaler = new t.Scale(i.resonance, 7e3), this.envelope = new t.Envelope({
                        attack: i.envelope.attack,
                        attackCurve: "linear",
                        decay: i.envelope.decay,
                        sustain: 0,
                        release: i.envelope.release
                    }).chain(this._filterFreqScaler, this._highpass.frequency), this.envelope.connect(this._amplitue.gain);
                    for (var n = 0; n < e.length; n++) {
                        var s = new t.FMOscillator({
                            type: "square",
                            modulationType: "square",
                            harmonicity: i.harmonicity,
                            modulationIndex: i.modulationIndex
                        });
                        s.connect(this._highpass).start(0), this._oscillators[n] = s;
                        var r = new t.Multiply(e[n]);
                        this._freqMultipliers[n] = r, this.frequency.chain(r, s.frequency)
                    }
                    this.octaves = i.octaves
                }, t.extend(t.MetalSynth, t.Instrument), t.MetalSynth.defaults = {
                    frequency: 200,
                    envelope: {
                        attack: .001,
                        decay: 1.4,
                        release: .2
                    },
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4e3,
                    octaves: 1.5
                }, t.MetalSynth.prototype.triggerAttack = function(t, e) {
                    return t = this.toSeconds(t), e = this.defaultArg(e, 1), this.envelope.triggerAttack(t, e), this
                }, t.MetalSynth.prototype.triggerRelease = function(t) {
                    return t = this.toSeconds(t), this.envelope.triggerRelease(t), this
                }, t.MetalSynth.prototype.triggerAttackRelease = function(t, e, i) {
                    return e = this.toSeconds(e), t = this.toSeconds(t), this.triggerAttack(e, i), this.triggerRelease(e + t), this
                }, Object.defineProperty(t.MetalSynth.prototype, "modulationIndex", {
                    get: function() {
                        return this._oscillators[0].modulationIndex.value
                    },
                    set: function(t) {
                        for (var e = 0; e < this._oscillators.length; e++) this._oscillators[e].modulationIndex.value = t
                    }
                }), Object.defineProperty(t.MetalSynth.prototype, "harmonicity", {
                    get: function() {
                        return this._oscillators[0].harmonicity.value
                    },
                    set: function(t) {
                        for (var e = 0; e < this._oscillators.length; e++) this._oscillators[e].harmonicity.value = t
                    }
                }), Object.defineProperty(t.MetalSynth.prototype, "resonance", {
                    get: function() {
                        return this._filterFreqScaler.min
                    },
                    set: function(t) {
                        this._filterFreqScaler.min = t, this.octaves = this._octaves
                    }
                }), Object.defineProperty(t.MetalSynth.prototype, "octaves", {
                    get: function() {
                        return this._octaves
                    },
                    set: function(t) {
                        this._octaves = t, this._filterFreqScaler.max = this._filterFreqScaler.min * Math.pow(2, t)
                    }
                }), t.MetalSynth.prototype.dispose = function() {
                    t.Instrument.prototype.dispose.call(this);
                    for (var e = 0; e < this._oscillators.length; e++) this._oscillators[e].dispose(), this._freqMultipliers[e].dispose();
                    this._oscillators = null, this._freqMultipliers = null, this.frequency.dispose(), this.frequency = null, this._filterFreqScaler.dispose(), this._filterFreqScaler = null, this._amplitue.dispose(), this._amplitue = null, this.envelope.dispose(), this.envelope = null, this._highpass.dispose(), this._highpass = null
                }, t.MetalSynth
            }), t(function(t) {
                return window.AudioBufferSourceNode && !AudioBufferSourceNode.prototype.start && (AudioBufferSourceNode.prototype.start = AudioBufferSourceNode.prototype.noteGrainOn, AudioBufferSourceNode.prototype.stop = AudioBufferSourceNode.prototype.noteOff), t.BufferSource = function() {
                    var e = this.optionsObject(arguments, ["buffer", "onended"], t.BufferSource.defaults);
                    this.onended = e.onended, this._startTime = -1, this._stopTime = -1, this._gainNode = this.output = new t.Gain, this._source = this.context.createBufferSource(), this._source.connect(this._gainNode), this.playbackRate = new t.Param(this._source.playbackRate, t.Type.Positive), this.fadeIn = e.fadeIn, this.fadeOut = e.fadeOut, this._gain = 1, this._onendedTimeout = -1, this.isUndef(e.buffer) || (this.buffer = e.buffer), this.loop = e.loop
                }, t.extend(t.BufferSource), t.BufferSource.defaults = {
                    onended: t.noOp,
                    fadeIn: 0,
                    fadeOut: 0
                }, Object.defineProperty(t.BufferSource.prototype, "state", {
                    get: function() {
                        var e = this.now();
                        return -1 !== this._startTime && e >= this._startTime && e < this._stopTime ? t.State.Started : t.State.Stopped
                    }
                }), t.BufferSource.prototype.start = function(t, e, i, n, s) {
                    if (-1 !== this._startTime) throw new Error("Tone.BufferSource: can only be started once.");
                    return this.buffer && (t = this.toSeconds(t), e = this.loop ? this.defaultArg(e, this.loopStart) : this.defaultArg(e, 0), e = this.toSeconds(e), t = this.toSeconds(t), this._source.start(t, e), n = this.defaultArg(n, 1), this._gain = n, s = this.isUndef(s) ? this.toSeconds(this.fadeIn) : this.toSeconds(s), s > 0 ? (this._gainNode.gain.setValueAtTime(0, t), this._gainNode.gain.linearRampToValueAtTime(this._gain, t + s)) : this._gainNode.gain.setValueAtTime(n, t), this._startTime = t + s, this.isUndef(i) || (i = this.defaultArg(i, this.buffer.duration - e), i = this.toSeconds(i), this.stop(t + i + s, s))), this
                }, t.BufferSource.prototype.stop = function(t, e) {
                    return this.buffer && (t = this.toSeconds(t), e = this.isUndef(e) ? this.toSeconds(this.fadeOut) : this.toSeconds(e), this._stopTime = t + e, this._gainNode.gain.cancelScheduledValues(this._startTime + this.sampleTime), e > 0 ? (this._gainNode.gain.setValueAtTime(this._gain, t), this._gainNode.gain.linearRampToValueAtTime(0, t + e), t += e) : this._gainNode.gain.setValueAtTime(0, t), this.isNumber(this._source.playbackState) && 2 !== this._source.playbackState || this._source.stop(t), clearTimeout(this._onendedTimeout), this._onendedTimeout = setTimeout(this._onended.bind(this), 1e3 * (this._stopTime - this.now()))), this
                }, t.BufferSource.prototype._onended = function() {
                    this.onended(this), this.dispose()
                }, Object.defineProperty(t.BufferSource.prototype, "loopStart", {
                    get: function() {
                        return this._source.loopStart
                    },
                    set: function(t) {
                        this._source.loopStart = this.toSeconds(t)
                    }
                }), Object.defineProperty(t.BufferSource.prototype, "loopEnd", {
                    get: function() {
                        return this._source.loopEnd
                    },
                    set: function(t) {
                        this._source.loopEnd = this.toSeconds(t)
                    }
                }), Object.defineProperty(t.BufferSource.prototype, "buffer", {
                    get: function() {
                        return this._source ? this._source.buffer : null
                    },
                    set: function(e) {
                        e instanceof t.Buffer ? this._source.buffer = e.get() : this._source.buffer = e
                    }
                }), Object.defineProperty(t.BufferSource.prototype, "loop", {
                    get: function() {
                        return this._source.loop
                    },
                    set: function(t) {
                        this._source.loop = t
                    }
                }), t.BufferSource.prototype.dispose = function() {
                    return this.onended = null, this._source && (this._source.disconnect(), this._source = null), this._gainNode && (this._gainNode.dispose(), this._gainNode = null), this._startTime = -1, this.playbackRate = null, this.output = null, clearTimeout(this._onendedTimeout), this
                }, t.BufferSource
            }), t(function(t) {
                function e() {
                    for (var e in i) n[e] = (new t.Buffer).fromArray(i[e])
                }
                t.Noise = function() {
                    var e = this.optionsObject(arguments, ["type"], t.Noise.defaults);
                    t.Source.call(this, e), this._source = null, this._type = e.type, this._playbackRate = e.playbackRate
                }, t.extend(t.Noise, t.Source), t.Noise.defaults = {
                    type: "white",
                    playbackRate: 1
                }, Object.defineProperty(t.Noise.prototype, "type", {
                    get: function() {
                        return this._type
                    },
                    set: function(e) {
                        if (this._type !== e) {
                            if (!(e in n)) throw new TypeError("Tone.Noise: invalid type: " + e);
                            if (this._type = e, this.state === t.State.Started) {
                                var i = this.now() + this.blockTime;
                                this._stop(i), this._start(i)
                            }
                        }
                    }
                }), Object.defineProperty(t.Noise.prototype, "playbackRate", {
                    get: function() {
                        return this._playbackRate
                    },
                    set: function(t) {
                        this._playbackRate = t, this._source && (this._source.playbackRate.value = t)
                    }
                }), t.Noise.prototype._start = function(e) {
                    var i = n[this._type];
                    this._source = new t.BufferSource(i).connect(this.output), this._source.loop = !0, this._source.playbackRate.value = this._playbackRate, this._source.start(this.toSeconds(e), Math.random() * (i.duration - .001))
                }, t.Noise.prototype._stop = function(t) {
                    this._source && (this._source.stop(this.toSeconds(t)), this._source = null)
                }, t.Noise.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), null !== this._source && (this._source.disconnect(), this._source = null), this._buffer = null, this
                };
                var i = {
                        pink: function() {
                            for (var t = [], e = 0; e < 2; e++) {
                                var i = new Float32Array(220500);
                                t[e] = i;
                                var n, s, r, o, a, l, h;
                                n = s = r = o = a = l = h = 0;
                                for (var u = 0; u < 220500; u++) {
                                    var c = 2 * Math.random() - 1;
                                    n = .99886 * n + .0555179 * c, s = .99332 * s + .0750759 * c, r = .969 * r + .153852 * c, o = .8665 * o + .3104856 * c, a = .55 * a + .5329522 * c, l = -.7616 * l - .016898 * c, i[u] = n + s + r + o + a + l + h + .5362 * c, i[u] *= .11, h = .115926 * c
                                }
                            }
                            return t
                        }(),
                        brown: function() {
                            for (var t = [], e = 0; e < 2; e++) {
                                var i = new Float32Array(220500);
                                t[e] = i;
                                for (var n = 0, s = 0; s < 220500; s++) {
                                    var r = 2 * Math.random() - 1;
                                    i[s] = (n + .02 * r) / 1.02, n = i[s], i[s] *= 3.5
                                }
                            }
                            return t
                        }(),
                        white: function() {
                            for (var t = [], e = 0; e < 2; e++) {
                                var i = new Float32Array(220500);
                                t[e] = i;
                                for (var n = 0; n < 220500; n++) i[n] = 2 * Math.random() - 1
                            }
                            return t
                        }()
                    },
                    n = {};
                return e(), t.Context.on("init", e), t.Noise
            }), t(function(t) {
                return t.NoiseSynth = function(e) {
                    e = this.defaultArg(e, t.NoiseSynth.defaults), t.Instrument.call(this, e), this.noise = new t.Noise, this.envelope = new t.AmplitudeEnvelope(e.envelope), this.noise.chain(this.envelope, this.output), this.noise.start(), this._readOnly(["noise", "envelope"])
                }, t.extend(t.NoiseSynth, t.Instrument), t.NoiseSynth.defaults = {
                    noise: {
                        type: "white"
                    },
                    envelope: {
                        attack: .005,
                        decay: .1,
                        sustain: 0
                    }
                }, t.NoiseSynth.prototype.triggerAttack = function(t, e) {
                    return this.envelope.triggerAttack(t, e), this
                }, t.NoiseSynth.prototype.triggerRelease = function(t) {
                    return this.envelope.triggerRelease(t), this
                }, t.NoiseSynth.prototype.triggerAttackRelease = function(t, e, i) {
                    return e = this.toSeconds(e), t = this.toSeconds(t), this.triggerAttack(e, i), this.triggerRelease(e + t), this
                }, t.NoiseSynth.prototype.dispose = function() {
                    return t.Instrument.prototype.dispose.call(this), this._writable(["noise", "envelope"]), this.noise.dispose(), this.noise = null, this.envelope.dispose(), this.envelope = null, this
                }, t.NoiseSynth
            }), t(function(t) {
                return t.PluckSynth = function(e) {
                    e = this.defaultArg(e, t.PluckSynth.defaults), t.Instrument.call(this, e), this._noise = new t.Noise("pink"), this.attackNoise = e.attackNoise, this._lfcf = new t.LowpassCombFilter({
                        resonance: e.resonance,
                        dampening: e.dampening
                    }), this.resonance = this._lfcf.resonance, this.dampening = this._lfcf.dampening, this._noise.connect(this._lfcf), this._lfcf.connect(this.output), this._readOnly(["resonance", "dampening"])
                }, t.extend(t.PluckSynth, t.Instrument), t.PluckSynth.defaults = {
                    attackNoise: 1,
                    dampening: 4e3,
                    resonance: .9
                }, t.PluckSynth.prototype.triggerAttack = function(t, e) {
                    t = this.toFrequency(t), e = this.toSeconds(e);
                    var i = 1 / t;
                    return this._lfcf.delayTime.setValueAtTime(i, e), this._noise.start(e), this._noise.stop(e + i * this.attackNoise), this
                }, t.PluckSynth.prototype.dispose = function() {
                    return t.Instrument.prototype.dispose.call(this), this._noise.dispose(), this._lfcf.dispose(), this._noise = null, this._lfcf = null, this._writable(["resonance", "dampening"]), this.dampening = null, this.resonance = null, this
                }, t.PluckSynth
            }), t(function(t) {
                return t.PolySynth = function() {
                    t.Instrument.call(this);
                    var e = this.optionsObject(arguments, ["polyphony", "voice"], t.PolySynth.defaults);
                    e = this.defaultArg(e, t.Instrument.defaults), e.polyphony = Math.min(t.PolySynth.MAX_POLYPHONY, e.polyphony), this.voices = new Array(e.polyphony), this._triggers = new Array(e.polyphony), this.detune = new t.Signal(e.detune, t.Type.Cents), this._readOnly("detune");
                    for (var i = 0; i < e.polyphony; i++) {
                        var n = new e.voice(arguments[2], arguments[3]);
                        this.voices[i] = n, n.connect(this.output), n.hasOwnProperty("detune") && this.detune.connect(n.detune), this._triggers[i] = {
                            release: -1,
                            note: null,
                            voice: n
                        }
                    }
                    this.volume.value = e.volume
                }, t.extend(t.PolySynth, t.Instrument), t.PolySynth.defaults = {
                    polyphony: 4,
                    volume: 0,
                    detune: 0,
                    voice: t.Synth
                }, t.PolySynth.prototype.triggerAttack = function(t, e, i) {
                    Array.isArray(t) || (t = [t]), e = this.toSeconds(e);
                    for (var n = 0; n < t.length; n++) {
                        for (var s = t[n], r = this._triggers[0], o = 1; o < this._triggers.length; o++) this._triggers[o].release < r.release && (r = this._triggers[o], o);
                        r.release = 1 / 0, r.note = JSON.stringify(s), r.voice.triggerAttack(s, e, i)
                    }
                    return this
                }, t.PolySynth.prototype.triggerAttackRelease = function(t, e, i, n) {
                    if (i = this.toSeconds(i), this.triggerAttack(t, i, n), this.isArray(e) && this.isArray(t))
                        for (var s = 0; s < t.length; s++) {
                            var r = e[Math.min(s, e.length - 1)];
                            this.triggerRelease(t[s], i + this.toSeconds(r))
                        } else this.triggerRelease(t, i + this.toSeconds(e));
                    return this
                }, t.PolySynth.prototype.triggerRelease = function(t, e) {
                    Array.isArray(t) || (t = [t]), e = this.toSeconds(e);
                    for (var i = 0; i < t.length; i++)
                        for (var n = JSON.stringify(t[i]), s = 0; s < this._triggers.length; s++) {
                            var r = this._triggers[s];
                            r.note === n && r.release > e && (r.voice.triggerRelease(e), r.release = e)
                        }
                    return this
                }, t.PolySynth.prototype.set = function(t, e, i) {
                    for (var n = 0; n < this.voices.length; n++) this.voices[n].set(t, e, i);
                    return this
                }, t.PolySynth.prototype.get = function(t) {
                    return this.voices[0].get(t)
                }, t.PolySynth.prototype.releaseAll = function(t) {
                    t = this.toSeconds(t);
                    for (var e = 0; e < this._triggers.length; e++) {
                        var i = this._triggers[e];
                        i.release > t && (i.release = t, i.voice.triggerRelease(t))
                    }
                    return this
                }, t.PolySynth.prototype.dispose = function() {
                    t.Instrument.prototype.dispose.call(this);
                    for (var e = 0; e < this.voices.length; e++) this.voices[e].dispose(), this.voices[e] = null;
                    return this._writable("detune"), this.detune.dispose(), this.detune = null, this.voices = null, this._triggers = null, this
                }, t.PolySynth.MAX_POLYPHONY = 20, t.PolySynth
            }), t(function(t) {
                return t.Player = function(e) {
                    var i;
                    e instanceof t.Buffer ? (e = e.get(), i = t.Player.defaults) : i = this.optionsObject(arguments, ["url", "onload"], t.Player.defaults), t.Source.call(this, i), this._source = null, this.autostart = i.autostart, this._buffer = new t.Buffer({
                        url: i.url,
                        onload: this._onload.bind(this, i.onload),
                        reverse: i.reverse
                    }), e instanceof AudioBuffer && this._buffer.set(e), this._loop = i.loop, this._loopStart = i.loopStart, this._loopEnd = i.loopEnd, this._playbackRate = i.playbackRate, this.retrigger = i.retrigger
                }, t.extend(t.Player, t.Source), t.Player.defaults = {
                    onload: t.noOp,
                    playbackRate: 1,
                    loop: !1,
                    autostart: !1,
                    loopStart: 0,
                    loopEnd: 0,
                    retrigger: !1,
                    reverse: !1
                }, t.Player.prototype.load = function(t, e) {
                    return this._buffer.load(t, this._onload.bind(this, e))
                }, t.Player.prototype._onload = function(e) {
                    e = this.defaultArg(e, t.noOp), e(this), this.autostart && this.start()
                }, t.Player.prototype._start = function(e, i, n) {
                    if (!this._buffer.loaded) throw Error("Tone.Player: tried to start Player before the buffer was loaded");
                    if (i = this._loop ? this.defaultArg(i, this._loopStart) : this.defaultArg(i, 0), i = this.toSeconds(i), n = this.defaultArg(n, Math.max(this._buffer.duration - i, 0)), n = this.toSeconds(n), e = this.toSeconds(e), this._source = this.context.createBufferSource(), this._source.buffer = this._buffer.get(), this._loop ? (this._source.loop = this._loop, this._source.loopStart = this.toSeconds(this._loopStart), this._source.loopEnd = this.toSeconds(this._loopEnd)) : this._synced || this._state.setStateAtTime(t.State.Stopped, e + n), this._source.playbackRate.value = this._playbackRate, this._source.connect(this.output), this._loop) {
                        var s = this._source.loopEnd || this._buffer.duration,
                            r = this._source.loopStart,
                            o = s - r;
                        if (i > s)
                            for (; i > s;) i -= o;
                        this._source.start(e, i)
                    } else this._source.start(e, i, n);
                    return this
                }, t.Player.prototype._stop = function(t) {
                    return this._source && (this._source.stop(this.toSeconds(t)), this._source = null), this
                }, t.Player.prototype.seek = function(e, i) {
                    return i = this.toSeconds(i), this._state.getValueAtTime(i) === t.State.Started && (e = this.toSeconds(e), this._stop(i), this._start(i, e)), this
                }, t.Player.prototype.setLoopPoints = function(t, e) {
                    return this.loopStart = t, this.loopEnd = e, this
                }, Object.defineProperty(t.Player.prototype, "loopStart", {
                    get: function() {
                        return this._loopStart
                    },
                    set: function(t) {
                        this._loopStart = t, this._source && (this._source.loopStart = this.toSeconds(t))
                    }
                }), Object.defineProperty(t.Player.prototype, "loopEnd", {
                    get: function() {
                        return this._loopEnd
                    },
                    set: function(t) {
                        this._loopEnd = t, this._source && (this._source.loopEnd = this.toSeconds(t))
                    }
                }), Object.defineProperty(t.Player.prototype, "buffer", {
                    get: function() {
                        return this._buffer
                    },
                    set: function(t) {
                        this._buffer.set(t)
                    }
                }), Object.defineProperty(t.Player.prototype, "loop", {
                    get: function() {
                        return this._loop
                    },
                    set: function(t) {
                        this._loop = t, this._source && (this._source.loop = t)
                    }
                }), Object.defineProperty(t.Player.prototype, "playbackRate", {
                    get: function() {
                        return this._playbackRate
                    },
                    set: function(t) {
                        this._playbackRate = t, this._source && (this._source.playbackRate.value = t)
                    }
                }), Object.defineProperty(t.Player.prototype, "reverse", {
                    get: function() {
                        return this._buffer.reverse
                    },
                    set: function(t) {
                        this._buffer.reverse = t
                    }
                }), t.Player.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), null !== this._source && (this._source.disconnect(), this._source = null), this._buffer.dispose(), this._buffer = null, this
                }, t.Player
            }), t(function(t) {
                return t.Sampler = function() {
                    var e = this.optionsObject(arguments, ["url", "onload"], t.Sampler.defaults);
                    t.Instrument.call(this, e), this.player = new t.Player(e.url, e.onload), this.player.retrigger = !0, this.envelope = new t.AmplitudeEnvelope(e.envelope), this.player.chain(this.envelope, this.output), this._readOnly(["player", "envelope"]), this.loop = e.loop, this.reverse = e.reverse
                }, t.extend(t.Sampler, t.Instrument), t.Sampler.defaults = {
                    onload: t.noOp,
                    loop: !1,
                    reverse: !1,
                    envelope: {
                        attack: .001,
                        decay: 0,
                        sustain: 1,
                        release: .1
                    }
                }, t.Sampler.prototype.triggerAttack = function(t, e, i) {
                    return e = this.toSeconds(e), t = this.defaultArg(t, 0), this.player.playbackRate = this.intervalToFrequencyRatio(t), this.player.start(e), this.envelope.triggerAttack(e, i), this
                }, t.Sampler.prototype.triggerRelease = function(t) {
                    return t = this.toSeconds(t), this.envelope.triggerRelease(t), this.player.stop(this.toSeconds(this.envelope.release) + t), this
                }, Object.defineProperty(t.Sampler.prototype, "loop", {
                    get: function() {
                        return this.player.loop
                    },
                    set: function(t) {
                        this.player.loop = t
                    }
                }), Object.defineProperty(t.Sampler.prototype, "reverse", {
                    get: function() {
                        return this.player.reverse
                    },
                    set: function(t) {
                        this.player.reverse = t
                    }
                }), Object.defineProperty(t.Sampler.prototype, "buffer", {
                    get: function() {
                        return this.player.buffer
                    },
                    set: function(t) {
                        this.player.buffer = t
                    }
                }), t.Sampler.prototype.dispose = function() {
                    return t.Instrument.prototype.dispose.call(this), this._writable(["player", "envelope"]), this.player.dispose(), this.player = null, this.envelope.dispose(), this.envelope = null, this
                }, t.Sampler
            }), t(function(t) {
                return t.GainToAudio = function() {
                    this._norm = this.input = this.output = new t.WaveShaper(function(t) {
                        return 2 * Math.abs(t) - 1
                    })
                }, t.extend(t.GainToAudio, t.SignalBase), t.GainToAudio.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._norm.dispose(), this._norm = null, this
                }, t.GainToAudio
            }), t(function(t) {
                return t.Normalize = function(e, i) {
                    this._inputMin = this.defaultArg(e, 0), this._inputMax = this.defaultArg(i, 1), this._sub = this.input = new t.Add(0), this._div = this.output = new t.Multiply(1), this._sub.connect(this._div), this._setRange()
                }, t.extend(t.Normalize, t.SignalBase), Object.defineProperty(t.Normalize.prototype, "min", {
                    get: function() {
                        return this._inputMin
                    },
                    set: function(t) {
                        this._inputMin = t, this._setRange()
                    }
                }), Object.defineProperty(t.Normalize.prototype, "max", {
                    get: function() {
                        return this._inputMax
                    },
                    set: function(t) {
                        this._inputMax = t, this._setRange()
                    }
                }), t.Normalize.prototype._setRange = function() {
                    this._sub.value = -this._inputMin, this._div.value = 1 / (this._inputMax - this._inputMin)
                }, t.Normalize.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this._sub.dispose(), this._sub = null, this._div.dispose(), this._div = null, this
                }, t.Normalize
            }), t(function(t) {
                return t.MultiPlayer = function() {
                    var e = this.optionsObject(arguments, ["urls", "onload"], t.MultiPlayer.defaults);
                    e.urls instanceof t.Buffers ? this.buffers = e.urls : this.buffers = new t.Buffers(e.urls, e.onload), this._activeSources = {}, this.fadeIn = e.fadeIn, this.fadeOut = e.fadeOut, this._volume = this.output = new t.Volume(e.volume), this.volume = this._volume.volume, this._readOnly("volume"), this._volume.output.output.channelCount = 2, this._volume.output.output.channelCountMode = "explicit", this.mute = e.mute
                }, t.extend(t.MultiPlayer, t.Source), t.MultiPlayer.defaults = {
                    onload: t.noOp,
                    fadeIn: 0,
                    fadeOut: 0
                }, t.MultiPlayer.prototype._makeSource = function(e) {
                    var i;
                    this.isString(e) || this.isNumber(e) ? i = this.buffers.get(e).get() : e instanceof t.Buffer ? i = e.get() : e instanceof AudioBuffer && (i = e);
                    var n = new t.BufferSource(i).connect(this.output);
                    return this._activeSources.hasOwnProperty(e) || (this._activeSources[e] = []), this._activeSources[e].push(n), n
                }, t.MultiPlayer.prototype.start = function(t, e, i, n, s, r) {
                    e = this.toSeconds(e);
                    var o = this._makeSource(t);
                    return o.start(e, i, n, this.defaultArg(r, 1), this.fadeIn), n && o.stop(e + this.toSeconds(n), this.fadeOut), s = this.defaultArg(s, 0), o.playbackRate.value = this.intervalToFrequencyRatio(s), this
                }, t.MultiPlayer.prototype.startLoop = function(t, e, i, n, s, r, o) {
                    e = this.toSeconds(e);
                    var a = this._makeSource(t);
                    return a.loop = !0, a.loopStart = this.toSeconds(this.defaultArg(n, 0)), a.loopEnd = this.toSeconds(this.defaultArg(s, 0)), a.start(e, i, void 0, this.defaultArg(o, 1), this.fadeIn), r = this.defaultArg(r, 0), a.playbackRate.value = this.intervalToFrequencyRatio(r), this
                }, t.MultiPlayer.prototype.stop = function(t, e) {
                    if (!this._activeSources[t] || !this._activeSources[t].length) throw new Error("Tone.MultiPlayer: cannot stop a buffer that hasn't been started or is already stopped");
                    return e = this.toSeconds(e), this._activeSources[t].shift().stop(e, this.fadeOut), this
                }, t.MultiPlayer.prototype.stopAll = function(t) {
                    t = this.toSeconds(t);
                    for (var e in this._activeSources)
                        for (var i = this._activeSources[e], n = 0; n < i.length; n++) i[n].stop(t);
                    return this
                }, t.MultiPlayer.prototype.add = function(t, e, i) {
                    return this.buffers.add(t, e, i), this
                }, Object.defineProperty(t.MultiPlayer.prototype, "state", {
                    get: function() {
                        return this._activeSources.length > 0 ? t.State.Started : t.State.Stopped
                    }
                }), Object.defineProperty(t.MultiPlayer.prototype, "mute", {
                    get: function() {
                        return this._volume.mute
                    },
                    set: function(t) {
                        this._volume.mute = t
                    }
                }), t.MultiPlayer.prototype.dispose = function() {
                    t.prototype.dispose.call(this), this._volume.dispose(), this._volume = null, this._writable("volume"), this.volume = null;
                    for (var e in this._activeSources) this._activeSources[e].forEach(function(t) {
                        t.dispose()
                    });
                    return this.buffers.dispose(), this.buffers = null, this._activeSources = null, this
                }, t.MultiPlayer
            }), t(function(t) {
                return t.GrainPlayer = function() {
                    var e = this.optionsObject(arguments, ["url", "onload"], t.GrainPlayer.defaults);
                    t.Source.call(this), this.buffer = new t.Buffer(e.url, e.onload), this._player = (new t.MultiPlayer).connect(this.output), this._clock = new t.Clock(this._tick.bind(this), 1), this._loopStart = 0, this._loopEnd = 0, this._playbackRate = e.playbackRate, this._grainSize = e.grainSize, this._overlap = e.overlap, this.detune = e.detune, this.drift = e.drift, this.overlap = e.overlap, this.loop = e.loop, this.playbackRate = e.playbackRate, this.grainSize = e.grainSize, this.loopStart = e.loopStart, this.loopEnd = e.loopEnd, this.reverse = e.reverse
                }, t.extend(t.GrainPlayer, t.Source), t.GrainPlayer.defaults = {
                    onload: t.noOp,
                    overlap: .1,
                    grainSize: .2,
                    drift: 0,
                    playbackRate: 1,
                    detune: 0,
                    loop: !1,
                    loopStart: 0,
                    loopEnd: 0,
                    reverse: !1
                }, t.GrainPlayer.prototype._start = function(t, e, i) {
                    e = this.defaultArg(e, 0), e = this.toSeconds(e), t = this.toSeconds(t), this._offset = e, this._clock.start(t), this._player.volume.setValueAtTime(0, t), i && this._stop(t + this.toSeconds(i))
                }, t.GrainPlayer.prototype._stop = function(t) {
                    this._clock.stop(t), this._player.volume.cancelScheduledValues(t), this._player.volume.setValueAtTime(-1 / 0, t)
                }, t.GrainPlayer.prototype._tick = function(t) {
                    var e = this.buffer.duration;
                    this.loop && this._loopEnd > 0 && (e = this._loopEnd);
                    var i = (2 * Math.random() - 1) * this.drift,
                        n = this._offset - this._overlap + i,
                        s = this.detune / 100;
                    n = Math.max(n, 0), n = Math.min(n, e);
                    var r = this._player.fadeIn;
                    if (this.loop && this._offset > e) {
                        var o = this._offset - e;
                        this._player.start(this.buffer, t, n, o + this._overlap, s), n = this._offset % e, this._offset = this._loopStart, this._player.fadeIn = 0, this._player.start(this.buffer, t + o, this._offset, n + this._overlap, s)
                    } else this._offset > e ? this.stop(t) : (0 === n && (this._player.fadeIn = 0), this._player.start(this.buffer, t, n, this.grainSize + this._overlap, s));
                    this._player.fadeIn = r;
                    var a = this._clock._nextTick - t;
                    this._offset += a * this._playbackRate
                }, t.GrainPlayer.prototype.scrub = function(t, e) {
                    return this._offset = this.toSeconds(t), this._tick(this.toSeconds(e)), this
                }, Object.defineProperty(t.GrainPlayer.prototype, "playbackRate", {
                    get: function() {
                        return this._playbackRate
                    },
                    set: function(t) {
                        this._playbackRate = t, this.grainSize = this._grainSize
                    }
                }), Object.defineProperty(t.GrainPlayer.prototype, "loopStart", {
                    get: function() {
                        return this._loopStart
                    },
                    set: function(t) {
                        this._loopStart = this.toSeconds(t)
                    }
                }), Object.defineProperty(t.GrainPlayer.prototype, "loopEnd", {
                    get: function() {
                        return this._loopEnd
                    },
                    set: function(t) {
                        this._loopEnd = this.toSeconds(t)
                    }
                }), Object.defineProperty(t.GrainPlayer.prototype, "reverse", {
                    get: function() {
                        return this.buffer.reverse
                    },
                    set: function(t) {
                        this.buffer.reverse = t
                    }
                }), Object.defineProperty(t.GrainPlayer.prototype, "grainSize", {
                    get: function() {
                        return this._grainSize
                    },
                    set: function(t) {
                        this._grainSize = this.toSeconds(t), this._clock.frequency.value = this._playbackRate / this._grainSize
                    }
                }), Object.defineProperty(t.GrainPlayer.prototype, "overlap", {
                    get: function() {
                        return this._overlap
                    },
                    set: function(t) {
                        t = this.toSeconds(t), this._overlap = t, this._overlap < 0 ? (this._player.fadeIn = .01, this._player.fadeOut = .01) : (this._player.fadeIn = t, this._player.fadeOut = t)
                    }
                }), t.GrainPlayer.prototype.dispose = function() {
                    return t.Source.prototype.dispose.call(this), this.buffer.dispose(), this.buffer = null, this._player.dispose(), this._player = null, this._clock.dispose(), this._clock = null, this
                }, t.GrainPlayer
            }), t(function(t) {
                return t.UserMedia = function() {
                    var e = this.optionsObject(arguments, ["volume"], t.UserMedia.defaults);
                    this._mediaStream = null, this._stream = null, this._device = null, this._volume = this.output = new t.Volume(e.volume), this.volume = this._volume.volume, this._readOnly("volume"), this.mute = e.mute
                }, t.extend(t.UserMedia), t.UserMedia.defaults = {
                    volume: 0,
                    mute: !1
                }, t.UserMedia.prototype.open = function(t) {
                    return t = this.defaultArg(t, "default"), this.enumerateDevices().then(function(e) {
                        var i;
                        if (this.isNumber(t) ? i = e[t] : (i = e.find(function(e) {
                                return e.label === t || e.deviceId === t
                            })) || (i = e[0]), !i) throw new Error("Tone.UserMedia: no matching audio inputs.");
                        this._device = i;
                        var n = {
                            audio: {
                                deviceId: i.deviceId,
                                echoCancellation: !1,
                                sampleRate: this.context.sampleRate
                            }
                        };
                        return navigator.mediaDevices.getUserMedia(n).then(function(t) {
                            return this._stream || (this._stream = t, this._mediaStream = this.context.createMediaStreamSource(t), this._mediaStream.connect(this.output)), this
                        }.bind(this))
                    }.bind(this))
                }, t.UserMedia.prototype.close = function() {
                    return this._stream && (this._stream.getAudioTracks().forEach(function(t) {
                        t.stop()
                    }), this._stream = null, this._mediaStream.disconnect(), this._mediaStream = null), this._device = null, this
                }, t.UserMedia.prototype.enumerateDevices = function() {
                    return navigator.mediaDevices.enumerateDevices().then(function(t) {
                        return t.filter(function(t) {
                            return "audioinput" === t.kind
                        })
                    })
                }, Object.defineProperty(t.UserMedia.prototype, "state", {
                    get: function() {
                        return this._stream && this._stream.active ? t.State.Started : t.State.Stopped
                    }
                }), Object.defineProperty(t.UserMedia.prototype, "deviceId", {
                    get: function() {
                        if (this._device) return this._device.deviceId
                    }
                }), Object.defineProperty(t.UserMedia.prototype, "groupId", {
                    get: function() {
                        if (this._device) return this._device.groupId
                    }
                }), Object.defineProperty(t.UserMedia.prototype, "label", {
                    get: function() {
                        if (this._device) return this._device.label
                    }
                }), Object.defineProperty(t.UserMedia.prototype, "mute", {
                    get: function() {
                        return this._volume.mute
                    },
                    set: function(t) {
                        this._volume.mute = t
                    }
                }), t.UserMedia.prototype.dispose = function() {
                    return t.prototype.dispose.call(this), this.close(), this._writable("volume"), this._volume.dispose(), this._volume = null, this.volume = null, this
                }, Object.defineProperty(t.UserMedia, "supported", {
                    get: function() {
                        return !t.prototype.isUndef(navigator.mediaDevices) && t.prototype.isFunction(navigator.mediaDevices.getUserMedia)
                    }
                }), t.UserMedia
            }), e
        })
    },
    431: function(t, e, i) {
        function n() {
            function t(t) {
                return new Int32Array(t)
            }

            function e(t) {
                return new Float32Array(t)
            }
            this.xr = r(576), this.l3_enc = o(576), this.scalefac = o(a.SFBMAX), this.xrpow_max = 0, this.part2_3_length = 0, this.big_values = 0, this.count1 = 0, this.global_gain = 0, this.scalefac_compress = 0, this.block_type = 0, this.mixed_block_flag = 0, this.table_select = o(3), this.subblock_gain = o(4), this.region0_count = 0, this.region1_count = 0, this.preflag = 0, this.scalefac_scale = 0, this.count1table_select = 0, this.part2_length = 0, this.sfb_lmax = 0, this.sfb_smin = 0, this.psy_lmax = 0, this.sfbmax = 0, this.psymax = 0, this.sfbdivide = 0, this.width = o(a.SFBMAX), this.window = o(a.SFBMAX), this.count1bits = 0, this.sfb_partition_table = null, this.slen = o(4), this.max_nonzero_coeff = 0;
            var i = this;
            this.assign = function(n) {
                i.xr = e(n.xr), i.l3_enc = t(n.l3_enc), i.scalefac = t(n.scalefac), i.xrpow_max = n.xrpow_max, i.part2_3_length = n.part2_3_length, i.big_values = n.big_values, i.count1 = n.count1, i.global_gain = n.global_gain, i.scalefac_compress = n.scalefac_compress, i.block_type = n.block_type, i.mixed_block_flag = n.mixed_block_flag, i.table_select = t(n.table_select), i.subblock_gain = t(n.subblock_gain), i.region0_count = n.region0_count, i.region1_count = n.region1_count, i.preflag = n.preflag, i.scalefac_scale = n.scalefac_scale, i.count1table_select = n.count1table_select, i.part2_length = n.part2_length, i.sfb_lmax = n.sfb_lmax, i.sfb_smin = n.sfb_smin, i.psy_lmax = n.psy_lmax, i.sfbmax = n.sfbmax, i.psymax = n.psymax, i.sfbdivide = n.sfbdivide, i.width = t(n.width), i.window = t(n.window), i.count1bits = n.count1bits, i.sfb_partition_table = n.sfb_partition_table.slice(0), i.slen = t(n.slen), i.max_nonzero_coeff = n.max_nonzero_coeff
            }
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            o = (s.new_float_n, s.new_int),
            a = (s.new_int_n, s.assert, i(427));
        t.exports = n
    },
    432: function(t, e) {
        function i(t, e, i, n) {
            this.xlen = t, this.linmax = e, this.table = i, this.hlen = n
        }
        var n = {};
        n.t1HB = [1, 1, 1, 0], n.t2HB = [1, 2, 1, 3, 1, 1, 3, 2, 0], n.t3HB = [3, 2, 1, 1, 1, 1, 3, 2, 0], n.t5HB = [1, 2, 6, 5, 3, 1, 4, 4, 7, 5, 7, 1, 6, 1, 1, 0], n.t6HB = [7, 3, 5, 1, 6, 2, 3, 2, 5, 4, 4, 1, 3, 3, 2, 0], n.t7HB = [1, 2, 10, 19, 16, 10, 3, 3, 7, 10, 5, 3, 11, 4, 13, 17, 8, 4, 12, 11, 18, 15, 11, 2, 7, 6, 9, 14, 3, 1, 6, 4, 5, 3, 2, 0], n.t8HB = [3, 4, 6, 18, 12, 5, 5, 1, 2, 16, 9, 3, 7, 3, 5, 14, 7, 3, 19, 17, 15, 13, 10, 4, 13, 5, 8, 11, 5, 1, 12, 4, 4, 1, 1, 0], n.t9HB = [7, 5, 9, 14, 15, 7, 6, 4, 5, 5, 6, 7, 7, 6, 8, 8, 8, 5, 15, 6, 9, 10, 5, 1, 11, 7, 9, 6, 4, 1, 14, 4, 6, 2, 6, 0], n.t10HB = [1, 2, 10, 23, 35, 30, 12, 17, 3, 3, 8, 12, 18, 21, 12, 7, 11, 9, 15, 21, 32, 40, 19, 6, 14, 13, 22, 34, 46, 23, 18, 7, 20, 19, 33, 47, 27, 22, 9, 3, 31, 22, 41, 26, 21, 20, 5, 3, 14, 13, 10, 11, 16, 6, 5, 1, 9, 8, 7, 8, 4, 4, 2, 0], n.t11HB = [3, 4, 10, 24, 34, 33, 21, 15, 5, 3, 4, 10, 32, 17, 11, 10, 11, 7, 13, 18, 30, 31, 20, 5, 25, 11, 19, 59, 27, 18, 12, 5, 35, 33, 31, 58, 30, 16, 7, 5, 28, 26, 32, 19, 17, 15, 8, 14, 14, 12, 9, 13, 14, 9, 4, 1, 11, 4, 6, 6, 6, 3, 2, 0], n.t12HB = [9, 6, 16, 33, 41, 39, 38, 26, 7, 5, 6, 9, 23, 16, 26, 11, 17, 7, 11, 14, 21, 30, 10, 7, 17, 10, 15, 12, 18, 28, 14, 5, 32, 13, 22, 19, 18, 16, 9, 5, 40, 17, 31, 29, 17, 13, 4, 2, 27, 12, 11, 15, 10, 7, 4, 1, 27, 12, 8, 12, 6, 3, 1, 0], n.t13HB = [1, 5, 14, 21, 34, 51, 46, 71, 42, 52, 68, 52, 67, 44, 43, 19, 3, 4, 12, 19, 31, 26, 44, 33, 31, 24, 32, 24, 31, 35, 22, 14, 15, 13, 23, 36, 59, 49, 77, 65, 29, 40, 30, 40, 27, 33, 42, 16, 22, 20, 37, 61, 56, 79, 73, 64, 43, 76, 56, 37, 26, 31, 25, 14, 35, 16, 60, 57, 97, 75, 114, 91, 54, 73, 55, 41, 48, 53, 23, 24, 58, 27, 50, 96, 76, 70, 93, 84, 77, 58, 79, 29, 74, 49, 41, 17, 47, 45, 78, 74, 115, 94, 90, 79, 69, 83, 71, 50, 59, 38, 36, 15, 72, 34, 56, 95, 92, 85, 91, 90, 86, 73, 77, 65, 51, 44, 43, 42, 43, 20, 30, 44, 55, 78, 72, 87, 78, 61, 46, 54, 37, 30, 20, 16, 53, 25, 41, 37, 44, 59, 54, 81, 66, 76, 57, 54, 37, 18, 39, 11, 35, 33, 31, 57, 42, 82, 72, 80, 47, 58, 55, 21, 22, 26, 38, 22, 53, 25, 23, 38, 70, 60, 51, 36, 55, 26, 34, 23, 27, 14, 9, 7, 34, 32, 28, 39, 49, 75, 30, 52, 48, 40, 52, 28, 18, 17, 9, 5, 45, 21, 34, 64, 56, 50, 49, 45, 31, 19, 12, 15, 10, 7, 6, 3, 48, 23, 20, 39, 36, 35, 53, 21, 16, 23, 13, 10, 6, 1, 4, 2, 16, 15, 17, 27, 25, 20, 29, 11, 17, 12, 16, 8, 1, 1, 0, 1], n.t15HB = [7, 12, 18, 53, 47, 76, 124, 108, 89, 123, 108, 119, 107, 81, 122, 63, 13, 5, 16, 27, 46, 36, 61, 51, 42, 70, 52, 83, 65, 41, 59, 36, 19, 17, 15, 24, 41, 34, 59, 48, 40, 64, 50, 78, 62, 80, 56, 33, 29, 28, 25, 43, 39, 63, 55, 93, 76, 59, 93, 72, 54, 75, 50, 29, 52, 22, 42, 40, 67, 57, 95, 79, 72, 57, 89, 69, 49, 66, 46, 27, 77, 37, 35, 66, 58, 52, 91, 74, 62, 48, 79, 63, 90, 62, 40, 38, 125, 32, 60, 56, 50, 92, 78, 65, 55, 87, 71, 51, 73, 51, 70, 30, 109, 53, 49, 94, 88, 75, 66, 122, 91, 73, 56, 42, 64, 44, 21, 25, 90, 43, 41, 77, 73, 63, 56, 92, 77, 66, 47, 67, 48, 53, 36, 20, 71, 34, 67, 60, 58, 49, 88, 76, 67, 106, 71, 54, 38, 39, 23, 15, 109, 53, 51, 47, 90, 82, 58, 57, 48, 72, 57, 41, 23, 27, 62, 9, 86, 42, 40, 37, 70, 64, 52, 43, 70, 55, 42, 25, 29, 18, 11, 11, 118, 68, 30, 55, 50, 46, 74, 65, 49, 39, 24, 16, 22, 13, 14, 7, 91, 44, 39, 38, 34, 63, 52, 45, 31, 52, 28, 19, 14, 8, 9, 3, 123, 60, 58, 53, 47, 43, 32, 22, 37, 24, 17, 12, 15, 10, 2, 1, 71, 37, 34, 30, 28, 20, 17, 26, 21, 16, 10, 6, 8, 6, 2, 0], n.t16HB = [1, 5, 14, 44, 74, 63, 110, 93, 172, 149, 138, 242, 225, 195, 376, 17, 3, 4, 12, 20, 35, 62, 53, 47, 83, 75, 68, 119, 201, 107, 207, 9, 15, 13, 23, 38, 67, 58, 103, 90, 161, 72, 127, 117, 110, 209, 206, 16, 45, 21, 39, 69, 64, 114, 99, 87, 158, 140, 252, 212, 199, 387, 365, 26, 75, 36, 68, 65, 115, 101, 179, 164, 155, 264, 246, 226, 395, 382, 362, 9, 66, 30, 59, 56, 102, 185, 173, 265, 142, 253, 232, 400, 388, 378, 445, 16, 111, 54, 52, 100, 184, 178, 160, 133, 257, 244, 228, 217, 385, 366, 715, 10, 98, 48, 91, 88, 165, 157, 148, 261, 248, 407, 397, 372, 380, 889, 884, 8, 85, 84, 81, 159, 156, 143, 260, 249, 427, 401, 392, 383, 727, 713, 708, 7, 154, 76, 73, 141, 131, 256, 245, 426, 406, 394, 384, 735, 359, 710, 352, 11, 139, 129, 67, 125, 247, 233, 229, 219, 393, 743, 737, 720, 885, 882, 439, 4, 243, 120, 118, 115, 227, 223, 396, 746, 742, 736, 721, 712, 706, 223, 436, 6, 202, 224, 222, 218, 216, 389, 386, 381, 364, 888, 443, 707, 440, 437, 1728, 4, 747, 211, 210, 208, 370, 379, 734, 723, 714, 1735, 883, 877, 876, 3459, 865, 2, 377, 369, 102, 187, 726, 722, 358, 711, 709, 866, 1734, 871, 3458, 870, 434, 0, 12, 10, 7, 11, 10, 17, 11, 9, 13, 12, 10, 7, 5, 3, 1, 3], n.t24HB = [15, 13, 46, 80, 146, 262, 248, 434, 426, 669, 653, 649, 621, 517, 1032, 88, 14, 12, 21, 38, 71, 130, 122, 216, 209, 198, 327, 345, 319, 297, 279, 42, 47, 22, 41, 74, 68, 128, 120, 221, 207, 194, 182, 340, 315, 295, 541, 18, 81, 39, 75, 70, 134, 125, 116, 220, 204, 190, 178, 325, 311, 293, 271, 16, 147, 72, 69, 135, 127, 118, 112, 210, 200, 188, 352, 323, 306, 285, 540, 14, 263, 66, 129, 126, 119, 114, 214, 202, 192, 180, 341, 317, 301, 281, 262, 12, 249, 123, 121, 117, 113, 215, 206, 195, 185, 347, 330, 308, 291, 272, 520, 10, 435, 115, 111, 109, 211, 203, 196, 187, 353, 332, 313, 298, 283, 531, 381, 17, 427, 212, 208, 205, 201, 193, 186, 177, 169, 320, 303, 286, 268, 514, 377, 16, 335, 199, 197, 191, 189, 181, 174, 333, 321, 305, 289, 275, 521, 379, 371, 11, 668, 184, 183, 179, 175, 344, 331, 314, 304, 290, 277, 530, 383, 373, 366, 10, 652, 346, 171, 168, 164, 318, 309, 299, 287, 276, 263, 513, 375, 368, 362, 6, 648, 322, 316, 312, 307, 302, 292, 284, 269, 261, 512, 376, 370, 364, 359, 4, 620, 300, 296, 294, 288, 282, 273, 266, 515, 380, 374, 369, 365, 361, 357, 2, 1033, 280, 278, 274, 267, 264, 259, 382, 378, 372, 367, 363, 360, 358, 356, 0, 43, 20, 19, 17, 15, 13, 11, 9, 7, 6, 4, 7, 5, 3, 1, 3], n.t32HB = [1, 10, 8, 20, 12, 20, 16, 32, 14, 12, 24, 0, 28, 16, 24, 16], n.t33HB = [15, 28, 26, 48, 22, 40, 36, 64, 14, 24, 20, 32, 12, 16, 8, 0], n.t1l = [1, 4, 3, 5], n.t2l = [1, 4, 7, 4, 5, 7, 6, 7, 8], n.t3l = [2, 3, 7, 4, 4, 7, 6, 7, 8], n.t5l = [1, 4, 7, 8, 4, 5, 8, 9, 7, 8, 9, 10, 8, 8, 9, 10], n.t6l = [3, 4, 6, 8, 4, 4, 6, 7, 5, 6, 7, 8, 7, 7, 8, 9], n.t7l = [1, 4, 7, 9, 9, 10, 4, 6, 8, 9, 9, 10, 7, 7, 9, 10, 10, 11, 8, 9, 10, 11, 11, 11, 8, 9, 10, 11, 11, 12, 9, 10, 11, 12, 12, 12], n.t8l = [2, 4, 7, 9, 9, 10, 4, 4, 6, 10, 10, 10, 7, 6, 8, 10, 10, 11, 9, 10, 10, 11, 11, 12, 9, 9, 10, 11, 12, 12, 10, 10, 11, 11, 13, 13], n.t9l = [3, 4, 6, 7, 9, 10, 4, 5, 6, 7, 8, 10, 5, 6, 7, 8, 9, 10, 7, 7, 8, 9, 9, 10, 8, 8, 9, 9, 10, 11, 9, 9, 10, 10, 11, 11], n.t10l = [1, 4, 7, 9, 10, 10, 10, 11, 4, 6, 8, 9, 10, 11, 10, 10, 7, 8, 9, 10, 11, 12, 11, 11, 8, 9, 10, 11, 12, 12, 11, 12, 9, 10, 11, 12, 12, 12, 12, 12, 10, 11, 12, 12, 13, 13, 12, 13, 9, 10, 11, 12, 12, 12, 13, 13, 10, 10, 11, 12, 12, 13, 13, 13], n.t11l = [2, 4, 6, 8, 9, 10, 9, 10, 4, 5, 6, 8, 10, 10, 9, 10, 6, 7, 8, 9, 10, 11, 10, 10, 8, 8, 9, 11, 10, 12, 10, 11, 9, 10, 10, 11, 11, 12, 11, 12, 9, 10, 11, 12, 12, 13, 12, 13, 9, 9, 9, 10, 11, 12, 12, 12, 9, 9, 10, 11, 12, 12, 12, 12], n.t12l = [4, 4, 6, 8, 9, 10, 10, 10, 4, 5, 6, 7, 9, 9, 10, 10, 6, 6, 7, 8, 9, 10, 9, 10, 7, 7, 8, 8, 9, 10, 10, 10, 8, 8, 9, 9, 10, 10, 10, 11, 9, 9, 10, 10, 10, 11, 10, 11, 9, 9, 9, 10, 10, 11, 11, 12, 10, 10, 10, 11, 11, 11, 11, 12], n.t13l = [1, 5, 7, 8, 9, 10, 10, 11, 10, 11, 12, 12, 13, 13, 14, 14, 4, 6, 8, 9, 10, 10, 11, 11, 11, 11, 12, 12, 13, 14, 14, 14, 7, 8, 9, 10, 11, 11, 12, 12, 11, 12, 12, 13, 13, 14, 15, 15, 8, 9, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 15, 15, 9, 9, 11, 11, 12, 12, 13, 13, 12, 13, 13, 14, 14, 15, 15, 16, 10, 10, 11, 12, 12, 12, 13, 13, 13, 13, 14, 13, 15, 15, 16, 16, 10, 11, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 15, 15, 16, 16, 11, 11, 12, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 16, 18, 18, 10, 10, 11, 12, 12, 13, 13, 14, 14, 14, 14, 15, 15, 16, 17, 17, 11, 11, 12, 12, 13, 13, 13, 15, 14, 15, 15, 16, 16, 16, 18, 17, 11, 12, 12, 13, 13, 14, 14, 15, 14, 15, 16, 15, 16, 17, 18, 19, 12, 12, 12, 13, 14, 14, 14, 14, 15, 15, 15, 16, 17, 17, 17, 18, 12, 13, 13, 14, 14, 15, 14, 15, 16, 16, 17, 17, 17, 18, 18, 18, 13, 13, 14, 15, 15, 15, 16, 16, 16, 16, 16, 17, 18, 17, 18, 18, 14, 14, 14, 15, 15, 15, 17, 16, 16, 19, 17, 17, 17, 19, 18, 18, 13, 14, 15, 16, 16, 16, 17, 16, 17, 17, 18, 18, 21, 20, 21, 18], n.t15l = [3, 5, 6, 8, 8, 9, 10, 10, 10, 11, 11, 12, 12, 12, 13, 14, 5, 5, 7, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 12, 13, 13, 6, 7, 7, 8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 13, 13, 13, 7, 8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 8, 8, 9, 9, 10, 10, 11, 11, 11, 11, 12, 12, 12, 13, 13, 13, 9, 9, 9, 10, 10, 10, 11, 11, 11, 11, 12, 12, 13, 13, 13, 14, 10, 9, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 13, 13, 14, 14, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 14, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 14, 14, 14, 10, 10, 11, 11, 11, 11, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13, 14, 15, 14, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 15, 12, 12, 11, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 14, 15, 15, 12, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 14, 15, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15], n.t16_5l = [1, 5, 7, 9, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13, 14, 11, 4, 6, 8, 9, 10, 11, 11, 11, 12, 12, 12, 13, 14, 13, 14, 11, 7, 8, 9, 10, 11, 11, 12, 12, 13, 12, 13, 13, 13, 14, 14, 12, 9, 9, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 14, 15, 15, 13, 10, 10, 11, 11, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 12, 10, 10, 11, 11, 12, 13, 13, 14, 13, 14, 14, 15, 15, 15, 16, 13, 11, 11, 11, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 16, 13, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 15, 15, 17, 17, 13, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 13, 12, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 15, 16, 15, 14, 12, 13, 12, 13, 14, 14, 14, 14, 15, 16, 16, 16, 17, 17, 16, 13, 13, 13, 13, 13, 14, 14, 15, 16, 16, 16, 16, 16, 16, 15, 16, 14, 13, 14, 14, 14, 14, 15, 15, 15, 15, 17, 16, 16, 16, 16, 18, 14, 15, 14, 14, 14, 15, 15, 16, 16, 16, 18, 17, 17, 17, 19, 17, 14, 14, 15, 13, 14, 16, 16, 15, 16, 16, 17, 18, 17, 19, 17, 16, 14, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 12], n.t16l = [1, 5, 7, 9, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13, 14, 10, 4, 6, 8, 9, 10, 11, 11, 11, 12, 12, 12, 13, 14, 13, 14, 10, 7, 8, 9, 10, 11, 11, 12, 12, 13, 12, 13, 13, 13, 14, 14, 11, 9, 9, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 14, 15, 15, 12, 10, 10, 11, 11, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 11, 10, 10, 11, 11, 12, 13, 13, 14, 13, 14, 14, 15, 15, 15, 16, 12, 11, 11, 11, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 16, 12, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 15, 15, 17, 17, 12, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 12, 12, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 15, 16, 15, 13, 12, 13, 12, 13, 14, 14, 14, 14, 15, 16, 16, 16, 17, 17, 16, 12, 13, 13, 13, 13, 14, 14, 15, 16, 16, 16, 16, 16, 16, 15, 16, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 17, 16, 16, 16, 16, 18, 13, 15, 14, 14, 14, 15, 15, 16, 16, 16, 18, 17, 17, 17, 19, 17, 13, 14, 15, 13, 14, 16, 16, 15, 16, 16, 17, 18, 17, 19, 17, 16, 13, 10, 10, 10, 11, 11, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 10], n.t24l = [4, 5, 7, 8, 9, 10, 10, 11, 11, 12, 12, 12, 12, 12, 13, 10, 5, 6, 7, 8, 9, 10, 10, 11, 11, 11, 12, 12, 12, 12, 12, 10, 7, 7, 8, 9, 9, 10, 10, 11, 11, 11, 11, 12, 12, 12, 13, 9, 8, 8, 9, 9, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 13, 9, 10, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 9, 11, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 10, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 10, 12, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 10, 12, 12, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 10, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 10, 13, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 6], n.t32l = [1, 5, 5, 7, 5, 8, 7, 9, 5, 7, 7, 9, 7, 9, 9, 10], n.t33l = [4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8], n.ht = [new i(0, 0, null, null), new i(2, 0, n.t1HB, n.t1l), new i(3, 0, n.t2HB, n.t2l), new i(3, 0, n.t3HB, n.t3l), new i(0, 0, null, null), new i(4, 0, n.t5HB, n.t5l), new i(4, 0, n.t6HB, n.t6l), new i(6, 0, n.t7HB, n.t7l), new i(6, 0, n.t8HB, n.t8l), new i(6, 0, n.t9HB, n.t9l), new i(8, 0, n.t10HB, n.t10l), new i(8, 0, n.t11HB, n.t11l), new i(8, 0, n.t12HB, n.t12l), new i(16, 0, n.t13HB, n.t13l), new i(0, 0, null, n.t16_5l), new i(16, 0, n.t15HB, n.t15l), new i(1, 1, n.t16HB, n.t16l), new i(2, 3, n.t16HB, n.t16l), new i(3, 7, n.t16HB, n.t16l), new i(4, 15, n.t16HB, n.t16l), new i(6, 63, n.t16HB, n.t16l), new i(8, 255, n.t16HB, n.t16l), new i(10, 1023, n.t16HB, n.t16l), new i(13, 8191, n.t16HB, n.t16l), new i(4, 15, n.t24HB, n.t24l), new i(5, 31, n.t24HB, n.t24l), new i(6, 63, n.t24HB, n.t24l), new i(7, 127, n.t24HB, n.t24l), new i(8, 255, n.t24HB, n.t24l), new i(9, 511, n.t24HB, n.t24l), new i(11, 2047, n.t24HB, n.t24l), new i(13, 8191, n.t24HB, n.t24l), new i(0, 0, n.t32HB, n.t32l), new i(0, 0, n.t33HB, n.t33l)], n.largetbl = [65540, 327685, 458759, 589832, 655369, 655370, 720906, 720907, 786443, 786444, 786444, 851980, 851980, 851980, 917517, 655370, 262149, 393222, 524295, 589832, 655369, 720906, 720906, 720907, 786443, 786443, 786444, 851980, 917516, 851980, 917516, 655370, 458759, 524295, 589832, 655369, 720905, 720906, 786442, 786443, 851979, 786443, 851979, 851980, 851980, 917516, 917517, 720905, 589832, 589832, 655369, 720905, 720906, 786442, 786442, 786443, 851979, 851979, 917515, 917516, 917516, 983052, 983052, 786441, 655369, 655369, 720905, 720906, 786442, 786442, 851978, 851979, 851979, 917515, 917516, 917516, 983052, 983052, 983053, 720905, 655370, 655369, 720906, 720906, 786442, 851978, 851979, 917515, 851979, 917515, 917516, 983052, 983052, 983052, 1048588, 786441, 720906, 720906, 720906, 786442, 851978, 851979, 851979, 851979, 917515, 917516, 917516, 917516, 983052, 983052, 1048589, 786441, 720907, 720906, 786442, 786442, 851979, 851979, 851979, 917515, 917516, 983052, 983052, 983052, 983052, 1114125, 1114125, 786442, 720907, 786443, 786443, 851979, 851979, 851979, 917515, 917515, 983051, 983052, 983052, 983052, 1048588, 1048589, 1048589, 786442, 786443, 786443, 786443, 851979, 851979, 917515, 917515, 983052, 983052, 983052, 983052, 1048588, 983053, 1048589, 983053, 851978, 786444, 851979, 786443, 851979, 917515, 917516, 917516, 917516, 983052, 1048588, 1048588, 1048589, 1114125, 1114125, 1048589, 786442, 851980, 851980, 851979, 851979, 917515, 917516, 983052, 1048588, 1048588, 1048588, 1048588, 1048589, 1048589, 983053, 1048589, 851978, 851980, 917516, 917516, 917516, 917516, 983052, 983052, 983052, 983052, 1114124, 1048589, 1048589, 1048589, 1048589, 1179661, 851978, 983052, 917516, 917516, 917516, 983052, 983052, 1048588, 1048588, 1048589, 1179661, 1114125, 1114125, 1114125, 1245197, 1114125, 851978, 917517, 983052, 851980, 917516, 1048588, 1048588, 983052, 1048589, 1048589, 1114125, 1179661, 1114125, 1245197, 1114125, 1048589, 851978, 655369, 655369, 655369, 720905, 720905, 786441, 786441, 786441, 851977, 851977, 851977, 851978, 851978, 851978, 851978, 655366], n.table23 = [65538, 262147, 458759, 262148, 327684, 458759, 393222, 458759, 524296], n.table56 = [65539, 262148, 458758, 524296, 262148, 327684, 524294, 589831, 458757, 524294, 589831, 655368, 524295, 524295, 589832, 655369], n.bitrate_table = [
            [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1],
            [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1],
            [0, 8, 16, 24, 32, 40, 48, 56, 64, -1, -1, -1, -1, -1, -1, -1]
        ], n.samplerate_table = [
            [22050, 24e3, 16e3, -1],
            [44100, 48e3, 32e3, -1],
            [11025, 12e3, 8e3, -1]
        ], n.scfsi_band = [0, 6, 11, 16, 21], t.exports = n
    },
    437: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }

        function s(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function r(t) {
            k = new A.default.Mp3Encoder(1, t, 128), o()
        }

        function o() {
            R = [], O = [], F = []
        }

        function a(t) {
            var e = t.inputBuffer.getChannelData(0),
                i = e.buffer.slice();
            O.push(i);
            for (var n = M.analyse(), s = 0; s < n.length; s++) F.push(n[s])
        }

        function l() {
            for (var t = O[0], e = 1; e < O.length; e++) t = h(t, O[e]);
            return t
        }

        function h(t, e) {
            var i = new Uint8Array(t.byteLength + e.byteLength);
            return i.set(new Uint8Array(t), 0), i.set(new Uint8Array(e), t.byteLength), i.buffer
        }

        function u(t) {
            for (var e = c(t), i = e.length, n = 0; i >= 0; n++) {
                var s = e.subarray(n, n + 1);
                f(k.encodeBuffer(s)), i--
            }
            f(k.flush())
        }

        function c(t) {
            var e = new Float32Array(t),
                i = new Int16Array(e.length);
            return p(e, i), i
        }

        function p(t, e) {
            for (var i = 0; i < t.length; i++) {
                var n = Math.max(-1, Math.min(1, t[i]));
                e[i] = n < 0 ? 32768 * n : 32767 * n
            }
        }

        function f(t) {
            R.push(new Int8Array(t))
        }

        function _(t, e) {
            var i = Number(t),
                n = Number(e);
            (!i || i < 0 || i > R.length) && (i = 0), (!n || n < 0 || n > R.length || n < i) && (n = R.length);
            var s = Array.from(R);
            return s = s.slice(i, n + 1), new Blob(s, {
                type: "audio/mp3"
            })
        }

        function d(t, e) {
            return t = Math.ceil(t), e = Math.floor(e), Math.floor(Math.random() * (e - t)) + t
        }

        function m(t) {
            C = [];
            for (var e = t; e < F.length; e += t) {
                var i = d(e - t, e);
                C.push(F[i])
            }
        }

        function y() {
            return T = new q
        }

        function v() {
            return T || y(), T
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var b = function() {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }
            return function(e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }();
        e.getSampleCreator = v;
        var g = i(429),
            S = n(g),
            w = i(498),
            A = n(w),
            T = void 0,
            x = void 0,
            M = void 0,
            k = void 0,
            R = void 0,
            O = void 0,
            E = void 0,
            P = void 0,
            B = void 0,
            C = void 0,
            F = void 0,
            q = function() {
                function t() {
                    if (s(this, t), this.resolution = 256, !S.default.UserMedia.supported) throw new Error("Tone.UserMedia is not supported");
                    x = new S.default.UserMedia, M = new S.default.Analyser({
                        type: "waveform",
                        size: this.resolution
                    }), x.connect(M)
                }
                return b(t, [{
                    key: "getReducedSet",
                    value: function(t) {
                        return m(F.length / t), C
                    }
                }, {
                    key: "getDataBufferLength",
                    value: function() {
                        return R.length
                    }
                }, {
                    key: "openMic",
                    value: function() {
                        return x.open().then(function() {
                            var t = x.context._context;
                            r(t.sampleRate), E = t.createScriptProcessor(0, 1, 1), E.onaudioprocess = a
                        })
                    }
                }, {
                    key: "startRecording",
                    value: function() {
                        x.connect(E), E.connect(x.context._context.destination)
                    }
                }, {
                    key: "resetRecorder",
                    value: function() {
                        o()
                    }
                }, {
                    key: "stopAndFinishRecording",
                    value: function() {
                        E.disconnect(), P = l(), u(P), this.createBlob()
                    }
                }, {
                    key: "createBlobObjectUrl",
                    value: function() {
                        return window.URL.createObjectURL(B)
                    }
                }, {
                    key: "createBuffer",
                    value: function(t) {
                        return new Promise(function(e, i) {
                            new S.default.Buffer(t, e, function(t) {
                                console.error(t), i(t)
                            })
                        })
                    }
                }, {
                    key: "createBlob",
                    value: function(t, e) {
                        B = _(t, e)
                    }
                }, {
                    key: "getValues",
                    value: function() {
                        return M.analyse()
                    }
                }]), t
            }();
        e.default = q
    },
    439: function(t, e, i) {
        function n() {
            function t(t) {
                r.arraycopy(t.header[t.w_ptr].buf, 0, P, C, t.sideinfo_len), C += t.sideinfo_len, B += 8 * t.sideinfo_len, t.w_ptr = t.w_ptr + 1 & _.MAX_HEADER_BUF - 1
            }

            function e(e, i, n) {
                for (u(n < M - 2); n > 0;) {
                    var s;
                    0 == F && (F = 8, C++, u(C < Lame.LAME_MAXMP3BUFFER), u(e.header[e.w_ptr].write_timing >= B), e.header[e.w_ptr].write_timing == B && t(e), P[C] = 0), s = Math.min(n, F), n -= s, F -= s, u(n < M), u(F < M), P[C] |= i >> n << F, B += s
                }
            }

            function i(t, e, i) {
                for (u(i < M - 2); i > 0;) {
                    var n;
                    0 == F && (F = 8, C++, u(C < Lame.LAME_MAXMP3BUFFER), P[C] = 0), n = Math.min(i, F), i -= n, F -= n, u(i < M), u(F < M), P[C] |= e >> i << F, B += n
                }
            }

            function n(t, i) {
                var n, s = t.internal_flags;
                if (u(i >= 0), i >= 8 && (e(s, 76, 8), i -= 8), i >= 8 && (e(s, 65, 8), i -= 8), i >= 8 && (e(s, 77, 8), i -= 8), i >= 8 && (e(s, 69, 8), i -= 8), i >= 32) {
                    var r = O.getLameShortVersion();
                    if (i >= 32)
                        for (n = 0; n < r.length && i >= 8; ++n) i -= 8, e(s, r.charAt(n), 8)
                }
                for (; i >= 1; i -= 1) e(s, s.ancillary_flag, 1), s.ancillary_flag ^= t.disable_reservoir ? 0 : 1;
                u(0 == i)
            }

            function s(t, e, i) {
                for (var n = t.header[t.h_ptr].ptr; i > 0;) {
                    var s = Math.min(i, 8 - (7 & n));
                    i -= s, u(i < M), t.header[t.h_ptr].buf[n >> 3] |= e >> i << 8 - (7 & n) - s, n += s
                }
                t.header[t.h_ptr].ptr = n
            }

            function d(t, e) {
                t <<= 8;
                for (var i = 0; i < 8; i++) t <<= 1, 0 != (65536 & ((e <<= 1) ^ t)) && (e ^= x);
                return e
            }

            function m(t, e) {
                var i, n, a, l = t.internal_flags;
                if (i = l.l3_side, l.header[l.h_ptr].ptr = 0, o.fill(l.header[l.h_ptr].buf, 0, l.sideinfo_len, 0), t.out_samplerate < 16e3 ? s(l, 4094, 12) : s(l, 4095, 12), s(l, t.version, 1), s(l, 1, 2), s(l, t.error_protection ? 0 : 1, 1), s(l, l.bitrate_index, 4), s(l, l.samplerate_index, 2), s(l, l.padding, 1), s(l, t.extension, 1), s(l, t.mode.ordinal(), 2), s(l, l.mode_ext, 2), s(l, t.copyright, 1), s(l, t.original, 1), s(l, t.emphasis, 2), t.error_protection && s(l, 0, 16), 1 == t.version) {
                    for (u(i.main_data_begin >= 0), s(l, i.main_data_begin, 9), 2 == l.channels_out ? s(l, i.private_bits, 3) : s(l, i.private_bits, 5), a = 0; a < l.channels_out; a++) {
                        var h;
                        for (h = 0; h < 4; h++) s(l, i.scfsi[a][h], 1)
                    }
                    for (n = 0; n < 2; n++)
                        for (a = 0; a < l.channels_out; a++) {
                            var c = i.tt[n][a];
                            s(l, c.part2_3_length + c.part2_length, 12), s(l, c.big_values / 2, 9), s(l, c.global_gain, 8), s(l, c.scalefac_compress, 4), c.block_type != f.NORM_TYPE ? (s(l, 1, 1), s(l, c.block_type, 2), s(l, c.mixed_block_flag, 1), 14 == c.table_select[0] && (c.table_select[0] = 16), s(l, c.table_select[0], 5), 14 == c.table_select[1] && (c.table_select[1] = 16), s(l, c.table_select[1], 5), s(l, c.subblock_gain[0], 3), s(l, c.subblock_gain[1], 3), s(l, c.subblock_gain[2], 3)) : (s(l, 0, 1), 14 == c.table_select[0] && (c.table_select[0] = 16), s(l, c.table_select[0], 5), 14 == c.table_select[1] && (c.table_select[1] = 16), s(l, c.table_select[1], 5), 14 == c.table_select[2] && (c.table_select[2] = 16), s(l, c.table_select[2], 5), u(0 <= c.region0_count && c.region0_count < 16), u(0 <= c.region1_count && c.region1_count < 8), s(l, c.region0_count, 4), s(l, c.region1_count, 3)), s(l, c.preflag, 1), s(l, c.scalefac_scale, 1), s(l, c.count1table_select, 1)
                        }
                } else
                    for (u(i.main_data_begin >= 0), s(l, i.main_data_begin, 8), s(l, i.private_bits, l.channels_out), n = 0, a = 0; a < l.channels_out; a++) {
                        var c = i.tt[n][a];
                        s(l, c.part2_3_length + c.part2_length, 12), s(l, c.big_values / 2, 9), s(l, c.global_gain, 8), s(l, c.scalefac_compress, 9), c.block_type != f.NORM_TYPE ? (s(l, 1, 1), s(l, c.block_type, 2), s(l, c.mixed_block_flag, 1), 14 == c.table_select[0] && (c.table_select[0] = 16), s(l, c.table_select[0], 5), 14 == c.table_select[1] && (c.table_select[1] = 16), s(l, c.table_select[1], 5), s(l, c.subblock_gain[0], 3), s(l, c.subblock_gain[1], 3), s(l, c.subblock_gain[2], 3)) : (s(l, 0, 1), 14 == c.table_select[0] && (c.table_select[0] = 16), s(l, c.table_select[0], 5), 14 == c.table_select[1] && (c.table_select[1] = 16), s(l, c.table_select[1], 5), 14 == c.table_select[2] && (c.table_select[2] = 16), s(l, c.table_select[2], 5), u(0 <= c.region0_count && c.region0_count < 16), u(0 <= c.region1_count && c.region1_count < 8), s(l, c.region0_count, 4), s(l, c.region1_count, 3)), s(l, c.scalefac_scale, 1), s(l, c.count1table_select, 1)
                    }
                t.error_protection && CRC_writeheader(l, l.header[l.h_ptr].buf);
                var p = l.h_ptr;
                u(l.header[p].ptr == 8 * l.sideinfo_len), l.h_ptr = p + 1 & _.MAX_HEADER_BUF - 1, l.header[l.h_ptr].write_timing = l.header[p].write_timing + e, l.h_ptr == l.w_ptr && r.err.println("Error: MAX_HEADER_BUF too small in bitstream.c \n")
            }

            function y(t, i) {
                var n, s = p.ht[i.count1table_select + 32],
                    r = 0,
                    o = i.big_values,
                    a = i.big_values;
                for (u(i.count1table_select < 2), n = (i.count1 - i.big_values) / 4; n > 0; --n) {
                    var l, h = 0,
                        c = 0;
                    l = i.l3_enc[o + 0], 0 != l && (c += 8, i.xr[a + 0] < 0 && h++, u(l <= 1)), l = i.l3_enc[o + 1], 0 != l && (c += 4, h *= 2, i.xr[a + 1] < 0 && h++, u(l <= 1)), l = i.l3_enc[o + 2], 0 != l && (c += 2, h *= 2, i.xr[a + 2] < 0 && h++, u(l <= 1)), l = i.l3_enc[o + 3], 0 != l && (c++, h *= 2, i.xr[a + 3] < 0 && h++, u(l <= 1)), o += 4, a += 4, e(t, h + s.table[c], s.hlen[c]), r += s.hlen[c]
                }
                return r
            }

            function v(t, i, n, s, r) {
                var o = p.ht[i],
                    a = 0;
                if (u(i < 32), 0 == i) return a;
                for (var l = n; l < s; l += 2) {
                    var h = 0,
                        c = 0,
                        f = o.xlen,
                        _ = o.xlen,
                        d = 0,
                        m = r.l3_enc[l],
                        y = r.l3_enc[l + 1];
                    if (0 != m && (r.xr[l] < 0 && d++, h--), i > 15) {
                        if (m > 14) {
                            var v = m - 15;
                            u(v <= o.linmax), d |= v << 1, c = f, m = 15
                        }
                        if (y > 14) {
                            var b = y - 15;
                            u(b <= o.linmax), d <<= f, d |= b, c += f, y = 15
                        }
                        _ = 16
                    }
                    0 != y && (d <<= 1, r.xr[l + 1] < 0 && d++, h--), u((m | y) < 16), m = m * _ + y, c -= h, h += o.hlen[m], u(h <= M), u(c <= M), e(t, o.table[m], h), e(t, d, c), a += h + c
                }
                return a
            }

            function b(t, e) {
                var i = 3 * t.scalefac_band.s[3];
                i > e.big_values && (i = e.big_values);
                var n = v(t, e.table_select[0], 0, i, e);
                return n += v(t, e.table_select[1], i, e.big_values, e)
            }

            function g(t, e) {
                var i, n, s, r;
                i = e.big_values, u(0 <= i && i <= 576);
                var o = e.region0_count + 1;
                return u(0 <= o), u(o < t.scalefac_band.l.length), s = t.scalefac_band.l[o], o += e.region1_count + 1, u(0 <= o), u(o < t.scalefac_band.l.length), r = t.scalefac_band.l[o], s > i && (s = i), r > i && (r = i), n = v(t, e.table_select[0], 0, s, e), n += v(t, e.table_select[1], s, r, e), n += v(t, e.table_select[2], r, i, e)
            }

            function S(t) {
                var i, n, s, r, o = 0,
                    a = t.internal_flags,
                    l = a.l3_side;
                if (1 == t.version)
                    for (i = 0; i < 2; i++)
                        for (n = 0; n < a.channels_out; n++) {
                            var h = l.tt[i][n],
                                p = c.slen1_tab[h.scalefac_compress],
                                _ = c.slen2_tab[h.scalefac_compress];
                            for (r = 0, s = 0; s < h.sfbdivide; s++) - 1 != h.scalefac[s] && (e(a, h.scalefac[s], p), r += p);
                            for (; s < h.sfbmax; s++) - 1 != h.scalefac[s] && (e(a, h.scalefac[s], _), r += _);
                            u(r == h.part2_length), h.block_type == f.SHORT_TYPE ? r += b(a, h) : r += g(a, h), r += y(a, h), u(r == h.part2_3_length + h.part2_length), o += r
                        } else
                            for (i = 0, n = 0; n < a.channels_out; n++) {
                                var d, m, h = l.tt[i][n],
                                    v = 0;
                                if (u(null != h.sfb_partition_table), r = 0, s = 0, m = 0, h.block_type == f.SHORT_TYPE) {
                                    for (; m < 4; m++) {
                                        var S = h.sfb_partition_table[m] / 3,
                                            w = h.slen[m];
                                        for (d = 0; d < S; d++, s++) e(a, Math.max(h.scalefac[3 * s + 0], 0), w), e(a, Math.max(h.scalefac[3 * s + 1], 0), w), e(a, Math.max(h.scalefac[3 * s + 2], 0), w), v += 3 * w
                                    }
                                    r += b(a, h)
                                } else {
                                    for (; m < 4; m++) {
                                        var S = h.sfb_partition_table[m],
                                            w = h.slen[m];
                                        for (d = 0; d < S; d++, s++) e(a, Math.max(h.scalefac[s], 0), w), v += w
                                    }
                                    r += g(a, h)
                                }
                                r += y(a, h), u(r == h.part2_3_length), u(v == h.part2_length), o += v + r
                            }
                return o
            }

            function w() {
                this.total = 0
            }

            function A(t, e) {
                var i, n, s, o, a, l = t.internal_flags;
                return a = l.w_ptr, o = l.h_ptr - 1, -1 == o && (o = _.MAX_HEADER_BUF - 1), i = l.header[o].write_timing - B, e.total = i, i >= 0 && (n = 1 + o - a, o < a && (n = 1 + o - a + _.MAX_HEADER_BUF), i -= 8 * n * l.sideinfo_len), s = T.getframebits(t), i += s, e.total += s, e.total % 8 != 0 ? e.total = 1 + e.total / 8 : e.total = e.total / 8, e.total += C + 1, i < 0 && r.err.println("strange error flushing buffer ... \n"), i
            }
            var T = this,
                x = 32773,
                M = 32,
                k = null,
                R = null,
                O = null,
                E = null;
            this.setModules = function(t, e, i, n) {
                k = t, R = e, O = i, E = n
            };
            var P = null,
                B = 0,
                C = 0,
                F = 0;
            this.getframebits = function(t) {
                var e, i = t.internal_flags;
                return e = 0 != i.bitrate_index ? p.bitrate_table[t.version][i.bitrate_index] : t.brate, u(8 <= e && e <= 640), 8 * (0 | 72e3 * (t.version + 1) * e / t.out_samplerate + i.padding)
            }, this.CRC_writeheader = function(t, e) {
                var i = 65535;
                i = d(255 & e[2], i), i = d(255 & e[3], i);
                for (var n = 6; n < t.sideinfo_len; n++) i = d(255 & e[n], i);
                e[4] = byte(i >> 8), e[5] = byte(255 & i)
            }, this.flush_bitstream = function(t) {
                var e, i, s = t.internal_flags,
                    r = s.h_ptr - 1;
                if (-1 == r && (r = _.MAX_HEADER_BUF - 1), e = s.l3_side, !((i = A(t, new w)) < 0)) {
                    if (n(t, i), u(s.header[r].write_timing + this.getframebits(t) == B), s.ResvSize = 0, e.main_data_begin = 0, s.findReplayGain) {
                        var o = k.GetTitleGain(s.rgdata);
                        u(NEQ(o, GainAnalysis.GAIN_NOT_ENOUGH_SAMPLES)), s.RadioGain = 0 | Math.floor(10 * o + .5)
                    }
                    s.findPeakSample && (s.noclipGainChange = 0 | Math.ceil(20 * Math.log10(s.PeakSample / 32767) * 10), s.noclipGainChange > 0 && (EQ(t.scale, 1) || EQ(t.scale, 0)) ? s.noclipScale = Math.floor(32767 / s.PeakSample * 100) / 100 : s.noclipScale = -1)
                }
            }, this.add_dummy_byte = function(t, e, n) {
                for (var s, r = t.internal_flags; n-- > 0;)
                    for (i(r, e, 8), s = 0; s < _.MAX_HEADER_BUF; ++s) r.header[s].write_timing += 8
            }, this.format_bitstream = function(t) {
                var e, i = t.internal_flags;
                e = i.l3_side;
                var s = this.getframebits(t);
                n(t, e.resvDrain_pre), m(t, s);
                var o = 8 * i.sideinfo_len;
                if (o += S(t), n(t, e.resvDrain_post), o += e.resvDrain_post, e.main_data_begin += (s - o) / 8, A(t, new w) != i.ResvSize && r.err.println("Internal buffer inconsistency. flushbits <> ResvSize"), 8 * e.main_data_begin != i.ResvSize && (r.err.printf("bit reservoir error: \nl3_side.main_data_begin: %d \nResvoir size:             %d \nresv drain (post)         %d \nresv drain (pre)          %d \nheader and sideinfo:      %d \ndata bits:                %d \ntotal bits:               %d (remainder: %d) \nbitsperframe:             %d \n", 8 * e.main_data_begin, i.ResvSize, e.resvDrain_post, e.resvDrain_pre, 8 * i.sideinfo_len, o - e.resvDrain_post - 8 * i.sideinfo_len, o, o % 8, s), r.err.println("This is a fatal error.  It has several possible causes:"), r.err.println("90%%  LAME compiled with buggy version of gcc using advanced optimizations"), r.err.println(" 9%%  Your system is overclocked"), r.err.println(" 1%%  bug in LAME encoding library"), i.ResvSize = 8 * e.main_data_begin), u(B % 8 == 0), B > 1e9) {
                    var a;
                    for (a = 0; a < _.MAX_HEADER_BUF; ++a) i.header[a].write_timing -= B;
                    B = 0
                }
                return 0
            }, this.copy_buffer = function(t, e, i, n, s) {
                var o = C + 1;
                if (o <= 0) return 0;
                if (0 != n && o > n) return -1;
                if (r.arraycopy(P, 0, e, i, o), C = -1, F = 0, 0 != s) {
                    var a = h(1);
                    if (a[0] = t.nMusicCRC, E.updateMusicCRC(a, e, i, o), t.nMusicCRC = a[0], o > 0 && (t.VBR_seek_table.nBytesWritten += o), t.decode_on_the_fly)
                        for (var c, p = l([2, 1152]), f = o, _ = -1; 0 != _;)
                            if (_ = R.hip_decode1_unclipped(t.hip, e, i, f, p[0], p[1]), f = 0, -1 == _ && (_ = 0), _ > 0) {
                                if (u(_ <= 1152), t.findPeakSample) {
                                    for (c = 0; c < _; c++) p[0][c] > t.PeakSample ? t.PeakSample = p[0][c] : -p[0][c] > t.PeakSample && (t.PeakSample = -p[0][c]);
                                    if (t.channels_out > 1)
                                        for (c = 0; c < _; c++) p[1][c] > t.PeakSample ? t.PeakSample = p[1][c] : -p[1][c] > t.PeakSample && (t.PeakSample = -p[1][c])
                                }
                                if (t.findReplayGain && k.AnalyzeSamples(t.rgdata, p[0], 0, p[1], 0, _, t.channels_out) == GainAnalysis.GAIN_ANALYSIS_ERROR) return -6
                            }
                }
                return o
            }, this.init_bit_stream_w = function(t) {
                P = a(Lame.LAME_MAXMP3BUFFER), t.h_ptr = t.w_ptr = 0, t.header[t.h_ptr].write_timing = 0, C = -1, F = 0, B = 0
            }
        }
        var s = i(384),
            r = s.System,
            o = (s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays),
            a = (s.new_array_n, s.new_byte),
            l = (s.new_double, s.new_float, s.new_float_n),
            h = s.new_int,
            u = (s.new_int_n, s.assert),
            c = i(446),
            p = i(432),
            f = i(388),
            _ = i(428);
        n.EQ = function(t, e) {
            return Math.abs(t) > Math.abs(e) ? Math.abs(t - e) <= 1e-6 * Math.abs(t) : Math.abs(t - e) <= 1e-6 * Math.abs(e)
        }, n.NEQ = function(t, e) {
            return !n.EQ(t, e)
        }, t.exports = n
    },
    440: function(t, e, i) {
        function n() {
            function t(t, e, i, n, s, r) {
                for (; 0 != s--;) i[n] = 1e-10 + t[e + 0] * r[0] - i[n - 1] * r[1] + t[e - 1] * r[2] - i[n - 2] * r[3] + t[e - 2] * r[4] - i[n - 3] * r[5] + t[e - 3] * r[6] - i[n - 4] * r[7] + t[e - 4] * r[8] - i[n - 5] * r[9] + t[e - 5] * r[10] - i[n - 6] * r[11] + t[e - 6] * r[12] - i[n - 7] * r[13] + t[e - 7] * r[14] - i[n - 8] * r[15] + t[e - 8] * r[16] - i[n - 9] * r[17] + t[e - 9] * r[18] - i[n - 10] * r[19] + t[e - 10] * r[20], ++n, ++e
            }

            function e(t, e, i, n, s, r) {
                for (; 0 != s--;) i[n] = t[e + 0] * r[0] - i[n - 1] * r[1] + t[e - 1] * r[2] - i[n - 2] * r[3] + t[e - 2] * r[4], ++n, ++e
            }

            function i(t, e) {
                for (var i = 0; i < MAX_ORDER; i++) t.linprebuf[i] = t.lstepbuf[i] = t.loutbuf[i] = t.rinprebuf[i] = t.rstepbuf[i] = t.routbuf[i] = 0;
                switch (0 | e) {
                    case 48e3:
                        t.reqindex = 0;
                        break;
                    case 44100:
                        t.reqindex = 1;
                        break;
                    case 32e3:
                        t.reqindex = 2;
                        break;
                    case 24e3:
                        t.reqindex = 3;
                        break;
                    case 22050:
                        t.reqindex = 4;
                        break;
                    case 16e3:
                        t.reqindex = 5;
                        break;
                    case 12e3:
                        t.reqindex = 6;
                        break;
                    case 11025:
                        t.reqindex = 7;
                        break;
                    case 8e3:
                        t.reqindex = 8;
                        break;
                    default:
                        return INIT_GAIN_ANALYSIS_ERROR
                }
                return t.sampleWindow = 0 | (e * u + c - 1) / c, t.lsum = 0, t.rsum = 0, t.totsamp = 0, o.ill(t.A, 0), INIT_GAIN_ANALYSIS_OK
            }

            function s(t) {
                return t * t
            }

            function a(t, e) {
                var i, s = 0;
                for (i = 0; i < e; i++) s += t[i];
                if (0 == s) return GAIN_NOT_ENOUGH_SAMPLES;
                var r = 0 | Math.ceil(s * (1 - h));
                for (i = e; i-- > 0 && !((r -= t[i]) <= 0););
                return l - i / n.STEPS_per_dB
            }
            var l = 64.82,
                h = (n.YULE_ORDER, .95),
                u = (n.MAX_SAMP_FREQ, n.RMS_WINDOW_TIME_NUMERATOR),
                c = n.RMS_WINDOW_TIME_DENOMINATOR,
                p = (n.MAX_SAMPLES_PER_WINDOW, [
                    [.038575994352, -3.84664617118067, -.02160367184185, 7.81501653005538, -.00123395316851, -11.34170355132042, -9291677959e-14, 13.05504219327545, -.01655260341619, -12.28759895145294, .02161526843274, 9.4829380631979, -.02074045215285, -5.87257861775999, .00594298065125, 2.75465861874613, .00306428023191, -.86984376593551, .00012025322027, .13919314567432, .00288463683916],
                    [.0541865640643, -3.47845948550071, -.02911007808948, 6.36317777566148, -.00848709379851, -8.54751527471874, -.00851165645469, 9.4769360780128, -.00834990904936, -8.81498681370155, .02245293253339, 6.85401540936998, -.02596338512915, -4.39470996079559, .01624864962975, 2.19611684890774, -.00240879051584, -.75104302451432, .00674613682247, .13149317958808, -.00187763777362],
                    [.15457299681924, -2.37898834973084, -.09331049056315, 2.84868151156327, -.06247880153653, -2.64577170229825, .02163541888798, 2.23697657451713, -.05588393329856, -1.67148153367602, .04781476674921, 1.00595954808547, .00222312597743, -.45953458054983, .03174092540049, .16378164858596, -.01390589421898, -.05032077717131, .00651420667831, .0234789740702, -.00881362733839],
                    [.30296907319327, -1.61273165137247, -.22613988682123, 1.0797749225997, -.08587323730772, -.2565625775407, .03282930172664, -.1627671912044, -.00915702933434, -.22638893773906, -.02364141202522, .39120800788284, -.00584456039913, -.22138138954925, .06276101321749, .04500235387352, -828086748e-14, .02005851806501, .00205861885564, .00302439095741, -.02950134983287],
                    [.33642304856132, -1.49858979367799, -.2557224142557, .87350271418188, -.11828570177555, .12205022308084, .11921148675203, -.80774944671438, -.07834489609479, .47854794562326, -.0046997791438, -.12453458140019, -.0058950022444, -.04067510197014, .05724228140351, .08333755284107, .00832043980773, -.04237348025746, -.0163538138454, .02977207319925, -.0176017656815],
                    [.4491525660845, -.62820619233671, -.14351757464547, .29661783706366, -.22784394429749, -.372563729424, -.01419140100551, .00213767857124, .04078262797139, -.42029820170918, -.12398163381748, .22199650564824, .04097565135648, .00613424350682, .10478503600251, .06747620744683, -.01863887810927, .05784820375801, -.03193428438915, .03222754072173, .00541907748707],
                    [.56619470757641, -1.04800335126349, -.75464456939302, .29156311971249, .1624213774223, -.26806001042947, .16744243493672, .00819999645858, -.18901604199609, .45054734505008, .3093178284183, -.33032403314006, -.27562961986224, .0673936833311, .00647310677246, -.04784254229033, .08647503780351, .01639907836189, -.0378898455484, .01807364323573, -.00588215443421],
                    [.58100494960553, -.51035327095184, -.53174909058578, -.31863563325245, -.14289799034253, -.20256413484477, .17520704835522, .1472815413433, .02377945217615, .38952639978999, .15558449135573, -.23313271880868, -.25344790059353, -.05246019024463, .01628462406333, -.02505961724053, .06920467763959, .02442357316099, -.03721611395801, .01818801111503, -.00749618797172],
                    [.53648789255105, -.2504987195602, -.42163034350696, -.43193942311114, -.00275953611929, -.03424681017675, .04267842219415, -.04678328784242, -.10214864179676, .26408300200955, .14590772289388, .15113130533216, -.02459864859345, -.17556493366449, -.11202315195388, -.18823009262115, -.04060034127, .05477720428674, .0478866554818, .0470440968812, -.02217936801134]
                ]),
                f = [
                    [.98621192462708, -1.97223372919527, -1.97242384925416, .97261396931306, .98621192462708],
                    [.98500175787242, -1.96977855582618, -1.97000351574484, .9702284756635, .98500175787242],
                    [.97938932735214, -1.95835380975398, -1.95877865470428, .95920349965459, .97938932735214],
                    [.97531843204928, -1.95002759149878, -1.95063686409857, .95124613669835, .97531843204928],
                    [.97316523498161, -1.94561023566527, -1.94633046996323, .94705070426118, .97316523498161],
                    [.96454515552826, -1.92783286977036, -1.92909031105652, .93034775234268, .96454515552826],
                    [.96009142950541, -1.91858953033784, -1.92018285901082, .92177618768381, .96009142950541],
                    [.95856916599601, -1.9154210807478, -1.91713833199203, .91885558323625, .95856916599601],
                    [.94597685600279, -1.88903307939452, -1.89195371200558, .89487434461664, .94597685600279]
                ];
            this.InitGainAnalysis = function(t, e) {
                return i(t, e) != INIT_GAIN_ANALYSIS_OK ? INIT_GAIN_ANALYSIS_ERROR : (t.linpre = MAX_ORDER, t.rinpre = MAX_ORDER, t.lstep = MAX_ORDER, t.rstep = MAX_ORDER, t.lout = MAX_ORDER, t.rout = MAX_ORDER, o.fill(t.B, 0), INIT_GAIN_ANALYSIS_OK)
            }, this.AnalyzeSamples = function(i, o, a, l, h, u, c) {
                var _, d, m, y, v, b, g;
                if (0 == u) return GAIN_ANALYSIS_OK;
                switch (g = 0, v = u, c) {
                    case 1:
                        l = o, h = a;
                        break;
                    case 2:
                        break;
                    default:
                        return GAIN_ANALYSIS_ERROR
                }
                for (u < MAX_ORDER ? (r.arraycopy(o, a, i.linprebuf, MAX_ORDER, u), r.arraycopy(l, h, i.rinprebuf, MAX_ORDER, u)) : (r.arraycopy(o, a, i.linprebuf, MAX_ORDER, MAX_ORDER), r.arraycopy(l, h, i.rinprebuf, MAX_ORDER, MAX_ORDER)); v > 0;) {
                    b = v > i.sampleWindow - i.totsamp ? i.sampleWindow - i.totsamp : v, g < MAX_ORDER ? (_ = i.linpre + g, d = i.linprebuf, m = i.rinpre + g, y = i.rinprebuf, b > MAX_ORDER - g && (b = MAX_ORDER - g)) : (_ = a + g, d = o, m = h + g, y = l), t(d, _, i.lstepbuf, i.lstep + i.totsamp, b, p[i.reqindex]), t(y, m, i.rstepbuf, i.rstep + i.totsamp, b, p[i.reqindex]), e(i.lstepbuf, i.lstep + i.totsamp, i.loutbuf, i.lout + i.totsamp, b, f[i.reqindex]), e(i.rstepbuf, i.rstep + i.totsamp, i.routbuf, i.rout + i.totsamp, b, f[i.reqindex]), _ = i.lout + i.totsamp, d = i.loutbuf, m = i.rout + i.totsamp, y = i.routbuf;
                    for (var S = b % 8; 0 != S--;) i.lsum += s(d[_++]), i.rsum += s(y[m++]);
                    for (S = b / 8; 0 != S--;) i.lsum += s(d[_ + 0]) + s(d[_ + 1]) + s(d[_ + 2]) + s(d[_ + 3]) + s(d[_ + 4]) + s(d[_ + 5]) + s(d[_ + 6]) + s(d[_ + 7]), _ += 8, i.rsum += s(y[m + 0]) + s(y[m + 1]) + s(y[m + 2]) + s(y[m + 3]) + s(y[m + 4]) + s(y[m + 5]) + s(y[m + 6]) + s(y[m + 7]), m += 8;
                    if (v -= b, g += b, i.totsamp += b, i.totsamp == i.sampleWindow) {
                        var w = 10 * n.STEPS_per_dB * Math.log10((i.lsum + i.rsum) / i.totsamp * .5 + 1e-37),
                            A = w <= 0 ? 0 : 0 | w;
                        A >= i.A.length && (A = i.A.length - 1), i.A[A]++, i.lsum = i.rsum = 0, r.arraycopy(i.loutbuf, i.totsamp, i.loutbuf, 0, MAX_ORDER), r.arraycopy(i.routbuf, i.totsamp, i.routbuf, 0, MAX_ORDER), r.arraycopy(i.lstepbuf, i.totsamp, i.lstepbuf, 0, MAX_ORDER), r.arraycopy(i.rstepbuf, i.totsamp, i.rstepbuf, 0, MAX_ORDER), i.totsamp = 0
                    }
                    if (i.totsamp > i.sampleWindow) return GAIN_ANALYSIS_ERROR
                }
                return u < MAX_ORDER ? (r.arraycopy(i.linprebuf, u, i.linprebuf, 0, MAX_ORDER - u), r.arraycopy(i.rinprebuf, u, i.rinprebuf, 0, MAX_ORDER - u), r.arraycopy(o, a, i.linprebuf, MAX_ORDER - u, u), r.arraycopy(l, h, i.rinprebuf, MAX_ORDER - u, u)) : (r.arraycopy(o, a + u - MAX_ORDER, i.linprebuf, 0, MAX_ORDER), r.arraycopy(l, h + u - MAX_ORDER, i.rinprebuf, 0, MAX_ORDER)), GAIN_ANALYSIS_OK
            }, this.GetTitleGain = function(t) {
                for (var e = a(t.A, t.A.length), i = 0; i < t.A.length; i++) t.B[i] += t.A[i], t.A[i] = 0;
                for (var i = 0; i < MAX_ORDER; i++) t.linprebuf[i] = t.lstepbuf[i] = t.loutbuf[i] = t.rinprebuf[i] = t.rstepbuf[i] = t.routbuf[i] = 0;
                return t.totsamp = 0, t.lsum = t.rsum = 0, e
            }
        }
        var s = i(384),
            r = s.System,
            o = (s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays);
        s.new_array_n, s.new_byte, s.new_double, s.new_float, s.new_float_n, s.new_int, s.new_int_n, s.assert;
        n.STEPS_per_dB = 100, n.MAX_dB = 120, n.GAIN_NOT_ENOUGH_SAMPLES = -24601, n.GAIN_ANALYSIS_ERROR = 0, n.GAIN_ANALYSIS_OK = 1, n.INIT_GAIN_ANALYSIS_ERROR = 0, n.INIT_GAIN_ANALYSIS_OK = 1, n.YULE_ORDER = 10, n.MAX_ORDER = n.YULE_ORDER, n.MAX_SAMP_FREQ = 48e3, n.RMS_WINDOW_TIME_NUMERATOR = 1, n.RMS_WINDOW_TIME_DENOMINATOR = 20, n.MAX_SAMPLES_PER_WINDOW = n.MAX_SAMP_FREQ * n.RMS_WINDOW_TIME_NUMERATOR / n.RMS_WINDOW_TIME_DENOMINATOR + 1, t.exports = n
    },
    441: function(t, e, i) {
        function n() {
            this.l = a(s.SBMAX_l), this.s = l([s.SBMAX_s, 3]);
            var t = this;
            this.assign = function(e) {
                o.arraycopy(e.l, 0, t.l, 0, s.SBMAX_l);
                for (var i = 0; i < s.SBMAX_s; i++)
                    for (var n = 0; n < 3; n++) t.s[i][n] = e.s[i][n]
            }
        }
        var s = i(388),
            r = i(384),
            o = r.System,
            a = (r.VbrMode, r.Float, r.ShortBlock, r.Util, r.Arrays, r.new_array_n, r.new_byte, r.new_double, r.new_float),
            l = r.new_float_n;
        r.new_int, r.new_int_n, r.assert;
        t.exports = n
    },
    442: function(t, e) {
        function i(t) {
            var e = t;
            this.ordinal = function() {
                return e
            }
        }
        i.STEREO = new i(0), i.JOINT_STEREO = new i(1), i.DUAL_CHANNEL = new i(2), i.MONO = new i(3), i.NOT_SET = new i(4), t.exports = i
    },
    443: function(t, e) {
        function i(t) {
            this.bits = t
        }
        t.exports = i
    },
    444: function(t, e, i) {
        function n() {
            function t(t) {
                return c(0 <= t + n.Q_MAX2 && t < n.Q_MAX), T[t + n.Q_MAX2]
            }

            function e(t, e) {
                var i = y.ATHformula(e, t);
                return i -= w, i = Math.pow(10, i / 10 + t.ATHlower)
            }

            function i(t) {
                for (var i = t.internal_flags.ATH.l, n = t.internal_flags.ATH.psfb21, s = t.internal_flags.ATH.s, r = t.internal_flags.ATH.psfb12, o = t.internal_flags, l = t.out_samplerate, h = 0; h < p.SBMAX_l; h++) {
                    var u = o.scalefac_band.l[h],
                        c = o.scalefac_band.l[h + 1];
                    i[h] = a.MAX_VALUE;
                    for (var f = u; f < c; f++) {
                        var _ = f * l / 1152,
                            d = e(t, _);
                        i[h] = Math.min(i[h], d)
                    }
                }
                for (var h = 0; h < p.PSFB21; h++) {
                    var u = o.scalefac_band.psfb21[h],
                        c = o.scalefac_band.psfb21[h + 1];
                    n[h] = a.MAX_VALUE;
                    for (var f = u; f < c; f++) {
                        var _ = f * l / 1152,
                            d = e(t, _);
                        n[h] = Math.min(n[h], d)
                    }
                }
                for (var h = 0; h < p.SBMAX_s; h++) {
                    var u = o.scalefac_band.s[h],
                        c = o.scalefac_band.s[h + 1];
                    s[h] = a.MAX_VALUE;
                    for (var f = u; f < c; f++) {
                        var _ = f * l / 384,
                            d = e(t, _);
                        s[h] = Math.min(s[h], d)
                    }
                    s[h] *= o.scalefac_band.s[h + 1] - o.scalefac_band.s[h]
                }
                for (var h = 0; h < p.PSFB12; h++) {
                    var u = o.scalefac_band.psfb12[h],
                        c = o.scalefac_band.psfb12[h + 1];
                    r[h] = a.MAX_VALUE;
                    for (var f = u; f < c; f++) {
                        var _ = f * l / 384,
                            d = e(t, _);
                        r[h] = Math.min(r[h], d)
                    }
                    r[h] *= o.scalefac_band.s[13] - o.scalefac_band.s[12]
                }
                if (t.noATH) {
                    for (var h = 0; h < p.SBMAX_l; h++) i[h] = 1e-20;
                    for (var h = 0; h < p.PSFB21; h++) n[h] = 1e-20;
                    for (var h = 0; h < p.SBMAX_s; h++) s[h] = 1e-20;
                    for (var h = 0; h < p.PSFB12; h++) r[h] = 1e-20
                }
                o.ATH.floor = 10 * Math.log10(e(t, -1))
            }

            function r(t) {
                this.s = t
            }
            var d = null,
                m = null,
                y = null;
            this.setModules = function(t, e, i) {
                d = t, m = e, y = i
            }, this.IPOW20 = function(t) {
                return c(0 <= t && t < n.Q_MAX), x[t]
            };
            var v = n.IXMAX_VAL,
                b = v + 2,
                g = n.Q_MAX,
                S = n.Q_MAX2,
                w = (n.LARGE_BITS, 100);
            this.nr_of_sfb_block = [
                [
                    [6, 5, 5, 5],
                    [9, 9, 9, 9],
                    [6, 9, 9, 9]
                ],
                [
                    [6, 5, 7, 3],
                    [9, 9, 12, 6],
                    [6, 9, 12, 6]
                ],
                [
                    [11, 10, 0, 0],
                    [18, 18, 0, 0],
                    [15, 18, 0, 0]
                ],
                [
                    [7, 7, 7, 0],
                    [12, 12, 12, 0],
                    [6, 15, 12, 0]
                ],
                [
                    [6, 6, 6, 3],
                    [12, 9, 9, 6],
                    [6, 12, 9, 6]
                ],
                [
                    [8, 8, 5, 0],
                    [15, 12, 9, 0],
                    [6, 18, 9, 0]
                ]
            ];
            var A = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 3, 2, 0];
            this.pretab = A, this.sfBandIndex = [new s([0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576], [0, 4, 8, 12, 18, 24, 32, 42, 56, 74, 100, 132, 174, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 114, 136, 162, 194, 232, 278, 332, 394, 464, 540, 576], [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 136, 180, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576], [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 4, 8, 12, 16, 20, 24, 30, 36, 44, 52, 62, 74, 90, 110, 134, 162, 196, 238, 288, 342, 418, 576], [0, 4, 8, 12, 16, 22, 30, 40, 52, 66, 84, 106, 136, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 4, 8, 12, 16, 20, 24, 30, 36, 42, 50, 60, 72, 88, 106, 128, 156, 190, 230, 276, 330, 384, 576], [0, 4, 8, 12, 16, 22, 28, 38, 50, 64, 80, 100, 126, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 4, 8, 12, 16, 20, 24, 30, 36, 44, 54, 66, 82, 102, 126, 156, 194, 240, 296, 364, 448, 550, 576], [0, 4, 8, 12, 16, 22, 30, 42, 58, 78, 104, 138, 180, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576], [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576], [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]), new s([0, 12, 24, 36, 48, 60, 72, 88, 108, 132, 160, 192, 232, 280, 336, 400, 476, 566, 568, 570, 572, 574, 576], [0, 8, 16, 24, 36, 52, 72, 96, 124, 160, 162, 164, 166, 192], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0])];
            var T = h(g + S + 1),
                x = h(g),
                M = h(b),
                k = h(b);
            this.adj43 = k, this.iteration_init = function(t) {
                var e, n = t.internal_flags,
                    s = n.l3_side;
                if (0 == n.iteration_init_init) {
                    for (n.iteration_init_init = 1, s.main_data_begin = 0, i(t), M[0] = 0, e = 1; e < b; e++) M[e] = Math.pow(e, 4 / 3);
                    for (e = 0; e < b - 1; e++) k[e] = e + 1 - Math.pow(.5 * (M[e] + M[e + 1]), .75);
                    for (k[e] = .5, e = 0; e < g; e++) x[e] = Math.pow(2, -.1875 * (e - 210));
                    for (e = 0; e <= g + S; e++) T[e] = Math.pow(2, .25 * (e - 210 - S));
                    d.huffman_init(n);
                    var r, o, a, l;
                    for (e = t.exp_nspsytune >> 2 & 63, e >= 32 && (e -= 64), r = Math.pow(10, e / 4 / 10), e = t.exp_nspsytune >> 8 & 63, e >= 32 && (e -= 64), o = Math.pow(10, e / 4 / 10), e = t.exp_nspsytune >> 14 & 63, e >= 32 && (e -= 64), a = Math.pow(10, e / 4 / 10), e = t.exp_nspsytune >> 20 & 63, e >= 32 && (e -= 64), l = a * Math.pow(10, e / 4 / 10), e = 0; e < p.SBMAX_l; e++) {
                        var h;
                        h = e <= 6 ? r : e <= 13 ? o : e <= 20 ? a : l, n.nsPsy.longfact[e] = h
                    }
                    for (e = 0; e < p.SBMAX_s; e++) {
                        var h;
                        h = e <= 5 ? r : e <= 10 ? o : e <= 11 ? a : l, n.nsPsy.shortfact[e] = h
                    }
                }
            }, this.on_pe = function(t, e, i, n, s, r) {
                var o, a, l = t.internal_flags,
                    h = 0,
                    p = u(2),
                    d = new f(h),
                    y = m.ResvMaxBits(t, n, d, r);
                h = d.bits;
                var v = h + y;
                for (v > _.MAX_BITS_PER_GRANULE && (v = _.MAX_BITS_PER_GRANULE), o = 0, a = 0; a < l.channels_out; ++a) i[a] = Math.min(_.MAX_BITS_PER_CHANNEL, h / l.channels_out), p[a] = 0 | i[a] * e[s][a] / 700 - i[a], p[a] > 3 * n / 4 && (p[a] = 3 * n / 4), p[a] < 0 && (p[a] = 0), p[a] + i[a] > _.MAX_BITS_PER_CHANNEL && (p[a] = Math.max(0, _.MAX_BITS_PER_CHANNEL - i[a])), o += p[a];
                if (o > y)
                    for (a = 0; a < l.channels_out; ++a) p[a] = y * p[a] / o;
                for (a = 0; a < l.channels_out; ++a) i[a] += p[a], y -= p[a];
                for (o = 0, a = 0; a < l.channels_out; ++a) o += i[a];
                if (o > _.MAX_BITS_PER_GRANULE) {
                    var b = 0;
                    for (a = 0; a < l.channels_out; ++a) i[a] *= _.MAX_BITS_PER_GRANULE, i[a] /= o, b += i[a];
                    c(b <= _.MAX_BITS_PER_GRANULE)
                }
                return v
            }, this.reduce_side = function(t, e, i, n) {
                c(n <= _.MAX_BITS_PER_GRANULE), c(t[0] + t[1] <= _.MAX_BITS_PER_GRANULE);
                var s = .33 * (.5 - e) / .5;
                s < 0 && (s = 0), s > .5 && (s = .5);
                var r = 0 | .5 * s * (t[0] + t[1]);
                r > _.MAX_BITS_PER_CHANNEL - t[0] && (r = _.MAX_BITS_PER_CHANNEL - t[0]), r < 0 && (r = 0), t[1] >= 125 && (t[1] - r > 125 ? (t[0] < i && (t[0] += r), t[1] -= r) : (t[0] += t[1] - 125, t[1] = 125)), r = t[0] + t[1], r > n && (t[0] = n * t[0] / r, t[1] = n * t[1] / r), c(t[0] <= _.MAX_BITS_PER_CHANNEL), c(t[1] <= _.MAX_BITS_PER_CHANNEL), c(t[0] + t[1] <= _.MAX_BITS_PER_GRANULE)
            }, this.athAdjust = function(t, e, i) {
                var n = 90.30873362,
                    s = l.FAST_LOG10_X(e, 10),
                    r = t * t,
                    o = 0;
                return s -= i, r > 1e-20 && (o = 1 + l.FAST_LOG10_X(r, 10 / n)), o < 0 && (o = 0), s *= o, s += i + n - 94.82444863, Math.pow(10, .1 * s)
            }, this.calc_xmin = function(t, e, i, n) {
                var s, r = 0,
                    a = t.internal_flags,
                    l = 0,
                    h = 0,
                    u = a.ATH,
                    c = i.xr,
                    f = t.VBR == o.vbr_mtrh ? 1 : 0,
                    _ = a.masking_lower;
                for (t.VBR != o.vbr_mtrh && t.VBR != o.vbr_mt || (_ = 1), s = 0; s < i.psy_lmax; s++) {
                    var d, m, y, v, b, g;
                    m = t.VBR == o.vbr_rh || t.VBR == o.vbr_mtrh ? athAdjust(u.adjust, u.l[s], u.floor) : u.adjust * u.l[s], b = i.width[s], y = m / b, v = 2.220446049250313e-16, g = b >> 1, d = 0;
                    do {
                        var S, w;
                        S = c[l] * c[l], d += S, v += S < y ? S : y, l++, w = c[l] * c[l], d += w, v += w < y ? w : y, l++
                    } while (--g > 0);
                    if (d > m && h++, s == p.SBPSY_l) {
                        var A = m * a.nsPsy.longfact[s];
                        v < A && (v = A)
                    }
                    if (0 != f && (m = v), !t.ATHonly) {
                        var T = e.en.l[s];
                        if (T > 0) {
                            var A;
                            A = d * e.thm.l[s] * _ / T, 0 != f && (A *= a.nsPsy.longfact[s]), m < A && (m = A)
                        }
                    }
                    n[r++] = 0 != f ? m : m * a.nsPsy.longfact[s]
                }
                var x = 575;
                if (i.block_type != p.SHORT_TYPE)
                    for (var M = 576; 0 != M-- && BitStream.EQ(c[M], 0);) x = M;
                i.max_nonzero_coeff = x;
                for (var k = i.sfb_smin; s < i.psymax; k++, s += 3) {
                    var b, R, O;
                    for (O = t.VBR == o.vbr_rh || t.VBR == o.vbr_mtrh ? athAdjust(u.adjust, u.s[k], u.floor) : u.adjust * u.s[k], b = i.width[s], R = 0; R < 3; R++) {
                        var m, y, v, d = 0,
                            g = b >> 1;
                        y = O / b, v = 2.220446049250313e-16;
                        do {
                            var S, w;
                            S = c[l] * c[l], d += S, v += S < y ? S : y, l++, w = c[l] * c[l], d += w, v += w < y ? w : y, l++
                        } while (--g > 0);
                        if (d > O && h++, k == p.SBPSY_s) {
                            var A = O * a.nsPsy.shortfact[k];
                            v < A && (v = A)
                        }
                        if (m = 0 != f ? v : O, !t.ATHonly && !t.ATHshort) {
                            var T = e.en.s[k][R];
                            if (T > 0) {
                                var A;
                                A = d * e.thm.s[k][R] * _ / T, 0 != f && (A *= a.nsPsy.shortfact[k]), m < A && (m = A)
                            }
                        }
                        n[r++] = 0 != f ? m : m * a.nsPsy.shortfact[k]
                    }
                    t.useTemporal && (n[r - 3] > n[r - 3 + 1] && (n[r - 3 + 1] += (n[r - 3] - n[r - 3 + 1]) * a.decay), n[r - 3 + 1] > n[r - 3 + 2] && (n[r - 3 + 2] += (n[r - 3 + 1] - n[r - 3 + 2]) * a.decay))
                }
                return h
            }, this.calc_noise_core = function(t, e, i, n) {
                var s = 0,
                    r = e.s,
                    o = t.l3_enc;
                if (r > t.count1)
                    for (; 0 != i--;) {
                        var a;
                        a = t.xr[r], r++, s += a * a, a = t.xr[r], r++, s += a * a
                    } else if (r > t.big_values) {
                        var l = h(2);
                        for (l[0] = 0, l[1] = n; 0 != i--;) {
                            var a;
                            a = Math.abs(t.xr[r]) - l[o[r]], r++, s += a * a, a = Math.abs(t.xr[r]) - l[o[r]], r++, s += a * a
                        }
                    } else
                        for (; 0 != i--;) {
                            var a;
                            a = Math.abs(t.xr[r]) - M[o[r]] * n, r++, s += a * a, a = Math.abs(t.xr[r]) - M[o[r]] * n, r++, s += a * a
                        }
                return e.s = r, s
            }, this.calc_noise = function(e, i, n, s, o) {
                var a, h, u = 0,
                    c = 0,
                    p = 0,
                    f = 0,
                    _ = 0,
                    d = -20,
                    m = 0,
                    y = e.scalefac,
                    v = 0;
                for (s.over_SSD = 0, a = 0; a < e.psymax; a++) {
                    var b = e.global_gain - (y[v++] + (0 != e.preflag ? A[a] : 0) << e.scalefac_scale + 1) - 8 * e.subblock_gain[e.window[a]],
                        g = 0;
                    if (null != o && o.step[a] == b) g = o.noise[a], m += e.width[a], n[u++] = g / i[c++], g = o.noise_log[a];
                    else {
                        var S = t(b);
                        if (h = e.width[a] >> 1, m + e.width[a] > e.max_nonzero_coeff) {
                            var w;
                            w = e.max_nonzero_coeff - m + 1, h = w > 0 ? w >> 1 : 0
                        }
                        var T = new r(m);
                        g = this.calc_noise_core(e, T, h, S), m = T.s, null != o && (o.step[a] = b, o.noise[a] = g), g = n[u++] = g / i[c++], g = l.FAST_LOG10(Math.max(g, 1e-20)), null != o && (o.noise_log[a] = g)
                    }
                    if (null != o && (o.global_gain = e.global_gain), _ += g, g > 0) {
                        var x;
                        x = Math.max(0 | 10 * g + .5, 1), s.over_SSD += x * x, p++, f += g
                    }
                    d = Math.max(d, g)
                }
                return s.over_count = p, s.tot_noise = _, s.over_noise = f, s.max_noise = d, p
            }, this.set_pinfo = function(t, e, i, n, s) {
                var r, o, a, l, u, f = t.internal_flags,
                    _ = 0 == e.scalefac_scale ? .5 : 1,
                    d = e.scalefac,
                    m = h(L3Side.SFBMAX),
                    y = h(L3Side.SFBMAX),
                    v = new CalcNoiseResult;
                calc_xmin(t, i, e, m), calc_noise(e, m, y, v, null);
                var b = 0;
                for (o = e.sfb_lmax, e.block_type != p.SHORT_TYPE && 0 == e.mixed_block_flag && (o = 22), r = 0; r < o; r++) {
                    var g = f.scalefac_band.l[r],
                        S = f.scalefac_band.l[r + 1],
                        w = S - g;
                    for (l = 0; b < S; b++) l += e.xr[b] * e.xr[b];
                    l /= w, u = 1e15, f.pinfo.en[n][s][r] = u * l, f.pinfo.xfsf[n][s][r] = u * m[r] * y[r] / w, i.en.l[r] > 0 && !t.ATHonly ? l /= i.en.l[r] : l = 0, f.pinfo.thr[n][s][r] = u * Math.max(l * i.thm.l[r], f.ATH.l[r]), f.pinfo.LAMEsfb[n][s][r] = 0, 0 != e.preflag && r >= 11 && (f.pinfo.LAMEsfb[n][s][r] = -_ * A[r]), r < p.SBPSY_l && (c(d[r] >= 0), f.pinfo.LAMEsfb[n][s][r] -= _ * d[r])
                }
                if (e.block_type == p.SHORT_TYPE)
                    for (o = r, r = e.sfb_smin; r < p.SBMAX_s; r++)
                        for (var g = f.scalefac_band.s[r], S = f.scalefac_band.s[r + 1], w = S - g, T = 0; T < 3; T++) {
                            for (l = 0, a = g; a < S; a++) l += e.xr[b] * e.xr[b], b++;
                            l = Math.max(l / w, 1e-20), u = 1e15, f.pinfo.en_s[n][s][3 * r + T] = u * l, f.pinfo.xfsf_s[n][s][3 * r + T] = u * m[o] * y[o] / w, i.en.s[r][T] > 0 ? l /= i.en.s[r][T] : l = 0, (t.ATHonly || t.ATHshort) && (l = 0), f.pinfo.thr_s[n][s][3 * r + T] = u * Math.max(l * i.thm.s[r][T], f.ATH.s[r]), f.pinfo.LAMEsfb_s[n][s][3 * r + T] = -2 * e.subblock_gain[T], r < p.SBPSY_s && (f.pinfo.LAMEsfb_s[n][s][3 * r + T] -= _ * d[o]), o++
                        }
                f.pinfo.LAMEqss[n][s] = e.global_gain, f.pinfo.LAMEmainbits[n][s] = e.part2_3_length + e.part2_length, f.pinfo.LAMEsfbits[n][s] = e.part2_length, f.pinfo.over[n][s] = v.over_count, f.pinfo.max_noise[n][s] = 10 * v.max_noise, f.pinfo.over_noise[n][s] = 10 * v.over_noise, f.pinfo.tot_noise[n][s] = 10 * v.tot_noise, f.pinfo.over_SSD[n][s] = v.over_SSD
            }
        }
        var s = i(445),
            r = i(384),
            o = (r.System, r.VbrMode),
            a = r.Float,
            l = (r.ShortBlock, r.Util),
            h = (r.Arrays, r.new_array_n, r.new_byte, r.new_double, r.new_float),
            u = (r.new_float_n, r.new_int),
            c = (r.new_int_n, r.assert),
            p = i(388),
            f = i(443),
            _ = i(428);
        n.Q_MAX = 257, n.Q_MAX2 = 116, n.LARGE_BITS = 1e5, n.IXMAX_VAL = 8206, t.exports = n
    },
    445: function(t, e, i) {
        function n(t, e, i, n) {
            this.l = o(1 + a.SBMAX_l), this.s = o(1 + a.SBMAX_s), this.psfb21 = o(1 + a.PSFB21), this.psfb12 = o(1 + a.PSFB12);
            var s = this.l,
                l = this.s;
            4 == arguments.length && (this.arrL = arguments[0], this.arrS = arguments[1], this.arr21 = arguments[2], this.arr12 = arguments[3], r.arraycopy(this.arrL, 0, s, 0, Math.min(this.arrL.length, this.l.length)), r.arraycopy(this.arrS, 0, l, 0, Math.min(this.arrS.length, this.s.length)), r.arraycopy(this.arr21, 0, this.psfb21, 0, Math.min(this.arr21.length, this.psfb21.length)), r.arraycopy(this.arr12, 0, this.psfb12, 0, Math.min(this.arr12.length, this.psfb12.length)))
        }
        var s = i(384),
            r = s.System,
            o = (s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float, s.new_float_n, s.new_int),
            a = (s.new_int_n, s.assert, i(388));
        t.exports = n
    },
    446: function(t, e, i) {
        function n() {
            function t(t) {
                this.bits = 0 | t
            }

            function e(t, e, i, n, s, r) {
                var o = .5946 / e;
                for (l(t > 0), t >>= 1; 0 != t--;) s[r++] = o > i[n++] ? 0 : 1, s[r++] = o > i[n++] ? 0 : 1
            }

            function i(t, e, i, n, s, r) {
                l(t > 0), t >>= 1;
                var o = t % 2;
                for (t >>= 1; 0 != t--;) {
                    var a, h, u, c, p, f, _, d;
                    a = i[n++] * e, h = i[n++] * e, p = 0 | a, u = i[n++] * e, f = 0 | h, c = i[n++] * e, _ = 0 | u, a += A.adj43[p], d = 0 | c, h += A.adj43[f], s[r++] = 0 | a, u += A.adj43[_], s[r++] = 0 | h, c += A.adj43[d], s[r++] = 0 | u, s[r++] = 0 | c
                }
                if (0 != o) {
                    var a, h, p, f;
                    a = i[n++] * e, h = i[n++] * e, p = 0 | a, f = 0 | h, a += A.adj43[p], h += A.adj43[f], s[r++] = 0 | a, s[r++] = 0 | h
                }
            }

            function s(t, n, s, r, a) {
                var u, c, p, f = 0,
                    _ = 0,
                    d = 0,
                    m = 0,
                    y = n,
                    v = 0,
                    b = y,
                    g = 0,
                    S = t,
                    w = 0;
                for (p = null != a && r.global_gain == a.global_gain, c = r.block_type == h.SHORT_TYPE ? 38 : 21, u = 0; u <= c; u++) {
                    var T = -1;
                    if ((p || r.block_type == h.NORM_TYPE) && (T = r.global_gain - (r.scalefac[u] + (0 != r.preflag ? A.pretab[u] : 0) << r.scalefac_scale + 1) - 8 * r.subblock_gain[r.window[u]]), l(r.width[u] >= 0), p && a.step[u] == T) 0 != _ && (i(_, s, S, w, b, g), _ = 0), 0 != d && (e(d, s, S, w, b, g), d = 0);
                    else {
                        var x = r.width[u];
                        if (f + r.width[u] > r.max_nonzero_coeff) {
                            var M;
                            M = r.max_nonzero_coeff - f + 1, o.fill(n, r.max_nonzero_coeff, 576, 0), x = M, x < 0 && (x = 0), u = c + 1
                        }
                        if (0 == _ && 0 == d && (b = y, g = v, S = t, w = m), null != a && a.sfb_count1 > 0 && u >= a.sfb_count1 && a.step[u] > 0 && T >= a.step[u] ? (0 != _ && (i(_, s, S, w, b, g), _ = 0, b = y, g = v, S = t, w = m), d += x) : (0 != d && (e(d, s, S, w, b, g), d = 0, b = y, g = v, S = t, w = m), _ += x), x <= 0) {
                            0 != d && (e(d, s, S, w, b, g), d = 0), 0 != _ && (i(_, s, S, w, b, g), _ = 0);
                            break
                        }
                    }
                    u <= c && (v += r.width[u], m += r.width[u], f += r.width[u])
                }
                0 != _ && (i(_, s, S, w, b, g), _ = 0), 0 != d && (e(d, s, S, w, b, g), d = 0)
            }

            function f(t, e, i) {
                var n = 0,
                    s = 0;
                do {
                    var r = t[e++],
                        o = t[e++];
                    n < r && (n = r), s < o && (s = o)
                } while (e < i);
                return n < s && (n = s), n
            }

            function _(t, e, i, n, s, r) {
                var o, a = 65536 * u.ht[n].xlen + u.ht[s].xlen,
                    l = 0;
                do {
                    var h = t[e++],
                        c = t[e++];
                    0 != h && (h > 14 && (h = 15, l += a), h *= 16), 0 != c && (c > 14 && (c = 15, l += a), h += c), l += u.largetbl[h]
                } while (e < i);
                return o = 65535 & l, l >>= 16, l > o && (l = o, n = s), r.bits += l, n
            }

            function d(t, e, i, n) {
                var s = 0,
                    r = u.ht[1].hlen;
                do {
                    var o = 2 * t[e + 0] + t[e + 1];
                    e += 2, s += r[o]
                } while (e < i);
                return n.bits += s, 1
            }

            function m(t, e, i, n, s) {
                var r, o, a = 0,
                    l = u.ht[n].xlen;
                o = 2 == n ? u.table23 : u.table56;
                do {
                    var h = t[e + 0] * l + t[e + 1];
                    e += 2, a += o[h]
                } while (e < i);
                return r = 65535 & a, a >>= 16, a > r && (a = r, n++), s.bits += a, n
            }

            function y(t, e, i, n, s) {
                var r = 0,
                    o = 0,
                    a = 0,
                    l = u.ht[n].xlen,
                    h = u.ht[n].hlen,
                    c = u.ht[n + 1].hlen,
                    p = u.ht[n + 2].hlen;
                do {
                    var f = t[e + 0] * l + t[e + 1];
                    e += 2, r += h[f], o += c[f], a += p[f]
                } while (e < i);
                var _ = n;
                return r > o && (r = o, _++), r > a && (r = a, _ = n + 2), s.bits += r, _
            }

            function v(t, e, i, n) {
                var s = f(t, e, i);
                switch (s) {
                    case 0:
                        return s;
                    case 1:
                        return d(t, e, i, n);
                    case 2:
                    case 3:
                        return m(t, e, i, x[s - 1], n);
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                        return y(t, e, i, x[s - 1], n);
                    default:
                        if (s > p.IXMAX_VAL) return n.bits = p.LARGE_BITS, -1;
                        s -= 15;
                        var r;
                        for (r = 24; r < 32 && !(u.ht[r].linmax >= s); r++);
                        var o;
                        for (o = r - 8; o < 24 && !(u.ht[o].linmax >= s); o++);
                        return _(t, e, i, o, r, n)
                }
            }

            function b(e, i, n, s, r, o, a) {
                for (var l = i.big_values, h = 0; h <= 22; h++) s[h] = p.LARGE_BITS;
                for (var h = 0; h < 16; h++) {
                    var u = e.scalefac_band.l[h + 1];
                    if (u >= l) break;
                    var c = 0,
                        f = new t(c),
                        _ = v(n, 0, u, f);
                    c = f.bits;
                    for (var d = 0; d < 8; d++) {
                        var m = e.scalefac_band.l[h + d + 2];
                        if (m >= l) break;
                        var y = c;
                        f = new t(y);
                        var b = v(n, u, m, f);
                        y = f.bits, s[h + d] > y && (s[h + d] = y, r[h + d] = h, o[h + d] = _, a[h + d] = b)
                    }
                }
            }

            function g(e, i, n, s, r, o, a, l) {
                for (var u = i.big_values, c = 2; c < h.SBMAX_l + 1; c++) {
                    var p = e.scalefac_band.l[c];
                    if (p >= u) break;
                    var f = r[c - 2] + i.count1bits;
                    if (n.part2_3_length <= f) break;
                    var _ = new t(f),
                        d = v(s, p, u, _);
                    f = _.bits, n.part2_3_length <= f || (n.assign(i), n.part2_3_length = f, n.region0_count = o[c - 2], n.region1_count = c - 2 - o[c - 2], n.table_select[0] = a[c - 2], n.table_select[1] = l[c - 2], n.table_select[2] = d)
                }
            }

            function S(t, e) {
                for (var i, n = e.tt[1][t], s = e.tt[0][t], r = 0; r < u.scfsi_band.length - 1; r++) {
                    for (i = u.scfsi_band[r]; i < u.scfsi_band[r + 1] && !(s.scalefac[i] != n.scalefac[i] && n.scalefac[i] >= 0); i++);
                    if (i == u.scfsi_band[r + 1]) {
                        for (i = u.scfsi_band[r]; i < u.scfsi_band[r + 1]; i++) n.scalefac[i] = -1;
                        e.scfsi[t][r] = 1
                    }
                }
                var o = 0,
                    a = 0;
                for (i = 0; i < 11; i++) - 1 != n.scalefac[i] && (a++, o < n.scalefac[i] && (o = n.scalefac[i]));
                for (var l = 0, c = 0; i < h.SBPSY_l; i++) - 1 != n.scalefac[i] && (c++, l < n.scalefac[i] && (l = n.scalefac[i]));
                for (var r = 0; r < 16; r++)
                    if (o < M[r] && l < k[r]) {
                        var p = R[r] * a + O[r] * c;
                        n.part2_length > p && (n.part2_length = p, n.scalefac_compress = r)
                    }
            }

            function w(t, e) {
                for (var i = 0; i < e; ++i)
                    if (t[i] < 0) return !1;
                return !0
            }
            var A = null;
            this.qupvt = null, this.setModules = function(t) {
                this.qupvt = t, A = t
            };
            var T = [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 1],
                    [1, 1],
                    [1, 1],
                    [1, 2],
                    [2, 2],
                    [2, 3],
                    [2, 3],
                    [3, 4],
                    [3, 4],
                    [3, 4],
                    [4, 5],
                    [4, 5],
                    [4, 6],
                    [5, 6],
                    [5, 6],
                    [5, 7],
                    [6, 7],
                    [6, 7]
                ],
                x = [1, 2, 5, 7, 7, 10, 10, 13, 13, 13, 13, 13, 13, 13, 13];
            this.noquant_count_bits = function(e, i, n) {
                var s = i.l3_enc,
                    r = Math.min(576, i.max_nonzero_coeff + 2 >> 1 << 1);
                for (null != n && (n.sfb_count1 = 0); r > 1 && 0 == (s[r - 1] | s[r - 2]); r -= 2);
                i.count1 = r;
                for (var o = 0, a = 0; r > 3; r -= 4) {
                    var c;
                    if ((2147483647 & (s[r - 1] | s[r - 2] | s[r - 3] | s[r - 4])) > 1) break;
                    c = 2 * (2 * (2 * s[r - 4] + s[r - 3]) + s[r - 2]) + s[r - 1], o += u.t32l[c], a += u.t33l[c]
                }
                var p = o;
                if (i.count1table_select = 0, o > a && (p = a, i.count1table_select = 1), i.count1bits = p, i.big_values = r, 0 == r) return p;
                if (i.block_type == h.SHORT_TYPE) o = 3 * e.scalefac_band.s[3], o > i.big_values && (o = i.big_values), a = i.big_values;
                else if (i.block_type == h.NORM_TYPE) {
                    if (l(r <= 576), o = i.region0_count = e.bv_scf[r - 2], a = i.region1_count = e.bv_scf[r - 1], l(o + a + 2 < h.SBPSY_l), a = e.scalefac_band.l[o + a + 2], o = e.scalefac_band.l[o + 1], a < r) {
                        var f = new t(p);
                        i.table_select[2] = v(s, a, r, f), p = f.bits
                    }
                } else i.region0_count = 7, i.region1_count = h.SBMAX_l - 1 - 7 - 1, o = e.scalefac_band.l[8], a = r, o > a && (o = a);
                if (o = Math.min(o, r), a = Math.min(a, r), l(o >= 0), l(a >= 0), 0 < o) {
                    var f = new t(p);
                    i.table_select[0] = v(s, 0, o, f), p = f.bits
                }
                if (o < a) {
                    var f = new t(p);
                    i.table_select[1] = v(s, o, a, f), p = f.bits
                }
                if (2 == e.use_best_huffman && (i.part2_3_length = p, best_huffman_divide(e, i), p = i.part2_3_length), null != n && i.block_type == h.NORM_TYPE) {
                    for (var _ = 0; e.scalefac_band.l[_] < i.big_values;) _++;
                    n.sfb_count1 = _
                }
                return p
            }, this.count_bits = function(t, e, i, n) {
                var r = i.l3_enc,
                    o = p.IXMAX_VAL / A.IPOW20(i.global_gain);
                if (i.xrpow_max > o) return p.LARGE_BITS;
                if (s(e, r, A.IPOW20(i.global_gain), i, n), 0 != (2 & t.substep_shaping))
                    for (var a = 0, h = i.global_gain + i.scalefac_scale, u = .634521682242439 / A.IPOW20(h), c = 0; c < i.sfbmax; c++) {
                        var f = i.width[c];
                        if (l(f >= 0), 0 == t.pseudohalf[c]) a += f;
                        else {
                            var _;
                            for (_ = a, a += f; _ < a; ++_) r[_] = e[_] >= u ? r[_] : 0
                        }
                    }
                return this.noquant_count_bits(t, i, n)
            }, this.best_huffman_divide = function(e, i) {
                var n = new c,
                    s = i.l3_enc,
                    r = a(23),
                    o = a(23),
                    p = a(23),
                    f = a(23);
                if (i.block_type != h.SHORT_TYPE || 1 != e.mode_gr) {
                    n.assign(i), i.block_type == h.NORM_TYPE && (b(e, i, s, r, o, p, f), g(e, n, i, s, r, o, p, f));
                    var _ = n.big_values;
                    if (!(0 == _ || (s[_ - 2] | s[_ - 1]) > 1 || (_ = i.count1 + 2) > 576)) {
                        n.assign(i), n.count1 = _;
                        var d = 0,
                            m = 0;
                        for (l(_ <= 576); _ > n.big_values; _ -= 4) {
                            var y = 2 * (2 * (2 * s[_ - 4] + s[_ - 3]) + s[_ - 2]) + s[_ - 1];
                            d += u.t32l[y], m += u.t33l[y]
                        }
                        if (n.big_values = _, n.count1table_select = 0, d > m && (d = m, n.count1table_select = 1), n.count1bits = d, n.block_type == h.NORM_TYPE) g(e, n, i, s, r, o, p, f);
                        else {
                            if (n.part2_3_length = d, d = e.scalefac_band.l[8], d > _ && (d = _), d > 0) {
                                var S = new t(n.part2_3_length);
                                n.table_select[0] = v(s, 0, d, S), n.part2_3_length = S.bits
                            }
                            if (_ > d) {
                                var S = new t(n.part2_3_length);
                                n.table_select[1] = v(s, d, _, S), n.part2_3_length = S.bits
                            }
                            i.part2_3_length > n.part2_3_length && i.assign(n)
                        }
                    }
                }
            };
            var M = [1, 1, 1, 1, 8, 2, 2, 2, 4, 4, 4, 8, 8, 8, 16, 16],
                k = [1, 2, 4, 8, 1, 2, 4, 8, 2, 4, 8, 2, 4, 8, 4, 8],
                R = [0, 0, 0, 0, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4],
                O = [0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 2, 3];
            n.slen1_tab = R, n.slen2_tab = O, this.best_scalefac_store = function(t, e, i, n) {
                var s, r, o, a, u = n.tt[e][i],
                    c = 0;
                for (o = 0, s = 0; s < u.sfbmax; s++) {
                    var p = u.width[s];
                    for (l(p >= 0), o += p, a = -p; a < 0 && 0 == u.l3_enc[a + o]; a++);
                    0 == a && (u.scalefac[s] = c = -2)
                }
                if (0 == u.scalefac_scale && 0 == u.preflag) {
                    var f = 0;
                    for (s = 0; s < u.sfbmax; s++) u.scalefac[s] > 0 && (f |= u.scalefac[s]);
                    if (0 == (1 & f) && 0 != f) {
                        for (s = 0; s < u.sfbmax; s++) u.scalefac[s] > 0 && (u.scalefac[s] >>= 1);
                        u.scalefac_scale = c = 1
                    }
                }
                if (0 == u.preflag && u.block_type != h.SHORT_TYPE && 2 == t.mode_gr) {
                    for (s = 11; s < h.SBPSY_l && !(u.scalefac[s] < A.pretab[s] && -2 != u.scalefac[s]); s++);
                    if (s == h.SBPSY_l) {
                        for (s = 11; s < h.SBPSY_l; s++) u.scalefac[s] > 0 && (u.scalefac[s] -= A.pretab[s]);
                        u.preflag = c = 1
                    }
                }
                for (r = 0; r < 4; r++) n.scfsi[i][r] = 0;
                for (2 == t.mode_gr && 1 == e && n.tt[0][i].block_type != h.SHORT_TYPE && n.tt[1][i].block_type != h.SHORT_TYPE && (S(i, n), c = 0), s = 0; s < u.sfbmax; s++) - 2 == u.scalefac[s] && (u.scalefac[s] = 0);
                0 != c && (2 == t.mode_gr ? this.scale_bitcount(u) : this.scale_bitcount_lsf(t, u))
            };
            var E = [0, 18, 36, 54, 54, 36, 54, 72, 54, 72, 90, 72, 90, 108, 108, 126],
                P = [0, 18, 36, 54, 51, 35, 53, 71, 52, 70, 88, 69, 87, 105, 104, 122],
                B = [0, 10, 20, 30, 33, 21, 31, 41, 32, 42, 52, 43, 53, 63, 64, 74];
            this.scale_bitcount = function(t) {
                var e, i, n, s = 0,
                    r = 0,
                    o = t.scalefac;
                if (l(w(o, t.sfbmax)), t.block_type == h.SHORT_TYPE) n = E, 0 != t.mixed_block_flag && (n = P);
                else if (n = B, 0 == t.preflag) {
                    for (i = 11; i < h.SBPSY_l && !(o[i] < A.pretab[i]); i++);
                    if (i == h.SBPSY_l)
                        for (t.preflag = 1, i = 11; i < h.SBPSY_l; i++) o[i] -= A.pretab[i]
                }
                for (i = 0; i < t.sfbdivide; i++) s < o[i] && (s = o[i]);
                for (; i < t.sfbmax; i++) r < o[i] && (r = o[i]);
                for (t.part2_length = p.LARGE_BITS, e = 0; e < 16; e++) s < M[e] && r < k[e] && t.part2_length > n[e] && (t.part2_length = n[e], t.scalefac_compress = e);
                return t.part2_length == p.LARGE_BITS
            };
            var C = [
                [15, 15, 7, 7],
                [15, 15, 7, 0],
                [7, 3, 0, 0],
                [15, 31, 31, 0],
                [7, 7, 7, 0],
                [3, 3, 0, 0]
            ];
            this.scale_bitcount_lsf = function(t, e) {
                var i, n, s, o, u, c, p, f, _ = a(4),
                    d = e.scalefac;
                for (i = 0 != e.preflag ? 2 : 0, p = 0; p < 4; p++) _[p] = 0;
                if (e.block_type == h.SHORT_TYPE) {
                    n = 1;
                    var m = A.nr_of_sfb_block[i][n];
                    for (f = 0, s = 0; s < 4; s++)
                        for (o = m[s] / 3, p = 0; p < o; p++, f++)
                            for (u = 0; u < 3; u++) d[3 * f + u] > _[s] && (_[s] = d[3 * f + u])
                } else {
                    n = 0;
                    var m = A.nr_of_sfb_block[i][n];
                    for (f = 0, s = 0; s < 4; s++)
                        for (o = m[s], p = 0; p < o; p++, f++) d[f] > _[s] && (_[s] = d[f])
                }
                for (c = !1, s = 0; s < 4; s++) _[s] > C[i][s] && (c = !0);
                if (!c) {
                    var y, v, b, g;
                    for (e.sfb_partition_table = A.nr_of_sfb_block[i][n], s = 0; s < 4; s++) e.slen[s] = F[_[s]];
                    switch (y = e.slen[0], v = e.slen[1], b = e.slen[2], g = e.slen[3], i) {
                        case 0:
                            e.scalefac_compress = (5 * y + v << 4) + (b << 2) + g;
                            break;
                        case 1:
                            e.scalefac_compress = 400 + (5 * y + v << 2) + b;
                            break;
                        case 2:
                            e.scalefac_compress = 500 + 3 * y + v;
                            break;
                        default:
                            r.err.printf("intensity stereo not implemented yet\n")
                    }
                }
                if (!c)
                    for (l(null != e.sfb_partition_table), e.part2_length = 0, s = 0; s < 4; s++) e.part2_length += e.slen[s] * e.sfb_partition_table[s];
                return c
            };
            var F = [0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4];
            this.huffman_init = function(t) {
                for (var e = 2; e <= 576; e += 2) {
                    for (var i, n = 0; t.scalefac_band.l[++n] < e;);
                    for (i = T[n][0]; t.scalefac_band.l[i + 1] > e;) i--;
                    for (i < 0 && (i = T[n][0]), t.bv_scf[e - 2] = i, i = T[n][1]; t.scalefac_band.l[i + t.bv_scf[e - 2] + 2] > e;) i--;
                    i < 0 && (i = T[n][1]), t.bv_scf[e - 1] = i
                }
            }
        }
        var s = i(384),
            r = s.System,
            o = (s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays),
            a = (s.new_array_n, s.new_byte, s.new_double, s.new_float, s.new_float_n, s.new_int),
            l = (s.new_int_n, s.assert),
            h = i(388),
            u = i(432),
            c = i(431),
            p = i(444);
        t.exports = n
    },
    451: function(t, e, i) {
        e = t.exports = i(83)(!0), e.push([t.i, ":root{--clearRed:rgba(246,81,29,.5);--clearBlue:rgba(0,138,206,.5);--clearGreen:rgba(151,204,4,.5);--clearOrange:rgba(226,132,19,.5);--black:#1f271b;--white:#fdfffc}.client-components-Recorder-Recorder__container--1IX7I{text-align:center;-webkit-animation:client-components-Recorder-Recorder__fadein--2bLMU .5s;animation:client-components-Recorder-Recorder__fadein--2bLMU .5s}.client-components-Recorder-Recorder__not-supported-message--1Z-x2{color:var(--black)}.client-components-Recorder-Recorder__blue-mask--3jPI_{width:100%;height:100%;position:absolute;top:0;left:0;background-color:var(--clearBlue);opacity:.5;-webkit-animation:client-components-Recorder-Recorder__maskFadein--1Ep97 .2s;animation:client-components-Recorder-Recorder__maskFadein--1Ep97 .2s;cursor:pointer}.client-components-Recorder-Recorder__label--3Lr8b{position:absolute;top:20%;width:100%;text-align:center;font-size:3.5rem;color:var(--black);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.client-components-Recorder-Recorder__red-mask--rI7Nc{width:100%;height:100%;position:absolute;top:0;left:0;background-color:var(--clearRed);opacity:.5;-webkit-animation:client-components-Recorder-Recorder__maskFadein--1Ep97 .2s;animation:client-components-Recorder-Recorder__maskFadein--1Ep97 .2s;cursor:pointer}.client-components-Recorder-Recorder__retry-button--1Ra3Y{background-color:var(--clearBlue)}.client-components-Recorder-Recorder__retry-button--1Ra3Y,.client-components-Recorder-Recorder__save-button--1qJ_f{font-size:3.5rem;color:var(--black);opacity:.5;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.client-components-Recorder-Recorder__save-button--1qJ_f{background-color:var(--clearGreen)}@-webkit-keyframes client-components-Recorder-Recorder__maskFadein--1Ep97{0%{opacity:0}to{opacity:.2}}@keyframes client-components-Recorder-Recorder__maskFadein--1Ep97{0%{opacity:0}to{opacity:.2}}@-webkit-keyframes client-components-Recorder-Recorder__fadein--2bLMU{0%{opacity:0}to{opacity:1}}@keyframes client-components-Recorder-Recorder__fadein--2bLMU{0%{opacity:0}to{opacity:1}}", "", {
            version: 3,
            sources: ["/usr/src/app/client/components/Recorder/Recorder.css"],
            names: [],
            mappings: "AAAA,MACE,8BAAiC,AACjC,+BAAiC,AACjC,gCAAkC,AAClC,kCAAoC,AACpC,gBAAuB,AACvB,eAAiB,CAClB,AAED,uDACE,kBAAmB,AACnB,yEAA8B,AACtB,gEAAsB,CAC/B,AAED,mEACE,kBAAoB,CACrB,AAED,uDACE,WAAY,AACZ,YAAa,AACb,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,kCAAmC,AACnC,WAAY,AACZ,6EAAkC,AAC1B,qEAA0B,AAClC,cAAgB,CACjB,AAED,mDACE,kBAAmB,AACnB,QAAS,AACT,WAAY,AACZ,kBAAmB,AACnB,iBAAkB,AAClB,mBAAoB,AACpB,yBAA0B,AACvB,sBAAuB,AACtB,qBAAsB,AAClB,gBAAkB,CAC3B,AAED,sDACE,WAAY,AACZ,YAAa,AACb,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,iCAAkC,AAClC,WAAY,AACZ,6EAAkC,AAC1B,qEAA0B,AAClC,cAAgB,CACjB,AAED,0DAIE,iCAAmC,CAMpC,AAED,mHAXE,iBAAkB,AAClB,mBAAoB,AACpB,WAAY,AAEZ,yBAA0B,AACvB,sBAAuB,AACtB,qBAAsB,AAClB,iBAAkB,AAC1B,cAAgB,CAajB,AAVD,yDAIE,kCAAoC,CAMrC,AAED,0EACI,GAAO,SAAW,CAAE,AACpB,GAAO,UAAY,CAAE,CACxB,AAED,kEACI,GAAO,SAAW,CAAE,AACpB,GAAO,UAAY,CAAE,CACxB,AAED,sEACI,GAAO,SAAW,CAAE,AACpB,GAAO,SAAW,CAAE,CACvB,AAED,8DACI,GAAO,SAAW,CAAE,AACpB,GAAO,SAAW,CAAE,CACvB",
            file: "Recorder.css",
            sourcesContent: [":root {\n  --clearRed: rgba(246,81,29, 0.5);\n  --clearBlue: rgba(0,138,206,0.5);\n  --clearGreen: rgba(151,204,4,0.5);\n  --clearOrange: rgba(226,132,19,0.5);\n  --black: rgb(31,39,27);\n  --white: #FDFFFC;\n}\n\n.container {\n  text-align: center;\n  -webkit-animation: fadein .5s;\n          animation: fadein .5s;\n}\n\n.not-supported-message {\n  color: var(--black);\n}\n\n.blue-mask {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-color: var(--clearBlue);\n  opacity: .5;\n  -webkit-animation: maskFadein .2s;\n          animation: maskFadein .2s;\n  cursor: pointer;\n}\n\n.label {\n  position: absolute;\n  top: 20%;\n  width: 100%;\n  text-align: center;\n  font-size: 3.5rem;\n  color: var(--black);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.red-mask {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-color: var(--clearRed);\n  opacity: .5;\n  -webkit-animation: maskFadein .2s;\n          animation: maskFadein .2s;\n  cursor: pointer;\n}\n\n.retry-button {\n  font-size: 3.5rem;\n  color: var(--black);\n  opacity: .5;\n  background-color: var(--clearBlue);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  cursor: pointer;\n}\n\n.save-button {\n  font-size: 3.5rem;\n  color: var(--black);\n  opacity: .5;\n  background-color: var(--clearGreen);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  cursor: pointer;\n}\n\n@-webkit-keyframes maskFadein {\n    from { opacity: 0; }\n    to   { opacity: .2; }\n}\n\n@keyframes maskFadein {\n    from { opacity: 0; }\n    to   { opacity: .2; }\n}\n\n@-webkit-keyframes fadein {\n    from { opacity: 0; }\n    to   { opacity: 1; }\n}\n\n@keyframes fadein {\n    from { opacity: 0; }\n    to   { opacity: 1; }\n}"],
            sourceRoot: ""
        }]), e.locals = {
            container: "client-components-Recorder-Recorder__container--1IX7I",
            fadein: "client-components-Recorder-Recorder__fadein--2bLMU",
            "not-supported-message": "client-components-Recorder-Recorder__not-supported-message--1Z-x2",
            notSupportedMessage: "client-components-Recorder-Recorder__not-supported-message--1Z-x2",
            "blue-mask": "client-components-Recorder-Recorder__blue-mask--3jPI_",
            blueMask: "client-components-Recorder-Recorder__blue-mask--3jPI_",
            maskFadein: "client-components-Recorder-Recorder__maskFadein--1Ep97",
            label: "client-components-Recorder-Recorder__label--3Lr8b",
            "red-mask": "client-components-Recorder-Recorder__red-mask--rI7Nc",
            redMask: "client-components-Recorder-Recorder__red-mask--rI7Nc",
            "retry-button": "client-components-Recorder-Recorder__retry-button--1Ra3Y",
            retryButton: "client-components-Recorder-Recorder__retry-button--1Ra3Y",
            "save-button": "client-components-Recorder-Recorder__save-button--1qJ_f",
            saveButton: "client-components-Recorder-Recorder__save-button--1qJ_f"
        }
    },
    457: function(t, e, i) {
        e = t.exports = i(83)(!0), e.push([t.i, ":root{--clearRed:rgba(246,81,29,.5);--clearBlue:rgba(0,138,206,.5);--clearGreen:rgba(151,204,4,.5);--clearOrange:rgba(226,132,19,.5);--black:#1f271b;--white:#fdfffc;--bottomOfTopNav:7%}.shared-components-App-AsyncRecorder-styles__container--1lz3H{text-align:center;position:fixed;top:0;width:100%;bottom:0}.shared-components-App-AsyncRecorder-styles__loading-message--22dKX{color:var(--white);font-size:40px}", "", {
            version: 3,
            sources: ["/usr/src/app/shared/components/App/AsyncRecorder/styles.css"],
            names: [],
            mappings: "AAAA,MACE,8BAAiC,AACjC,+BAAiC,AACjC,gCAAkC,AAClC,kCAAoC,AACpC,gBAAuB,AACvB,gBAAiB,AAGjB,mBAAqB,CAFtB,AAID,8DACE,kBAAmB,AACnB,eAAgB,AAChB,MAAO,AACP,WAAY,AACZ,QAAU,CACX,AACD,oEACE,mBAAoB,AACpB,cAAgB,CACjB",
            file: "styles.css",
            sourcesContent: [":root {\n  --clearRed: rgba(246,81,29, 0.5);\n  --clearBlue: rgba(0,138,206,0.5);\n  --clearGreen: rgba(151,204,4,0.5);\n  --clearOrange: rgba(226,132,19,0.5);\n  --black: rgb(31,39,27);\n  --white: #FDFFFC;\n}\n:root {\n  --bottomOfTopNav: 7%;\n}\n.container {\n  text-align: center;\n  position: fixed;\n  top: 0;\n  width: 100%;\n  bottom: 0;\n}\n.loading-message {\n  color: var(--white);\n  font-size: 40px;\n}"],
            sourceRoot: ""
        }]), e.locals = {
            container: "shared-components-App-AsyncRecorder-styles__container--1lz3H",
            "loading-message": "shared-components-App-AsyncRecorder-styles__loading-message--22dKX",
            loadingMessage: "shared-components-App-AsyncRecorder-styles__loading-message--22dKX"
        }
    },
    460: function(t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {
                default: t
            }
        }

        function s(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function r(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        }

        function o(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }

        function a(t) {
            requestAnimationFrame(function() {
                var e = t.canvas.width,
                    i = t.canvas.height;
                t.beginPath(), t.clearRect(0, 0, e, i), t.closePath()
            })
        }

        function l(t) {
            return {
                objectUrl: S.getStagedObjectUrl(t)
            }
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var h = function() {
                var t = "function" == typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
                return function(e, i, n, s) {
                    var r = e && e.defaultProps,
                        o = arguments.length - 3;
                    if (i || 0 === o || (i = {}), i && r)
                        for (var a in r) void 0 === i[a] && (i[a] = r[a]);
                    else i || (i = r || {});
                    if (1 === o) i.children = s;
                    else if (o > 1) {
                        for (var l = Array(o), h = 0; h < o; h++) l[h] = arguments[h + 3];
                        i.children = l
                    }
                    return {
                        $$typeof: t,
                        type: e,
                        key: void 0 === n ? null : "" + n,
                        ref: null,
                        props: i,
                        _owner: null
                    }
                }
            }(),
            u = function() {
                function t(t, e) {
                    for (var i = 0; i < e.length; i++) {
                        var n = e[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }
                return function(e, i, n) {
                    return i && t(e.prototype, i), n && t(e, n), e
                }
            }(),
            c = i(4),
            p = n(c),
            f = i(50),
            _ = i(153),
            d = i(393),
            m = n(d),
            y = i(1459),
            v = n(y),
            b = i(161),
            g = i(84),
            S = function(t) {
                if (t && t.__esModule) return t;
                var e = {};
                if (null != t)
                    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e.default = t, e
            }(g),
            w = i(426),
            A = n(w),
            T = i(437),
            x = i(471),
            M = n(x),
            k = function(t) {
                function e(t) {
                    s(this, e);
                    var i = r(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t));
                    i.prompts = {
                        START: i._renderSTART.bind(i),
                        STOP: i._renderSTOP.bind(i),
                        USER_MEDIA_DENIED: i._renderUSER_MEDIA_DENIED.bind(i)
                    }, i.state = {
                        isRecording: !1,
                        disableRecording: !0,
                        currentPrompt: i.prompts.START,
                        drawWave: !1,
                        duration: void 0
                    };
                    try {
                        i.sampleCreator = (0, T.getSampleCreator)()
                    } catch (t) {}
                    return i._startRecording = i._startRecording.bind(i), i._stopRecording = i._stopRecording.bind(i), i._beginDrawingWaves = i._beginDrawingWaves.bind(i), i._drawWave = i._drawWave.bind(i), i._drawSample = i._drawSample.bind(i), i
                }
                return o(e, t), u(e, [{
                    key: "_beginDrawingWaves",
                    value: function() {
                        this.canvasContext = this.canvas.getContext("2d"), this.canvasContext.canvas.width = this.canvas.width, this.canvasContext.canvas.height = this.canvas.height, this.setState({
                            drawWave: !0
                        }), this._drawWave()
                    }
                }, {
                    key: "_drawWave",
                    value: function() {
                        var t = this.canvasContext.canvas.width,
                            e = this.canvasContext.canvas.height,
                            i = void 0,
                            n = void 0,
                            s = !1;
                        this.state.drawWave && requestAnimationFrame(this._drawWave);
                        var r = this.sampleCreator.getValues();
                        this.canvasContext.beginPath(), this.canvasContext.clearRect(0, 0, t, e), this.canvasContext.lineJoin = "round", this.state.isRecording ? (this.canvasContext.lineWidth = 5, this.canvasContext.strokeStyle = "red") : (this.canvasContext.lineWidth = 2, this.canvasContext.strokeStyle = "#CCCCCC"), this.canvasContext.moveTo(r[0] / 255 * t, e);
                        for (var o = Date.now(), a = r.length; a > 0; a--) {
                            this.state.isRecording && 1 - a / r.length > (o - this.state.recordingStartTime) / 1e4 && !s && (s = !0, this.canvasContext.stroke(), this.canvasContext.closePath(), this.canvasContext.lineWidth = 2, this.canvasContext.strokeStyle = "#CCCCCC", this.canvasContext.beginPath(), this.canvasContext.moveTo(i, n), this.canvasContext.lineJoin = "round");
                            i = r[a] / (this.sampleCreator.resolution - 1) * t, n = a / (this.sampleCreator.resolution - 1) * e, this.canvasContext.lineTo(i, n)
                        }
                        this.canvasContext.stroke(), this.canvasContext.closePath()
                    }
                }, {
                    key: "_drawSample",
                    value: function(t) {
                        var e = v.default.create(t);
                        e.offset(0, t.byteLength / 4);
                        var i = this.canvasContext,
                            n = i.canvas.height,
                            s = function(t) {
                                return function(e) {
                                    return t - (e + 128) * t / 256
                                }
                            }(n);
                        i.beginPath(), e.min.forEach(function(t, e) {
                            return i.lineTo(e + .5, s(t) + .5)
                        }), e.max.reverse().forEach(function(t, n) {
                            i.lineTo(e.offset_length - n + .5, s(t) + .5)
                        }), i.closePath(), i.stroke()
                    }
                }, {
                    key: "_renderSTART",
                    value: function() {
                        return h("div", {}, void 0, this.state.disableRecording ? h("div", {}, void 0, "Waiting on encoder to initialize") : h("div", {
                            className: M.default.blueMask
                        }))
                    }
                }, {
                    key: "_startRecording",
                    value: function() {
                        this.sampleCreator.startRecording(), this.props.addItemToNavBar(null, {
                            type: "CHECK",
                            cb: this._stopRecording
                        }), this.setState({
                            recordingStartTime: Date.now(),
                            isRecording: !0,
                            currentPrompt: this.prompts.STOP
                        })
                    }
                }, {
                    key: "_renderSTOP",
                    value: function() {
                        return h("div", {
                            className: M.default.redMask
                        })
                    }
                }, {
                    key: "_navigateToCleanup",
                    value: function() {
                        this.props.history.push(this.props.match.url + "/cleanup")
                    }
                }, {
                    key: "_stopRecording",
                    value: function() {
                        this.setState({
                            isRecording: !1,
                            drawWave: !1
                        }), a(this.canvasContext), this.sampleCreator.stopAndFinishRecording();
                        var t = this.sampleCreator.createBlobObjectUrl();
                        this.props.setStagedSample({
                            startTime: 0,
                            volume: 0,
                            panning: 0,
                            duration: 0
                        }), this.props.setStagedObjectUrl(t);
                        var e = Math.ceil(.2 * this.sampleCreator.getDataBufferLength()),
                            i = Math.ceil(.8 * this.sampleCreator.getDataBufferLength());
                        this.props.setCleanup({
                            leftSliderValue: e,
                            rightSliderValue: i,
                            clipStart: e,
                            clipEnd: i
                        }), this._navigateToCleanup()
                    }
                }, {
                    key: "_renderUSER_MEDIA_DENIED",
                    value: function() {
                        return h("div", {}, void 0, "Welp, you blew it!")
                    }
                }, {
                    key: "componentDidMount",
                    value: function() {
                        var t = this,
                            e = this.container ? this.container.parentNode.clientHeight : 0,
                            i = this.container ? this.container.parentNode.clientWidth : 0;
                        this.setState({
                            canvasWidth: i,
                            canvasHeight: e
                        }, function() {
                            t.canvas && t.sampleCreator.openMic().then(function() {
                                t.canvas && (t.props.addItemToNavBar(null, {
                                    type: "RECORD",
                                    cb: t._startRecording
                                }), t.setState({
                                    disableRecording: !1
                                }), t._beginDrawingWaves())
                            }).catch(function(e) {
                                console.error(e), t.setState({
                                    currentPrompt: t.prompts.USER_MEDIA_DENIED
                                })
                            })
                        })
                    }
                }, {
                    key: "render",
                    value: function() {
                        var t = this;
                        return p.default.createElement("div", {
                            ref: function(e) {
                                t.container = e
                            }
                        }, this.sampleCreator ? h("div", {}, void 0, this.state.currentPrompt()) : h("div", {
                            className: M.default.notSupportedMessage
                        }, void 0, "WebAudio is not supported by this browser.", h("br", {}), "Please upgrade this browser's version or switch to a browser that supports this technology.", h("br", {}), "i.e. internet explorer, safari, and all iOS-based browsers will not be able to run this application"), !this.state.disableRecording && h(A.default, {
                            addItemToNavBar: this.props.addItemToNavBar,
                            renderErrorComponent: function() {}
                        }), p.default.createElement("canvas", {
                            className: M.default.container,
                            width: this.state.canvasWidth || 0,
                            height: this.state.canvasHeight || 0,
                            ref: function(e) {
                                t.canvas = e
                            }
                        }))
                    }
                }]), e
            }(p.default.Component),
            R = {
                setStagedObjectUrl: b.setStagedObjectUrl,
                setStagedSample: b.setStagedSample,
                setCleanup: b.setCleanup
            };
        e.default = (0, f.compose)((0, m.default)(M.default), (0, _.connect)(l, R))(k)
    },
    461: function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(19);
        e.default = (0, n.asyncComponent)({
            resolve: function() {
                return i.e(0).then(i.bind(null, 460))
            },
            serverMode: "defer"
        })
    },
    465: function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(19);
        e.default = (0, n.asyncComponent)({
            resolve: function() {
                return i.e(5).then(i.bind(null, 459))
            },
            serverMode: "defer"
        })
    },
    466: function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = i(19);
        e.default = (0, n.asyncComponent)({
            resolve: function() {
                return i.e(7).then(i.bind(null, 463))
            },
            serverMode: "defer"
        })
    },
    471: function(t, e, i) {
        var n = i(451),
            s = i(85);
        "string" == typeof n && (n = [
            [t.i, n, ""]
        ]), t.exports = n.locals || {}, t.exports._getContent = function() {
            return n
        }, t.exports._getCss = function() {
            return n.toString()
        }, t.exports._insertCss = function(t) {
            return s(n, t)
        }
    },
    477: function(t, e, i) {
        var n = i(457),
            s = i(85);
        "string" == typeof n && (n = [
            [t.i, n, ""]
        ]), t.exports = n.locals || {}, t.exports._getContent = function() {
            return n
        }, t.exports._getCss = function() {
            return n.toString()
        }, t.exports._insertCss = function(t) {
            return s(n, t)
        }
    },
    478: function(t, e, i) {
        function n() {
            this.useAdjust = 0, this.aaSensitivityP = 0, this.adjust = 0, this.adjustLimit = 0, this.decay = 0, this.floor = 0, this.l = r(o.SBMAX_l), this.s = r(o.SBMAX_s), this.psfb21 = r(o.PSFB21), this.psfb12 = r(o.PSFB12), this.cb_l = r(o.CBANDS), this.cb_s = r(o.CBANDS), this.eql_w = r(o.BLKSIZE / 2)
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            o = (s.new_float_n, s.new_int, s.new_int_n, s.assert, i(388));
        t.exports = n
    },
    479: function(t, e, i) {
        function n(t) {
            var e = t;
            this.quantize = e, this.iteration_loop = function(t, e, i, n) {
                var s, p = t.internal_flags,
                    f = r(u.SFBMAX),
                    _ = r(576),
                    d = o(2),
                    m = 0,
                    y = p.l3_side,
                    v = new l(m);
                this.quantize.rv.ResvFrameBegin(t, v), m = v.bits;
                for (var b = 0; b < p.mode_gr; b++) {
                    s = this.quantize.qupvt.on_pe(t, e, d, m, b, b), p.mode_ext == h.MPG_MD_MS_LR && (this.quantize.ms_convert(p.l3_side, b), this.quantize.qupvt.reduce_side(d, i[b], m, s));
                    for (var g = 0; g < p.channels_out; g++) {
                        var S, w, A = y.tt[b][g];
                        A.block_type != h.SHORT_TYPE ? (S = 0, w = p.PSY.mask_adjust - S) : (S = 0, w = p.PSY.mask_adjust_short - S), p.masking_lower = Math.pow(10, .1 * w), this.quantize.init_outer_loop(p, A), this.quantize.init_xrpow(p, A, _) && (this.quantize.qupvt.calc_xmin(t, n[b][g], A, f), this.quantize.outer_loop(t, A, f, _, g, d[g])), this.quantize.iteration_finish_one(p, b, g), a(A.part2_3_length <= c.MAX_BITS_PER_CHANNEL), a(A.part2_3_length <= d[g])
                    }
                }
                this.quantize.rv.ResvFrameEnd(p, m)
            }
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            o = (s.new_float_n, s.new_int),
            a = (s.new_int_n, s.assert),
            l = i(443),
            h = i(388),
            u = i(427),
            c = i(428);
        t.exports = n
    },
    480: function(t, e, i) {
        function n() {
            this.global_gain = 0, this.sfb_count1 = 0, this.step = o(39), this.noise = r(39), this.noise_log = r(39)
        }
        var s = i(384),
            r = s.new_float,
            o = s.new_int;
        s.assert;
        t.exports = n
    },
    481: function(t, e) {
        function i() {
            this.over_noise = 0, this.tot_noise = 0, this.max_noise = 0, this.over_count = 0, this.over_SSD = 0, this.bits = 0
        }
        t.exports = i
    },
    482: function(t, e, i) {
        function n() {
            function t(t, e, i) {
                var s, o, a, l = 0;
                i <<= 1;
                var h = e + i;
                s = 4;
                do {
                    var u, c, p, f, _, d, m;
                    m = s >> 1, f = s, _ = s << 1, d = _ + f, s = _ << 1, o = e, a = o + m;
                    do {
                        var y, v, b, g;
                        v = t[o + 0] - t[o + f], y = t[o + 0] + t[o + f], g = t[o + _] - t[o + d], b = t[o + _] + t[o + d], t[o + _] = y - b, t[o + 0] = y + b, t[o + d] = v - g, t[o + f] = v + g, v = t[a + 0] - t[a + f], y = t[a + 0] + t[a + f], g = r.SQRT2 * t[a + d], b = r.SQRT2 * t[a + _], t[a + _] = y - b, t[a + 0] = y + b, t[a + d] = v - g, t[a + f] = v + g, a += s, o += s
                    } while (o < h);
                    for (c = n[l + 0], u = n[l + 1], p = 1; p < m; p++) {
                        var S, w;
                        S = 1 - 2 * u * u, w = 2 * u * c, o = e + p, a = e + f - p;
                        do {
                            var A, T, x, y, v, M, b, k, g, R;
                            T = w * t[o + f] - S * t[a + f], A = S * t[o + f] + w * t[a + f], v = t[o + 0] - A, y = t[o + 0] + A, M = t[a + 0] - T, x = t[a + 0] + T, T = w * t[o + d] - S * t[a + d], A = S * t[o + d] + w * t[a + d], g = t[o + _] - A, b = t[o + _] + A, R = t[a + _] - T, k = t[a + _] + T, T = u * b - c * R, A = c * b + u * R, t[o + _] = y - A, t[o + 0] = y + A, t[a + d] = M - T, t[a + f] = M + T, T = c * k - u * g, A = u * k + c * g, t[a + _] = x - A, t[a + 0] = x + A, t[o + d] = v - T, t[o + f] = v + T, a += s, o += s
                        } while (o < h);
                        S = c, c = S * n[l + 0] - u * n[l + 1], u = S * n[l + 1] + u * n[l + 0]
                    }
                    l += 2
                } while (s < i)
            }
            var e = o(a.BLKSIZE),
                i = o(a.BLKSIZE_s / 2),
                n = [.9238795325112867, .3826834323650898, .9951847266721969, .0980171403295606, .9996988186962042, .02454122852291229, .9999811752826011, .006135884649154475],
                s = [0, 128, 64, 192, 32, 160, 96, 224, 16, 144, 80, 208, 48, 176, 112, 240, 8, 136, 72, 200, 40, 168, 104, 232, 24, 152, 88, 216, 56, 184, 120, 248, 4, 132, 68, 196, 36, 164, 100, 228, 20, 148, 84, 212, 52, 180, 116, 244, 12, 140, 76, 204, 44, 172, 108, 236, 28, 156, 92, 220, 60, 188, 124, 252, 2, 130, 66, 194, 34, 162, 98, 226, 18, 146, 82, 210, 50, 178, 114, 242, 10, 138, 74, 202, 42, 170, 106, 234, 26, 154, 90, 218, 58, 186, 122, 250, 6, 134, 70, 198, 38, 166, 102, 230, 22, 150, 86, 214, 54, 182, 118, 246, 14, 142, 78, 206, 46, 174, 110, 238, 30, 158, 94, 222, 62, 190, 126, 254];
            this.fft_short = function(e, n, r, o, l) {
                for (var h = 0; h < 3; h++) {
                    var u = a.BLKSIZE_s / 2,
                        c = 65535 & 192 * (h + 1),
                        p = a.BLKSIZE_s / 8 - 1;
                    do {
                        var f, _, d, m, y, v = 255 & s[p << 2];
                        f = i[v] * o[r][l + v + c], y = i[127 - v] * o[r][l + v + c + 128], _ = f - y, f += y, d = i[v + 64] * o[r][l + v + c + 64], y = i[63 - v] * o[r][l + v + c + 192], m = d - y, d += y, u -= 4, n[h][u + 0] = f + d, n[h][u + 2] = f - d, n[h][u + 1] = _ + m, n[h][u + 3] = _ - m, f = i[v + 1] * o[r][l + v + c + 1], y = i[126 - v] * o[r][l + v + c + 129], _ = f - y, f += y, d = i[v + 65] * o[r][l + v + c + 65], y = i[62 - v] * o[r][l + v + c + 193], m = d - y, d += y, n[h][u + a.BLKSIZE_s / 2 + 0] = f + d, n[h][u + a.BLKSIZE_s / 2 + 2] = f - d, n[h][u + a.BLKSIZE_s / 2 + 1] = _ + m, n[h][u + a.BLKSIZE_s / 2 + 3] = _ - m
                    } while (--p >= 0);
                    t(n[h], u, a.BLKSIZE_s / 2)
                }
            }, this.fft_long = function(i, n, r, o, l) {
                var h = a.BLKSIZE / 8 - 1,
                    u = a.BLKSIZE / 2;
                do {
                    var c, p, f, _, d, m = 255 & s[h];
                    c = e[m] * o[r][l + m], d = e[m + 512] * o[r][l + m + 512], p = c - d, c += d, f = e[m + 256] * o[r][l + m + 256], d = e[m + 768] * o[r][l + m + 768], _ = f - d, f += d, u -= 4, n[u + 0] = c + f, n[u + 2] = c - f, n[u + 1] = p + _, n[u + 3] = p - _, c = e[m + 1] * o[r][l + m + 1], d = e[m + 513] * o[r][l + m + 513], p = c - d, c += d, f = e[m + 257] * o[r][l + m + 257], d = e[m + 769] * o[r][l + m + 769], _ = f - d, f += d, n[u + a.BLKSIZE / 2 + 0] = c + f, n[u + a.BLKSIZE / 2 + 2] = c - f, n[u + a.BLKSIZE / 2 + 1] = p + _, n[u + a.BLKSIZE / 2 + 3] = p - _
                } while (--h >= 0);
                t(n, u, a.BLKSIZE / 2)
            }, this.init_fft = function(t) {
                for (var n = 0; n < a.BLKSIZE; n++) e[n] = .42 - .5 * Math.cos(2 * Math.PI * (n + .5) / a.BLKSIZE) + .08 * Math.cos(4 * Math.PI * (n + .5) / a.BLKSIZE);
                for (var n = 0; n < a.BLKSIZE_s / 2; n++) i[n] = .5 * (1 - Math.cos(2 * Math.PI * (n + .5) / a.BLKSIZE_s))
            }
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util),
            o = (s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            a = (s.new_float_n, s.new_int, s.new_int_n, s.assert, i(388));
        t.exports = n
    },
    483: function(t, e, i) {
        function n() {
            this.tt = [
                [null, null],
                [null, null]
            ], this.main_data_begin = 0, this.private_bits = 0, this.resvDrain_pre = 0, this.resvDrain_post = 0, this.scfsi = [r(4), r(4)];
            for (var t = 0; t < 2; t++)
                for (var e = 0; e < 2; e++) this.tt[t][e] = new o
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float, s.new_float_n, s.new_int),
            o = (s.new_int_n, s.assert, i(431));
        t.exports = n
    },
    484: function(t, e, i) {
        function n() {
            this.thm = new s, this.en = new s
        }
        var s = i(441);
        t.exports = n
    },
    485: function(t, e, i) {
        function n() {
            function t() {
                this.mask_adjust = 0, this.mask_adjust_short = 0, this.bo_l_weight = l(g.SBMAX_l), this.bo_s_weight = l(g.SBMAX_s)
            }

            function e() {
                this.lowerlimit = 0
            }

            function i(t, e) {
                this.lowpass = e
            }

            function s(t) {
                var e;
                return t.class_id = K, e = t.internal_flags = new _, t.mode = MPEGMode.NOT_SET, t.original = 1, t.in_samplerate = 44100, t.num_channels = 2, t.num_samples = -1, t.bWriteVbrTag = !0, t.quality = -1, t.short_blocks = null, e.subblock_gain = -1, t.lowpassfreq = 0, t.highpassfreq = 0, t.lowpasswidth = -1, t.highpasswidth = -1, t.VBR = o.vbr_off, t.VBR_q = 4, t.ATHcurve = -1, t.VBR_mean_bitrate_kbps = 128, t.VBR_min_bitrate_kbps = 0, t.VBR_max_bitrate_kbps = 0, t.VBR_hard_min = 0, e.VBR_min_bitrate = 1, e.VBR_max_bitrate = 13, t.quant_comp = -1, t.quant_comp_short = -1, t.msfix = -1, e.resample_ratio = 1, e.OldValue[0] = 180, e.OldValue[1] = 180, e.CurrentStep[0] = 4, e.CurrentStep[1] = 4, e.masking_lower = 1, e.nsPsy.attackthre = -1, e.nsPsy.attackthre_s = -1, t.scale = -1, t.athaa_type = -1, t.ATHtype = -1, t.athaa_loudapprox = -1, t.athaa_sensitivity = 0, t.useTemporal = null, t.interChRatio = -1, e.mf_samples_to_encode = g.ENCDELAY + g.POSTDELAY, t.encoder_padding = 0, e.mf_size = g.ENCDELAY - g.MDCTDELAY, t.findReplayGain = !1, t.decode_on_the_fly = !1, e.decode_on_the_fly = !1, e.findReplayGain = !1, e.findPeakSample = !1, e.RadioGain = 0, e.AudiophileGain = 0, e.noclipGainChange = 0, e.noclipScale = -1, t.preset = 0, t.write_id3tag_automatic = !0, 0
            }

            function S(t) {
                return t > 1 ? 0 : t <= 0 ? 1 : Math.cos(Math.PI / 2 * t)
            }

            function w(t, e) {
                var i = 44100;
                return e >= 48e3 ? i = 48e3 : e >= 44100 ? i = 44100 : e >= 32e3 ? i = 32e3 : e >= 24e3 ? i = 24e3 : e >= 22050 ? i = 22050 : e >= 16e3 ? i = 16e3 : e >= 12e3 ? i = 12e3 : e >= 11025 ? i = 11025 : e >= 8e3 && (i = 8e3), -1 == t ? i : (t <= 15960 && (i = 44100), t <= 15250 && (i = 32e3), t <= 11220 && (i = 24e3), t <= 9970 && (i = 22050), t <= 7230 && (i = 16e3), t <= 5420 && (i = 12e3), t <= 4510 && (i = 11025), t <= 3970 && (i = 8e3), e < i ? e > 44100 ? 48e3 : e > 32e3 ? 44100 : e > 24e3 ? 32e3 : e > 22050 ? 24e3 : e > 16e3 ? 22050 : e > 12e3 ? 16e3 : e > 11025 ? 12e3 : e > 8e3 ? 11025 : 8e3 : i)
            }

            function A(t, e) {
                switch (t) {
                    case 44100:
                        return e.version = 1, 0;
                    case 48e3:
                        return e.version = 1, 1;
                    case 32e3:
                        return e.version = 1, 2;
                    case 22050:
                        return e.version = 0, 0;
                    case 24e3:
                        return e.version = 0, 1;
                    case 16e3:
                        return e.version = 0, 2;
                    case 11025:
                        return e.version = 0, 0;
                    case 12e3:
                        return e.version = 0, 1;
                    case 8e3:
                        return e.version = 0, 2;
                    default:
                        return e.version = 0, -1
                }
            }

            function T(t, e, i) {
                i < 16e3 && (e = 2);
                for (var n = b.bitrate_table[e][1], s = 2; s <= 14; s++) b.bitrate_table[e][s] > 0 && Math.abs(b.bitrate_table[e][s] - t) < Math.abs(n - t) && (n = b.bitrate_table[e][s]);
                return n
            }

            function x(t, e, i) {
                i < 16e3 && (e = 2);
                for (var n = 0; n <= 14; n++)
                    if (b.bitrate_table[e][n] > 0 && b.bitrate_table[e][n] == t) return n;
                return -1
            }

            function M(t, e) {
                var n = [new i(8, 2e3), new i(16, 3700), new i(24, 3900), new i(32, 5500), new i(40, 7e3), new i(48, 7500), new i(56, 1e4), new i(64, 11e3), new i(80, 13500), new i(96, 15100), new i(112, 15600), new i(128, 17e3), new i(160, 17500), new i(192, 18600), new i(224, 19400), new i(256, 19700), new i(320, 20500)],
                    s = D.nearestBitrateFullIndex(e);
                t.lowerlimit = n[s].lowpass
            }

            function k(t) {
                var e = t.internal_flags,
                    i = 32,
                    n = -1;
                if (e.lowpass1 > 0) {
                    for (var s = 999, o = 0; o <= 31; o++) {
                        var a = o / 31;
                        a >= e.lowpass2 && (i = Math.min(i, o)), e.lowpass1 < a && a < e.lowpass2 && (s = Math.min(s, o))
                    }
                    e.lowpass1 = 999 == s ? (i - .75) / 31 : (s - .75) / 31, e.lowpass2 = i / 31
                }
                if (e.highpass2 > 0 && e.highpass2 < .75 / 31 * .9 && (e.highpass1 = 0, e.highpass2 = 0, r.err.println("Warning: highpass filter disabled.  highpass frequency too small\n")), e.highpass2 > 0) {
                    for (var l = -1, o = 0; o <= 31; o++) {
                        var a = o / 31;
                        a <= e.highpass1 && (n = Math.max(n, o)), e.highpass1 < a && a < e.highpass2 && (l = Math.max(l, o))
                    }
                    e.highpass1 = n / 31, e.highpass2 = -1 == l ? (n + .75) / 31 : (l + .75) / 31
                }
                for (var o = 0; o < 32; o++) {
                    var h, u, a = o / 31;
                    h = e.highpass2 > e.highpass1 ? S((e.highpass2 - a) / (e.highpass2 - e.highpass1 + 1e-20)) : 1, u = e.lowpass2 > e.lowpass1 ? S((a - e.lowpass1) / (e.lowpass2 - e.lowpass1 + 1e-20)) : 1, e.amp_filter[o] = h * u
                }
            }

            function R(t) {
                var e = t.internal_flags;
                switch (t.quality) {
                    default:
                        case 9:
                        e.psymodel = 0,
                    e.noise_shaping = 0,
                    e.noise_shaping_amp = 0,
                    e.noise_shaping_stop = 0,
                    e.use_best_huffman = 0,
                    e.full_outer_loop = 0;
                    break;
                    case 8:
                            t.quality = 7;
                    case 7:
                            e.psymodel = 1,
                        e.noise_shaping = 0,
                        e.noise_shaping_amp = 0,
                        e.noise_shaping_stop = 0,
                        e.use_best_huffman = 0,
                        e.full_outer_loop = 0;
                        break;
                    case 6:
                            case 5:
                            e.psymodel = 1,
                        0 == e.noise_shaping && (e.noise_shaping = 1),
                        e.noise_shaping_amp = 0,
                        e.noise_shaping_stop = 0,
                        -1 == e.subblock_gain && (e.subblock_gain = 1),
                        e.use_best_huffman = 0,
                        e.full_outer_loop = 0;
                        break;
                    case 4:
                            e.psymodel = 1,
                        0 == e.noise_shaping && (e.noise_shaping = 1),
                        e.noise_shaping_amp = 0,
                        e.noise_shaping_stop = 0,
                        -1 == e.subblock_gain && (e.subblock_gain = 1),
                        e.use_best_huffman = 1,
                        e.full_outer_loop = 0;
                        break;
                    case 3:
                            e.psymodel = 1,
                        0 == e.noise_shaping && (e.noise_shaping = 1),
                        e.noise_shaping_amp = 1,
                        e.noise_shaping_stop = 1,
                        -1 == e.subblock_gain && (e.subblock_gain = 1),
                        e.use_best_huffman = 1,
                        e.full_outer_loop = 0;
                        break;
                    case 2:
                            e.psymodel = 1,
                        0 == e.noise_shaping && (e.noise_shaping = 1),
                        0 == e.substep_shaping && (e.substep_shaping = 2),
                        e.noise_shaping_amp = 1,
                        e.noise_shaping_stop = 1,
                        -1 == e.subblock_gain && (e.subblock_gain = 1),
                        e.use_best_huffman = 1,
                        e.full_outer_loop = 0;
                        break;
                    case 1:
                            case 0:
                            e.psymodel = 1,
                        0 == e.noise_shaping && (e.noise_shaping = 1),
                        0 == e.substep_shaping && (e.substep_shaping = 2),
                        e.noise_shaping_amp = 2,
                        e.noise_shaping_stop = 1,
                        -1 == e.subblock_gain && (e.subblock_gain = 1),
                        e.use_best_huffman = 1,
                        e.full_outer_loop = 0
                }
            }

            function O(t) {
                var e = t.internal_flags;
                t.frameNum = 0, t.write_id3tag_automatic && W.id3tag_write_v2(t), e.bitrate_stereoMode_Hist = h([16, 5]), e.bitrate_blockType_Hist = h([16, 6]), e.PeakSample = 0, t.bWriteVbrTag && Y.InitVbrTag(t)
            }

            function E(t, e) {
                (null == t.in_buffer_0 || t.in_buffer_nsamples < e) && (t.in_buffer_0 = l(e), t.in_buffer_1 = l(e), t.in_buffer_nsamples = e)
            }

            function P(t) {
                var e = g.BLKSIZE + t.framesize - g.FFTOFFSET;
                return e = Math.max(e, 512 + t.framesize - 32), c(_.MFSIZE >= e), e
            }

            function B(t, e, i, n, s, r, o) {
                var a, l, h, u, p, f = t.internal_flags,
                    d = 0,
                    m = [null, null],
                    y = [null, null];
                if (f.Class_ID != K) return -3;
                if (0 == n) return 0;
                if ((p = U.copy_buffer(f, s, r, o, 0)) < 0) return p;
                if (r += p, d += p, y[0] = e, y[1] = i, v.NEQ(t.scale, 0) && v.NEQ(t.scale, 1))
                    for (l = 0; l < n; ++l) y[0][l] *= t.scale, 2 == f.channels_out && (y[1][l] *= t.scale);
                if (v.NEQ(t.scale_left, 0) && v.NEQ(t.scale_left, 1))
                    for (l = 0; l < n; ++l) y[0][l] *= t.scale_left;
                if (v.NEQ(t.scale_right, 0) && v.NEQ(t.scale_right, 1))
                    for (l = 0; l < n; ++l) y[1][l] *= t.scale_right;
                if (2 == t.num_channels && 1 == f.channels_out)
                    for (l = 0; l < n; ++l) y[0][l] = .5 * (y[0][l] + y[1][l]), y[1][l] = 0;
                u = P(t), m[0] = f.mfbuf[0], m[1] = f.mfbuf[1];
                for (var b = 0; n > 0;) {
                    var S = [null, null],
                        w = 0,
                        A = 0;
                    S[0] = y[0], S[1] = y[1];
                    var T = new F;
                    if (N(t, m, S, b, n, T), w = T.n_in, A = T.n_out, f.findReplayGain && !f.decode_on_the_fly && V.AnalyzeSamples(f.rgdata, m[0], f.mf_size, m[1], f.mf_size, A, f.channels_out) == GainAnalysis.GAIN_ANALYSIS_ERROR) return -6;
                    if (n -= w, b += w, f.channels_out, f.mf_size += A, c(f.mf_size <= _.MFSIZE), f.mf_samples_to_encode < 1 && (f.mf_samples_to_encode = g.ENCDELAY + g.POSTDELAY), f.mf_samples_to_encode += A, f.mf_size >= u) {
                        var x = o - d;
                        if (0 == o && (x = 0), (a = C(t, m[0], m[1], s, r, x)) < 0) return a;
                        for (r += a, d += a, f.mf_size -= t.framesize, f.mf_samples_to_encode -= t.framesize, h = 0; h < f.channels_out; h++)
                            for (l = 0; l < f.mf_size; l++) m[h][l] = m[h][l + t.framesize]
                    }
                }
                return c(0 == n), d
            }

            function C(t, e, i, n, s, r) {
                var o = D.enc.lame_encode_mp3_frame(t, e, i, n, s, r);
                return t.frameNum++, o
            }

            function F() {
                this.n_in = 0, this.n_out = 0
            }

            function q() {
                this.num_used = 0
            }

            function j(t, e) {
                return 0 != e ? j(e, t % e) : t
            }

            function L(t, e, i) {
                var n = Math.PI * e;
                t /= i, t < 0 && (t = 0), t > 1 && (t = 1);
                var s = t - .5,
                    r = .42 - .5 * Math.cos(2 * t * Math.PI) + .08 * Math.cos(4 * t * Math.PI);
                return Math.abs(s) < 1e-9 ? n / Math.PI : r * Math.sin(i * n * s) / (Math.PI * i * s)
            }

            function I(t, e, i, n, s, r, o, a, h) {
                var u, p, f = t.internal_flags,
                    d = 0,
                    m = t.out_samplerate / j(t.out_samplerate, t.in_samplerate);
                m > _.BPC && (m = _.BPC);
                var y = Math.abs(f.resample_ratio - Math.floor(.5 + f.resample_ratio)) < 1e-4 ? 1 : 0,
                    v = 1 / f.resample_ratio;
                v > 1 && (v = 1);
                var b = 31;
                0 == b % 2 && --b, b += y;
                var g = b + 1;
                if (0 == f.fill_buffer_resample_init) {
                    for (f.inbuf_old[0] = l(g), f.inbuf_old[1] = l(g), u = 0; u <= 2 * m; ++u) f.blackfilt[u] = l(g);
                    for (f.itime[0] = 0, f.itime[1] = 0, d = 0; d <= 2 * m; d++) {
                        var S = 0,
                            w = (d - m) / (2 * m);
                        for (u = 0; u <= b; u++) S += f.blackfilt[d][u] = L(u - w, v, b);
                        for (u = 0; u <= b; u++) f.blackfilt[d][u] /= S
                    }
                    f.fill_buffer_resample_init = 1
                }
                var A = f.inbuf_old[h];
                for (p = 0; p < n; p++) {
                    var T, x;
                    if (T = p * f.resample_ratio, d = 0 | Math.floor(T - f.itime[h]), b + d - b / 2 >= o) break;
                    var w = T - f.itime[h] - (d + b % 2 * .5);
                    c(Math.abs(w) <= .501), x = 0 | Math.floor(2 * w * m + m + .5);
                    var M = 0;
                    for (u = 0; u <= b; ++u) {
                        var k, R = u + d - b / 2;
                        c(R < o), c(R + g >= 0), k = R < 0 ? A[g + R] : s[r + R], M += k * f.blackfilt[x][u]
                    }
                    e[i + p] = M
                }
                if (a.num_used = Math.min(o, b + d - b / 2), f.itime[h] += a.num_used - p * f.resample_ratio, a.num_used >= g)
                    for (u = 0; u < g; u++) A[u] = s[r + a.num_used + u - g];
                else {
                    var O = g - a.num_used;
                    for (u = 0; u < O; ++u) A[u] = A[u + a.num_used];
                    for (d = 0; u < g; ++u, ++d) A[u] = s[r + d];
                    c(d == a.num_used)
                }
                return p
            }

            function N(t, e, i, n, s, r) {
                var o = t.internal_flags;
                if (o.resample_ratio < .9999 || o.resample_ratio > 1.0001)
                    for (var a = 0; a < o.channels_out; a++) {
                        var l = new q;
                        r.n_out = I(t, e[a], o.mf_size, t.framesize, i[a], n, s, l, a), r.n_in = l.num_used
                    } else {
                        r.n_out = Math.min(t.framesize, s), r.n_in = r.n_out;
                        for (var h = 0; h < r.n_out; ++h) e[0][o.mf_size + h] = i[0][n + h], 2 == o.channels_out && (e[1][o.mf_size + h] = i[1][n + h])
                    }
            }
            var D = this;
            n.V9 = 410, n.V8 = 420, n.V7 = 430, n.V6 = 440, n.V5 = 450, n.V4 = 460, n.V3 = 470, n.V2 = 480, n.V1 = 490, n.V0 = 500, n.R3MIX = 1e3, n.STANDARD = 1001, n.EXTREME = 1002, n.INSANE = 1003, n.STANDARD_FAST = 1004, n.EXTREME_FAST = 1005, n.MEDIUM = 1006, n.MEDIUM_FAST = 1007;
            n.LAME_MAXMP3BUFFER = 147456;
            var V, U, G, H, X, Y, z, W, Q, Z = new p;
            this.enc = new g, this.setModules = function(t, e, i, n, s, r, o, a, l) {
                V = t, U = e, G = i, H = n, X = s, Y = r, z = o, W = a, Q = l, this.enc.setModules(U, Z, H, Y)
            };
            var K = 4294479419;
            this.lame_init = function() {
                var t = new f;
                return 0 != s(t) ? null : (t.lame_allocated_gfp = 1, t)
            }, this.nearestBitrateFullIndex = function(t) {
                var e = [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
                    i = 0,
                    n = 0,
                    s = 0,
                    r = 0;
                r = e[16], s = 16, n = e[16], i = 16;
                for (var o = 0; o < 16; o++)
                    if (Math.max(t, e[o + 1]) != t) {
                        r = e[o + 1], s = o + 1, n = e[o], i = o;
                        break
                    }
                return r - t > t - n ? i : s
            }, this.lame_init_params = function(i) {
                var n = i.internal_flags;
                if (n.Class_ID = 0, null == n.ATH && (n.ATH = new d), null == n.PSY && (n.PSY = new t), null == n.rgdata && (n.rgdata = new m), n.channels_in = i.num_channels, 1 == n.channels_in && (i.mode = MPEGMode.MONO), n.channels_out = i.mode == MPEGMode.MONO ? 1 : 2, n.mode_ext = g.MPG_MD_MS_LR, i.mode == MPEGMode.MONO && (i.force_ms = !1), i.VBR == o.vbr_off && 128 != i.VBR_mean_bitrate_kbps && 0 == i.brate && (i.brate = i.VBR_mean_bitrate_kbps), i.VBR == o.vbr_off || i.VBR == o.vbr_mtrh || i.VBR == o.vbr_mt || (i.free_format = !1), i.VBR == o.vbr_off && 0 == i.brate && v.EQ(i.compression_ratio, 0) && (i.compression_ratio = 11.025), i.VBR == o.vbr_off && i.compression_ratio > 0 && (0 == i.out_samplerate && (i.out_samplerate = map2MP3Frequency(int(.97 * i.in_samplerate))), i.brate = 0 | 16 * i.out_samplerate * n.channels_out / (1e3 * i.compression_ratio), n.samplerate_index = A(i.out_samplerate, i), i.free_format || (i.brate = T(i.brate, i.version, i.out_samplerate))), 0 != i.out_samplerate && (i.out_samplerate < 16e3 ? (i.VBR_mean_bitrate_kbps = Math.max(i.VBR_mean_bitrate_kbps, 8), i.VBR_mean_bitrate_kbps = Math.min(i.VBR_mean_bitrate_kbps, 64)) : i.out_samplerate < 32e3 ? (i.VBR_mean_bitrate_kbps = Math.max(i.VBR_mean_bitrate_kbps, 8), i.VBR_mean_bitrate_kbps = Math.min(i.VBR_mean_bitrate_kbps, 160)) : (i.VBR_mean_bitrate_kbps = Math.max(i.VBR_mean_bitrate_kbps, 32), i.VBR_mean_bitrate_kbps = Math.min(i.VBR_mean_bitrate_kbps, 320))), 0 == i.lowpassfreq) {
                    var s = 16e3;
                    switch (i.VBR) {
                        case o.vbr_off:
                            var r = new e;
                            M(r, i.brate), s = r.lowerlimit;
                            break;
                        case o.vbr_abr:
                            var r = new e;
                            M(r, i.VBR_mean_bitrate_kbps), s = r.lowerlimit;
                            break;
                        case o.vbr_rh:
                            var l = [19500, 19e3, 18600, 18e3, 17500, 16e3, 15600, 14900, 12500, 1e4, 3950];
                            if (0 <= i.VBR_q && i.VBR_q <= 9) {
                                var h = l[i.VBR_q],
                                    u = l[i.VBR_q + 1],
                                    f = i.VBR_q_frac;
                                s = linear_int(h, u, f)
                            } else s = 19500;
                            break;
                        default:
                            var l = [19500, 19e3, 18500, 18e3, 17500, 16500, 15500, 14500, 12500, 9500, 3950];
                            if (0 <= i.VBR_q && i.VBR_q <= 9) {
                                var h = l[i.VBR_q],
                                    u = l[i.VBR_q + 1],
                                    f = i.VBR_q_frac;
                                s = linear_int(h, u, f)
                            } else s = 19500
                    }
                    i.mode != MPEGMode.MONO || i.VBR != o.vbr_off && i.VBR != o.vbr_abr || (s *= 1.5), i.lowpassfreq = 0 | s
                }
                if (0 == i.out_samplerate && (2 * i.lowpassfreq > i.in_samplerate && (i.lowpassfreq = i.in_samplerate / 2), i.out_samplerate = w(0 | i.lowpassfreq, i.in_samplerate)), i.lowpassfreq = Math.min(20500, i.lowpassfreq), i.lowpassfreq = Math.min(i.out_samplerate / 2, i.lowpassfreq), i.VBR == o.vbr_off && (i.compression_ratio = 16 * i.out_samplerate * n.channels_out / (1e3 * i.brate)), i.VBR == o.vbr_abr && (i.compression_ratio = 16 * i.out_samplerate * n.channels_out / (1e3 * i.VBR_mean_bitrate_kbps)), i.bWriteVbrTag || (i.findReplayGain = !1, i.decode_on_the_fly = !1, n.findPeakSample = !1), n.findReplayGain = i.findReplayGain, n.decode_on_the_fly = i.decode_on_the_fly, n.decode_on_the_fly && (n.findPeakSample = !0), n.findReplayGain && V.InitGainAnalysis(n.rgdata, i.out_samplerate) == GainAnalysis.INIT_GAIN_ANALYSIS_ERROR) return i.internal_flags = null, -6;
                switch (n.decode_on_the_fly && !i.decode_only && (null != n.hip && Q.hip_decode_exit(n.hip), n.hip = Q.hip_decode_init()), n.mode_gr = i.out_samplerate <= 24e3 ? 1 : 2, i.framesize = 576 * n.mode_gr, i.encoder_delay = g.ENCDELAY, n.resample_ratio = i.in_samplerate / i.out_samplerate, i.VBR) {
                    case o.vbr_mt:
                    case o.vbr_rh:
                    case o.vbr_mtrh:
                        var _ = [5.7, 6.5, 7.3, 8.2, 10, 11.9, 13, 14, 15, 16.5];
                        i.compression_ratio = _[i.VBR_q];
                        break;
                    case o.vbr_abr:
                        i.compression_ratio = 16 * i.out_samplerate * n.channels_out / (1e3 * i.VBR_mean_bitrate_kbps);
                        break;
                    default:
                        i.compression_ratio = 16 * i.out_samplerate * n.channels_out / (1e3 * i.brate)
                }
                if (i.mode == MPEGMode.NOT_SET && (i.mode = MPEGMode.JOINT_STEREO), i.highpassfreq > 0 ? (n.highpass1 = 2 * i.highpassfreq, i.highpasswidth >= 0 ? n.highpass2 = 2 * (i.highpassfreq + i.highpasswidth) : n.highpass2 = 2 * i.highpassfreq, n.highpass1 /= i.out_samplerate, n.highpass2 /= i.out_samplerate) : (n.highpass1 = 0, n.highpass2 = 0), i.lowpassfreq > 0 ? (n.lowpass2 = 2 * i.lowpassfreq, i.lowpasswidth >= 0 ? (n.lowpass1 = 2 * (i.lowpassfreq - i.lowpasswidth), n.lowpass1 < 0 && (n.lowpass1 = 0)) : n.lowpass1 = 2 * i.lowpassfreq, n.lowpass1 /= i.out_samplerate, n.lowpass2 /= i.out_samplerate) : (n.lowpass1 = 0, n.lowpass2 = 0), k(i), n.samplerate_index = A(i.out_samplerate, i), n.samplerate_index < 0) return i.internal_flags = null, -1;
                if (i.VBR == o.vbr_off) {
                    if (i.free_format) n.bitrate_index = 0;
                    else if (i.brate = T(i.brate, i.version, i.out_samplerate), n.bitrate_index = x(i.brate, i.version, i.out_samplerate), n.bitrate_index <= 0) return i.internal_flags = null, -1
                } else n.bitrate_index = 1;
                i.analysis && (i.bWriteVbrTag = !1), null != n.pinfo && (i.bWriteVbrTag = !1), U.init_bit_stream_w(n);
                for (var S = n.samplerate_index + 3 * i.version + 6 * (i.out_samplerate < 16e3 ? 1 : 0), E = 0; E < g.SBMAX_l + 1; E++) n.scalefac_band.l[E] = H.sfBandIndex[S].l[E];
                for (var E = 0; E < g.PSFB21 + 1; E++) {
                    var P = (n.scalefac_band.l[22] - n.scalefac_band.l[21]) / g.PSFB21,
                        B = n.scalefac_band.l[21] + E * P;
                    n.scalefac_band.psfb21[E] = B
                }
                n.scalefac_band.psfb21[g.PSFB21] = 576;
                for (var E = 0; E < g.SBMAX_s + 1; E++) n.scalefac_band.s[E] = H.sfBandIndex[S].s[E];
                for (var E = 0; E < g.PSFB12 + 1; E++) {
                    var P = (n.scalefac_band.s[13] - n.scalefac_band.s[12]) / g.PSFB12,
                        B = n.scalefac_band.s[12] + E * P;
                    n.scalefac_band.psfb12[E] = B
                }
                n.scalefac_band.psfb12[g.PSFB12] = 192, 1 == i.version ? n.sideinfo_len = 1 == n.channels_out ? 21 : 36 : n.sideinfo_len = 1 == n.channels_out ? 13 : 21, i.error_protection && (n.sideinfo_len += 2), O(i), n.Class_ID = K;
                var C;
                for (C = 0; C < 19; C++) n.nsPsy.pefirbuf[C] = 700 * n.mode_gr * n.channels_out;
                switch (-1 == i.ATHtype && (i.ATHtype = 4), c(i.VBR_q <= 9), c(i.VBR_q >= 0), i.VBR) {
                    case o.vbr_mt:
                        i.VBR = o.vbr_mtrh;
                    case o.vbr_mtrh:
                        null == i.useTemporal && (i.useTemporal = !1), G.apply_preset(i, 500 - 10 * i.VBR_q, 0), i.quality < 0 && (i.quality = LAME_DEFAULT_QUALITY), i.quality < 5 && (i.quality = 0), i.quality > 5 && (i.quality = 5), n.PSY.mask_adjust = i.maskingadjust, n.PSY.mask_adjust_short = i.maskingadjust_short, i.experimentalY ? n.sfb21_extra = !1 : n.sfb21_extra = i.out_samplerate > 44e3, n.iteration_loop = new VBRNewIterationLoop(X);
                        break;
                    case o.vbr_rh:
                        G.apply_preset(i, 500 - 10 * i.VBR_q, 0), n.PSY.mask_adjust = i.maskingadjust, n.PSY.mask_adjust_short = i.maskingadjust_short, i.experimentalY ? n.sfb21_extra = !1 : n.sfb21_extra = i.out_samplerate > 44e3, i.quality > 6 && (i.quality = 6), i.quality < 0 && (i.quality = LAME_DEFAULT_QUALITY), n.iteration_loop = new VBROldIterationLoop(X);
                        break;
                    default:
                        var F;
                        n.sfb21_extra = !1, i.quality < 0 && (i.quality = LAME_DEFAULT_QUALITY), F = i.VBR, F == o.vbr_off && (i.VBR_mean_bitrate_kbps = i.brate), G.apply_preset(i, i.VBR_mean_bitrate_kbps, 0), i.VBR = F, n.PSY.mask_adjust = i.maskingadjust, n.PSY.mask_adjust_short = i.maskingadjust_short, F == o.vbr_off ? n.iteration_loop = new y(X) : n.iteration_loop = new ABRIterationLoop(X)
                }
                if (c(i.scale >= 0), i.VBR != o.vbr_off) {
                    if (n.VBR_min_bitrate = 1, n.VBR_max_bitrate = 14, i.out_samplerate < 16e3 && (n.VBR_max_bitrate = 8), 0 != i.VBR_min_bitrate_kbps && (i.VBR_min_bitrate_kbps = T(i.VBR_min_bitrate_kbps, i.version, i.out_samplerate), n.VBR_min_bitrate = x(i.VBR_min_bitrate_kbps, i.version, i.out_samplerate), n.VBR_min_bitrate < 0)) return -1;
                    if (0 != i.VBR_max_bitrate_kbps && (i.VBR_max_bitrate_kbps = T(i.VBR_max_bitrate_kbps, i.version, i.out_samplerate), n.VBR_max_bitrate = x(i.VBR_max_bitrate_kbps, i.version, i.out_samplerate), n.VBR_max_bitrate < 0)) return -1;
                    i.VBR_min_bitrate_kbps = b.bitrate_table[i.version][n.VBR_min_bitrate], i.VBR_max_bitrate_kbps = b.bitrate_table[i.version][n.VBR_max_bitrate], i.VBR_mean_bitrate_kbps = Math.min(b.bitrate_table[i.version][n.VBR_max_bitrate], i.VBR_mean_bitrate_kbps), i.VBR_mean_bitrate_kbps = Math.max(b.bitrate_table[i.version][n.VBR_min_bitrate], i.VBR_mean_bitrate_kbps)
                }
                return i.tune && (n.PSY.mask_adjust += i.tune_value_a, n.PSY.mask_adjust_short += i.tune_value_a), R(i), c(i.scale >= 0), i.athaa_type < 0 ? n.ATH.useAdjust = 3 : n.ATH.useAdjust = i.athaa_type, n.ATH.aaSensitivityP = Math.pow(10, i.athaa_sensitivity / -10), null == i.short_blocks && (i.short_blocks = a.short_block_allowed), i.short_blocks != a.short_block_allowed || i.mode != MPEGMode.JOINT_STEREO && i.mode != MPEGMode.STEREO || (i.short_blocks = a.short_block_coupled), i.quant_comp < 0 && (i.quant_comp = 1), i.quant_comp_short < 0 && (i.quant_comp_short = 0), i.msfix < 0 && (i.msfix = 0), i.exp_nspsytune = 1 | i.exp_nspsytune, i.internal_flags.nsPsy.attackthre < 0 && (i.internal_flags.nsPsy.attackthre = p.NSATTACKTHRE), i.internal_flags.nsPsy.attackthre_s < 0 && (i.internal_flags.nsPsy.attackthre_s = p.NSATTACKTHRE_S), c(i.scale >= 0), i.scale < 0 && (i.scale = 1), i.ATHtype < 0 && (i.ATHtype = 4), i.ATHcurve < 0 && (i.ATHcurve = 4), i.athaa_loudapprox < 0 && (i.athaa_loudapprox = 2), i.interChRatio < 0 && (i.interChRatio = 0), null == i.useTemporal && (i.useTemporal = !0), n.slot_lag = n.frac_SpF = 0, i.VBR == o.vbr_off && (n.slot_lag = n.frac_SpF = 72e3 * (i.version + 1) * i.brate % i.out_samplerate | 0), H.iteration_init(i), Z.psymodel_init(i), c(i.scale >= 0), 0
            }, this.lame_encode_flush = function(t, e, i, n) {
                var s, r, o, a, l = t.internal_flags,
                    h = u([2, 1152]),
                    c = 0,
                    p = l.mf_samples_to_encode - g.POSTDELAY,
                    f = P(t);
                if (l.mf_samples_to_encode < 1) return 0;
                for (s = 0, t.in_samplerate != t.out_samplerate && (p += 16 * t.out_samplerate / t.in_samplerate), o = t.framesize - p % t.framesize, o < 576 && (o += t.framesize), t.encoder_padding = o, a = (p + o) / t.framesize; a > 0 && c >= 0;) {
                    var _ = f - l.mf_size,
                        d = t.frameNum;
                    _ *= t.in_samplerate, _ /= t.out_samplerate, _ > 1152 && (_ = 1152), _ < 1 && (_ = 1), r = n - s, 0 == n && (r = 0), c = this.lame_encode_buffer(t, h[0], h[1], _, e, i, r), i += c, s += c, a -= d != t.frameNum ? 1 : 0
                }
                if (l.mf_samples_to_encode = 0, c < 0) return c;
                if (r = n - s, 0 == n && (r = 0), U.flush_bitstream(t), (c = U.copy_buffer(l, e, i, r, 1)) < 0) return c;
                if (i += c, s += c, r = n - s, 0 == n && (r = 0), t.write_id3tag_automatic) {
                    if (W.id3tag_write_v1(t), (c = U.copy_buffer(l, e, i, r, 0)) < 0) return c;
                    s += c
                }
                return s
            }, this.lame_encode_buffer = function(t, e, i, n, s, r, o) {
                var a = t.internal_flags,
                    l = [null, null];
                if (a.Class_ID != K) return -3;
                if (0 == n) return 0;
                E(a, n), l[0] = a.in_buffer_0, l[1] = a.in_buffer_1;
                for (var h = 0; h < n; h++) l[0][h] = e[h], a.channels_in > 1 && (l[1][h] = i[h]);
                return B(t, l[0], l[1], n, s, r, o)
            }
        }
        var s = i(384),
            r = s.System,
            o = s.VbrMode,
            a = (s.Float, s.ShortBlock),
            l = (s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            h = (s.new_float_n, s.new_int, s.new_int_n),
            u = s.new_short_n,
            c = s.assert,
            p = i(490),
            f = i(486),
            _ = i(428),
            d = i(478),
            m = i(492),
            y = i(479),
            v = i(439),
            b = i(432),
            g = i(388);
        t.exports = n
    },
    486: function(t, e, i) {
        function n() {
            this.class_id = 0, this.num_samples = 0, this.num_channels = 0, this.in_samplerate = 0, this.out_samplerate = 0, this.scale = 0, this.scale_left = 0, this.scale_right = 0, this.analysis = !1, this.bWriteVbrTag = !1, this.decode_only = !1, this.quality = 0, this.mode = s.STEREO, this.force_ms = !1, this.free_format = !1, this.findReplayGain = !1, this.decode_on_the_fly = !1, this.write_id3tag_automatic = !1, this.brate = 0, this.compression_ratio = 0, this.copyright = 0, this.original = 0, this.extension = 0, this.emphasis = 0, this.error_protection = 0, this.strict_ISO = !1, this.disable_reservoir = !1, this.quant_comp = 0, this.quant_comp_short = 0, this.experimentalY = !1, this.experimentalZ = 0, this.exp_nspsytune = 0, this.preset = 0, this.VBR = null, this.VBR_q_frac = 0, this.VBR_q = 0, this.VBR_mean_bitrate_kbps = 0, this.VBR_min_bitrate_kbps = 0, this.VBR_max_bitrate_kbps = 0, this.VBR_hard_min = 0, this.lowpassfreq = 0, this.highpassfreq = 0, this.lowpasswidth = 0, this.highpasswidth = 0, this.maskingadjust = 0, this.maskingadjust_short = 0, this.ATHonly = !1, this.ATHshort = !1, this.noATH = !1, this.ATHtype = 0, this.ATHcurve = 0, this.ATHlower = 0, this.athaa_type = 0, this.athaa_loudapprox = 0, this.athaa_sensitivity = 0, this.short_blocks = null, this.useTemporal = !1, this.interChRatio = 0, this.msfix = 0, this.tune = !1, this.tune_value_a = 0, this.version = 0, this.encoder_delay = 0, this.encoder_padding = 0, this.framesize = 0, this.frameNum = 0, this.lame_allocated_gfp = 0, this.internal_flags = null
        }
        var s = i(442);
        t.exports = n
    },
    487: function(t, e, i) {
        function n() {
            function t(t, e, i) {
                for (var s = 10, r = e + 238 - 14 - 286, a = -15; a < 0; a++) {
                    var l, h, u;
                    l = n[s + -10], h = t[r + -224] * l, u = t[e + 224] * l, l = n[s + -9], h += t[r + -160] * l, u += t[e + 160] * l, l = n[s + -8], h += t[r + -96] * l, u += t[e + 96] * l, l = n[s + -7], h += t[r + -32] * l, u += t[e + 32] * l, l = n[s + -6], h += t[r + 32] * l, u += t[e + -32] * l, l = n[s + -5], h += t[r + 96] * l, u += t[e + -96] * l, l = n[s + -4], h += t[r + 160] * l, u += t[e + -160] * l, l = n[s + -3], h += t[r + 224] * l, u += t[e + -224] * l, l = n[s + -2], h += t[e + -256] * l, u -= t[r + 256] * l, l = n[s + -1], h += t[e + -192] * l, u -= t[r + 192] * l, l = n[s + 0], h += t[e + -128] * l, u -= t[r + 128] * l, l = n[s + 1], h += t[e + -64] * l, u -= t[r + 64] * l, l = n[s + 2], h += t[e + 0] * l, u -= t[r + 0] * l, l = n[s + 3], h += t[e + 64] * l, u -= t[r + -64] * l, l = n[s + 4], h += t[e + 128] * l, u -= t[r + -128] * l, l = n[s + 5], h += t[e + 192] * l, u -= t[r + -192] * l, h *= n[s + 6], l = u - h, i[30 + 2 * a] = u + h, i[31 + 2 * a] = n[s + 7] * l, s += 18, e--, r++
                }
                var h, u, c, p;
                u = t[e + -16] * n[s + -10], h = t[e + -32] * n[s + -2], u += (t[e + -48] - t[e + 16]) * n[s + -9], h += t[e + -96] * n[s + -1], u += (t[e + -80] + t[e + 48]) * n[s + -8], h += t[e + -160] * n[s + 0], u += (t[e + -112] - t[e + 80]) * n[s + -7], h += t[e + -224] * n[s + 1], u += (t[e + -144] + t[e + 112]) * n[s + -6], h -= t[e + 32] * n[s + 2], u += (t[e + -176] - t[e + 144]) * n[s + -5], h -= t[e + 96] * n[s + 3], u += (t[e + -208] + t[e + 176]) * n[s + -4], h -= t[e + 160] * n[s + 4], u += (t[e + -240] - t[e + 208]) * n[s + -3], h -= t[e + 224], c = h - u, p = h + u, u = i[14], h = i[15] - u, i[31] = p + u, i[30] = c + h, i[15] = c - h, i[14] = p - u;
                var f;
                f = i[28] - i[0], i[0] += i[28], i[28] = f * n[s + -36 + 7], f = i[29] - i[1], i[1] += i[29], i[29] = f * n[s + -36 + 7], f = i[26] - i[2], i[2] += i[26], i[26] = f * n[s + -72 + 7], f = i[27] - i[3], i[3] += i[27], i[27] = f * n[s + -72 + 7], f = i[24] - i[4], i[4] += i[24], i[24] = f * n[s + -108 + 7], f = i[25] - i[5], i[5] += i[25], i[25] = f * n[s + -108 + 7], f = i[22] - i[6], i[6] += i[22], i[22] = f * o.SQRT2, f = i[23] - i[7], i[7] += i[23], i[23] = f * o.SQRT2 - i[7], i[7] -= i[6], i[22] -= i[7], i[23] -= i[22], f = i[6], i[6] = i[31] - f, i[31] = i[31] + f, f = i[7], i[7] = i[30] - f, i[30] = i[30] + f, f = i[22], i[22] = i[15] - f, i[15] = i[15] + f, f = i[23], i[23] = i[14] - f, i[14] = i[14] + f, f = i[20] - i[8], i[8] += i[20], i[20] = f * n[s + -180 + 7], f = i[21] - i[9], i[9] += i[21], i[21] = f * n[s + -180 + 7], f = i[18] - i[10], i[10] += i[18], i[18] = f * n[s + -216 + 7], f = i[19] - i[11], i[11] += i[19], i[19] = f * n[s + -216 + 7], f = i[16] - i[12], i[12] += i[16], i[16] = f * n[s + -252 + 7], f = i[17] - i[13], i[13] += i[17], i[17] = f * n[s + -252 + 7], f = -i[20] + i[24], i[20] += i[24], i[24] = f * n[s + -216 + 7], f = -i[21] + i[25], i[21] += i[25], i[25] = f * n[s + -216 + 7], f = i[4] - i[8], i[4] += i[8], i[8] = f * n[s + -216 + 7], f = i[5] - i[9], i[5] += i[9], i[9] = f * n[s + -216 + 7], f = i[0] - i[12], i[0] += i[12], i[12] = f * n[s + -72 + 7], f = i[1] - i[13], i[1] += i[13], i[13] = f * n[s + -72 + 7], f = i[16] - i[28], i[16] += i[28], i[28] = f * n[s + -72 + 7], f = -i[17] + i[29], i[17] += i[29], i[29] = f * n[s + -72 + 7], f = o.SQRT2 * (i[2] - i[10]), i[2] += i[10], i[10] = f, f = o.SQRT2 * (i[3] - i[11]), i[3] += i[11], i[11] = f, f = o.SQRT2 * (-i[18] + i[26]), i[18] += i[26], i[26] = f - i[18], f = o.SQRT2 * (-i[19] + i[27]), i[19] += i[27], i[27] = f - i[19], f = i[2], i[19] -= i[3], i[3] -= f, i[2] = i[31] - f, i[31] += f, f = i[3], i[11] -= i[19], i[18] -= f, i[3] = i[30] - f, i[30] += f, f = i[18], i[27] -= i[11], i[19] -= f, i[18] = i[15] - f, i[15] += f, f = i[19], i[10] -= f, i[19] = i[14] - f, i[14] += f, f = i[10], i[11] -= f, i[10] = i[23] - f, i[23] += f, f = i[11], i[26] -= f, i[11] = i[22] - f, i[22] += f, f = i[26], i[27] -= f, i[26] = i[7] - f, i[7] += f, f = i[27], i[27] = i[6] - f, i[6] += f, f = o.SQRT2 * (i[0] - i[4]), i[0] += i[4], i[4] = f, f = o.SQRT2 * (i[1] - i[5]), i[1] += i[5], i[5] = f, f = o.SQRT2 * (i[16] - i[20]), i[16] += i[20], i[20] = f, f = o.SQRT2 * (i[17] - i[21]), i[17] += i[21], i[21] = f, f = -o.SQRT2 * (i[8] - i[12]), i[8] += i[12], i[12] = f - i[8], f = -o.SQRT2 * (i[9] - i[13]), i[9] += i[13], i[13] = f - i[9], f = -o.SQRT2 * (i[25] - i[29]), i[25] += i[29], i[29] = f - i[25], f = -o.SQRT2 * (i[24] + i[28]), i[24] -= i[28], i[28] = f - i[24], f = i[24] - i[16], i[24] = f, f = i[20] - f, i[20] = f, f = i[28] - f, i[28] = f, f = i[25] - i[17], i[25] = f, f = i[21] - f, i[21] = f, f = i[29] - f, i[29] = f, f = i[17] - i[1], i[17] = f, f = i[9] - f, i[9] = f, f = i[25] - f, i[25] = f, f = i[5] - f, i[5] = f, f = i[21] - f, i[21] = f, f = i[13] - f, i[13] = f, f = i[29] - f, i[29] = f, f = i[1] - i[0], i[1] = f, f = i[16] - f, i[16] = f, f = i[17] - f, i[17] = f, f = i[8] - f, i[8] = f, f = i[9] - f, i[9] = f, f = i[24] - f, i[24] = f, f = i[25] - f, i[25] = f, f = i[4] - f, i[4] = f, f = i[5] - f, i[5] = f, f = i[20] - f, i[20] = f, f = i[21] - f, i[21] = f, f = i[12] - f;
                i[12] = f, f = i[13] - f, i[13] = f, f = i[28] - f, i[28] = f, f = i[29] - f, i[29] = f, f = i[0], i[0] += i[31], i[31] -= f, f = i[1], i[1] += i[30], i[30] -= f, f = i[16], i[16] += i[15], i[15] -= f, f = i[17], i[17] += i[14], i[14] -= f, f = i[8], i[8] += i[23], i[23] -= f, f = i[9], i[9] += i[22], i[22] -= f, f = i[24], i[24] += i[7], i[7] -= f, f = i[25], i[25] += i[6], i[6] -= f, f = i[4], i[4] += i[27], i[27] -= f, f = i[5], i[5] += i[26], i[26] -= f, f = i[20], i[20] += i[11], i[11] -= f, f = i[21], i[21] += i[10], i[10] -= f, f = i[12], i[12] += i[19], i[19] -= f, f = i[13], i[13] += i[18], i[18] -= f, f = i[28], i[28] += i[3], i[3] -= f, f = i[29], i[29] += i[2], i[2] -= f
            }

            function e(t, e) {
                for (var i = 0; i < 3; i++) {
                    var n, r, o, a, l, u;
                    a = t[e + 6] * s[h.SHORT_TYPE][0] - t[e + 15], n = t[e + 0] * s[h.SHORT_TYPE][2] - t[e + 9], r = a + n, o = a - n, a = t[e + 15] * s[h.SHORT_TYPE][0] + t[e + 6], n = t[e + 9] * s[h.SHORT_TYPE][2] + t[e + 0], l = a + n, u = -a + n, n = 2.069978111953089e-11 * (t[e + 3] * s[h.SHORT_TYPE][1] - t[e + 12]), a = 2.069978111953089e-11 * (t[e + 12] * s[h.SHORT_TYPE][1] + t[e + 3]), t[e + 0] = 1.90752519173728e-11 * r + n, t[e + 15] = 1.90752519173728e-11 * -l + a, o = .8660254037844387 * o * 1.907525191737281e-11, l = .5 * l * 1.907525191737281e-11 + a, t[e + 3] = o - l, t[e + 6] = o + l, r = .5 * r * 1.907525191737281e-11 - n, u = .8660254037844387 * u * 1.907525191737281e-11, t[e + 9] = r + u, t[e + 12] = r - u, e++
                }
            }

            function i(t, e, i) {
                var n, s, r, o, a, l, h, u, p, f;
                r = i[17] - i[9], a = i[15] - i[11], l = i[14] - i[12], h = i[0] + i[8], u = i[1] + i[7], p = i[2] + i[6], f = i[3] + i[5], t[e + 17] = h + p - f - (u - i[4]), s = (h + p - f) * c[19] + (u - i[4]), n = (r - a - l) * c[18], t[e + 5] = n + s, t[e + 6] = n - s, o = (i[16] - i[10]) * c[18], u = u * c[19] + i[4], n = r * c[12] + o + a * c[13] + l * c[14], s = -h * c[16] + u - p * c[17] + f * c[15], t[e + 1] = n + s, t[e + 2] = n - s, n = r * c[13] - o - a * c[14] + l * c[12], s = -h * c[17] + u - p * c[15] + f * c[16], t[e + 9] = n + s, t[e + 10] = n - s, n = r * c[14] - o + a * c[12] - l * c[13], s = h * c[15] - u + p * c[16] - f * c[17], t[e + 13] = n + s, t[e + 14] = n - s;
                var _, d, m, y, v, b, g, S;
                _ = i[8] - i[0], m = i[6] - i[2], y = i[5] - i[3], v = i[17] + i[9], b = i[16] + i[10], g = i[15] + i[11], S = i[14] + i[12], t[e + 0] = v + g + S + (b + i[13]), n = (v + g + S) * c[19] - (b + i[13]), s = (_ - m + y) * c[18], t[e + 11] = n + s, t[e + 12] = n - s, d = (i[7] - i[1]) * c[18], b = i[13] - b * c[19], n = v * c[15] - b + g * c[16] + S * c[17], s = _ * c[14] + d + m * c[12] + y * c[13], t[e + 3] = n + s, t[e + 4] = n - s, n = -v * c[17] + b - g * c[15] - S * c[16], s = _ * c[13] + d - m * c[14] - y * c[12], t[e + 7] = n + s, t[e + 8] = n - s, n = -v * c[16] + b - g * c[17] - S * c[15], s = _ * c[12] - d + m * c[13] - y * c[14], t[e + 15] = n + s, t[e + 16] = n - s
            }
            var n = [-.1482523854003001, 32.308141959636465, 296.40344946382766, 883.1344870032432, 11113.947376231741, 1057.2713659324597, 305.7402417275812, 30.825928907280012, 3.8533188138216365, 59.42900443849514, 709.5899960123345, 5281.91112291017, -5829.66483675846, -817.6293103748613, -76.91656988279972, -4.594269939176596, .9063471690191471, .1960342806591213, -.15466694054279598, 34.324387823855965, 301.8067566458425, 817.599602898885, 11573.795901679885, 1181.2520595540152, 321.59731579894424, 31.232021761053772, 3.7107095756221318, 53.650946155329365, 684.167428119626, 5224.56624370173, -6366.391851890084, -908.9766368219582, -89.83068876699639, -5.411397422890401, .8206787908286602, .3901806440322567, -.16070888947830023, 36.147034243915876, 304.11815768187864, 732.7429163887613, 11989.60988270091, 1300.012278487897, 335.28490093152146, 31.48816102859945, 3.373875931311736, 47.232241542899175, 652.7371796173471, 5132.414255594984, -6909.087078780055, -1001.9990371107289, -103.62185754286375, -6.104916304710272, .7416505462720353, .5805693545089249, -.16636367662261495, 37.751650073343995, 303.01103387567713, 627.9747488785183, 12358.763425278165, 1412.2779918482834, 346.7496836825721, 31.598286663170416, 3.1598635433980946, 40.57878626349686, 616.1671130880391, 5007.833007176154, -7454.040671756168, -1095.7960341867115, -118.24411666465777, -6.818469345853504, .6681786379192989, .7653668647301797, -.1716176790982088, 39.11551877123304, 298.3413246578966, 503.5259106886539, 12679.589408408976, 1516.5821921214542, 355.9850766329023, 31.395241710249053, 2.9164211881972335, 33.79716964664243, 574.8943997801362, 4853.234992253242, -7997.57021486075, -1189.7624067269965, -133.6444792601766, -7.7202770609839915, .5993769336819237, .9427934736519954, -.17645823955292173, 40.21879108166477, 289.9982036694474, 359.3226160751053, 12950.259102786438, 1612.1013903507662, 362.85067106591504, 31.045922092242872, 2.822222032597987, 26.988862316190684, 529.8996541764288, 4671.371946949588, -8535.899136645805, -1282.5898586244496, -149.58553632943463, -8.643494270763135, .5345111359507916, 1.111140466039205, -.36174739330527045, 41.04429910497807, 277.5463268268618, 195.6386023135583, 13169.43812144731, 1697.6433561479398, 367.40983966190305, 30.557037410382826, 2.531473372857427, 20.070154905927314, 481.50208566532336, 4464.970341588308, -9065.36882077239, -1373.62841526722, -166.1660487028118, -9.58289321133207, .4729647758913199, 1.268786568327291, -.36970682634889585, 41.393213350082036, 261.2935935556502, 12.935476055240873, 13336.131683328815, 1772.508612059496, 369.76534388639965, 29.751323653701338, 2.4023193045459172, 13.304795348228817, 430.5615775526625, 4237.0568611071185, -9581.931701634761, -1461.6913552409758, -183.12733958476446, -10.718010163869403, .41421356237309503, 1.414213562373095, -.37677560326535325, 41.619486213528496, 241.05423794991074, -187.94665032361226, 13450.063605744153, 1836.153896465782, 369.4908799925761, 29.001847876923147, 2.0714759319987186, 6.779591200894186, 377.7767837205709, 3990.386575512536, -10081.709459700915, -1545.947424837898, -200.3762958015653, -11.864482073055006, .3578057213145241, 1.546020906725474, -.3829366947518991, 41.1516456456653, 216.47684307105183, -406.1569483347166, 13511.136535077321, 1887.8076599260432, 367.3025214564151, 28.136213436723654, 1.913880671464418, .3829366947518991, 323.85365704338597, 3728.1472257487526, -10561.233882199509, -1625.2025997821418, -217.62525175416, -13.015432208941645, .3033466836073424, 1.66293922460509, -.5822628872992417, 40.35639251440489, 188.20071124269245, -640.2706748618148, 13519.21490106562, 1927.6022433578062, 362.8197642637487, 26.968821921868447, 1.7463817695935329, -5.62650678237171, 269.3016715297017, 3453.386536448852, -11016.145278780888, -1698.6569643425091, -234.7658734267683, -14.16351421663124, .2504869601913055, 1.76384252869671, -.5887180101749253, 39.23429103868072, 155.76096234403798, -889.2492977967378, 13475.470561874661, 1955.0535223723712, 356.4450994756727, 25.894952980042156, 1.5695032905781554, -11.181939564328772, 214.80884394039484, 3169.1640829158237, -11443.321309975563, -1765.1588461316153, -251.68908574481912, -15.49755935939164, .198912367379658, 1.847759065022573, -.7912582233652842, 37.39369355329111, 119.699486012458, -1151.0956593239027, 13380.446257078214, 1970.3952110853447, 348.01959814116185, 24.731487364283044, 1.3850130831637748, -16.421408865300393, 161.05030052864092, 2878.3322807850063, -11838.991423510031, -1823.985884688674, -268.2854986386903, -16.81724543849939, .1483359875383474, 1.913880671464418, -.7960642926861912, 35.2322109610459, 80.01928065061526, -1424.0212633405113, 13235.794061869668, 1973.804052543835, 337.9908651258184, 23.289159354463873, 1.3934255946442087, -21.099669467133474, 108.48348407242611, 2583.700758091299, -12199.726194855148, -1874.2780658979746, -284.2467154529415, -18.11369784385905, .09849140335716425, 1.961570560806461, -.998795456205172, 32.56307803611191, 36.958364584370486, -1706.075448829146, 13043.287458812016, 1965.3831106103316, 326.43182772364605, 22.175018750622293, 1.198638339011324, -25.371248002043963, 57.53505923036915, 2288.41886619975, -12522.674544337233, -1914.8400385312243, -299.26241273417224, -19.37805630698734, .04912684976946725, 1.990369453344394, .035780907 * o.SQRT2 * .5 / 2384e-9, .017876148 * o.SQRT2 * .5 / 2384e-9, .003134727 * o.SQRT2 * .5 / 2384e-9, .002457142 * o.SQRT2 * .5 / 2384e-9, 971317e-9 * o.SQRT2 * .5 / 2384e-9, 218868e-9 * o.SQRT2 * .5 / 2384e-9, 101566e-9 * o.SQRT2 * .5 / 2384e-9, 13828e-9 * o.SQRT2 * .5 / 2384e-9, 12804.797818791945, 1945.5515939597317, 313.4244966442953, 49591e-9 / 2384e-9, 1995.1556208053692, 21458e-9 / 2384e-9, -69618e-9 / 2384e-9],
                s = [
                    [2.382191739347913e-13, 6.423305872147834e-13, 9.400849094049688e-13, 1.122435026096556e-12, 1.183840321267481e-12, 1.122435026096556e-12, 9.40084909404969e-13, 6.423305872147839e-13, 2.382191739347918e-13, 5.456116108943412e-12, 4.878985199565852e-12, 4.240448995017367e-12, 3.559909094758252e-12, 2.858043359288075e-12, 2.156177623817898e-12, 1.475637723558783e-12, 8.371015190102974e-13, 2.599706096327376e-13, -5.456116108943412e-12, -4.878985199565852e-12, -4.240448995017367e-12, -3.559909094758252e-12, -2.858043359288076e-12, -2.156177623817898e-12, -1.475637723558783e-12, -8.371015190102975e-13, -2.599706096327376e-13, -2.382191739347923e-13, -6.423305872147843e-13, -9.400849094049696e-13, -1.122435026096556e-12, -1.183840321267481e-12, -1.122435026096556e-12, -9.400849094049694e-13, -6.42330587214784e-13, -2.382191739347918e-13],
                    [2.382191739347913e-13, 6.423305872147834e-13, 9.400849094049688e-13, 1.122435026096556e-12, 1.183840321267481e-12, 1.122435026096556e-12, 9.400849094049688e-13, 6.423305872147841e-13, 2.382191739347918e-13, 5.456116108943413e-12, 4.878985199565852e-12, 4.240448995017367e-12, 3.559909094758253e-12, 2.858043359288075e-12, 2.156177623817898e-12, 1.475637723558782e-12, 8.371015190102975e-13, 2.599706096327376e-13, -5.461314069809755e-12, -4.921085770524055e-12, -4.343405037091838e-12, -3.732668368707687e-12, -3.093523840190885e-12, -2.430835727329465e-12, -1.734679010007751e-12, -9.74825365660928e-13, -2.797435120168326e-13, 0, 0, 0, 0, 0, 0, -2.283748241799531e-13, -4.037858874020686e-13, -2.146547464825323e-13],
                    [.1316524975873958, .414213562373095, .7673269879789602, 1.091308501069271, 1.303225372841206, 1.56968557711749, 1.920982126971166, 2.414213562373094, 3.171594802363212, 4.510708503662055, 7.595754112725146, 22.90376554843115, .984807753012208, .6427876096865394, .3420201433256688, .9396926207859084, -.1736481776669303, -.7660444431189779, .8660254037844387, .5, -.5144957554275265, -.4717319685649723, -.3133774542039019, -.1819131996109812, -.09457419252642064, -.04096558288530405, -.01419856857247115, -.003699974673760037, .8574929257125442, .8817419973177052, .9496286491027329, .9833145924917901, .9955178160675857, .9991605581781475, .999899195244447, .9999931550702802],
                    [0, 0, 0, 0, 0, 0, 2.283748241799531e-13, 4.037858874020686e-13, 2.146547464825323e-13, 5.461314069809755e-12, 4.921085770524055e-12, 4.343405037091838e-12, 3.732668368707687e-12, 3.093523840190885e-12, 2.430835727329466e-12, 1.734679010007751e-12, 9.74825365660928e-13, 2.797435120168326e-13, -5.456116108943413e-12, -4.878985199565852e-12, -4.240448995017367e-12, -3.559909094758253e-12, -2.858043359288075e-12, -2.156177623817898e-12, -1.475637723558782e-12, -8.371015190102975e-13, -2.599706096327376e-13, -2.382191739347913e-13, -6.423305872147834e-13, -9.400849094049688e-13, -1.122435026096556e-12, -1.183840321267481e-12, -1.122435026096556e-12, -9.400849094049688e-13, -6.423305872147841e-13, -2.382191739347918e-13]
                ],
                u = s[h.SHORT_TYPE],
                c = s[h.SHORT_TYPE],
                p = s[h.SHORT_TYPE],
                f = s[h.SHORT_TYPE],
                _ = [0, 1, 16, 17, 8, 9, 24, 25, 4, 5, 20, 21, 12, 13, 28, 29, 2, 3, 18, 19, 10, 11, 26, 27, 6, 7, 22, 23, 14, 15, 30, 31];
            this.mdct_sub48 = function(n, o, c) {
                for (var d = o, m = 286, y = 0; y < n.channels_out; y++) {
                    for (var v = 0; v < n.mode_gr; v++) {
                        for (var b, g = n.l3_side.tt[v][y], S = g.xr, w = 0, A = n.sb_sample[y][1 - v], T = 0, x = 0; x < 9; x++)
                            for (t(d, m, A[T]), t(d, m + 32, A[T + 1]), T += 2, m += 64, b = 1; b < 32; b += 2) A[T - 1][b] *= -1;
                        for (b = 0; b < 32; b++, w += 18) {
                            var M = g.block_type,
                                k = n.sb_sample[y][v],
                                R = n.sb_sample[y][1 - v];
                            if (0 != g.mixed_block_flag && b < 2 && (M = 0), n.amp_filter[b] < 1e-12) a.fill(S, w + 0, w + 18, 0);
                            else {
                                if (n.amp_filter[b] < 1)
                                    for (var x = 0; x < 18; x++) R[x][_[b]] *= n.amp_filter[b];
                                if (M == h.SHORT_TYPE) {
                                    for (var x = -3; x < 0; x++) {
                                        var O = s[h.SHORT_TYPE][x + 3];
                                        S[w + 3 * x + 9] = k[9 + x][_[b]] * O - k[8 - x][_[b]], S[w + 3 * x + 18] = k[14 - x][_[b]] * O + k[15 + x][_[b]], S[w + 3 * x + 10] = k[15 + x][_[b]] * O - k[14 - x][_[b]], S[w + 3 * x + 19] = R[2 - x][_[b]] * O + R[3 + x][_[b]], S[w + 3 * x + 11] = R[3 + x][_[b]] * O - R[2 - x][_[b]], S[w + 3 * x + 20] = R[8 - x][_[b]] * O + R[9 + x][_[b]]
                                    }
                                    e(S, w)
                                } else {
                                    for (var E = l(18), x = -9; x < 0; x++) {
                                        var P, B;
                                        P = s[M][x + 27] * R[x + 9][_[b]] + s[M][x + 36] * R[8 - x][_[b]], B = s[M][x + 9] * k[x + 9][_[b]] - s[M][x + 18] * k[8 - x][_[b]], E[x + 9] = P - B * u[3 + x + 9], E[x + 18] = P * u[3 + x + 9] + B
                                    }
                                    i(S, w, E)
                                }
                            }
                            if (M != h.SHORT_TYPE && 0 != b)
                                for (var x = 7; x >= 0; --x) {
                                    var C, F;
                                    C = S[w + x] * p[20 + x] + S[w + -1 - x] * f[28 + x], F = S[w + x] * f[28 + x] - S[w + -1 - x] * p[20 + x], S[w + -1 - x] = C, S[w + x] = F
                                }
                        }
                    }
                    if (d = c, m = 286, 1 == n.mode_gr)
                        for (var q = 0; q < 18; q++) r.arraycopy(n.sb_sample[y][1][q], 0, n.sb_sample[y][0][q], 0, 32)
                }
            }
        }
        var s = i(384),
            r = s.System,
            o = (s.VbrMode, s.Float, s.ShortBlock, s.Util),
            a = s.Arrays,
            l = (s.new_array_n, s.new_byte, s.new_double, s.new_float),
            h = (s.new_float_n, s.new_int, s.new_int_n, s.assert, i(388));
        t.exports = n
    },
    488: function(t, e, i) {
        function n() {
            this.last_en_subshort = o([4, 9]), this.lastAttacks = a(4), this.pefirbuf = r(19), this.longfact = r(l.SBMAX_l), this.shortfact = r(l.SBMAX_s), this.attackthre = 0, this.attackthre_s = 0
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            o = s.new_float_n,
            a = s.new_int,
            l = (s.new_int_n, s.assert, i(388));
        t.exports = n
    },
    489: function(t, e, i) {
        function n() {
            function t(t, e, i, n, s, r, o, a, l, h, u, c, p, f, _) {
                this.vbr_q = t, this.quant_comp = e, this.quant_comp_s = i, this.expY = n, this.st_lrm = s, this.st_s = r, this.masking_adj = o, this.masking_adj_short = a, this.ath_lower = l, this.ath_curve = h, this.ath_sensitivity = u, this.interch = c, this.safejoint = p, this.sfb21mod = f, this.msfix = _
            }

            function e(t, e, i, n, s, r, o, a, l, h, u, c, p, f) {
                this.quant_comp = e, this.quant_comp_s = i, this.safejoint = n, this.nsmsfix = s, this.st_lrm = r, this.st_s = o, this.nsbass = a, this.scale = l, this.masking_adj = h, this.ath_lower = u, this.ath_curve = c, this.interch = p, this.sfscale = f
            }

            function i(t, e, i) {
                var n = t.VBR == r.vbr_rh ? a : l,
                    o = t.VBR_q_frac,
                    h = n[e],
                    u = n[e + 1],
                    c = h;
                h.st_lrm = h.st_lrm + o * (u.st_lrm - h.st_lrm), h.st_s = h.st_s + o * (u.st_s - h.st_s), h.masking_adj = h.masking_adj + o * (u.masking_adj - h.masking_adj), h.masking_adj_short = h.masking_adj_short + o * (u.masking_adj_short - h.masking_adj_short), h.ath_lower = h.ath_lower + o * (u.ath_lower - h.ath_lower), h.ath_curve = h.ath_curve + o * (u.ath_curve - h.ath_curve), h.ath_sensitivity = h.ath_sensitivity + o * (u.ath_sensitivity - h.ath_sensitivity), h.interch = h.interch + o * (u.interch - h.interch), h.msfix = h.msfix + o * (u.msfix - h.msfix), s(t, c.vbr_q), 0 != i ? t.quant_comp = c.quant_comp : Math.abs(t.quant_comp - -1) > 0 || (t.quant_comp = c.quant_comp), 0 != i ? t.quant_comp_short = c.quant_comp_s : Math.abs(t.quant_comp_short - -1) > 0 || (t.quant_comp_short = c.quant_comp_s), 0 != c.expY && (t.experimentalY = 0 != c.expY), 0 != i ? t.internal_flags.nsPsy.attackthre = c.st_lrm : Math.abs(t.internal_flags.nsPsy.attackthre - -1) > 0 || (t.internal_flags.nsPsy.attackthre = c.st_lrm), 0 != i ? t.internal_flags.nsPsy.attackthre_s = c.st_s : Math.abs(t.internal_flags.nsPsy.attackthre_s - -1) > 0 || (t.internal_flags.nsPsy.attackthre_s = c.st_s), 0 != i ? t.maskingadjust = c.masking_adj : Math.abs(t.maskingadjust - 0) > 0 || (t.maskingadjust = c.masking_adj), 0 != i ? t.maskingadjust_short = c.masking_adj_short : Math.abs(t.maskingadjust_short - 0) > 0 || (t.maskingadjust_short = c.masking_adj_short), 0 != i ? t.ATHlower = -c.ath_lower / 10 : Math.abs(10 * -t.ATHlower - 0) > 0 || (t.ATHlower = -c.ath_lower / 10), 0 != i ? t.ATHcurve = c.ath_curve : Math.abs(t.ATHcurve - -1) > 0 || (t.ATHcurve = c.ath_curve), 0 != i ? t.athaa_sensitivity = c.ath_sensitivity : Math.abs(t.athaa_sensitivity - -1) > 0 || (t.athaa_sensitivity = c.ath_sensitivity), c.interch > 0 && (0 != i ? t.interChRatio = c.interch : Math.abs(t.interChRatio - -1) > 0 || (t.interChRatio = c.interch)), c.safejoint > 0 && (t.exp_nspsytune = t.exp_nspsytune | c.safejoint), c.sfb21mod > 0 && (t.exp_nspsytune = t.exp_nspsytune | c.sfb21mod << 20), 0 != i ? t.msfix = c.msfix : Math.abs(t.msfix - -1) > 0 || (t.msfix = c.msfix), 0 == i && (t.VBR_q = e, t.VBR_q_frac = o)
            }

            function n(t, e, i) {
                var n = e,
                    s = o.nearestBitrateFullIndex(e);
                if (t.VBR = r.vbr_abr, t.VBR_mean_bitrate_kbps = n, t.VBR_mean_bitrate_kbps = Math.min(t.VBR_mean_bitrate_kbps, 320), t.VBR_mean_bitrate_kbps = Math.max(t.VBR_mean_bitrate_kbps, 8), t.brate = t.VBR_mean_bitrate_kbps, t.VBR_mean_bitrate_kbps > 320 && (t.disable_reservoir = !0), h[s].safejoint > 0 && (t.exp_nspsytune = 2 | t.exp_nspsytune), h[s].sfscale > 0 && (t.internal_flags.noise_shaping = 2), Math.abs(h[s].nsbass) > 0) {
                    var a = int(4 * h[s].nsbass);
                    a < 0 && (a += 64), t.exp_nspsytune = t.exp_nspsytune | a << 2
                }
                return 0 != i ? t.quant_comp = h[s].quant_comp : Math.abs(t.quant_comp - -1) > 0 || (t.quant_comp = h[s].quant_comp), 0 != i ? t.quant_comp_short = h[s].quant_comp_s : Math.abs(t.quant_comp_short - -1) > 0 || (t.quant_comp_short = h[s].quant_comp_s), 0 != i ? t.msfix = h[s].nsmsfix : Math.abs(t.msfix - -1) > 0 || (t.msfix = h[s].nsmsfix), 0 != i ? t.internal_flags.nsPsy.attackthre = h[s].st_lrm : Math.abs(t.internal_flags.nsPsy.attackthre - -1) > 0 || (t.internal_flags.nsPsy.attackthre = h[s].st_lrm), 0 != i ? t.internal_flags.nsPsy.attackthre_s = h[s].st_s : Math.abs(t.internal_flags.nsPsy.attackthre_s - -1) > 0 || (t.internal_flags.nsPsy.attackthre_s = h[s].st_s), 0 != i ? t.scale = h[s].scale : Math.abs(t.scale - -1) > 0 || (t.scale = h[s].scale), 0 != i ? t.maskingadjust = h[s].masking_adj : Math.abs(t.maskingadjust - 0) > 0 || (t.maskingadjust = h[s].masking_adj), h[s].masking_adj > 0 ? 0 != i ? t.maskingadjust_short = .9 * h[s].masking_adj : Math.abs(t.maskingadjust_short - 0) > 0 || (t.maskingadjust_short = .9 * h[s].masking_adj) : 0 != i ? t.maskingadjust_short = 1.1 * h[s].masking_adj : Math.abs(t.maskingadjust_short - 0) > 0 || (t.maskingadjust_short = 1.1 * h[s].masking_adj), 0 != i ? t.ATHlower = -h[s].ath_lower / 10 : Math.abs(10 * -t.ATHlower - 0) > 0 || (t.ATHlower = -h[s].ath_lower / 10), 0 != i ? t.ATHcurve = h[s].ath_curve : Math.abs(t.ATHcurve - -1) > 0 || (t.ATHcurve = h[s].ath_curve), 0 != i ? t.interChRatio = h[s].interch : Math.abs(t.interChRatio - -1) > 0 || (t.interChRatio = h[s].interch), e
            }

            function s(t, e) {
                var i = 0;
                return 0 > e && (i = -1, e = 0), 9 < e && (i = -1, e = 9), t.VBR_q = e, t.VBR_q_frac = 0, i
            }
            var o;
            this.setModules = function(t) {
                o = t
            };
            var a = [new t(0, 9, 9, 0, 5.2, 125, -4.2, -6.3, 4.8, 1, 0, 0, 2, 21, .97), new t(1, 9, 9, 0, 5.3, 125, -3.6, -5.6, 4.5, 1.5, 0, 0, 2, 21, 1.35), new t(2, 9, 9, 0, 5.6, 125, -2.2, -3.5, 2.8, 2, 0, 0, 2, 21, 1.49), new t(3, 9, 9, 1, 5.8, 130, -1.8, -2.8, 2.6, 3, -4, 0, 2, 20, 1.64), new t(4, 9, 9, 1, 6, 135, -.7, -1.1, 1.1, 3.5, -8, 0, 2, 0, 1.79), new t(5, 9, 9, 1, 6.4, 140, .5, .4, -7.5, 4, -12, 2e-4, 0, 0, 1.95), new t(6, 9, 9, 1, 6.6, 145, .67, .65, -14.7, 6.5, -19, 4e-4, 0, 0, 2.3), new t(7, 9, 9, 1, 6.6, 145, .8, .75, -19.7, 8, -22, 6e-4, 0, 0, 2.7), new t(8, 9, 9, 1, 6.6, 145, 1.2, 1.15, -27.5, 10, -23, 7e-4, 0, 0, 0), new t(9, 9, 9, 1, 6.6, 145, 1.6, 1.6, -36, 11, -25, 8e-4, 0, 0, 0), new t(10, 9, 9, 1, 6.6, 145, 2, 2, -36, 12, -25, 8e-4, 0, 0, 0)],
                l = [new t(0, 9, 9, 0, 4.2, 25, -7, -4, 7.5, 1, 0, 0, 2, 26, .97), new t(1, 9, 9, 0, 4.2, 25, -5.6, -3.6, 4.5, 1.5, 0, 0, 2, 21, 1.35), new t(2, 9, 9, 0, 4.2, 25, -4.4, -1.8, 2, 2, 0, 0, 2, 18, 1.49), new t(3, 9, 9, 1, 4.2, 25, -3.4, -1.25, 1.1, 3, -4, 0, 2, 15, 1.64), new t(4, 9, 9, 1, 4.2, 25, -2.2, .1, 0, 3.5, -8, 0, 2, 0, 1.79), new t(5, 9, 9, 1, 4.2, 25, -1, 1.65, -7.7, 4, -12, 2e-4, 0, 0, 1.95), new t(6, 9, 9, 1, 4.2, 25, -0, 2.47, -7.7, 6.5, -19, 4e-4, 0, 0, 2), new t(7, 9, 9, 1, 4.2, 25, .5, 2, -14.5, 8, -22, 6e-4, 0, 0, 2), new t(8, 9, 9, 1, 4.2, 25, 1, 2.4, -22, 10, -23, 7e-4, 0, 0, 2), new t(9, 9, 9, 1, 4.2, 25, 1.5, 2.95, -30, 11, -25, 8e-4, 0, 0, 2), new t(10, 9, 9, 1, 4.2, 25, 2, 2.95, -36, 12, -30, 8e-4, 0, 0, 2)],
                h = [new e(8, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -30, 11, .0012, 1), new e(16, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -25, 11, .001, 1), new e(24, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -20, 11, .001, 1), new e(32, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -15, 11, .001, 1), new e(40, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -10, 11, 9e-4, 1), new e(48, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -10, 11, 9e-4, 1), new e(56, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -6, 11, 8e-4, 1), new e(64, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, -2, 11, 8e-4, 1), new e(80, 9, 9, 0, 0, 6.6, 145, 0, .95, 0, 0, 8, 7e-4, 1), new e(96, 9, 9, 0, 2.5, 6.6, 145, 0, .95, 0, 1, 5.5, 6e-4, 1), new e(112, 9, 9, 0, 2.25, 6.6, 145, 0, .95, 0, 2, 4.5, 5e-4, 1), new e(128, 9, 9, 0, 1.95, 6.4, 140, 0, .95, 0, 3, 4, 2e-4, 1), new e(160, 9, 9, 1, 1.79, 6, 135, 0, .95, -2, 5, 3.5, 0, 1), new e(192, 9, 9, 1, 1.49, 5.6, 125, 0, .97, -4, 7, 3, 0, 0), new e(224, 9, 9, 1, 1.25, 5.2, 125, 0, .98, -6, 9, 2, 0, 0), new e(256, 9, 9, 1, .97, 5.2, 125, 0, 1, -8, 10, 1, 0, 0), new e(320, 9, 9, 1, .9, 5.2, 125, 0, 1, -10, 12, 0, 0, 0)];
            this.apply_preset = function(t, e, s) {
                switch (e) {
                    case Lame.R3MIX:
                        e = Lame.V3, t.VBR = r.vbr_mtrh;
                        break;
                    case Lame.MEDIUM:
                        e = Lame.V4, t.VBR = r.vbr_rh;
                        break;
                    case Lame.MEDIUM_FAST:
                        e = Lame.V4, t.VBR = r.vbr_mtrh;
                        break;
                    case Lame.STANDARD:
                        e = Lame.V2, t.VBR = r.vbr_rh;
                        break;
                    case Lame.STANDARD_FAST:
                        e = Lame.V2, t.VBR = r.vbr_mtrh;
                        break;
                    case Lame.EXTREME:
                        e = Lame.V0, t.VBR = r.vbr_rh;
                        break;
                    case Lame.EXTREME_FAST:
                        e = Lame.V0, t.VBR = r.vbr_mtrh;
                        break;
                    case Lame.INSANE:
                        return e = 320, t.preset = e, n(t, e, s), t.VBR = r.vbr_off, e
                }
                switch (t.preset = e, e) {
                    case Lame.V9:
                        return i(t, 9, s), e;
                    case Lame.V8:
                        return i(t, 8, s), e;
                    case Lame.V7:
                        return i(t, 7, s), e;
                    case Lame.V6:
                        return i(t, 6, s), e;
                    case Lame.V5:
                        return i(t, 5, s), e;
                    case Lame.V4:
                        return i(t, 4, s), e;
                    case Lame.V3:
                        return i(t, 3, s), e;
                    case Lame.V2:
                        return i(t, 2, s), e;
                    case Lame.V1:
                        return i(t, 1, s), e;
                    case Lame.V0:
                        return i(t, 0, s), e
                }
                return 8 <= e && e <= 320 ? n(t, e, s) : (t.preset = 0, e)
            }
        }
        var s = i(384),
            r = (s.System, s.VbrMode);
        s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float, s.new_float_n, s.new_int, s.new_int_n, s.assert;
        t.exports = n
    },
    490: function(t, e, i) {
        function n() {
            function t(t) {
                return t
            }

            function e(t, e) {
                for (var i = 0, n = 0; n < d.BLKSIZE / 2; ++n) i += t[n] * e.ATH.eql_w[n];
                return i *= rt
            }

            function i(i, n, s, r, o, a, h, u, c, p, f) {
                var _ = i.internal_flags;
                if (c < 2) J.fft_long(_, r[o], c, p, f), J.fft_short(_, a[h], c, p, f);
                else if (2 == c) {
                    for (var m = d.BLKSIZE - 1; m >= 0; --m) {
                        var y = r[o + 0][m],
                            v = r[o + 1][m];
                        r[o + 0][m] = (y + v) * l.SQRT2 * .5, r[o + 1][m] = (y - v) * l.SQRT2 * .5
                    }
                    for (var b = 2; b >= 0; --b)
                        for (var m = d.BLKSIZE_s - 1; m >= 0; --m) {
                            var y = a[h + 0][b][m],
                                v = a[h + 1][b][m];
                            a[h + 0][b][m] = (y + v) * l.SQRT2 * .5, a[h + 1][b][m] = (y - v) * l.SQRT2 * .5
                        }
                }
                n[0] = t(r[o + 0][0]), n[0] *= n[0];
                for (var m = d.BLKSIZE / 2 - 1; m >= 0; --m) {
                    var g = r[o + 0][d.BLKSIZE / 2 - m],
                        S = r[o + 0][d.BLKSIZE / 2 + m];
                    n[d.BLKSIZE / 2 - m] = t(.5 * (g * g + S * S))
                }
                for (var b = 2; b >= 0; --b) {
                    s[b][0] = a[h + 0][b][0], s[b][0] *= s[b][0];
                    for (var m = d.BLKSIZE_s / 2 - 1; m >= 0; --m) {
                        var g = a[h + 0][b][d.BLKSIZE_s / 2 - m],
                            S = a[h + 0][b][d.BLKSIZE_s / 2 + m];
                        s[b][d.BLKSIZE_s / 2 - m] = t(.5 * (g * g + S * S))
                    }
                }
                for (var w = 0, m = 11; m < d.HBLKSIZE; m++) w += n[m];
                if (_.tot_ener[c] = w, i.analysis) {
                    for (var m = 0; m < d.HBLKSIZE; m++) _.pinfo.energy[u][c][m] = _.pinfo.energy_save[c][m], _.pinfo.energy_save[c][m] = n[m];
                    _.pinfo.pe[u][c] = _.pe[c]
                }
                2 == i.athaa_loudapprox && c < 2 && (_.loudness_sq[u][c] = _.loudness_sq_save[c], _.loudness_sq_save[c] = e(n, _))
            }

            function n() {
                Q = Math.pow(10, (ht + 1) / 16), Z = Math.pow(10, (ut + 1) / 16), K = Math.pow(10, ct / 10)
            }

            function s(t, e, i, n, s, r) {
                var o;
                if (e > t) {
                    if (!(e < t * Z)) return t + e;
                    o = e / t
                } else {
                    if (t >= e * Z) return t + e;
                    o = t / e
                }
                if (f(t >= 0), f(e >= 0), t += e, n + 3 <= 6) {
                    if (o >= Q) return t;
                    var a = 0 | l.FAST_LOG10_X(o, 16);
                    return t * _t[a]
                }
                var a = 0 | l.FAST_LOG10_X(o, 16);
                if (e = 0 != r ? s.ATH.cb_s[i] * s.ATH.adjust : s.ATH.cb_l[i] * s.ATH.adjust, f(e >= 0), t < K * e) {
                    if (t > e) {
                        var h, u;
                        return h = 1, a <= 13 && (h = dt[a]), u = l.FAST_LOG10_X(t / e, 10 / 15), t * ((ft[a] - h) * u + h)
                    }
                    return a > 13 ? t : t * dt[a]
                }
                return t * ft[a]
            }

            function m(t, e, i) {
                var n;
                if (t < 0 && (t = 0), e < 0 && (e = 0), t <= 0) return e;
                if (e <= 0) return t;
                if (n = e > t ? e / t : t / e, -2 <= i && i <= 2) {
                    if (n >= Q) return t + e;
                    var s = 0 | l.FAST_LOG10_X(n, 16);
                    return (t + e) * mt[s]
                }
                return n < Z ? t + e : (t < e && (t = e), t)
            }

            function y(t, e) {
                var i = t.internal_flags;
                if (i.channels_out > 1) {
                    for (var n = 0; n < d.SBMAX_l; n++) {
                        var s = i.thm[0].l[n],
                            r = i.thm[1].l[n];
                        i.thm[0].l[n] += r * e, i.thm[1].l[n] += s * e
                    }
                    for (var n = 0; n < d.SBMAX_s; n++)
                        for (var o = 0; o < 3; o++) {
                            var s = i.thm[0].s[n][o],
                                r = i.thm[1].s[n][o];
                            i.thm[0].s[n][o] += r * e, i.thm[1].s[n][o] += s * e
                        }
                }
            }

            function v(t) {
                for (var e = 0; e < d.SBMAX_l; e++)
                    if (!(t.thm[0].l[e] > 1.58 * t.thm[1].l[e] || t.thm[1].l[e] > 1.58 * t.thm[0].l[e])) {
                        var i = t.mld_l[e] * t.en[3].l[e],
                            n = Math.max(t.thm[2].l[e], Math.min(t.thm[3].l[e], i));
                        i = t.mld_l[e] * t.en[2].l[e];
                        var s = Math.max(t.thm[3].l[e], Math.min(t.thm[2].l[e], i));
                        t.thm[2].l[e] = n, t.thm[3].l[e] = s
                    }
                for (var e = 0; e < d.SBMAX_s; e++)
                    for (var r = 0; r < 3; r++)
                        if (!(t.thm[0].s[e][r] > 1.58 * t.thm[1].s[e][r] || t.thm[1].s[e][r] > 1.58 * t.thm[0].s[e][r])) {
                            var i = t.mld_s[e] * t.en[3].s[e][r],
                                n = Math.max(t.thm[2].s[e][r], Math.min(t.thm[3].s[e][r], i));
                            i = t.mld_s[e] * t.en[2].s[e][r];
                            var s = Math.max(t.thm[3].s[e][r], Math.min(t.thm[2].s[e][r], i));
                            t.thm[2].s[e][r] = n, t.thm[3].s[e][r] = s
                        }
            }

            function b(t, e, i) {
                var n = e,
                    s = Math.pow(10, i);
                e *= 2, n *= 2;
                for (var r = 0; r < d.SBMAX_l; r++) {
                    var o, a, l, h;
                    if (h = t.ATH.cb_l[t.bm_l[r]] * s, o = Math.min(Math.max(t.thm[0].l[r], h), Math.max(t.thm[1].l[r], h)), a = Math.max(t.thm[2].l[r], h), l = Math.max(t.thm[3].l[r], h), o * e < a + l) {
                        var u = o * n / (a + l);
                        a *= u, l *= u, f(a + l > 0)
                    }
                    t.thm[2].l[r] = Math.min(a, t.thm[2].l[r]), t.thm[3].l[r] = Math.min(l, t.thm[3].l[r])
                }
                s *= d.BLKSIZE_s / d.BLKSIZE;
                for (var r = 0; r < d.SBMAX_s; r++)
                    for (var c = 0; c < 3; c++) {
                        var o, a, l, h;
                        if (h = t.ATH.cb_s[t.bm_s[r]] * s, o = Math.min(Math.max(t.thm[0].s[r][c], h), Math.max(t.thm[1].s[r][c], h)), a = Math.max(t.thm[2].s[r][c], h), l = Math.max(t.thm[3].s[r][c], h), o * e < a + l) {
                            var u = o * e / (a + l);
                            a *= u, l *= u, f(a + l > 0)
                        }
                        t.thm[2].s[r][c] = Math.min(t.thm[2].s[r][c], a), t.thm[3].s[r][c] = Math.min(t.thm[3].s[r][c], l)
                    }
            }

            function g(t, e, i, n, s) {
                var r, o, a = 0,
                    l = 0;
                for (r = o = 0; r < d.SBMAX_s; ++o, ++r) {
                    for (var h = t.bo_s[r], u = t.npart_s, c = h < u ? h : u; o < c;) f(e[o] >= 0), f(i[o] >= 0), a += e[o], l += i[o], o++;
                    if (t.en[n].s[r][s] = a, t.thm[n].s[r][s] = l, o >= u) {
                        ++r;
                        break
                    }
                    f(e[o] >= 0), f(i[o] >= 0);
                    var p = t.PSY.bo_s_weight[r],
                        _ = 1 - p;
                    a = p * e[o], l = p * i[o], t.en[n].s[r][s] += a, t.thm[n].s[r][s] += l, a = _ * e[o], l = _ * i[o]
                }
                for (; r < d.SBMAX_s; ++r) t.en[n].s[r][s] = 0, t.thm[n].s[r][s] = 0
            }

            function S(t, e, i, n) {
                var s, r, o = 0,
                    a = 0;
                for (s = r = 0; s < d.SBMAX_l; ++r, ++s) {
                    for (var l = t.bo_l[s], h = t.npart_l, u = l < h ? l : h; r < u;) f(e[r] >= 0), f(i[r] >= 0), o += e[r], a += i[r], r++;
                    if (t.en[n].l[s] = o, t.thm[n].l[s] = a, r >= h) {
                        ++s;
                        break
                    }
                    f(e[r] >= 0), f(i[r] >= 0);
                    var c = t.PSY.bo_l_weight[s],
                        p = 1 - c;
                    o = c * e[r], a = c * i[r], t.en[n].l[s] += o, t.thm[n].l[s] += a, o = p * e[r], a = p * i[r]
                }
                for (; s < d.SBMAX_l; ++s) t.en[n].l[s] = 0, t.thm[n].l[s] = 0
            }

            function w(t, e, i, n, s, r) {
                var o, a, l = t.internal_flags;
                for (a = o = 0; a < l.npart_s; ++a) {
                    for (var h = 0, u = 0, c = l.numlines_s[a], p = 0; p < c; ++p, ++o) {
                        var _ = e[r][o];
                        h += _, u < _ && (u = _)
                    }
                    i[a] = h
                }
                for (f(a == l.npart_s), f(129 == o), o = a = 0; a < l.npart_s; a++) {
                    var m = l.s3ind_s[a][0],
                        y = l.s3_ss[o++] * i[m];
                    for (++m; m <= l.s3ind_s[a][1];) y += l.s3_ss[o] * i[m], ++o, ++m;
                    var v = it * l.nb_s1[s][a];
                    if (n[a] = Math.min(y, v), l.blocktype_old[1 & s] == d.SHORT_TYPE) {
                        var v = nt * l.nb_s2[s][a],
                            b = n[a];
                        n[a] = Math.min(v, b)
                    }
                    l.nb_s2[s][a] = l.nb_s1[s][a], l.nb_s1[s][a] = y, f(n[a] >= 0)
                }
                for (; a <= d.CBANDS; ++a) i[a] = 0, n[a] = 0
            }

            function A(t, e, i, n) {
                var s = t.internal_flags;
                t.short_blocks != a.short_block_coupled || 0 != e[0] && 0 != e[1] || (e[0] = e[1] = 0);
                for (var r = 0; r < s.channels_out; r++) n[r] = d.NORM_TYPE, t.short_blocks == a.short_block_dispensed && (e[r] = 1), t.short_blocks == a.short_block_forced && (e[r] = 0), 0 != e[r] ? (f(s.blocktype_old[r] != d.START_TYPE), s.blocktype_old[r] == d.SHORT_TYPE && (n[r] = d.STOP_TYPE)) : (n[r] = d.SHORT_TYPE, s.blocktype_old[r] == d.NORM_TYPE && (s.blocktype_old[r] = d.START_TYPE), s.blocktype_old[r] == d.STOP_TYPE && (s.blocktype_old[r] = d.SHORT_TYPE)), i[r] = s.blocktype_old[r], s.blocktype_old[r] = n[r]
            }

            function T(t, e, i) {
                return i >= 1 ? t : i <= 0 ? e : e > 0 ? Math.pow(t / e, i) * e : 0
            }

            function x(t, e) {
                for (var i = 309.07, n = 0; n < d.SBMAX_s - 1; n++)
                    for (var s = 0; s < 3; s++) {
                        var r = t.thm.s[n][s];
                        if (f(n < yt.length), r > 0) {
                            var o = r * e,
                                a = t.en.s[n][s];
                            a > o && (a > 1e10 * o ? i += yt[n] * (10 * $) : (f(o > 0), i += yt[n] * l.FAST_LOG10(a / o)))
                        }
                    }
                return i
            }

            function M(t, e) {
                for (var i = 281.0575, n = 0; n < d.SBMAX_l - 1; n++) {
                    var s = t.thm.l[n];
                    if (f(n < vt.length), s > 0) {
                        var r = s * e,
                            o = t.en.l[n];
                        o > r && (o > 1e10 * r ? i += vt[n] * (10 * $) : (f(r > 0), i += vt[n] * l.FAST_LOG10(o / r)))
                    }
                }
                return i
            }

            function k(t, e, i, n, s) {
                var r, o;
                for (r = o = 0; r < t.npart_l; ++r) {
                    var a, l = 0,
                        h = 0;
                    for (a = 0; a < t.numlines_l[r]; ++a, ++o) {
                        var u = e[o];
                        f(u >= 0), l += u, h < u && (h = u)
                    }
                    i[r] = l, n[r] = h, s[r] = l * t.rnumlines_l[r], f(t.rnumlines_l[r] >= 0), f(l >= 0), f(i[r] >= 0), f(n[r] >= 0), f(s[r] >= 0)
                }
            }

            function R(t, e, i, n) {
                var s = pt.length - 1,
                    r = 0,
                    o = i[r] + i[r + 1];
                if (f(o >= 0), o > 0) {
                    var a = e[r];
                    a < e[r + 1] && (a = e[r + 1]), f(t.numlines_l[r] + t.numlines_l[r + 1] - 1 > 0), o = 20 * (2 * a - o) / (o * (t.numlines_l[r] + t.numlines_l[r + 1] - 1));
                    var l = 0 | o;
                    l > s && (l = s), n[r] = l
                } else n[r] = 0;
                for (r = 1; r < t.npart_l - 1; r++)
                    if (o = i[r - 1] + i[r] + i[r + 1], f(o >= 0), o > 0) {
                        var a = e[r - 1];
                        a < e[r] && (a = e[r]), a < e[r + 1] && (a = e[r + 1]), f(t.numlines_l[r - 1] + t.numlines_l[r] + t.numlines_l[r + 1] - 1 > 0), o = 20 * (3 * a - o) / (o * (t.numlines_l[r - 1] + t.numlines_l[r] + t.numlines_l[r + 1] - 1));
                        var l = 0 | o;
                        l > s && (l = s), n[r] = l
                    } else n[r] = 0;
                if (f(r > 0), f(r == t.npart_l - 1), o = i[r - 1] + i[r], f(o >= 0), o > 0) {
                    var a = e[r - 1];
                    a < e[r] && (a = e[r]), f(t.numlines_l[r - 1] + t.numlines_l[r] - 1 > 0), o = 20 * (2 * a - o) / (o * (t.numlines_l[r - 1] + t.numlines_l[r] - 1));
                    var l = 0 | o;
                    l > s && (l = s), n[r] = l
                } else n[r] = 0;
                f(r == t.npart_l - 1)
            }

            function O(e, i, n, s, r, o, a, h) {
                var u = e.internal_flags;
                if (s < 2) J.fft_long(u, a[h], s, i, n);
                else if (2 == s)
                    for (var c = d.BLKSIZE - 1; c >= 0; --c) {
                        var p = a[h + 0][c],
                            f = a[h + 1][c];
                        a[h + 0][c] = (p + f) * l.SQRT2 * .5, a[h + 1][c] = (p - f) * l.SQRT2 * .5
                    }
                o[0] = t(a[h + 0][0]), o[0] *= o[0];
                for (var c = d.BLKSIZE / 2 - 1; c >= 0; --c) {
                    var _ = a[h + 0][d.BLKSIZE / 2 - c],
                        m = a[h + 0][d.BLKSIZE / 2 + c];
                    o[d.BLKSIZE / 2 - c] = t(.5 * (_ * _ + m * m))
                }
                for (var y = 0, c = 11; c < d.HBLKSIZE; c++) y += o[c];
                if (u.tot_ener[s] = y, e.analysis) {
                    for (var c = 0; c < d.HBLKSIZE; c++) u.pinfo.energy[r][s][c] = u.pinfo.energy_save[s][c], u.pinfo.energy_save[s][c] = o[c];
                    u.pinfo.pe[r][s] = u.pe[s]
                }
            }

            function E(e, i, n, s, r, o, a, h) {
                var u = e.internal_flags;
                if (0 == r && s < 2 && J.fft_short(u, a[h], s, i, n), 2 == s)
                    for (var c = d.BLKSIZE_s - 1; c >= 0; --c) {
                        var p = a[h + 0][r][c],
                            f = a[h + 1][r][c];
                        a[h + 0][r][c] = (p + f) * l.SQRT2 * .5, a[h + 1][r][c] = (p - f) * l.SQRT2 * .5
                    }
                o[r][0] = a[h + 0][r][0], o[r][0] *= o[r][0];
                for (var c = d.BLKSIZE_s / 2 - 1; c >= 0; --c) {
                    var _ = a[h + 0][r][d.BLKSIZE_s / 2 - c],
                        m = a[h + 0][r][d.BLKSIZE_s / 2 + c];
                    o[r][d.BLKSIZE_s / 2 - c] = t(.5 * (_ * _ + m * m))
                }
            }

            function P(t, i, n, s) {
                var r = t.internal_flags;
                2 == t.athaa_loudapprox && n < 2 && (r.loudness_sq[i][n] = r.loudness_sq_save[n], r.loudness_sq_save[n] = e(s, r))
            }

            function B(t, e, i, n, s, r, o, a, l, h) {
                for (var p = c([2, 576]), _ = t.internal_flags, d = _.channels_out, m = t.mode == MPEGMode.JOINT_STEREO ? 4 : d, y = 0; y < d; y++) {
                    firbuf = e[y];
                    var v = i + 576 - 350 - at + 192;
                    f(gt.length == (at - 1) / 2);
                    for (var b = 0; b < 576; b++) {
                        var g, S;
                        g = firbuf[v + b + 10], S = 0;
                        for (var w = 0; w < (at - 1) / 2 - 1; w += 2) g += gt[w] * (firbuf[v + b + w] + firbuf[v + b + at - w]), S += gt[w + 1] * (firbuf[v + b + w + 1] + firbuf[v + b + at - w - 1]);
                        p[y][b] = g + S
                    }
                    s[n][y].en.assign(_.en[y]), s[n][y].thm.assign(_.thm[y]), m > 2 && (r[n][y].en.assign(_.en[y + 2]), r[n][y].thm.assign(_.thm[y + 2]))
                }
                for (var y = 0; y < m; y++) {
                    var A = u(12),
                        T = u(12),
                        x = [0, 0, 0, 0],
                        M = p[1 & y],
                        k = 0,
                        R = 3 == y ? _.nsPsy.attackthre_s : _.nsPsy.attackthre,
                        O = 1;
                    if (2 == y)
                        for (var b = 0, w = 576; w > 0; ++b, --w) {
                            var E = p[0][b],
                                P = p[1][b];
                            p[0][b] = E + P, p[1][b] = E - P
                        }
                    for (var b = 0; b < 3; b++) T[b] = _.nsPsy.last_en_subshort[y][b + 6], f(_.nsPsy.last_en_subshort[y][b + 4] > 0), A[b] = T[b] / _.nsPsy.last_en_subshort[y][b + 4], x[0] += T[b];
                    for (var b = 0; b < 9; b++) {
                        for (var B = k + 64, C = 1; k < B; k++) C < Math.abs(M[k]) && (C = Math.abs(M[k]));
                        _.nsPsy.last_en_subshort[y][b] = T[b + 3] = C, x[1 + b / 3] += C, C > T[b + 3 - 2] ? (f(T[b + 3 - 2] > 0), C /= T[b + 3 - 2]) : T[b + 3 - 2] > 10 * C ? (f(C > 0), C = T[b + 3 - 2] / (10 * C)) : C = 0, A[b + 3] = C
                    }
                    for (var b = 0; b < 3; ++b) {
                        var F = T[3 * b + 3] + T[3 * b + 4] + T[3 * b + 5],
                            q = 1;
                        6 * T[3 * b + 5] < F && (q *= .5, 6 * T[3 * b + 4] < F && (q *= .5)), a[y][b] = q
                    }
                    if (t.analysis) {
                        for (var j = A[0], b = 1; b < 12; b++) j < A[b] && (j = A[b]);
                        _.pinfo.ers[n][y] = _.pinfo.ers_save[y], _.pinfo.ers_save[y] = j
                    }
                    for (var b = 0; b < 12; b++) 0 == l[y][b / 3] && A[b] > R && (l[y][b / 3] = b % 3 + 1);
                    for (var b = 1; b < 4; b++) {
                        var L = x[b - 1],
                            I = x[b];
                        Math.max(L, I) < 4e4 && L < 1.7 * I && I < 1.7 * L && (1 == b && l[y][0] <= l[y][b] && (l[y][0] = 0), l[y][b] = 0)
                    }
                    l[y][0] <= _.nsPsy.lastAttacks[y] && (l[y][0] = 0), 3 != _.nsPsy.lastAttacks[y] && l[y][0] + l[y][1] + l[y][2] + l[y][3] == 0 || (O = 0, 0 != l[y][1] && 0 != l[y][0] && (l[y][1] = 0), 0 != l[y][2] && 0 != l[y][1] && (l[y][2] = 0), 0 != l[y][3] && 0 != l[y][2] && (l[y][3] = 0)), y < 2 ? h[y] = O : 0 == O && (h[0] = h[1] = 0), o[y] = _.tot_ener[y]
                }
            }

            function C(t, e, i) {
                if (0 == i)
                    for (var n = 0; n < t.npart_s; n++) t.nb_s2[e][n] = t.nb_s1[e][n], t.nb_s1[e][n] = 0
            }

            function F(t, e) {
                for (var i = 0; i < t.npart_l; i++) t.nb_2[e][i] = t.nb_1[e][i], t.nb_1[e][i] = 0
            }

            function q(t, e, i, n) {
                var s = pt.length - 1,
                    r = 0,
                    o = i[r] + i[r + 1];
                if (f(o >= 0), o > 0) {
                    var a = e[r];
                    a < e[r + 1] && (a = e[r + 1]), f(t.numlines_s[r] + t.numlines_s[r + 1] - 1 > 0), o = 20 * (2 * a - o) / (o * (t.numlines_s[r] + t.numlines_s[r + 1] - 1));
                    var l = 0 | o;
                    l > s && (l = s), n[r] = l
                } else n[r] = 0;
                for (r = 1; r < t.npart_s - 1; r++)
                    if (o = i[r - 1] + i[r] + i[r + 1], f(r + 1 < t.npart_s), f(o >= 0), o > 0) {
                        var a = e[r - 1];
                        a < e[r] && (a = e[r]), a < e[r + 1] && (a = e[r + 1]), f(t.numlines_s[r - 1] + t.numlines_s[r] + t.numlines_s[r + 1] - 1 > 0), o = 20 * (3 * a - o) / (o * (t.numlines_s[r - 1] + t.numlines_s[r] + t.numlines_s[r + 1] - 1));
                        var l = 0 | o;
                        l > s && (l = s), n[r] = l
                    } else n[r] = 0;
                if (f(r > 0), f(r == t.npart_s - 1), o = i[r - 1] + i[r], f(o >= 0), o > 0) {
                    var a = e[r - 1];
                    a < e[r] && (a = e[r]), f(t.numlines_s[r - 1] + t.numlines_s[r] - 1 > 0), o = 20 * (2 * a - o) / (o * (t.numlines_s[r - 1] + t.numlines_s[r] - 1));
                    var l = 0 | o;
                    l > s && (l = s), n[r] = l
                } else n[r] = 0;
                f(r == t.npart_s - 1)
            }

            function j(t, e, i, n, s, r) {
                var o, a, l, h = t.internal_flags,
                    c = new float[d.CBANDS],
                    p = u(d.CBANDS),
                    _ = new int[d.CBANDS];
                for (l = a = 0; l < h.npart_s; ++l) {
                    var y = 0,
                        v = 0,
                        b = h.numlines_s[l];
                    for (o = 0; o < b; ++o, ++a) {
                        var g = e[r][a];
                        y += g, v < g && (v = g)
                    }
                    i[l] = y, f(y >= 0), c[l] = v, f(b > 0), p[l] = y / b, f(p[l] >= 0)
                }
                for (f(l == h.npart_s), f(129 == a); l < d.CBANDS; ++l) c[l] = 0, p[l] = 0;
                for (q(h, c, p, _), a = l = 0; l < h.npart_s; l++) {
                    var S, w, A, T, x, M = h.s3ind_s[l][0],
                        k = h.s3ind_s[l][1];
                    for (S = _[M], w = 1, T = h.s3_ss[a] * i[M] * pt[_[M]], ++a, ++M; M <= k;) S += _[M], w += 1, A = h.s3_ss[a] * i[M] * pt[_[M]], T = m(T, A, M - l), ++a, ++M;
                    S = (1 + 2 * S) / (2 * w), x = .5 * pt[S], T *= x, n[l] = T, h.nb_s2[s][l] = h.nb_s1[s][l], h.nb_s1[s][l] = T, A = c[l], A *= h.minval_s[l], A *= x, n[l] > A && (n[l] = A), h.masking_lower > 1 && (n[l] *= h.masking_lower), n[l] > i[l] && (n[l] = i[l]), h.masking_lower < 1 && (n[l] *= h.masking_lower), f(n[l] >= 0)
                }
                for (; l < d.CBANDS; ++l) i[l] = 0, n[l] = 0
            }

            function L(t, e, i, n, s) {
                var r, o = u(d.CBANDS),
                    a = u(d.CBANDS),
                    l = p(d.CBANDS + 2);
                k(t, e, i, o, a), R(t, o, a, l);
                var h = 0;
                for (r = 0; r < t.npart_l; r++) {
                    var c, _, y, v, b = t.s3ind[r][0],
                        g = t.s3ind[r][1],
                        S = 0,
                        w = 0;
                    for (S = l[b], w += 1, _ = t.s3_ll[h] * i[b] * pt[l[b]], ++h, ++b; b <= g;) S += l[b], w += 1, c = t.s3_ll[h] * i[b] * pt[l[b]], v = m(_, c, b - r), _ = v, ++h, ++b;
                    if (S = (1 + 2 * S) / (2 * w), y = .5 * pt[S], _ *= y, t.blocktype_old[1 & s] == d.SHORT_TYPE) {
                        var A = tt * t.nb_1[s][r];
                        n[r] = A > 0 ? Math.min(_, A) : Math.min(_, i[r] * ot)
                    } else {
                        var A, T = et * t.nb_2[s][r],
                            x = tt * t.nb_1[s][r];
                        T <= 0 && (T = _), x <= 0 && (x = _), A = t.blocktype_old[1 & s] == d.NORM_TYPE ? Math.min(x, T) : x, n[r] = Math.min(_, A)
                    }
                    t.nb_2[s][r] = t.nb_1[s][r], t.nb_1[s][r] = _, c = o[r], c *= t.minval_l[r], c *= y, n[r] > c && (n[r] = c), t.masking_lower > 1 && (n[r] *= t.masking_lower), n[r] > i[r] && (n[r] = i[r]), t.masking_lower < 1 && (n[r] *= t.masking_lower), f(n[r] >= 0)
                }
                for (; r < d.CBANDS; ++r) i[r] = 0, n[r] = 0
            }

            function I(t, e) {
                var i = t.internal_flags;
                t.short_blocks != a.short_block_coupled || 0 != e[0] && 0 != e[1] || (e[0] = e[1] = 0);
                for (var n = 0; n < i.channels_out; n++) t.short_blocks == a.short_block_dispensed && (e[n] = 1), t.short_blocks == a.short_block_forced && (e[n] = 0)
            }

            function N(t, e, i) {
                for (var n = t.internal_flags, s = 0; s < n.channels_out; s++) {
                    var r = d.NORM_TYPE;
                    0 != e[s] ? (f(n.blocktype_old[s] != d.START_TYPE), n.blocktype_old[s] == d.SHORT_TYPE && (r = d.STOP_TYPE)) : (r = d.SHORT_TYPE, n.blocktype_old[s] == d.NORM_TYPE && (n.blocktype_old[s] = d.START_TYPE), n.blocktype_old[s] == d.STOP_TYPE && (n.blocktype_old[s] = d.SHORT_TYPE)), i[s] = n.blocktype_old[s], n.blocktype_old[s] = r
                }
            }

            function D(t, e, i, n, s, r, o) {
                for (var a, l, h = 2 * r, u = r > 0 ? Math.pow(10, s) : 1, c = 0; c < o; ++c) {
                    var p = t[2][c],
                        _ = t[3][c],
                        d = e[0][c],
                        m = e[1][c],
                        y = e[2][c],
                        v = e[3][c];
                    if (d <= 1.58 * m && m <= 1.58 * d) {
                        var b = i[c] * _,
                            g = i[c] * p;
                        l = Math.max(y, Math.min(v, b)), a = Math.max(v, Math.min(y, g))
                    } else l = y, a = v;
                    if (r > 0) {
                        var S, w, A = n[c] * u;
                        if (S = Math.min(Math.max(d, A), Math.max(m, A)), y = Math.max(l, A), v = Math.max(a, A), (w = y + v) > 0 && S * h < w) {
                            var T = S * h / w;
                            y *= T, v *= T, f(w > 0)
                        }
                        l = Math.min(y, l), a = Math.min(v, a)
                    }
                    l > p && (l = p), a > _ && (a = _), e[2][c] = l, e[3][c] = a
                }
            }

            function V(t, e) {
                var i, n = t;
                return i = n >= 0 ? 27 * -n : n * e, i <= -72 ? 0 : Math.exp(i * lt)
            }

            function U(t) {
                var e, i, n = 0,
                    s = 0,
                    r = 0;
                for (r = 0; V(r, t) > 1e-20; r -= 1);
                for (e = r, i = 0; Math.abs(i - e) > 1e-12;) r = (i + e) / 2, V(r, t) > 0 ? i = r : e = r;
                n = e;
                var e, i, r = 0;
                for (r = 0; V(r, t) > 1e-20; r += 1);
                for (e = 0, i = r; Math.abs(i - e) > 1e-12;) r = (i + e) / 2, V(r, t) > 0 ? e = r : i = r;
                s = i;
                var o, a = 0;
                for (o = 0; o <= 1e3; ++o) {
                    var r = n + o * (s - n) / 1e3;
                    a += V(r, t)
                }
                return 1001 / (a * (s - n))
            }

            function G(t) {
                var e, i, n, s;
                return e = t, e *= e >= 0 ? 3 : 1.5, e >= .5 && e <= 2.5 ? (s = e - .5, i = 8 * (s * s - 2 * s)) : i = 0, e += .474, (n = 15.811389 + 7.5 * e - 17.5 * Math.sqrt(1 + e * e)) <= -60 ? 0 : (e = Math.exp((i + n) * lt), e /= .6609193)
            }

            function H(t) {
                return t < 0 && (t = 0), t *= .001, 13 * Math.atan(.76 * t) + 3.5 * Math.atan(t * t / 56.25)
            }

            function X(t, e, i, n, s, r, o, a, l, h, c, _) {
                var m, y = u(d.CBANDS + 1),
                    v = a / (_ > 15 ? 1152 : 384),
                    b = p(d.HBLKSIZE);
                a /= l;
                var g = 0,
                    S = 0;
                for (m = 0; m < d.CBANDS; m++) {
                    var w, A;
                    for (w = H(a * g), y[m] = a * g, A = g; H(a * A) - w < st && A <= l / 2; A++);
                    for (t[m] = A - g, S = m + 1; g < A;) f(g < d.HBLKSIZE), b[g++] = m;
                    if (g > l / 2) {
                        g = l / 2, ++m;
                        break
                    }
                }
                f(m < d.CBANDS), y[m] = a * g;
                for (var T = 0; T < _; T++) {
                    var x, M, k, R, O;
                    k = h[T], R = h[T + 1], x = 0 | Math.floor(.5 + c * (k - .5)), x < 0 && (x = 0), M = 0 | Math.floor(.5 + c * (R - .5)), M > l / 2 && (M = l / 2), i[T] = (b[x] + b[M]) / 2, e[T] = b[M];
                    var E = v * R;
                    o[T] = (E - y[e[T]]) / (y[e[T] + 1] - y[e[T]]), o[T] < 0 ? o[T] = 0 : o[T] > 1 && (o[T] = 1), O = H(a * h[T] * c), O = Math.min(O, 15.5) / 15.5, r[T] = Math.pow(10, 1.25 * (1 - Math.cos(Math.PI * O)) - 2.5)
                }
                g = 0;
                for (var P = 0; P < S; P++) {
                    var w, B, C = t[P];
                    w = H(a * g), B = H(a * (g + C - 1)), n[P] = .5 * (w + B), w = H(a * (g - .5)), B = H(a * (g + C - .5)), s[P] = B - w, g += C
                }
                return S
            }

            function Y(t, e, i, n, s, r) {
                var o, a = c([d.CBANDS, d.CBANDS]),
                    l = 0;
                if (r)
                    for (var h = 0; h < e; h++)
                        for (o = 0; o < e; o++) {
                            var p = G(i[h] - i[o]) * n[o];
                            a[h][o] = p * s[h]
                        } else
                            for (o = 0; o < e; o++)
                                for (var f = 15 + Math.min(21 / i[o], 12), _ = U(f), h = 0; h < e; h++) {
                                    var p = _ * V(i[h] - i[o], f) * n[o];
                                    a[h][o] = p * s[h]
                                }
                for (var h = 0; h < e; h++) {
                    for (o = 0; o < e && !(a[h][o] > 0); o++);
                    for (t[h][0] = o, o = e - 1; o > 0 && !(a[h][o] > 0); o--);
                    t[h][1] = o, l += t[h][1] - t[h][0] + 1
                }
                for (var m = u(l), y = 0, h = 0; h < e; h++)
                    for (o = t[h][0]; o <= t[h][1]; o++) m[y++] = a[h][o];
                return m
            }

            function z(t) {
                var e = H(t);
                return e = Math.min(e, 15.5) / 15.5, Math.pow(10, 1.25 * (1 - Math.cos(Math.PI * e)) - 2.5)
            }

            function W(t, e) {
                return t < -.3 && (t = 3410), t /= 1e3, t = Math.max(.1, t), 3.64 * Math.pow(t, -.8) - 6.8 * Math.exp(-.6 * Math.pow(t - 3.4, 2)) + 6 * Math.exp(-.15 * Math.pow(t - 8.7, 2)) + .001 * (.6 + .04 * e) * Math.pow(t, 4)
            }
            var Q, Z, K, J = new _,
                $ = 2.302585092994046,
                tt = 2,
                et = 16,
                it = 2,
                nt = 16,
                st = .34,
                rt = 1 / 217621504 / (d.BLKSIZE / 2),
                ot = .3,
                at = 21,
                lt = .2302585093,
                ht = 8,
                ut = 23,
                ct = 15,
                pt = [1, .79433, .63096, .63096, .63096, .63096, .63096, .25119, .11749],
                ft = [3.3246 * 3.3246, 3.23837 * 3.23837, 9.9500500969, 9.0247369744, 8.1854926609, 7.0440875649, 2.46209 * 2.46209, 2.284 * 2.284, 4.4892710641, 1.96552 * 1.96552, 1.82335 * 1.82335, 1.69146 * 1.69146, 2.4621061921, 2.1508568964, 1.37074 * 1.37074, 1.31036 * 1.31036, 1.5691069696, 1.4555939904, 1.16203 * 1.16203, 1.2715945225, 1.09428 * 1.09428, 1.0659 * 1.0659, 1.0779838276, 1.0382591025, 1],
                _t = [1.7782755904, 1.35879 * 1.35879, 1.38454 * 1.38454, 1.39497 * 1.39497, 1.40548 * 1.40548, 1.3537 * 1.3537, 1.6999465924, 1.22321 * 1.22321, 1.3169398564, 1],
                dt = [5.5396212496, 2.29259 * 2.29259, 4.9868695969, 2.12675 * 2.12675, 2.02545 * 2.02545, 1.87894 * 1.87894, 1.74303 * 1.74303, 1.61695 * 1.61695, 2.2499700001, 1.39148 * 1.39148, 1.29083 * 1.29083, 1.19746 * 1.19746, 1.2339655056, 1.0779838276],
                mt = [1.7782755904, 1.35879 * 1.35879, 1.38454 * 1.38454, 1.39497 * 1.39497, 1.40548 * 1.40548, 1.3537 * 1.3537, 1.6999465924, 1.22321 * 1.22321, 1.3169398564, 1],
                yt = [11.8, 13.6, 17.2, 32, 46.5, 51.3, 57.5, 67.1, 71.5, 84.6, 97.6, 130],
                vt = [6.8, 5.8, 5.8, 6.4, 6.5, 9.9, 12.1, 14.4, 15, 18.9, 21.6, 26.9, 34.2, 40.2, 46.8, 56.5, 60.7, 73.9, 85.7, 93.4, 126.1],
                bt = [-1.730326e-17, -.01703172, -1.349528e-17, .0418072, -6.73278e-17, -.0876324, -3.0835e-17, .1863476, -1.104424e-16, -.627638];
            this.L3psycho_anal_ns = function(t, e, n, o, a, l, _, m, O, E) {
                var P, B, C, F, q, j, L, I, N, D = t.internal_flags,
                    V = c([2, d.BLKSIZE]),
                    U = c([2, 3, d.BLKSIZE_s]),
                    G = u(d.CBANDS + 1),
                    H = u(d.CBANDS + 1),
                    X = u(d.CBANDS + 2),
                    Y = p(2),
                    z = p(2),
                    W = c([2, 576]),
                    Q = p(d.CBANDS + 2),
                    Z = p(d.CBANDS + 2);
                for (h.fill(Z, 0), P = D.channels_out, t.mode == MPEGMode.JOINT_STEREO && (P = 4), N = t.VBR == r.vbr_off ? 0 == D.ResvMax ? 0 : D.ResvSize / D.ResvMax * .5 : t.VBR == r.vbr_rh || t.VBR == r.vbr_mtrh || t.VBR == r.vbr_mt ? .6 : 1, B = 0; B < D.channels_out; B++) {
                    var K = e[B],
                        J = n + 576 - 350 - at + 192;
                    for (f(bt.length == (at - 1) / 2), F = 0; F < 576; F++) {
                        var $, it;
                        for ($ = K[J + F + 10], it = 0, q = 0; q < (at - 1) / 2 - 1; q += 2) $ += bt[q] * (K[J + F + q] + K[J + F + at - q]), it += bt[q + 1] * (K[J + F + q + 1] + K[J + F + at - q - 1]);
                        W[B][F] = $ + it
                    }
                    a[o][B].en.assign(D.en[B]), a[o][B].thm.assign(D.thm[B]), P > 2 && (l[o][B].en.assign(D.en[B + 2]), l[o][B].thm.assign(D.thm[B + 2]))
                }
                for (B = 0; B < P; B++) {
                    var nt, st, rt, lt = u(12),
                        ht = [0, 0, 0, 0],
                        ut = u(12),
                        ct = 1,
                        ft = u(d.CBANDS),
                        _t = u(d.CBANDS),
                        dt = [0, 0, 0, 0],
                        mt = u(d.HBLKSIZE),
                        yt = c([3, d.HBLKSIZE_s]);
                    for (f(D.npart_s <= d.CBANDS), f(D.npart_l <= d.CBANDS), F = 0; F < 3; F++) lt[F] = D.nsPsy.last_en_subshort[B][F + 6], f(D.nsPsy.last_en_subshort[B][F + 4] > 0), ut[F] = lt[F] / D.nsPsy.last_en_subshort[B][F + 4], ht[0] += lt[F];
                    if (2 == B)
                        for (F = 0; F < 576; F++) {
                            var vt, gt;
                            vt = W[0][F], gt = W[1][F], W[0][F] = vt + gt, W[1][F] = vt - gt
                        }
                    var St = W[1 & B],
                        wt = 0;
                    for (F = 0; F < 9; F++) {
                        for (var At = wt + 64, Tt = 1; wt < At; wt++) Tt < Math.abs(St[wt]) && (Tt = Math.abs(St[wt]));
                        D.nsPsy.last_en_subshort[B][F] = lt[F + 3] = Tt, ht[1 + F / 3] += Tt, Tt > lt[F + 3 - 2] ? (f(lt[F + 3 - 2] > 0), Tt /= lt[F + 3 - 2]) : lt[F + 3 - 2] > 10 * Tt ? (f(Tt > 0), Tt = lt[F + 3 - 2] / (10 * Tt)) : Tt = 0, ut[F + 3] = Tt
                    }
                    if (t.analysis) {
                        var xt = ut[0];
                        for (F = 1; F < 12; F++) xt < ut[F] && (xt = ut[F]);
                        D.pinfo.ers[o][B] = D.pinfo.ers_save[B], D.pinfo.ers_save[B] = xt
                    }
                    for (rt = 3 == B ? D.nsPsy.attackthre_s : D.nsPsy.attackthre, F = 0; F < 12; F++) 0 == dt[F / 3] && ut[F] > rt && (dt[F / 3] = F % 3 + 1);
                    for (F = 1; F < 4; F++) {
                        var Mt;
                        ht[F - 1] > ht[F] ? (f(ht[F] > 0), Mt = ht[F - 1] / ht[F]) : (f(ht[F - 1] > 0), Mt = ht[F] / ht[F - 1]), Mt < 1.7 && (dt[F] = 0, 1 == F && (dt[0] = 0))
                    }
                    for (0 != dt[0] && 0 != D.nsPsy.lastAttacks[B] && (dt[0] = 0), 3 != D.nsPsy.lastAttacks[B] && dt[0] + dt[1] + dt[2] + dt[3] == 0 || (ct = 0, 0 != dt[1] && 0 != dt[0] && (dt[1] = 0), 0 != dt[2] && 0 != dt[1] && (dt[2] = 0), 0 != dt[3] && 0 != dt[2] && (dt[3] = 0)), B < 2 ? z[B] = ct : 0 == ct && (z[0] = z[1] = 0), O[B] = D.tot_ener[B], st = U, nt = V, i(t, mt, yt, nt, 1 & B, st, 1 & B, o, B, e, n), k(D, mt, G, ft, _t), R(D, ft, _t, Q), I = 0; I < 3; I++) {
                        var kt, Rt;
                        for (w(t, yt, H, X, B, I), g(D, H, X, B, I), L = 0; L < d.SBMAX_s; L++) {
                            if (Rt = D.thm[B].s[L][I], Rt *= .8, dt[I] >= 2 || 1 == dt[I + 1]) {
                                var Ot = 0 != I ? I - 1 : 2,
                                    Tt = T(D.thm[B].s[L][Ot], Rt, .6 * N);
                                Rt = Math.min(Rt, Tt)
                            }
                            if (1 == dt[I]) {
                                var Ot = 0 != I ? I - 1 : 2,
                                    Tt = T(D.thm[B].s[L][Ot], Rt, ot * N);
                                Rt = Math.min(Rt, Tt)
                            } else if (0 != I && 3 == dt[I - 1] || 0 == I && 3 == D.nsPsy.lastAttacks[B]) {
                                var Ot = 2 != I ? I + 1 : 0,
                                    Tt = T(D.thm[B].s[L][Ot], Rt, ot * N);
                                Rt = Math.min(Rt, Tt)
                            }
                            kt = lt[3 * I + 3] + lt[3 * I + 4] + lt[3 * I + 5], 6 * lt[3 * I + 5] < kt && (Rt *= .5, 6 * lt[3 * I + 4] < kt && (Rt *= .5)), D.thm[B].s[L][I] = Rt
                        }
                    }
                    for (D.nsPsy.lastAttacks[B] = dt[2], j = 0, C = 0; C < D.npart_l; C++) {
                        for (var Et = D.s3ind[C][0], Pt = G[Et] * pt[Q[Et]], Bt = D.s3_ll[j++] * Pt; ++Et <= D.s3ind[C][1];) Pt = G[Et] * pt[Q[Et]], Bt = s(Bt, D.s3_ll[j++] * Pt, Et, Et - C, D, 0);
                        Bt *= .158489319246111, D.blocktype_old[1 & B] == d.SHORT_TYPE ? X[C] = Bt : X[C] = T(Math.min(Bt, Math.min(tt * D.nb_1[B][C], et * D.nb_2[B][C])), Bt, N), D.nb_2[B][C] = D.nb_1[B][C], D.nb_1[B][C] = Bt
                    }
                    for (; C <= d.CBANDS; ++C) G[C] = 0, X[C] = 0;
                    S(D, G, X, B)
                }
                if (t.mode != MPEGMode.STEREO && t.mode != MPEGMode.JOINT_STEREO || t.interChRatio > 0 && y(t, t.interChRatio), t.mode == MPEGMode.JOINT_STEREO) {
                    var Ct;
                    v(D), Ct = t.msfix, Math.abs(Ct) > 0 && b(D, Ct, t.ATHlower * D.ATH.adjust)
                }
                for (A(t, z, E, Y), B = 0; B < P; B++) {
                    var Ft, qt, jt, Lt = 0;
                    B > 1 ? (Ft = m, Lt = -2, qt = d.NORM_TYPE, E[0] != d.SHORT_TYPE && E[1] != d.SHORT_TYPE || (qt = d.SHORT_TYPE), jt = l[o][B - 2]) : (Ft = _, Lt = 0, qt = E[B], jt = a[o][B]), qt == d.SHORT_TYPE ? Ft[Lt + B] = x(jt, D.masking_lower) : Ft[Lt + B] = M(jt, D.masking_lower), t.analysis && (D.pinfo.pe[o][B] = Ft[Lt + B])
                }
                return 0
            };
            var gt = [-1.730326e-17, -.01703172, -1.349528e-17, .0418072, -6.73278e-17, -.0876324, -3.0835e-17, .1863476, -1.104424e-16, -.627638];
            this.L3psycho_anal_vbr = function(t, e, i, n, s, r, o, a, l, h) {
                var f, _, m = t.internal_flags,
                    y = u(d.HBLKSIZE),
                    v = c([3, d.HBLKSIZE_s]),
                    b = c([2, d.BLKSIZE]),
                    w = c([2, 3, d.BLKSIZE_s]),
                    A = c([4, d.CBANDS]),
                    k = c([4, d.CBANDS]),
                    R = c([4, 3]),
                    q = [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ],
                    V = p(2),
                    U = t.mode == MPEGMode.JOINT_STEREO ? 4 : m.channels_out;
                B(t, e, i, n, s, r, l, R, q, V), I(t, V);
                for (var G = 0; G < U; G++) {
                    var H = 1 & G;
                    f = b, O(t, e, i, G, n, y, f, H), P(t, n, G, y), 0 != V[H] ? L(m, y, A[G], k[G], G) : F(m, G)
                }
                V[0] + V[1] == 2 && t.mode == MPEGMode.JOINT_STEREO && D(A, k, m.mld_cb_l, m.ATH.cb_l, t.ATHlower * m.ATH.adjust, t.msfix, m.npart_l);
                for (var G = 0; G < U; G++) {
                    var H = 1 & G;
                    0 != V[H] && S(m, A[G], k[G], G)
                }
                for (var X = 0; X < 3; X++) {
                    for (var G = 0; G < U; ++G) {
                        var H = 1 & G;
                        0 != V[H] ? C(m, G, X) : (_ = w, E(t, e, i, G, X, v, _, H), j(t, v, A[G], k[G], G, X))
                    }
                    V[0] + V[1] == 0 && t.mode == MPEGMode.JOINT_STEREO && D(A, k, m.mld_cb_s, m.ATH.cb_s, t.ATHlower * m.ATH.adjust, t.msfix, m.npart_s);
                    for (var G = 0; G < U; ++G) {
                        var H = 1 & G;
                        0 == V[H] && g(m, A[G], k[G], G, X)
                    }
                }
                for (var G = 0; G < U; G++) {
                    var H = 1 & G;
                    if (0 == V[H])
                        for (var Y = 0; Y < d.SBMAX_s; Y++) {
                            for (var z = u(3), X = 0; X < 3; X++) {
                                var W = m.thm[G].s[Y][X];
                                if (W *= .8, q[G][X] >= 2 || 1 == q[G][X + 1]) {
                                    var Q = 0 != X ? X - 1 : 2,
                                        Z = T(m.thm[G].s[Y][Q], W, .36);
                                    W = Math.min(W, Z)
                                } else if (1 == q[G][X]) {
                                    var Q = 0 != X ? X - 1 : 2,
                                        Z = T(m.thm[G].s[Y][Q], W, .6 * ot);
                                    W = Math.min(W, Z)
                                } else if (0 != X && 3 == q[G][X - 1] || 0 == X && 3 == m.nsPsy.lastAttacks[G]) {
                                    var Q = 2 != X ? X + 1 : 0,
                                        Z = T(m.thm[G].s[Y][Q], W, .6 * ot);
                                    W = Math.min(W, Z)
                                }
                                W *= R[G][X], z[X] = W
                            }
                            for (var X = 0; X < 3; X++) m.thm[G].s[Y][X] = z[X]
                        }
                }
                for (var G = 0; G < U; G++) m.nsPsy.lastAttacks[G] = q[G][2];
                N(t, V, h);
                for (var G = 0; G < U; G++) {
                    var K, J, $, tt;
                    G > 1 ? (K = a, J = -2, $ = d.NORM_TYPE, h[0] != d.SHORT_TYPE && h[1] != d.SHORT_TYPE || ($ = d.SHORT_TYPE), tt = r[n][G - 2]) : (K = o, J = 0, $ = h[G], tt = s[n][G]), $ == d.SHORT_TYPE ? K[J + G] = x(tt, m.masking_lower) : K[J + G] = M(tt, m.masking_lower), t.analysis && (m.pinfo.pe[n][G] = K[J + G])
                }
                return 0
            }, this.psymodel_init = function(t) {
                var e, i = t.internal_flags,
                    s = !0,
                    a = 13,
                    l = 0,
                    h = 0,
                    c = -8.25,
                    p = -4.5,
                    _ = u(d.CBANDS),
                    m = u(d.CBANDS),
                    y = u(d.CBANDS),
                    v = t.out_samplerate;
                switch (t.experimentalZ) {
                    default:
                        case 0:
                        s = !0;
                    break;
                    case 1:
                            s = t.VBR != r.vbr_mtrh && t.VBR != r.vbr_mt;
                        break;
                    case 2:
                            s = !1;
                        break;
                    case 3:
                            a = 8,
                        l = -1.75,
                        h = -.0125,
                        c = -8.25,
                        p = -2.25
                }
                for (i.ms_ener_ratio_old = .25, i.blocktype_old[0] = i.blocktype_old[1] = d.NORM_TYPE, e = 0; e < 4; ++e) {
                    for (var b = 0; b < d.CBANDS; ++b) i.nb_1[e][b] = 1e20, i.nb_2[e][b] = 1e20, i.nb_s1[e][b] = i.nb_s2[e][b] = 1;
                    for (var g = 0; g < d.SBMAX_l; g++) i.en[e].l[g] = 1e20, i.thm[e].l[g] = 1e20;
                    for (var b = 0; b < 3; ++b) {
                        for (var g = 0; g < d.SBMAX_s; g++) i.en[e].s[g][b] = 1e20, i.thm[e].s[g][b] = 1e20;
                        i.nsPsy.lastAttacks[e] = 0
                    }
                    for (var b = 0; b < 9; b++) i.nsPsy.last_en_subshort[e][b] = 10
                }
                for (i.loudness_sq_save[0] = i.loudness_sq_save[1] = 0, i.npart_l = X(i.numlines_l, i.bo_l, i.bm_l, _, m, i.mld_l, i.PSY.bo_l_weight, v, d.BLKSIZE, i.scalefac_band.l, d.BLKSIZE / 1152, d.SBMAX_l), f(i.npart_l < d.CBANDS), e = 0; e < i.npart_l; e++) {
                    var S = l;
                    _[e] >= a && (S = h * (_[e] - a) / (24 - a) + l * (24 - _[e]) / (24 - a)), y[e] = Math.pow(10, S / 10), i.numlines_l[e] > 0 ? i.rnumlines_l[e] = 1 / i.numlines_l[e] : i.rnumlines_l[e] = 0
                }
                i.s3_ll = Y(i.s3ind, i.npart_l, _, m, y, s);
                var b = 0;
                for (e = 0; e < i.npart_l; e++) {
                    var w;
                    w = o.MAX_VALUE;
                    for (var A = 0; A < i.numlines_l[e]; A++, b++) {
                        var T, x = v * b / (1e3 * d.BLKSIZE);
                        T = this.ATHformula(1e3 * x, t) - 20, T = Math.pow(10, .1 * T), T *= i.numlines_l[e], w > T && (w = T)
                    }
                    i.ATH.cb_l[e] = w, w = 20 * _[e] / 10 - 20, w > 6 && (w = 100), w < -15 && (w = -15), w -= 8, i.minval_l[e] = Math.pow(10, w / 10) * i.numlines_l[e]
                }
                for (i.npart_s = X(i.numlines_s, i.bo_s, i.bm_s, _, m, i.mld_s, i.PSY.bo_s_weight, v, d.BLKSIZE_s, i.scalefac_band.s, d.BLKSIZE_s / 384, d.SBMAX_s), f(i.npart_s < d.CBANDS), b = 0, e = 0; e < i.npart_s; e++) {
                    var w, S = c;
                    _[e] >= a && (S = p * (_[e] - a) / (24 - a) + c * (24 - _[e]) / (24 - a)), y[e] = Math.pow(10, S / 10), w = o.MAX_VALUE;
                    for (var A = 0; A < i.numlines_s[e]; A++, b++) {
                        var T, x = v * b / (1e3 * d.BLKSIZE_s);
                        T = this.ATHformula(1e3 * x, t) - 20, T = Math.pow(10, .1 * T), T *= i.numlines_s[e], w > T && (w = T)
                    }
                    i.ATH.cb_s[e] = w, w = 7 * _[e] / 12 - 7, _[e] > 12 && (w *= 1 + 3.1 * Math.log(1 + w)), _[e] < 12 && (w *= 1 + 2.3 * Math.log(1 - w)), w < -15 && (w = -15), w -= 8, i.minval_s[e] = Math.pow(10, w / 10) * i.numlines_s[e]
                }
                i.s3_ss = Y(i.s3ind_s, i.npart_s, _, m, y, s), n(), J.init_fft(i), i.decay = Math.exp(-1 * $ / (.01 * v / 192));
                var M;
                M = 3.5, 0 != (2 & t.exp_nspsytune) && (M = 1), Math.abs(t.msfix) > 0 && (M = t.msfix), t.msfix = M;
                for (var k = 0; k < i.npart_l; k++) i.s3ind[k][1] > i.npart_l - 1 && (i.s3ind[k][1] = i.npart_l - 1);
                var R = 576 * i.mode_gr / v;
                if (i.ATH.decay = Math.pow(10, -1.2 * R), i.ATH.adjust = .01, i.ATH.adjustLimit = 1, f(i.bo_l[d.SBMAX_l - 1] <= i.npart_l), f(i.bo_s[d.SBMAX_s - 1] <= i.npart_s), -1 != t.ATHtype) {
                    var x, O = t.out_samplerate / d.BLKSIZE,
                        E = 0;
                    for (x = 0, e = 0; e < d.BLKSIZE / 2; ++e) x += O, i.ATH.eql_w[e] = 1 / Math.pow(10, this.ATHformula(x, t) / 10), E += i.ATH.eql_w[e];
                    for (E = 1 / E, e = d.BLKSIZE / 2; --e >= 0;) i.ATH.eql_w[e] *= E
                }
                for (var k = b = 0; k < i.npart_s; ++k)
                    for (e = 0; e < i.numlines_s[k]; ++e) ++b;
                f(129 == b);
                for (var k = b = 0; k < i.npart_l; ++k)
                    for (e = 0; e < i.numlines_l[k]; ++e) ++b;
                for (f(513 == b), b = 0, e = 0; e < i.npart_l; e++) {
                    var x = v * (b + i.numlines_l[e] / 2) / (1 * d.BLKSIZE);
                    i.mld_cb_l[e] = z(x), b += i.numlines_l[e]
                }
                for (; e < d.CBANDS; ++e) i.mld_cb_l[e] = 1;
                for (b = 0, e = 0; e < i.npart_s; e++) {
                    var x = v * (b + i.numlines_s[e] / 2) / (1 * d.BLKSIZE_s);
                    i.mld_cb_s[e] = z(x), b += i.numlines_s[e]
                }
                for (; e < d.CBANDS; ++e) i.mld_cb_s[e] = 1;
                return 0
            }, this.ATHformula = function(t, e) {
                var i;
                switch (e.ATHtype) {
                    case 0:
                        i = W(t, 9);
                        break;
                    case 1:
                        i = W(t, -1);
                        break;
                    case 2:
                        i = W(t, 0);
                        break;
                    case 3:
                        i = W(t, 1) + 6;
                        break;
                    case 4:
                        i = W(t, e.ATHcurve);
                        break;
                    default:
                        i = W(t, 0)
                }
                return i
            }
        }
        var s = i(384),
            r = (s.System, s.VbrMode),
            o = s.Float,
            a = s.ShortBlock,
            l = s.Util,
            h = s.Arrays,
            u = (s.new_array_n, s.new_byte, s.new_double, s.new_float),
            c = s.new_float_n,
            p = s.new_int,
            f = (s.new_int_n, s.assert),
            _ = i(482),
            d = i(388);
        t.exports = n
    },
    491: function(t, e, i) {
        function n() {
            function t(t, e, i, n) {
                n = 0;
                for (var s = 0; s <= i; ++s) {
                    var r = Math.abs(t.xr[s]);
                    n += r, e[s] = Math.sqrt(r * Math.sqrt(r)), e[s] > t.xrpow_max && (t.xrpow_max = e[s])
                }
                return n
            }

            function e(t, e) {
                var i = t.ATH,
                    n = e.xr;
                if (e.block_type != _.SHORT_TYPE)
                    for (var s = !1, r = _.PSFB21 - 1; r >= 0 && !s; r--) {
                        var o = t.scalefac_band.psfb21[r],
                            a = t.scalefac_band.psfb21[r + 1],
                            l = M.athAdjust(i.adjust, i.psfb21[r], i.floor);
                        t.nsPsy.longfact[21] > 1e-12 && (l *= t.nsPsy.longfact[21]);
                        for (var h = a - 1; h >= o; h--) {
                            if (!(Math.abs(n[h]) < l)) {
                                s = !0;
                                break
                            }
                            n[h] = 0
                        }
                    } else
                        for (var u = 0; u < 3; u++)
                            for (var s = !1, r = _.PSFB12 - 1; r >= 0 && !s; r--) {
                                var o = 3 * t.scalefac_band.s[12] + (t.scalefac_band.s[13] - t.scalefac_band.s[12]) * u + (t.scalefac_band.psfb12[r] - t.scalefac_band.psfb12[0]),
                                    a = o + (t.scalefac_band.psfb12[r + 1] - t.scalefac_band.psfb12[r]),
                                    c = M.athAdjust(i.adjust, i.psfb12[r], i.floor);
                                t.nsPsy.shortfact[12] > 1e-12 && (c *= t.nsPsy.shortfact[12]);
                                for (var h = a - 1; h >= o; h--) {
                                    if (!(Math.abs(n[h]) < c)) {
                                        s = !0;
                                        break
                                    }
                                    n[h] = 0
                                }
                            }
            }

            function i(t) {
                this.ordinal = t
            }

            function n(t, e, n, s, r) {
                var o, a = t.CurrentStep[s],
                    l = !1,
                    h = t.OldValue[s],
                    c = i.BINSEARCH_NONE;
                for (e.global_gain = h, n -= e.part2_length, u(0 != a);;) {
                    var p;
                    if (o = k.count_bits(t, r, e, null), 1 == a || o == n) break;
                    o > n ? (c == i.BINSEARCH_DOWN && (l = !0), l && (a /= 2), c = i.BINSEARCH_UP, p = a) : (c == i.BINSEARCH_UP && (l = !0), l && (a /= 2), c = i.BINSEARCH_DOWN, p = -a), e.global_gain += p, e.global_gain < 0 && (e.global_gain = 0, l = !0), e.global_gain > 255 && (e.global_gain = 255, l = !0)
                }
                for (u(e.global_gain >= 0), u(e.global_gain < 256); o > n && e.global_gain < 255;) e.global_gain++, o = k.count_bits(t, r, e, null);
                return t.CurrentStep[s] = h - e.global_gain >= 4 ? 4 : 2, t.OldValue[s] = e.global_gain, e.part2_3_length = o, o
            }

            function s(t) {
                for (var e = 0; e < t.sfbmax; e++)
                    if (t.scalefac[e] + t.subblock_gain[t.window[e]] == 0) return !1;
                return !0
            }

            function y(t) {
                return a.FAST_LOG10(.368 + .632 * t * t * t)
            }

            function v(t, e) {
                for (var i = 1e-37, n = 0; n < e.psymax; n++) i += y(t[n]);
                return Math.max(1e-20, i)
            }

            function b(t, e, i, n, s) {
                var r;
                switch (t) {
                    default:
                        case 9:
                        e.over_count > 0 ? (r = i.over_SSD <= e.over_SSD, i.over_SSD == e.over_SSD && (r = i.bits < e.bits)) : r = i.max_noise < 0 && 10 * i.max_noise + i.bits <= 10 * e.max_noise + e.bits;
                    break;
                    case 0:
                            r = i.over_count < e.over_count || i.over_count == e.over_count && i.over_noise < e.over_noise || i.over_count == e.over_count && BitStream.EQ(i.over_noise, e.over_noise) && i.tot_noise < e.tot_noise;
                        break;
                    case 8:
                            i.max_noise = v(s, n);
                    case 1:
                            r = i.max_noise < e.max_noise;
                        break;
                    case 2:
                            r = i.tot_noise < e.tot_noise;
                        break;
                    case 3:
                            r = i.tot_noise < e.tot_noise && i.max_noise < e.max_noise;
                        break;
                    case 4:
                            r = i.max_noise <= 0 && e.max_noise > .2 || i.max_noise <= 0 && e.max_noise < 0 && e.max_noise > i.max_noise - .2 && i.tot_noise < e.tot_noise || i.max_noise <= 0 && e.max_noise > 0 && e.max_noise > i.max_noise - .2 && i.tot_noise < e.tot_noise + e.over_noise || i.max_noise > 0 && e.max_noise > -.05 && e.max_noise > i.max_noise - .1 && i.tot_noise + i.over_noise < e.tot_noise + e.over_noise || i.max_noise > 0 && e.max_noise > -.1 && e.max_noise > i.max_noise - .15 && i.tot_noise + i.over_noise + i.over_noise < e.tot_noise + e.over_noise + e.over_noise;
                        break;
                    case 5:
                            r = i.over_noise < e.over_noise || BitStream.EQ(i.over_noise, e.over_noise) && i.tot_noise < e.tot_noise;
                        break;
                    case 6:
                            r = i.over_noise < e.over_noise || BitStream.EQ(i.over_noise, e.over_noise) && (i.max_noise < e.max_noise || BitStream.EQ(i.max_noise, e.max_noise) && i.tot_noise <= e.tot_noise);
                        break;
                    case 7:
                            r = i.over_count < e.over_count || i.over_noise < e.over_noise
                }
                return 0 == e.over_count && (r = r && i.bits < e.bits), r
            }

            function g(t, e, i, n, s) {
                var r, o = t.internal_flags;
                r = 0 == e.scalefac_scale ? 1.2968395546510096 : 1.6817928305074292;
                for (var a = 0, l = 0; l < e.sfbmax; l++) a < i[l] && (a = i[l]);
                var h = o.noise_shaping_amp;
                switch (3 == h && (h = s ? 2 : 1), h) {
                    case 2:
                        break;
                    case 1:
                        a > 1 ? a = Math.pow(a, .5) : a *= .95;
                        break;
                    case 0:
                    default:
                        a > 1 ? a = 1 : a *= .95
                }
                for (var u = 0, l = 0; l < e.sfbmax; l++) {
                    var c, p = e.width[l];
                    if (u += p, !(i[l] < a)) {
                        if (0 != (2 & o.substep_shaping) && (o.pseudohalf[l] = 0 == o.pseudohalf[l] ? 1 : 0, 0 == o.pseudohalf[l] && 2 == o.noise_shaping_amp)) return;
                        for (e.scalefac[l]++, c = -p; c < 0; c++) n[u + c] *= r, n[u + c] > e.xrpow_max && (e.xrpow_max = n[u + c]);
                        if (2 == o.noise_shaping_amp) return
                    }
                }
            }

            function S(t, e) {
                for (var i = 0, n = 0; n < t.sfbmax; n++) {
                    var s = t.width[n],
                        r = t.scalefac[n];
                    if (0 != t.preflag && (r += M.pretab[n]), i += s, 0 != (1 & r)) {
                        r++;
                        for (var o = -s; o < 0; o++) e[i + o] *= 1.2968395546510096, e[i + o] > t.xrpow_max && (t.xrpow_max = e[i + o])
                    }
                    t.scalefac[n] = r >> 1
                }
                t.preflag = 0, t.scalefac_scale = 1
            }

            function w(t, e, i) {
                var n, s = e.scalefac;
                for (n = 0; n < e.sfb_lmax; n++)
                    if (s[n] >= 16) return !0;
                for (var r = 0; r < 3; r++) {
                    var o = 0,
                        a = 0;
                    for (n = e.sfb_lmax + r; n < e.sfbdivide; n += 3) o < s[n] && (o = s[n]);
                    for (; n < e.sfbmax; n += 3) a < s[n] && (a = s[n]);
                    if (!(o < 16 && a < 8)) {
                        if (e.subblock_gain[r] >= 7) return !0;
                        e.subblock_gain[r]++;
                        var l = t.scalefac_band.l[e.sfb_lmax];
                        for (n = e.sfb_lmax + r; n < e.sfbmax; n += 3) {
                            var h, c = e.width[n],
                                p = s[n];
                            if (u(p >= 0), (p -= 4 >> e.scalefac_scale) >= 0) s[n] = p, l += 3 * c;
                            else {
                                s[n] = 0;
                                var f = 210 + (p << e.scalefac_scale + 1);
                                h = M.IPOW20(f), l += c * (r + 1);
                                for (var _ = -c; _ < 0; _++) i[l + _] *= h, i[l + _] > e.xrpow_max && (e.xrpow_max = i[l + _]);
                                l += c * (3 - r - 1)
                            }
                        }
                        var h = M.IPOW20(202);
                        l += e.width[n] * (r + 1);
                        for (var _ = -e.width[n]; _ < 0; _++) i[l + _] *= h, i[l + _] > e.xrpow_max && (e.xrpow_max = i[l + _])
                    }
                }
                return !1
            }

            function A(t, e, i, n, r) {
                var o = t.internal_flags;
                g(t, e, i, n, r);
                var a = s(e);
                return !a && (!(a = 2 == o.mode_gr ? k.scale_bitcount(e) : k.scale_bitcount_lsf(o, e)) || (o.noise_shaping > 1 && (l.fill(o.pseudohalf, 0), 0 == e.scalefac_scale ? (S(e, n), a = !1) : e.block_type == _.SHORT_TYPE && o.subblock_gain > 0 && (a = w(o, e, n) || s(e))), a || (a = 2 == o.mode_gr ? k.scale_bitcount(e) : k.scale_bitcount_lsf(o, e)), !a))
            }
            var T;
            this.rv = null;
            var x;
            this.qupvt = null;
            var M, k, R = new c;
            this.setModules = function(t, e, i, n) {
                T = t, x = e, this.rv = e, M = i, this.qupvt = i, k = n, R.setModules(M, k)
            }, this.ms_convert = function(t, e) {
                for (var i = 0; i < 576; ++i) {
                    var n = t.tt[e][0].xr[i],
                        s = t.tt[e][1].xr[i];
                    t.tt[e][0].xr[i] = (n + s) * (.5 * a.SQRT2), t.tt[e][1].xr[i] = (n - s) * (.5 * a.SQRT2)
                }
            }, this.init_xrpow = function(e, i, n) {
                var s = 0,
                    r = 0 | i.max_nonzero_coeff;
                if (u(null != n), i.xrpow_max = 0, u(0 <= r && r <= 575), l.fill(n, r, 576, 0), (s = t(i, n, r, s)) > 1e-20) {
                    var o = 0;
                    0 != (2 & e.substep_shaping) && (o = 1);
                    for (var a = 0; a < i.psymax; a++) e.pseudohalf[a] = o;
                    return !0
                }
                return l.fill(i.l3_enc, 0, 576, 0), !1
            }, this.init_outer_loop = function(t, i) {
                i.part2_3_length = 0, i.big_values = 0, i.count1 = 0, i.global_gain = 210, i.scalefac_compress = 0, i.table_select[0] = 0, i.table_select[1] = 0, i.table_select[2] = 0, i.subblock_gain[0] = 0, i.subblock_gain[1] = 0, i.subblock_gain[2] = 0, i.subblock_gain[3] = 0, i.region0_count = 0, i.region1_count = 0, i.preflag = 0, i.scalefac_scale = 0, i.count1table_select = 0, i.part2_length = 0, i.sfb_lmax = _.SBPSY_l, i.sfb_smin = _.SBPSY_s, i.psy_lmax = t.sfb21_extra ? _.SBMAX_l : _.SBPSY_l, i.psymax = i.psy_lmax, i.sfbmax = i.sfb_lmax, i.sfbdivide = 11;
                for (var n = 0; n < _.SBMAX_l; n++) i.width[n] = t.scalefac_band.l[n + 1] - t.scalefac_band.l[n], i.window[n] = 3;
                if (i.block_type == _.SHORT_TYPE) {
                    var s = h(576);
                    i.sfb_smin = 0, i.sfb_lmax = 0, 0 != i.mixed_block_flag && (i.sfb_smin = 3, i.sfb_lmax = 2 * t.mode_gr + 4), i.psymax = i.sfb_lmax + 3 * ((t.sfb21_extra ? _.SBMAX_s : _.SBPSY_s) - i.sfb_smin), i.sfbmax = i.sfb_lmax + 3 * (_.SBPSY_s - i.sfb_smin), i.sfbdivide = i.sfbmax - 18, i.psy_lmax = i.sfb_lmax;
                    var o = t.scalefac_band.l[i.sfb_lmax];
                    r.arraycopy(i.xr, 0, s, 0, 576);
                    for (var n = i.sfb_smin; n < _.SBMAX_s; n++)
                        for (var a = t.scalefac_band.s[n], u = t.scalefac_band.s[n + 1], c = 0; c < 3; c++)
                            for (var p = a; p < u; p++) i.xr[o++] = s[3 * p + c];
                    for (var f = i.sfb_lmax, n = i.sfb_smin; n < _.SBMAX_s; n++) i.width[f] = i.width[f + 1] = i.width[f + 2] = t.scalefac_band.s[n + 1] - t.scalefac_band.s[n], i.window[f] = 0, i.window[f + 1] = 1, i.window[f + 2] = 2, f += 3
                }
                i.count1bits = 0, i.sfb_partition_table = M.nr_of_sfb_block[0][0], i.slen[0] = 0, i.slen[1] = 0, i.slen[2] = 0, i.slen[3] = 0, i.max_nonzero_coeff = 575, l.fill(i.scalefac, 0), e(t, i)
            }, i.BINSEARCH_NONE = new i(0), i.BINSEARCH_UP = new i(1), i.BINSEARCH_DOWN = new i(2), this.trancate_smallspectrums = function(t, e, i, n) {
                var s = h(m.SFBMAX);
                if ((0 != (4 & t.substep_shaping) || e.block_type != _.SHORT_TYPE) && 0 == (128 & t.substep_shaping)) {
                    M.calc_noise(e, i, s, new p, null);
                    for (var r = 0; r < 576; r++) {
                        var o = 0;
                        0 != e.l3_enc[r] && (o = Math.abs(e.xr[r])), n[r] = o
                    }
                    var r = 0,
                        a = 8;
                    e.block_type == _.SHORT_TYPE && (a = 6);
                    do {
                        var u, c, f, d, y = e.width[a];
                        if (r += y, !(s[a] >= 1 || (l.sort(n, r - y, y), BitStream.EQ(n[r - 1], 0)))) {
                            u = (1 - s[a]) * i[a], c = 0, d = 0;
                            do {
                                var v;
                                for (f = 1; d + f < y && !BitStream.NEQ(n[d + r - y], n[d + r + f - y]); f++);
                                if (v = n[d + r - y] * n[d + r - y] * f, u < v) {
                                    0 != d && (c = n[d + r - y - 1]);
                                    break
                                }
                                u -= v, d += f
                            } while (d < y);
                            if (!BitStream.EQ(c, 0))
                                do {
                                    Math.abs(e.xr[r - y]) <= c && (e.l3_enc[r - y] = 0)
                                } while (--y > 0)
                        }
                    } while (++a < e.psymax);
                    e.part2_3_length = k.noquant_count_bits(t, e, null)
                }
            }, this.outer_loop = function(t, e, i, s, a, l) {
                var c, y = t.internal_flags,
                    v = new d,
                    g = h(576),
                    S = h(m.SFBMAX),
                    w = new p,
                    T = new f,
                    x = 9999999,
                    R = !1,
                    O = !1,
                    E = 0;
                if (n(y, e, l, a, s), 0 == y.noise_shaping) return 100;
                M.calc_noise(e, i, S, w, T), w.bits = e.part2_3_length, v.assign(e);
                var P = 0;
                for (r.arraycopy(s, 0, g, 0, 576); !R;) {
                    do {
                        var B, C = new p,
                            F = 255;
                        if (B = 0 != (2 & y.substep_shaping) ? 20 : 3, y.sfb21_extra) {
                            if (S[v.sfbmax] > 1) break;
                            if (v.block_type == _.SHORT_TYPE && (S[v.sfbmax + 1] > 1 || S[v.sfbmax + 2] > 1)) break
                        }
                        if (!A(t, v, S, s, O)) break;
                        0 != v.scalefac_scale && (F = 254);
                        var q = l - v.part2_length;
                        if (q <= 0) break;
                        for (;
                            (v.part2_3_length = k.count_bits(y, s, v, T)) > q && v.global_gain <= F;) v.global_gain++;
                        if (v.global_gain > F) break;
                        if (0 == w.over_count) {
                            for (;
                                (v.part2_3_length = k.count_bits(y, s, v, T)) > x && v.global_gain <= F;) v.global_gain++;
                            if (v.global_gain > F) break
                        }
                        if (M.calc_noise(v, i, S, C, T), C.bits = v.part2_3_length, c = e.block_type != _.SHORT_TYPE ? t.quant_comp : t.quant_comp_short, 0 != (c = b(c, w, C, v, S) ? 1 : 0)) x = e.part2_3_length, w = C, e.assign(v), P = 0, r.arraycopy(s, 0, g, 0, 576);
                        else if (0 == y.full_outer_loop) {
                            if (++P > B && 0 == w.over_count) break;
                            if (3 == y.noise_shaping_amp && O && P > 30) break;
                            if (3 == y.noise_shaping_amp && O && v.global_gain - E > 15) break
                        }
                    } while (v.global_gain + v.scalefac_scale < 255);
                    3 == y.noise_shaping_amp ? O ? R = !0 : (v.assign(e), r.arraycopy(g, 0, s, 0, 576), P = 0, E = v.global_gain, O = !0) : R = !0
                }
                return u(e.global_gain + e.scalefac_scale <= 255), t.VBR == o.vbr_rh || t.VBR == o.vbr_mtrh ? r.arraycopy(g, 0, s, 0, 576) : 0 != (1 & y.substep_shaping) && trancate_smallspectrums(y, e, i, s), w.over_count
            }, this.iteration_finish_one = function(t, e, i) {
                var n = t.l3_side,
                    s = n.tt[e][i];
                k.best_scalefac_store(t, e, i, n), 1 == t.use_best_huffman && k.best_huffman_divide(t, s), x.ResvAdjust(t, s)
            }, this.VBR_encode_granule = function(t, e, i, n, s, o, a) {
                var c, p, f = t.internal_flags,
                    _ = new d,
                    m = h(576),
                    y = a,
                    v = a + 1,
                    b = (a + o) / 2,
                    g = 0,
                    S = f.sfb21_extra;
                u(y <= LameInternalFlags.MAX_BITS_PER_CHANNEL), l.fill(_.l3_enc, 0);
                do {
                    u(b >= o), u(b <= a), u(o <= a), f.sfb21_extra = !(b > y - 42) && S, p = outer_loop(t, e, i, n, s, b), p <= 0 ? (g = 1, v = e.part2_3_length, _.assign(e), r.arraycopy(n, 0, m, 0, 576), a = v - 32, c = a - o, b = (a + o) / 2) : (o = b + 32, c = a - o, b = (a + o) / 2, 0 != g && (g = 2, e.assign(_), r.arraycopy(m, 0, n, 0, 576)))
                } while (c > 12);
                f.sfb21_extra = S, 2 == g && r.arraycopy(_.l3_enc, 0, e.l3_enc, 0, 576), u(e.part2_3_length <= y)
            }, this.get_framebits = function(t, e) {
                var i = t.internal_flags;
                i.bitrate_index = i.VBR_min_bitrate;
                var n = T.getframebits(t);
                i.bitrate_index = 1, n = T.getframebits(t);
                for (var s = 1; s <= i.VBR_max_bitrate; s++) {
                    i.bitrate_index = s;
                    var r = new MeanBits(n);
                    e[s] = x.ResvFrameBegin(t, r), n = r.bits
                }
            }, this.VBR_old_prepare = function(t, e, i, n, s, r, o, a, l) {
                var h, u = t.internal_flags,
                    c = 0,
                    p = 1,
                    f = 0;
                u.bitrate_index = u.VBR_max_bitrate;
                var d = x.ResvFrameBegin(t, new MeanBits(0)) / u.mode_gr;
                get_framebits(t, r);
                for (var m = 0; m < u.mode_gr; m++) {
                    var y = M.on_pe(t, e, a[m], d, m, 0);
                    u.mode_ext == _.MPG_MD_MS_LR && (ms_convert(u.l3_side, m), M.reduce_side(a[m], i[m], d, y));
                    for (var v = 0; v < u.channels_out; ++v) {
                        var b = u.l3_side.tt[m][v];
                        b.block_type != _.SHORT_TYPE ? (c = 1.28 / (1 + Math.exp(3.5 - e[m][v] / 300)) - .05, h = u.PSY.mask_adjust - c) : (c = 2.56 / (1 + Math.exp(3.5 - e[m][v] / 300)) - .14, h = u.PSY.mask_adjust_short - c), u.masking_lower = Math.pow(10, .1 * h), init_outer_loop(u, b), l[m][v] = M.calc_xmin(t, n[m][v], b, s[m][v]), 0 != l[m][v] && (p = 0), o[m][v] = 126, f += a[m][v]
                    }
                }
                for (var m = 0; m < u.mode_gr; m++)
                    for (var v = 0; v < u.channels_out; v++) f > r[u.VBR_max_bitrate] && (a[m][v] *= r[u.VBR_max_bitrate], a[m][v] /= f), o[m][v] > a[m][v] && (o[m][v] = a[m][v]);
                return p
            }, this.bitpressure_strategy = function(t, e, i, n) {
                for (var s = 0; s < t.mode_gr; s++)
                    for (var r = 0; r < t.channels_out; r++) {
                        for (var o = t.l3_side.tt[s][r], a = e[s][r], l = 0, h = 0; h < o.psy_lmax; h++) a[l++] *= 1 + .029 * h * h / _.SBMAX_l / _.SBMAX_l;
                        if (o.block_type == _.SHORT_TYPE)
                            for (var h = o.sfb_smin; h < _.SBMAX_s; h++) a[l++] *= 1 + .029 * h * h / _.SBMAX_s / _.SBMAX_s, a[l++] *= 1 + .029 * h * h / _.SBMAX_s / _.SBMAX_s, a[l++] *= 1 + .029 * h * h / _.SBMAX_s / _.SBMAX_s;
                        n[s][r] = 0 | Math.max(i[s][r], .9 * n[s][r])
                    }
            }, this.VBR_new_prepare = function(t, e, i, n, s, r) {
                var o, a = t.internal_flags,
                    l = 1,
                    h = 0,
                    u = 0;
                if (t.free_format) {
                    a.bitrate_index = 0;
                    var c = new MeanBits(h);
                    o = x.ResvFrameBegin(t, c), h = c.bits, s[0] = o
                } else {
                    a.bitrate_index = a.VBR_max_bitrate;
                    var c = new MeanBits(h);
                    x.ResvFrameBegin(t, c), h = c.bits, get_framebits(t, s), o = s[a.VBR_max_bitrate]
                }
                for (var p = 0; p < a.mode_gr; p++) {
                    M.on_pe(t, e, r[p], h, p, 0), a.mode_ext == _.MPG_MD_MS_LR && ms_convert(a.l3_side, p);
                    for (var f = 0; f < a.channels_out; ++f) {
                        var d = a.l3_side.tt[p][f];
                        a.masking_lower = Math.pow(10, .1 * a.PSY.mask_adjust), init_outer_loop(a, d), 0 != M.calc_xmin(t, i[p][f], d, n[p][f]) && (l = 0), u += r[p][f]
                    }
                }
                for (var p = 0; p < a.mode_gr; p++)
                    for (var f = 0; f < a.channels_out; f++) u > o && (r[p][f] *= o, r[p][f] /= u);
                return l
            }, this.calc_target_bits = function(t, e, i, n, s, r) {
                var o, a, l, h, u = t.internal_flags,
                    c = u.l3_side,
                    p = 0;
                u.bitrate_index = u.VBR_max_bitrate;
                var f = new MeanBits(p);
                for (r[0] = x.ResvFrameBegin(t, f), p = f.bits, u.bitrate_index = 1, p = T.getframebits(t) - 8 * u.sideinfo_len, s[0] = p / (u.mode_gr * u.channels_out), p = t.VBR_mean_bitrate_kbps * t.framesize * 1e3, 0 != (1 & u.substep_shaping) && (p *= 1.09), p /= t.out_samplerate, p -= 8 * u.sideinfo_len, p /= u.mode_gr * u.channels_out, o = .93 + .07 * (11 - t.compression_ratio) / 5.5, o < .9 && (o = .9), o > 1 && (o = 1), a = 0; a < u.mode_gr; a++) {
                    var d = 0;
                    for (l = 0; l < u.channels_out; l++) {
                        if (n[a][l] = int(o * p), e[a][l] > 700) {
                            var m = int((e[a][l] - 700) / 1.4),
                                y = c.tt[a][l];
                            n[a][l] = int(o * p), y.block_type == _.SHORT_TYPE && m < p / 2 && (m = p / 2), m > 3 * p / 2 ? m = 3 * p / 2 : m < 0 && (m = 0), n[a][l] += m
                        }
                        n[a][l] > LameInternalFlags.MAX_BITS_PER_CHANNEL && (n[a][l] = LameInternalFlags.MAX_BITS_PER_CHANNEL), d += n[a][l]
                    }
                    if (d > LameInternalFlags.MAX_BITS_PER_GRANULE)
                        for (l = 0; l < u.channels_out; ++l) n[a][l] *= LameInternalFlags.MAX_BITS_PER_GRANULE, n[a][l] /= d
                }
                if (u.mode_ext == _.MPG_MD_MS_LR)
                    for (a = 0; a < u.mode_gr; a++) M.reduce_side(n[a], i[a], p * u.channels_out, LameInternalFlags.MAX_BITS_PER_GRANULE);
                for (h = 0, a = 0; a < u.mode_gr; a++)
                    for (l = 0; l < u.channels_out; l++) n[a][l] > LameInternalFlags.MAX_BITS_PER_CHANNEL && (n[a][l] = LameInternalFlags.MAX_BITS_PER_CHANNEL), h += n[a][l];
                if (h > r[0])
                    for (a = 0; a < u.mode_gr; a++)
                        for (l = 0; l < u.channels_out; l++) n[a][l] *= r[0], n[a][l] /= h
            }
        }
        var s = i(384),
            r = s.System,
            o = s.VbrMode,
            a = (s.Float, s.ShortBlock, s.Util),
            l = s.Arrays,
            h = (s.new_array_n, s.new_byte, s.new_double, s.new_float),
            u = (s.new_float_n, s.new_int, s.new_int_n, s.assert),
            c = i(494),
            p = i(481),
            f = i(480),
            _ = i(388),
            d = i(431),
            m = i(427);
        t.exports = n
    },
    492: function(t, e, i) {
        function n() {
            this.linprebuf = r(2 * a.MAX_ORDER), this.linpre = 0, this.lstepbuf = r(a.MAX_SAMPLES_PER_WINDOW + a.MAX_ORDER), this.lstep = 0, this.loutbuf = r(a.MAX_SAMPLES_PER_WINDOW + a.MAX_ORDER), this.lout = 0, this.rinprebuf = r(2 * a.MAX_ORDER), this.rinpre = 0, this.rstepbuf = r(a.MAX_SAMPLES_PER_WINDOW + a.MAX_ORDER), this.rstep = 0, this.routbuf = r(a.MAX_SAMPLES_PER_WINDOW + a.MAX_ORDER), this.rout = 0, this.sampleWindow = 0, this.totsamp = 0, this.lsum = 0, this.rsum = 0, this.freqindex = 0, this.first = 0, this.A = o(0 | a.STEPS_per_dB * a.MAX_dB), this.B = o(0 | a.STEPS_per_dB * a.MAX_dB)
        }
        var s = i(384),
            r = (s.System, s.VbrMode, s.Float, s.ShortBlock, s.Util, s.Arrays, s.new_array_n, s.new_byte, s.new_double, s.new_float),
            o = (s.new_float_n, s.new_int),
            a = (s.new_int_n, s.assert, i(440));
        t.exports = n
    },
    493: function(t, e, i) {
        function n() {
            var t;
            this.setModules = function(e) {
                t = e
            }, this.ResvFrameBegin = function(e, i) {
                var n, s = e.internal_flags,
                    o = s.l3_side,
                    a = t.getframebits(e);
                i.bits = (a - 8 * s.sideinfo_len) / s.mode_gr;
                var l = 2048 * s.mode_gr - 8;
                e.brate > 320 ? n = 8 * int(1e3 * e.brate / (e.out_samplerate / 1152) / 8 + .5) : (n = 11520, e.strict_ISO && (n = 8 * int(32e4 / (e.out_samplerate / 1152) / 8 + .5))), s.ResvMax = n - a, s.ResvMax > l && (s.ResvMax = l), (s.ResvMax < 0 || e.disable_reservoir) && (s.ResvMax = 0);
                var h = i.bits * s.mode_gr + Math.min(s.ResvSize, s.ResvMax);
                return h > n && (h = n), r(0 == s.ResvMax % 8), r(s.ResvMax >= 0), o.resvDrain_pre = 0, null != s.pinfo && (s.pinfo.mean_bits = i.bits / 2, s.pinfo.resvsize = s.ResvSize), h
            }, this.ResvMaxBits = function(t, e, i, n) {
                var s, r = t.internal_flags,
                    o = r.ResvSize,
                    a = r.ResvMax;
                0 != n && (o += e), 0 != (1 & r.substep_shaping) && (a *= .9), i.bits = e, 10 * o > 9 * a ? (s = o - 9 * a / 10, i.bits += s, r.substep_shaping |= 128) : (s = 0, r.substep_shaping &= 127, t.disable_reservoir || 0 != (1 & r.substep_shaping) || (i.bits -= .1 * e));
                var l = o < 6 * r.ResvMax / 10 ? o : 6 * r.ResvMax / 10;
                return l -= s, l < 0 && (l = 0), l
            }, this.ResvAdjust = function(t, e) {
                t.ResvSize -= e.part2_3_length + e.part2_length
            }, this.ResvFrameEnd = function(t, e) {
                var i, n = t.l3_side;
                t.ResvSize += e * t.mode_gr;
                var s = 0;
                n.resvDrain_post = 0, n.resvDrain_pre = 0, 0 != (i = t.ResvSize % 8) && (s += i), (i = t.ResvSize - s - t.ResvMax) > 0 && (r(0 == i % 8), r(i >= 0), s += i);
                var o = Math.min(8 * n.main_data_begin, s) / 8;
                n.resvDrain_pre += 8 * o, s -= 8 * o, t.ResvSize -= 8 * o, n.main_data_begin -= o, n.resvDrain_post += s, t.ResvSize -= s
            }
        }
        var s = i(384),
            r = s.assert;
        t.exports = n
    },
    494: function(t, e) {
        function i() {
            var t, e;
            this.setModules = function(i, n) {
                t = i, e = n
            }
        }
        t.exports = i
    },
    495: function(t, e) {
        function i() {
            this.sum = 0, this.seen = 0, this.want = 0, this.pos = 0, this.size = 0, this.bag = null, this.nVbrNumFrames = 0, this.nBytesWritten = 0, this.TotalFrameSize = 0
        }
        t.exports = i
    },
    496: function(t, e, i) {
        function n() {
            function t(t, e) {
                if (t.nVbrNumFrames++, t.sum += e, !(++t.seen < t.want) && (t.pos < t.size && (t.bag[t.pos] = t.sum, t.pos++, t.seen = 0), t.pos == t.size)) {
                    for (var i = 1; i < t.size; i += 2) t.bag[i / 2] = t.bag[i];
                    t.want *= 2, t.pos /= 2
                }
            }

            function e(t, e) {
                if (!(t.pos <= 0))
                    for (var i = 1; i < S; ++i) {
                        var n, s, r = i / S,
                            o = 0 | Math.floor(r * t.pos);
                        o > t.pos - 1 && (o = t.pos - 1), n = t.bag[o], s = t.sum;
                        var a = 0 | 256 * n / s;
                        a > 255 && (a = 255), e[i] = 255 & a
                    }
            }

            function i(t, e) {
                var i = 255 & t[e + 0];
                return i <<= 8, i |= 255 & t[e + 1], i <<= 8, i |= 255 & t[e + 2], i <<= 8, i |= 255 & t[e + 3]
            }

            function s(t, e, i) {
                t[e + 0] = 255 & i >> 24, t[e + 1] = 255 & i >> 16, t[e + 2] = 255 & i >> 8, t[e + 3] = 255 & i
            }

            function c(t, e, i) {
                t[e + 0] = 255 & i >> 8, t[e + 1] = 255 & i
            }

            function p(t, e) {
                return new String(t, e, O.length(), R).equals(O) || new String(t, e, E.length(), R).equals(E)
            }

            function f(t, e, i) {
                return 255 & (t << e | i & ~(-1 << e))
            }

            function _(t, e) {
                var i = t.internal_flags;
                e[0] = f(e[0], 8, 255), e[1] = f(e[1], 3, 7), e[1] = f(e[1], 1, t.out_samplerate < 16e3 ? 0 : 1), e[1] = f(e[1], 1, t.version), e[1] = f(e[1], 2, 1), e[1] = f(e[1], 1, t.error_protection ? 0 : 1), e[2] = f(e[2], 4, i.bitrate_index), e[2] = f(e[2], 2, i.samplerate_index), e[2] = f(e[2], 1, 0), e[2] = f(e[2], 1, t.extension), e[3] = f(e[3], 2, t.mode.ordinal()), e[3] = f(e[3], 2, i.mode_ext), e[3] = f(e[3], 1, t.copyright), e[3] = f(e[3], 1, t.original), e[3] = f(e[3], 2, t.emphasis), e[0] = 255;
                var n, s = 241 & e[1];
                n = 1 == t.version ? x : t.out_samplerate < 16e3 ? k : M, t.VBR == o.vbr_off && (n = t.brate);
                var r;
                r = t.free_format ? 0 : 255 & 16 * v.BitrateIndex(n, t.version, t.out_samplerate), 1 == t.version ? (e[1] = 255 & (10 | s), s = 13 & e[2], e[2] = 255 & (r | s)) : (e[1] = 255 & (2 | s), s = 13 & e[2], e[2] = 255 & (r | s))
            }

            function d(t, e) {
                return e = e >> 8 ^ P[255 & (e ^ t)]
            }

            function m(t, e, i, n, r) {
                var o, l, h, u = t.internal_flags,
                    p = 0,
                    f = t.encoder_delay,
                    _ = t.encoder_padding,
                    m = 100 - 10 * t.VBR_q - t.quality,
                    y = g.getLameVeryShortVersion(),
                    v = [1, 5, 3, 2, 4, 0, 3],
                    b = 0 | (t.lowpassfreq / 100 + .5 > 255 ? 255 : t.lowpassfreq / 100 + .5),
                    S = 0,
                    w = 0,
                    A = t.internal_flags.noise_shaping,
                    T = 0,
                    x = 0,
                    M = 0,
                    k = 0,
                    R = 0,
                    O = 0 != (1 & t.exp_nspsytune),
                    E = 0 != (2 & t.exp_nspsytune),
                    P = !1,
                    B = !1,
                    C = t.internal_flags.nogap_total,
                    F = t.internal_flags.nogap_current,
                    q = t.ATHtype,
                    j = 0;
                switch (t.VBR) {
                    case vbr_abr:
                        h = t.VBR_mean_bitrate_kbps;
                        break;
                    case vbr_off:
                        h = t.brate;
                        break;
                    default:
                        h = t.VBR_min_bitrate_kbps
                }
                switch (o = t.VBR.ordinal() < v.length ? v[t.VBR.ordinal()] : 0, l = 0 + o, u.findReplayGain && (u.RadioGain > 510 && (u.RadioGain = 510), u.RadioGain < -510 && (u.RadioGain = -510), w = 8192, w |= 3072, u.RadioGain >= 0 ? w |= u.RadioGain : (w |= 512, w |= -u.RadioGain)), u.findPeakSample && (S = Math.abs(0 | u.PeakSample / 32767 * Math.pow(2, 23) + .5)), -1 != C && (F > 0 && (B = !0), F < C - 1 && (P = !0)), j = q + ((O ? 1 : 0) << 4) + ((E ? 1 : 0) << 5) + ((P ? 1 : 0) << 6) + ((B ? 1 : 0) << 7), m < 0 && (m = 0), t.mode) {
                    case MONO:
                        T = 0;
                        break;
                    case STEREO:
                        T = 1;
                        break;
                    case DUAL_CHANNEL:
                        T = 2;
                        break;
                    case JOINT_STEREO:
                        T = t.force_ms ? 4 : 3;
                        break;
                    case NOT_SET:
                    default:
                        T = 7
                }
                M = t.in_samplerate <= 32e3 ? 0 : 48e3 == t.in_samplerate ? 2 : t.in_samplerate > 48e3 ? 3 : 1, (t.short_blocks == a.short_block_forced || t.short_blocks == a.short_block_dispensed || -1 == t.lowpassfreq && -1 == t.highpassfreq || t.scale_left < t.scale_right || t.scale_left > t.scale_right || t.disable_reservoir && t.brate < 320 || t.noATH || t.ATHonly || 0 == q || t.in_samplerate <= 32e3) && (x = 1), k = A + (T << 2) + (x << 5) + (M << 6), R = u.nMusicCRC, s(i, n + p, m), p += 4;
                for (var L = 0; L < 9; L++) i[n + p + L] = 255 & y.charAt(L);
                p += 9, i[n + p] = 255 & l, p++, i[n + p] = 255 & b, p++, s(i, n + p, S), p += 4, c(i, n + p, w), p += 2, c(i, n + p, 0), p += 2, i[n + p] = 255 & j, p++, i[n + p] = h >= 255 ? 255 : 255 & h, p++, i[n + p] = 255 & f >> 4, i[n + p + 1] = 255 & (f << 4) + (_ >> 8), i[n + p + 2] = 255 & _, p += 3, i[n + p] = 255 & k, p++, i[n + p++] = 0, c(i, n + p, t.preset), p += 2, s(i, n + p, e), p += 4, c(i, n + p, R), p += 2;
                for (var I = 0; I < p; I++) r = d(i[n + I], r);
                return c(i, n + p, r), p += 2
            }

            function y(t) {
                t.seek(0);
                var e = h(10);
                t.readFully(e);
                return new String(e, "ISO-8859-1").startsWith("ID3") ? 0 : ((127 & e[6]) << 21 | (127 & e[7]) << 14 | (127 & e[8]) << 7 | 127 & e[9]) + e.length
            }
            var v, b, g;
            this.setModules = function(t, e, i) {
                v = t, b = e, g = i
            };
            var S = n.NUMTOCENTRIES,
                w = n.MAXFRAMESIZE,
                A = S + 4 + 4 + 4 + 4 + 4,
                T = A + 9 + 1 + 1 + 8 + 1 + 1 + 3 + 1 + 1 + 2 + 4 + 2 + 2,
                x = 128,
                M = 64,
                k = 32,
                R = null,
                O = "Xing",
                E = "Info",
                P = [0, 49345, 49537, 320, 49921, 960, 640, 49729, 50689, 1728, 1920, 51009, 1280, 50625, 50305, 1088, 52225, 3264, 3456, 52545, 3840, 53185, 52865, 3648, 2560, 51905, 52097, 2880, 51457, 2496, 2176, 51265, 55297, 6336, 6528, 55617, 6912, 56257, 55937, 6720, 7680, 57025, 57217, 8e3, 56577, 7616, 7296, 56385, 5120, 54465, 54657, 5440, 55041, 6080, 5760, 54849, 53761, 4800, 4992, 54081, 4352, 53697, 53377, 4160, 61441, 12480, 12672, 61761, 13056, 62401, 62081, 12864, 13824, 63169, 63361, 14144, 62721, 13760, 13440, 62529, 15360, 64705, 64897, 15680, 65281, 16320, 16e3, 65089, 64001, 15040, 15232, 64321, 14592, 63937, 63617, 14400, 10240, 59585, 59777, 10560, 60161, 11200, 10880, 59969, 60929, 11968, 12160, 61249, 11520, 60865, 60545, 11328, 58369, 9408, 9600, 58689, 9984, 59329, 59009, 9792, 8704, 58049, 58241, 9024, 57601, 8640, 8320, 57409, 40961, 24768, 24960, 41281, 25344, 41921, 41601, 25152, 26112, 42689, 42881, 26432, 42241, 26048, 25728, 42049, 27648, 44225, 44417, 27968, 44801, 28608, 28288, 44609, 43521, 27328, 27520, 43841, 26880, 43457, 43137, 26688, 30720, 47297, 47489, 31040, 47873, 31680, 31360, 47681, 48641, 32448, 32640, 48961, 32e3, 48577, 48257, 31808, 46081, 29888, 30080, 46401, 30464, 47041, 46721, 30272, 29184, 45761, 45953, 29504, 45313, 29120, 28800, 45121, 20480, 37057, 37249, 20800, 37633, 21440, 21120, 37441, 38401, 22208, 22400, 38721, 21760, 38337, 38017, 21568, 39937, 23744, 23936, 40257, 24320, 40897, 40577, 24128, 23040, 39617, 39809, 23360, 39169, 22976, 22656, 38977, 34817, 18624, 18816, 35137, 19200, 35777, 35457, 19008, 19968, 36545, 36737, 20288, 36097, 19904, 19584, 35905, 17408, 33985, 34177, 17728, 34561, 18368, 18048, 34369, 33281, 17088, 17280, 33601, 16640, 33217, 32897, 16448];
            this.addVbrFrame = function(e) {
                var i = e.internal_flags,
                    n = Tables.bitrate_table[e.version][i.bitrate_index];
                u(null != i.VBR_seek_table.bag), t(i.VBR_seek_table, n)
            }, this.getVbrTag = function(t) {
                var e = new VBRTagData,
                    n = 0;
                e.flags = 0;
                var s = t[n + 1] >> 3 & 1,
                    r = t[n + 2] >> 2 & 3,
                    o = t[n + 3] >> 6 & 3,
                    a = t[n + 2] >> 4 & 15;
                if (a = Tables.bitrate_table[s][a], t[n + 1] >> 4 == 14 ? e.samprate = Tables.samplerate_table[2][r] : e.samprate = Tables.samplerate_table[s][r], n += 0 != s ? 3 != o ? 36 : 21 : 3 != o ? 21 : 13, !p(t, n)) return null;
                n += 4, e.hId = s;
                var l = e.flags = i(t, n);
                if (n += 4, 0 != (1 & l) && (e.frames = i(t, n), n += 4), 0 != (2 & l) && (e.bytes = i(t, n), n += 4), 0 != (4 & l)) {
                    if (null != e.toc)
                        for (var h = 0; h < S; h++) e.toc[h] = t[n + h];
                    n += S
                }
                e.vbrScale = -1, 0 != (8 & l) && (e.vbrScale = i(t, n), n += 4), e.headersize = 72e3 * (s + 1) * a / e.samprate, n += 21;
                var u = t[n + 0] << 4;
                u += t[n + 1] >> 4;
                var c = (15 & t[n + 1]) << 8;
                return c += 255 & t[n + 2], (u < 0 || u > 3e3) && (u = -1), (c < 0 || c > 3e3) && (c = -1), e.encDelay = u, e.encPadding = c, e
            }, this.InitVbrTag = function(t) {
                var e, i = t.internal_flags;
                e = 1 == t.version ? x : t.out_samplerate < 16e3 ? k : M, t.VBR == o.vbr_off && (e = t.brate);
                var n = 72e3 * (t.version + 1) * e / t.out_samplerate,
                    s = i.sideinfo_len + T;
                if (i.VBR_seek_table.TotalFrameSize = n, n < s || n > w) return void(t.bWriteVbrTag = !1);
                i.VBR_seek_table.nVbrNumFrames = 0, i.VBR_seek_table.nBytesWritten = 0, i.VBR_seek_table.sum = 0, i.VBR_seek_table.seen = 0, i.VBR_seek_table.want = 1, i.VBR_seek_table.pos = 0, null == i.VBR_seek_table.bag && (i.VBR_seek_table.bag = new int[400], i.VBR_seek_table.size = 400);
                var r = h(w);
                _(t, r);
                for (var a = i.VBR_seek_table.TotalFrameSize, l = 0; l < a; ++l) b.add_dummy_byte(t, 255 & r[l], 1)
            }, this.updateMusicCRC = function(t, e, i, n) {
                for (var s = 0; s < n; ++s) t[0] = d(e[i + s], t[0])
            }, this.getLameTagFrame = function(t, i) {
                var n = t.internal_flags;
                if (!t.bWriteVbrTag) return 0;
                if (n.Class_ID != Lame.LAME_ID) return 0;
                if (n.VBR_seek_table.pos <= 0) return 0;
                if (i.length < n.VBR_seek_table.TotalFrameSize) return n.VBR_seek_table.TotalFrameSize;
                l.fill(i, 0, n.VBR_seek_table.TotalFrameSize, 0), _(t, i);
                var a = h(S);
                if (t.free_format)
                    for (var u = 1; u < S; ++u) a[u] = 255 & 255 * u / 100;
                else e(n.VBR_seek_table, a);
                var c = n.sideinfo_len;
                t.error_protection && (c -= 2), t.VBR == o.vbr_off ? (i[c++] = 255 & E.charAt(0), i[c++] = 255 & E.charAt(1), i[c++] = 255 & E.charAt(2), i[c++] = 255 & E.charAt(3)) : (i[c++] = 255 & O.charAt(0), i[c++] = 255 & O.charAt(1), i[c++] = 255 & O.charAt(2), i[c++] = 255 & O.charAt(3)), s(i, c, 15), c += 4, s(i, c, n.VBR_seek_table.nVbrNumFrames), c += 4;
                var p = n.VBR_seek_table.nBytesWritten + n.VBR_seek_table.TotalFrameSize;
                s(i, c, 0 | p), c += 4, r.arraycopy(a, 0, i, c, a.length), c += a.length, t.error_protection && b.CRC_writeheader(n, i);
                for (var f = 0, u = 0; u < c; u++) f = d(i[u], f);
                return c += m(t, p, i, c, f), n.VBR_seek_table.TotalFrameSize
            }, this.putVbrTag = function(t, e) {
                if (t.internal_flags.VBR_seek_table.pos <= 0) return -1;
                if (e.seek(e.length()), 0 == e.length()) return -1;
                var i = y(e);
                e.seek(i);
                var n = h(w),
                    s = getLameTagFrame(t, n);
                return s > n.length ? -1 : s < 1 ? 0 : (e.write(n, 0, s), 0)
            }
        }
        var s = i(384),
            r = s.System,
            o = s.VbrMode,
            a = (s.Float, s.ShortBlock),
            l = (s.Util, s.Arrays),
            h = (s.new_array_n, s.new_byte),
            u = (s.new_double, s.new_float, s.new_float_n, s.new_int, s.new_int_n, s.assert);
        n.NUMTOCENTRIES = 100, n.MAXFRAMESIZE = 2880, t.exports = n
    },
    497: function(t, e) {
        function i() {
            this.getLameVersion = function() {
                return "3.98.4"
            }, this.getLameShortVersion = function() {
                return "3.98.4"
            }, this.getLameVeryShortVersion = function() {
                return "LAME3.98r"
            }, this.getPsyVersion = function() {
                return "0.93"
            }, this.getLameUrl = function() {
                return "http://www.mp3dev.org/"
            }, this.getLameOsBitness = function() {
                return "32bits"
            }
        }
        t.exports = i
    },
    498: function(t, e, i) {
        function n() {
            var t, e;
            this.setModules = function(i, n) {
                t = i, e = n
            }
        }

        function s() {
            var t, e, i;
            this.setModules = function(n, s, r) {
                t = n, e = s, i = r
            }
        }

        function r() {}

        function o() {
            var t, e;
            this.setModules = function(i, n) {
                t = i, e = n
            }
        }

        function a(t, e, i) {
            3 != arguments.length && (console.error("WARN: Mp3Encoder(channels, samplerate, kbps) not specified"), t = 1, e = 44100, i = 128);
            var a = new Lame,
                l = new n,
                h = new GainAnalysis,
                u = new BitStream,
                d = new Presets,
                m = new QuantizePVT,
                y = new Quantize,
                v = new _,
                b = new f,
                g = new o,
                S = new Reservoir,
                w = new Takehiro,
                A = new s,
                T = new r;
            a.setModules(h, u, d, m, y, v, b, g, T), u.setModules(h, T, b, v), g.setModules(u, b), d.setModules(a), y.setModules(u, S, m, w), m.setModules(w, S, a.enc.psy), S.setModules(u), w.setModules(m), v.setModules(a, u, b), l.setModules(A, T), A.setModules(b, g, d);
            var x = a.lame_init();
            x.num_channels = t, x.in_samplerate = e, x.brate = i, x.mode = MPEGMode.STEREO, x.quality = 3, x.bWriteVbrTag = !1, x.disable_reservoir = !0, x.write_id3tag_automatic = !1;
            var M = a.lame_init_params(x);
            p(0 == M);
            var k = 1152,
                R = 0 | 1.25 * k + 7200,
                O = c(R);
            this.encodeBuffer = function(e, i) {
                1 == t && (i = e), p(e.length == i.length), e.length > k && (k = e.length, R = 0 | 1.25 * k + 7200, O = c(R));
                var n = a.lame_encode_buffer(x, e, i, e.length, O, 0, R);
                return new Int8Array(O.subarray(0, n))
            }, this.flush = function() {
                var t = a.lame_encode_flush(x, O, 0, R);
                return new Int8Array(O.subarray(0, t))
            }
        }

        function l() {
            this.dataOffset = 0, this.dataLen = 0, this.channels = 0, this.sampleRate = 0
        }

        function h(t) {
            return t.charCodeAt(0) << 24 | t.charCodeAt(1) << 16 | t.charCodeAt(2) << 8 | t.charCodeAt(3)
        }
        var u = i(384),
            c = (u.System, u.VbrMode, u.Float, u.ShortBlock, u.Util, u.Arrays, u.new_array_n, u.new_byte),
            p = (u.new_double, u.new_float, u.new_float_n, u.new_int, u.new_int_n, u.assert);
        Lame = i(485), Presets = i(489), GainAnalysis = i(440), QuantizePVT = i(444), Quantize = i(491), Takehiro = i(446), Reservoir = i(493), MPEGMode = i(442), BitStream = i(439);
        var f = (i(388), i(497)),
            _ = i(496);
        l.RIFF = h("RIFF"), l.WAVE = h("WAVE"), l.fmt_ = h("fmt "), l.data = h("data"), l.readHeader = function(t) {
            var e = new l,
                i = t.getUint32(0, !1);
            if (l.RIFF == i) {
                t.getUint32(4, !0);
                if (l.WAVE == t.getUint32(8, !1) && l.fmt_ == t.getUint32(12, !1)) {
                    var n = t.getUint32(16, !0),
                        s = 20;
                    switch (n) {
                        case 16:
                        case 18:
                            e.channels = t.getUint16(s + 2, !0), e.sampleRate = t.getUint32(s + 4, !0);
                            break;
                        default:
                            throw "extended fmt chunk not implemented"
                    }
                    s += n;
                    for (var r = l.data, o = 0; r != i && (i = t.getUint32(s, !1), o = t.getUint32(s + 4, !0), r != i);) s += o + 8;
                    return e.dataLen = o, e.dataOffset = s + 8, e
                }
            }
        }, t.exports.Mp3Encoder = a, t.exports.WavHeader = l
    }
});