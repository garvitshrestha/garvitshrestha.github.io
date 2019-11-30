! function (global, factory) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define(factory) : global.moment = factory()
}(this, (function () {
            "use strict";
            var hookCallback, some;

            function hooks() {
                return hookCallback.apply(null, arguments)
            }

            function setHookCallback(callback) {
                hookCallback = callback
            }

            function isArray(input) {
                return input instanceof Array || "[object Array]" === Object.prototype.toString.call(input)
            }

            function isObject(input) {
                return null != input && "[object Object]" === Object.prototype.toString.call(input)
            }

            function isObjectEmpty(obj) {
                if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(obj).length;
                var k;
                for (k in obj)
                    if (obj.hasOwnProperty(k)) return !1;
                return !0
            }

            function isUndefined(input) {
                return void 0 === input
            }

            function isNumber(input) {
                return "number" == typeof input || "[object Number]" === Object.prototype.toString.call(input)
            }

            function isDate(input) {
                return input instanceof Date || "[object Date]" === Object.prototype.toString.call(input)
            }

            function map(arr, fn) {
                var res = [],
                    i;
                for (i = 0; i < arr.length; ++i) res.push(fn(arr[i], i));
                return res
            }

            function hasOwnProp(a, b) {
                return Object.prototype.hasOwnProperty.call(a, b)
            }

            function extend(a, b) {
                for (var i in b) hasOwnProp(b, i) && (a[i] = b[i]);
                return hasOwnProp(b, "toString") && (a.toString = b.toString), hasOwnProp(b, "valueOf") && (a.valueOf = b.valueOf), a
            }

            function createUTC(input, format, locale, strict) {
                return createLocalOrUTC(input, format, locale, strict, !0).utc()
            }

            function defaultParsingFlags() {
                return {
                    empty: !1,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -2,
                    charsLeftOver: 0,
                    nullInput: !1,
                    invalidMonth: null,
                    invalidFormat: !1,
                    userInvalidated: !1,
                    iso: !1,
                    parsedDateParts: [],
                    meridiem: null,
                    rfc2822: !1,
                    weekdayMismatch: !1
                }
            }

            function getParsingFlags(m) {
                return null == m._pf && (m._pf = {
                    empty: !1,
                    unusedTokens: [],
                    unusedInput: [],
                    overflow: -2,
                    charsLeftOver: 0,
                    nullInput: !1,
                    invalidMonth: null,
                    invalidFormat: !1,
                    userInvalidated: !1,
                    iso: !1,
                    parsedDateParts: [],
                    meridiem: null,
                    rfc2822: !1,
                    weekdayMismatch: !1
                }), m._pf
            }

            function isValid(m) {
                if (null == m._isValid) {
                    var flags = getParsingFlags(m),
                        parsedParts = some.call(flags.parsedDateParts, (function (i) {
                            return null != i
                        })),
                        isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
                    if (m._strict && (isNowValid = isNowValid && 0 === flags.charsLeftOver && 0 === flags.unusedTokens.length && void 0 === flags.bigHour), null != Object.isFrozen && Object.isFrozen(m)) return isNowValid;
                    m._isValid = isNowValid
                }
                return m._isValid
            }

            function createInvalid(flags) {
                var m = createUTC(NaN);
                return null != flags ? extend(getParsingFlags(m), flags) : getParsingFlags(m).userInvalidated = !0, m
            }
            some = Array.prototype.some ? Array.prototype.some : function (fun) {
                for (var t = Object(this), len = t.length >>> 0, i = 0; i < len; i++)
                    if (i in t && fun.call(this, t[i], i, t)) return !0;
                return !1
            };
            var momentProperties = hooks.momentProperties = [];

            function copyConfig(to, from) {
                var i, prop, val;
                if (isUndefined(from._isAMomentObject) || (to._isAMomentObject = from._isAMomentObject), isUndefined(from._i) || (to._i = from._i), isUndefined(from._f) || (to._f = from._f), isUndefined(from._l) || (to._l = from._l), isUndefined(from._strict) || (to._strict = from._strict), isUndefined(from._tzm) || (to._tzm = from._tzm), isUndefined(from._isUTC) || (to._isUTC = from._isUTC), isUndefined(from._offset) || (to._offset = from._offset), isUndefined(from._pf) || (to._pf = getParsingFlags(from)), isUndefined(from._locale) || (to._locale = from._locale), momentProperties.length > 0)
                    for (i = 0; i < momentProperties.length; i++) isUndefined(val = from[prop = momentProperties[i]]) || (to[prop] = val);
                return to
            }
            var updateInProgress = !1;

            function Moment(config) {
                copyConfig(this, config), this._d = new Date(null != config._d ? config._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === updateInProgress && (updateInProgress = !0, hooks.updateOffset(this), updateInProgress = !1)
            }

            function isMoment(obj) {
                return obj instanceof Moment || null != obj && null != obj._isAMomentObject
            }

            function absFloor(number) {
                return number < 0 ? Math.ceil(number) || 0 : Math.floor(number)
            }

            function toInt(argumentForCoercion) {
                var coercedNumber = +argumentForCoercion,
                    value = 0;
                return 0 !== coercedNumber && isFinite(coercedNumber) && (value = absFloor(coercedNumber)), value
            }

            function compareArrays(array1, array2, dontConvert) {
                var len = Math.min(array1.length, array2.length),
                    lengthDiff = Math.abs(array1.length - array2.length),
                    diffs = 0,
                    i;
                for (i = 0; i < len; i++)(dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) && diffs++;
                return diffs + lengthDiff
            }

            function warn(msg) {
                !1 === hooks.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + msg)
            }

            function deprecate(msg, fn) {
                var firstTime = !0;
                return extend((function () {
                    if (null != hooks.deprecationHandler && hooks.deprecationHandler(null, msg), firstTime) {
                        for (var args = [], arg, i = 0; i < arguments.length; i++) {
                            if (arg = "", "object" == typeof arguments[i]) {
                                for (var key in arg += "\n[" + i + "] ", arguments[0]) arg += key + ": " + arguments[0][key] + ", ";
                                arg = arg.slice(0, -2)
                            } else arg = arguments[i];
                            args.push(arg)
                        }
                        warn(msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + (new Error).stack), firstTime = !1
                    }
                    return fn.apply(this, arguments)
                }), fn)
            }
            var deprecations = {},
                keys;

            function deprecateSimple(name, msg) {
                null != hooks.deprecationHandler && hooks.deprecationHandler(name, msg), deprecations[name] || (warn(msg), deprecations[name] = !0)
            }

            function isFunction(input) {
                return input instanceof Function || "[object Function]" === Object.prototype.toString.call(input)
            }

            function set(config) {
                var prop, i;
                for (i in config) isFunction(prop = config[i]) ? this[i] = prop : this["_" + i] = prop;
                this._config = config, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source)
            }

            function mergeConfigs(parentConfig, childConfig) {
                var res = extend({}, parentConfig),
                    prop;
                for (prop in childConfig) hasOwnProp(childConfig, prop) && (isObject(parentConfig[prop]) && isObject(childConfig[prop]) ? (res[prop] = {}, extend(res[prop], parentConfig[prop]), extend(res[prop], childConfig[prop])) : null != childConfig[prop] ? res[prop] = childConfig[prop] : delete res[prop]);
                for (prop in parentConfig) hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop]) && (res[prop] = extend({}, res[prop]));
                return res
            }

            function Locale(config) {
                null != config && this.set(config)
            }
            hooks.suppressDeprecationWarnings = !1, hooks.deprecationHandler = null, keys = Object.keys ? Object.keys : function (obj) {
                var i, res = [];
                for (i in obj) hasOwnProp(obj, i) && res.push(i);
                return res
            };
            var defaultCalendar = {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            };

            function calendar(key, mom, now) {
                var output = this._calendar[key] || this._calendar.sameElse;
                return isFunction(output) ? output.call(mom, now) : output
            }
            var defaultLongDateFormat = {
                LTS: "h:mm:ss A",
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY h:mm A",
                LLLL: "dddd, MMMM D, YYYY h:mm A"
            };

            function longDateFormat(key) {
                var format = this._longDateFormat[key],
                    formatUpper = this._longDateFormat[key.toUpperCase()];
                return format || !formatUpper ? format : (this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, (function (val) {
                    return val.slice(1)
                })), this._longDateFormat[key])
            }
            var defaultInvalidDate = "Invalid date";

            function invalidDate() {
                return this._invalidDate
            }
            var defaultOrdinal = "%d",
                defaultDayOfMonthOrdinalParse = /\d{1,2}/;

            function ordinal(number) {
                return this._ordinal.replace("%d", number)
            }
            var defaultRelativeTime = {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                ss: "%d seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            };

            function relativeTime(number, withoutSuffix, string, isFuture) {
                var output = this._relativeTime[string];
                return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number)
            }

            function pastFuture(diff, output) {
                var format = this._relativeTime[diff > 0 ? "future" : "past"];
                return isFunction(format) ? format(output) : format.replace(/%s/i, output)
            }
            var aliases = {};

            function addUnitAlias(unit, shorthand) {
                var lowerCase = unit.toLowerCase();
                aliases[lowerCase] = aliases[lowerCase + "s"] = aliases[shorthand] = unit
            }

            function normalizeUnits(units) {
                return "string" == typeof units ? aliases[units] || aliases[units.toLowerCase()] : void 0
            }

            function normalizeObjectUnits(inputObject) {
                var normalizedInput = {},
                    normalizedProp, prop;
                for (prop in inputObject) hasOwnProp(inputObject, prop) && (normalizedProp = normalizeUnits(prop)) && (normalizedInput[normalizedProp] = inputObject[prop]);
                return normalizedInput
            }
            var priorities = {};

            function addUnitPriority(unit, priority) {
                priorities[unit] = priority
            }

            function getPrioritizedUnits(unitsObj) {
                var units = [];
                for (var u in unitsObj) units.push({
                    unit: u,
                    priority: priorities[u]
                });
                return units.sort((function (a, b) {
                    return a.priority - b.priority
                })), units
            }

            function zeroFill(number, targetLength, forceSign) {
                var absNumber = "" + Math.abs(number),
                    zerosToFill = targetLength - absNumber.length,
                    sign;
                return (number >= 0 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber
            }
            var formattingTokens = /(\[[^\[]*\])|(\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
                localFormattingTokens = /(\[[^\[]*\])|(\)?(LTS|LT|LL?L?L?|l{1,4})/g,
                formatFunctions = {},
                formatTokenFunctions = {};

            function addFormatToken(token, padded, ordinal, callback) {
                var func = callback;
                "string" == typeof callback && (func = function () {
                    return this[callback]()
                }), token && (formatTokenFunctions[token] = func), padded && (formatTokenFunctions[padded[0]] = function () {
                    return zeroFill(func.apply(this, arguments), padded[1], padded[2])
                }), ordinal && (formatTokenFunctions[ordinal] = function () {
                    return this.localeData().ordinal(func.apply(this, arguments), token)
                })
            }

            function removeFormattingTokens(input) {
                return input.match(/\[[\s\S]/) ? input.replace(/^\[|\]$/g, "") : input.replace(/\/g,"")}function makeFormatFunction(format){var array=format.match(formattingTokens),i,length;for(i=0,length=array.length;i<length;i++)formatTokenFunctions[array[i]]?array[i]=formatTokenFunctions[array[i]]:array[i]=removeFormattingTokens(array[i]);return function(mom){var output="",i;for(i=0;i<length;i++)output+=isFunction(array[i])?array[i].call(mom,format):array[i];return output}}function formatMoment(m,format){return m.isValid()?(format=expandFormat(format,m.localeData()),formatFunctions[format]=formatFunctions[format]||makeFormatFunction(format),formatFunctions[format](m)):m.localeData().invalidDate()}function expandFormat(format,locale){var i=5;function replaceLongDateFormatTokens(input){return locale.longDateFormat(input)||input}for(localFormattingTokens.lastIndex=0;i>=0&&localFormattingTokens.test(format);)format=format.replace(localFormattingTokens,replaceLongDateFormatTokens),localFormattingTokens.lastIndex=0,i-=1;return format}var match1=/\
                        d / , match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, regexes = {};

                        function addRegexToken(token, regex, strictRegex) {
                            regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
                                return isStrict && strictRegex ? strictRegex : regex
                            }
                        }

                        function getParseRegexForToken(token, config) {
                            return hasOwnProp(regexes, token) ? regexes[token](config._strict, config._locale) : new RegExp(unescapeFormat(token))
                        }

                        function unescapeFormat(s) {
                            return regexEscape(s.replace("\","
                                        ").replace(/\(\[)|\(\])|\[([^\]\[]*)\]|\(.)/g,(function(matched,p1,p2,p3,p4){return p1||p2||p3||p4})))}function regexEscape(s){return s.replace(/[-\/\^$*+?.()|[\]{}]/g,"\
                                        $ & ")}var tokens={};function addParseToken(token,callback){var i,func=callback;for("
                                        string "==typeof token&&(token=[token]),isNumber(callback)&&(func=function(input,array){array[callback]=toInt(input)}),i=0;i<token.length;i++)tokens[token[i]]=func}function addWeekParseToken(token,callback){addParseToken(token,(function(input,array,config,token){config._w=config._w||{},callback(input,config._w,config,token)}))}function addTimeToArrayFromToken(token,input,config){null!=input&&hasOwnProp(tokens,token)&&tokens[token](input,config._a,config,token)}var YEAR=0,MONTH=1,DATE=2,HOUR=3,MINUTE=4,SECOND=5,MILLISECOND=6,WEEK=7,WEEKDAY=8;function daysInYear(year){return isLeapYear(year)?366:365}function isLeapYear(year){return year%4==0&&year%100!=0||year%400==0}addFormatToken("
                                        Y ",0,0,(function(){var y=this.year();return y<=9999?"
                                        "+y:" + "+y})),addFormatToken(0,["
                                        YY ",2],0,(function(){return this.year()%100})),addFormatToken(0,["
                                        YYYY ",4],0,"
                                        year "),addFormatToken(0,["
                                        YYYYY ",5],0,"
                                        year "),addFormatToken(0,["
                                        YYYYYY ",6,!0],0,"
                                        year "),addUnitAlias("
                                        year ","
                                        y "),addUnitPriority("
                                        year ",1),addRegexToken("
                                        Y ",matchSigned),addRegexToken("
                                        YY ",match1to2,match2),addRegexToken("
                                        YYYY ",match1to4,match4),addRegexToken("
                                        YYYYY ",match1to6,match6),addRegexToken("
                                        YYYYYY ",match1to6,match6),addParseToken(["
                                        YYYYY ","
                                        YYYYYY "],YEAR),addParseToken("
                                        YYYY ",(function(input,array){array[YEAR]=2===input.length?hooks.parseTwoDigitYear(input):toInt(input)})),addParseToken("
                                        YY ",(function(input,array){array[YEAR]=hooks.parseTwoDigitYear(input)})),addParseToken("
                                        Y ",(function(input,array){array[YEAR]=parseInt(input,10)})),hooks.parseTwoDigitYear=function(input){return toInt(input)+(toInt(input)>68?1900:2e3)};var getSetYear=makeGetSet("
                                        FullYear ",!0),indexOf;function getIsLeapYear(){return isLeapYear(this.year())}function makeGetSet(unit,keepTime){return function(value){return null!=value?(set(this,unit,value),hooks.updateOffset(this,keepTime),this):get(this,unit)}}function get(mom,unit){return mom.isValid()?mom._d["
                                        get "+(mom._isUTC?"
                                        UTC ":"
                                        ")+unit]():NaN}function set(mom,unit,value){mom.isValid()&&!isNaN(value)&&("
                                        FullYear "===unit&&isLeapYear(mom.year())&&1===mom.month()&&29===mom.date()?mom._d["
                                        set "+(mom._isUTC?"
                                        UTC ":"
                                        ")+unit](value,mom.month(),daysInMonth(value,mom.month())):mom._d["
                                        set "+(mom._isUTC?"
                                        UTC ":"
                                        ")+unit](value))}function stringGet(units){return isFunction(this[units=normalizeUnits(units)])?this[units]():this}function stringSet(units,value){if("
                                        object "==typeof units)for(var prioritized=getPrioritizedUnits(units=normalizeObjectUnits(units)),i=0;i<prioritized.length;i++)this[prioritized[i].unit](units[prioritized[i].unit]);else if(isFunction(this[units=normalizeUnits(units)]))return this[units](value);return this}function mod(n,x){return(n%x+x)%x}function daysInMonth(year,month){if(isNaN(year)||isNaN(month))return NaN;var modMonth=mod(month,12);return year+=(month-modMonth)/12,1===modMonth?isLeapYear(year)?29:28:31-modMonth%7%2}indexOf=Array.prototype.indexOf?Array.prototype.indexOf:function(o){var i;for(i=0;i<this.length;++i)if(this[i]===o)return i;return-1},addFormatToken("
                                        M ",["
                                        MM ",2],"
                                        Mo ",(function(){return this.month()+1})),addFormatToken("
                                        MMM ",0,0,(function(format){return this.localeData().monthsShort(this,format)})),addFormatToken("
                                        MMMM ",0,0,(function(format){return this.localeData().months(this,format)})),addUnitAlias("
                                        month ","
                                        M "),addUnitPriority("
                                        month ",8),addRegexToken("
                                        M ",match1to2),addRegexToken("
                                        MM ",match1to2,match2),addRegexToken("
                                        MMM ",(function(isStrict,locale){return locale.monthsShortRegex(isStrict)})),addRegexToken("
                                        MMMM ",(function(isStrict,locale){return locale.monthsRegex(isStrict)})),addParseToken(["
                                        M ","
                                        MM "],(function(input,array){array[MONTH]=toInt(input)-1})),addParseToken(["
                                        MMM ","
                                        MMMM "],(function(input,array,config,token){var month=config._locale.monthsParse(input,token,config._strict);null!=month?array[MONTH]=month:getParsingFlags(config).invalidMonth=input}));var MONTHS_IN_FORMAT=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,defaultLocaleMonths="
                                        January_February_March_April_May_June_July_August_September_October_November_December ".split("
                                        _ ");function localeMonths(m,format){return m?isArray(this._months)?this._months[m.month()]:this._months[(this._months.isFormat||MONTHS_IN_FORMAT).test(format)?"
                                        format ":"
                                        standalone "][m.month()]:isArray(this._months)?this._months:this._months.standalone}var defaultLocaleMonthsShort="
                                        Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec ".split("
                                        _ ");function localeMonthsShort(m,format){return m?isArray(this._monthsShort)?this._monthsShort[m.month()]:this._monthsShort[MONTHS_IN_FORMAT.test(format)?"
                                        format ":"
                                        standalone "][m.month()]:isArray(this._monthsShort)?this._monthsShort:this._monthsShort.standalone}function handleStrictParse(monthName,format,strict){var i,ii,mom,llc=monthName.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],i=0;i<12;++i)mom=createUTC([2e3,i]),this._shortMonthsParse[i]=this.monthsShort(mom,"
                                        ").toLocaleLowerCase(),this._longMonthsParse[i]=this.months(mom,"
                                        ").toLocaleLowerCase();return strict?"
                                        MMM "===format?-1!==(ii=indexOf.call(this._shortMonthsParse,llc))?ii:null:-1!==(ii=indexOf.call(this._longMonthsParse,llc))?ii:null:"
                                        MMM "===format?-1!==(ii=indexOf.call(this._shortMonthsParse,llc))?ii:-1!==(ii=indexOf.call(this._longMonthsParse,llc))?ii:null:-1!==(ii=indexOf.call(this._longMonthsParse,llc))?ii:-1!==(ii=indexOf.call(this._shortMonthsParse,llc))?ii:null}function localeMonthsParse(monthName,format,strict){var i,mom,regex;if(this._monthsParseExact)return handleStrictParse.call(this,monthName,format,strict);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),i=0;i<12;i++){if(mom=createUTC([2e3,i]),strict&&!this._longMonthsParse[i]&&(this._longMonthsParse[i]=new RegExp(" ^ "+this.months(mom,"
                                        ").replace(".
                                        ","
                                        ")+"
                                        $ ","
                                        i "),this._shortMonthsParse[i]=new RegExp(" ^ "+this.monthsShort(mom,"
                                        ").replace(".
                                        ","
                                        ")+"
                                        $ ","
                                        i ")),strict||this._monthsParse[i]||(regex=" ^ "+this.months(mom,"
                                        ")+" | ^ "+this.monthsShort(mom,"
                                        "),this._monthsParse[i]=new RegExp(regex.replace(".
                                        ","
                                        "),"
                                        i ")),strict&&"
                                        MMMM "===format&&this._longMonthsParse[i].test(monthName))return i;if(strict&&"
                                        MMM "===format&&this._shortMonthsParse[i].test(monthName))return i;if(!strict&&this._monthsParse[i].test(monthName))return i}}function setMonth(mom,value){var dayOfMonth;if(!mom.isValid())return mom;if("
                                        string "==typeof value)if(/^\d+$/.test(value))value=toInt(value);else if(!isNumber(value=mom.localeData().monthsParse(value)))return mom;return dayOfMonth=Math.min(mom.date(),daysInMonth(mom.year(),value)),mom._d["
                                        set "+(mom._isUTC?"
                                        UTC ":"
                                        ")+"
                                        Month "](value,dayOfMonth),mom}function getSetMonth(value){return null!=value?(setMonth(this,value),hooks.updateOffset(this,!0),this):get(this,"
                                        Month ")}function getDaysInMonth(){return daysInMonth(this.year(),this.month())}var defaultMonthsShortRegex=matchWord;function monthsShortRegex(isStrict){return this._monthsParseExact?(hasOwnProp(this,"
                                        _monthsRegex ")||computeMonthsParse.call(this),isStrict?this._monthsShortStrictRegex:this._monthsShortRegex):(hasOwnProp(this,"
                                        _monthsShortRegex ")||(this._monthsShortRegex=defaultMonthsShortRegex),this._monthsShortStrictRegex&&isStrict?this._monthsShortStrictRegex:this._monthsShortRegex)}var defaultMonthsRegex=matchWord;function monthsRegex(isStrict){return this._monthsParseExact?(hasOwnProp(this,"
                                        _monthsRegex ")||computeMonthsParse.call(this),isStrict?this._monthsStrictRegex:this._monthsRegex):(hasOwnProp(this,"
                                        _monthsRegex ")||(this._monthsRegex=defaultMonthsRegex),this._monthsStrictRegex&&isStrict?this._monthsStrictRegex:this._monthsRegex)}function computeMonthsParse(){function cmpLenRev(a,b){return b.length-a.length}var shortPieces=[],longPieces=[],mixedPieces=[],i,mom;for(i=0;i<12;i++)mom=createUTC([2e3,i]),shortPieces.push(this.monthsShort(mom,"
                                        ")),longPieces.push(this.months(mom,"
                                        ")),mixedPieces.push(this.months(mom,"
                                        ")),mixedPieces.push(this.monthsShort(mom,"
                                        "));for(shortPieces.sort(cmpLenRev),longPieces.sort(cmpLenRev),mixedPieces.sort(cmpLenRev),i=0;i<12;i++)shortPieces[i]=regexEscape(shortPieces[i]),longPieces[i]=regexEscape(longPieces[i]);for(i=0;i<24;i++)mixedPieces[i]=regexEscape(mixedPieces[i]);this._monthsRegex=new RegExp(" ^ ("+mixedPieces.join(" | ")+")
                                        ","
                                        i "),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp(" ^ ("+longPieces.join(" | ")+")
                                        ","
                                        i "),this._monthsShortStrictRegex=new RegExp(" ^ ("+shortPieces.join(" | ")+")
                                        ","
                                        i ")}function createDate(y,m,d,h,M,s,ms){var date;return y<100&&y>=0?(date=new Date(y+400,m,d,h,M,s,ms),isFinite(date.getFullYear())&&date.setFullYear(y)):date=new Date(y,m,d,h,M,s,ms),date}function createUTCDate(y){var date;if(y<100&&y>=0){var args=Array.prototype.slice.call(arguments);args[0]=y+400,date=new Date(Date.UTC.apply(null,args)),isFinite(date.getUTCFullYear())&&date.setUTCFullYear(y)}else date=new Date(Date.UTC.apply(null,arguments));return date}function firstWeekOffset(year,dow,doy){var fwd=7+dow-doy,fwdlw;return-((7+createUTCDate(year,0,fwd).getUTCDay()-dow)%7)+fwd-1}function dayOfYearFromWeeks(year,week,weekday,dow,doy){var localWeekday,weekOffset,dayOfYear=1+7*(week-1)+(7+weekday-dow)%7+firstWeekOffset(year,dow,doy),resYear,resDayOfYear;return dayOfYear<=0?resDayOfYear=daysInYear(resYear=year-1)+dayOfYear:dayOfYear>daysInYear(year)?(resYear=year+1,resDayOfYear=dayOfYear-daysInYear(year)):(resYear=year,resDayOfYear=dayOfYear),{year:resYear,dayOfYear:resDayOfYear}}function weekOfYear(mom,dow,doy){var weekOffset=firstWeekOffset(mom.year(),dow,doy),week=Math.floor((mom.dayOfYear()-weekOffset-1)/7)+1,resWeek,resYear;return week<1?resWeek=week+weeksInYear(resYear=mom.year()-1,dow,doy):week>weeksInYear(mom.year(),dow,doy)?(resWeek=week-weeksInYear(mom.year(),dow,doy),resYear=mom.year()+1):(resYear=mom.year(),resWeek=week),{week:resWeek,year:resYear}}function weeksInYear(year,dow,doy){var weekOffset=firstWeekOffset(year,dow,doy),weekOffsetNext=firstWeekOffset(year+1,dow,doy);return(daysInYear(year)-weekOffset+weekOffsetNext)/7}function localeWeek(mom){return weekOfYear(mom,this._week.dow,this._week.doy).week}addFormatToken("
                                        w ",["
                                        ww ",2],"
                                        wo ","
                                        week "),addFormatToken("
                                        W ",["
                                        WW ",2],"
                                        Wo ","
                                        isoWeek "),addUnitAlias("
                                        week ","
                                        w "),addUnitAlias("
                                        isoWeek ","
                                        W "),addUnitPriority("
                                        week ",5),addUnitPriority("
                                        isoWeek ",5),addRegexToken("
                                        w ",match1to2),addRegexToken("
                                        ww ",match1to2,match2),addRegexToken("
                                        W ",match1to2),addRegexToken("
                                        WW ",match1to2,match2),addWeekParseToken(["
                                        w ","
                                        ww ","
                                        W ","
                                        WW "],(function(input,week,config,token){week[token.substr(0,1)]=toInt(input)}));var defaultLocaleWeek={dow:0,doy:6};function localeFirstDayOfWeek(){return this._week.dow}function localeFirstDayOfYear(){return this._week.doy}function getSetWeek(input){var week=this.localeData().week(this);return null==input?week:this.add(7*(input-week),"
                                        d ")}function getSetISOWeek(input){var week=weekOfYear(this,1,4).week;return null==input?week:this.add(7*(input-week),"
                                        d ")}function parseWeekday(input,locale){return"
                                        string "!=typeof input?input:isNaN(input)?"
                                        number "==typeof(input=locale.weekdaysParse(input))?input:null:parseInt(input,10)}function parseIsoWeekday(input,locale){return"
                                        string "==typeof input?locale.weekdaysParse(input)%7||7:isNaN(input)?null:input}function shiftWeekdays(ws,n){return ws.slice(n,7).concat(ws.slice(0,n))}addFormatToken("
                                        d ",0,"
                                        do ","
                                        day "),addFormatToken("
                                        dd ",0,0,(function(format){return this.localeData().weekdaysMin(this,format)})),addFormatToken("
                                        ddd ",0,0,(function(format){return this.localeData().weekdaysShort(this,format)})),addFormatToken("
                                        dddd ",0,0,(function(format){return this.localeData().weekdays(this,format)})),addFormatToken("
                                        e ",0,0,"
                                        weekday "),addFormatToken("
                                        E ",0,0,"
                                        isoWeekday "),addUnitAlias("
                                        day ","
                                        d "),addUnitAlias("
                                        weekday ","
                                        e "),addUnitAlias("
                                        isoWeekday ","
                                        E "),addUnitPriority("
                                        day ",11),addUnitPriority("
                                        weekday ",11),addUnitPriority("
                                        isoWeekday ",11),addRegexToken("
                                        d ",match1to2),addRegexToken("
                                        e ",match1to2),addRegexToken("
                                        E ",match1to2),addRegexToken("
                                        dd ",(function(isStrict,locale){return locale.weekdaysMinRegex(isStrict)})),addRegexToken("
                                        ddd ",(function(isStrict,locale){return locale.weekdaysShortRegex(isStrict)})),addRegexToken("
                                        dddd ",(function(isStrict,locale){return locale.weekdaysRegex(isStrict)})),addWeekParseToken(["
                                        dd ","
                                        ddd ","
                                        dddd "],(function(input,week,config,token){var weekday=config._locale.weekdaysParse(input,token,config._strict);null!=weekday?week.d=weekday:getParsingFlags(config).invalidWeekday=input})),addWeekParseToken(["
                                        d ","
                                        e ","
                                        E "],(function(input,week,config,token){week[token]=toInt(input)}));var defaultLocaleWeekdays="
                                        Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday ".split("
                                        _ ");function localeWeekdays(m,format){var weekdays=isArray(this._weekdays)?this._weekdays:this._weekdays[m&&!0!==m&&this._weekdays.isFormat.test(format)?"
                                        format ":"
                                        standalone "];return!0===m?shiftWeekdays(weekdays,this._week.dow):m?weekdays[m.day()]:weekdays}var defaultLocaleWeekdaysShort="
                                        Sun_Mon_Tue_Wed_Thu_Fri_Sat ".split("
                                        _ ");function localeWeekdaysShort(m){return!0===m?shiftWeekdays(this._weekdaysShort,this._week.dow):m?this._weekdaysShort[m.day()]:this._weekdaysShort}var defaultLocaleWeekdaysMin="
                                        Su_Mo_Tu_We_Th_Fr_Sa ".split("
                                        _ ");function localeWeekdaysMin(m){return!0===m?shiftWeekdays(this._weekdaysMin,this._week.dow):m?this._weekdaysMin[m.day()]:this._weekdaysMin}function handleStrictParse(weekdayName,format,strict){var i,ii,mom,llc=weekdayName.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],i=0;i<7;++i)mom=createUTC([2e3,1]).day(i),this._minWeekdaysParse[i]=this.weekdaysMin(mom,"
                                        ").toLocaleLowerCase(),this._shortWeekdaysParse[i]=this.weekdaysShort(mom,"
                                        ").toLocaleLowerCase(),this._weekdaysParse[i]=this.weekdays(mom,"
                                        ").toLocaleLowerCase();return strict?"
                                        dddd "===format?-1!==(ii=indexOf.call(this._weekdaysParse,llc))?ii:null:"
                                        ddd "===format?-1!==(ii=indexOf.call(this._shortWeekdaysParse,llc))?ii:null:-1!==(ii=indexOf.call(this._minWeekdaysParse,llc))?ii:null:"
                                        dddd "===format?-1!==(ii=indexOf.call(this._weekdaysParse,llc))?ii:-1!==(ii=indexOf.call(this._shortWeekdaysParse,llc))?ii:-1!==(ii=indexOf.call(this._minWeekdaysParse,llc))?ii:null:"
                                        ddd "===format?-1!==(ii=indexOf.call(this._shortWeekdaysParse,llc))?ii:-1!==(ii=indexOf.call(this._weekdaysParse,llc))?ii:-1!==(ii=indexOf.call(this._minWeekdaysParse,llc))?ii:null:-1!==(ii=indexOf.call(this._minWeekdaysParse,llc))?ii:-1!==(ii=indexOf.call(this._weekdaysParse,llc))?ii:-1!==(ii=indexOf.call(this._shortWeekdaysParse,llc))?ii:null}function localeWeekdaysParse(weekdayName,format,strict){var i,mom,regex;if(this._weekdaysParseExact)return handleStrictParse.call(this,weekdayName,format,strict);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),i=0;i<7;i++){if(mom=createUTC([2e3,1]).day(i),strict&&!this._fullWeekdaysParse[i]&&(this._fullWeekdaysParse[i]=new RegExp(" ^ "+this.weekdays(mom,"
                                        ").replace(".
                                        ","\. ? ")+"
                                        $ ","
                                        i "),this._shortWeekdaysParse[i]=new RegExp(" ^ "+this.weekdaysShort(mom,"
                                        ").replace(".
                                        ","\. ? ")+"
                                        $ ","
                                        i "),this._minWeekdaysParse[i]=new RegExp(" ^ "+this.weekdaysMin(mom,"
                                        ").replace(".
                                        ","\. ? ")+"
                                        $ ","
                                        i ")),this._weekdaysParse[i]||(regex=" ^ "+this.weekdays(mom,"
                                        ")+" | ^ "+this.weekdaysShort(mom,"
                                        ")+" | ^ "+this.weekdaysMin(mom,"
                                        "),this._weekdaysParse[i]=new RegExp(regex.replace(".
                                        ","
                                        "),"
                                        i ")),strict&&"
                                        dddd "===format&&this._fullWeekdaysParse[i].test(weekdayName))return i;if(strict&&"
                                        ddd "===format&&this._shortWeekdaysParse[i].test(weekdayName))return i;if(strict&&"
                                        dd "===format&&this._minWeekdaysParse[i].test(weekdayName))return i;if(!strict&&this._weekdaysParse[i].test(weekdayName))return i}}function getSetDayOfWeek(input){if(!this.isValid())return null!=input?this:NaN;var day=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=input?(input=parseWeekday(input,this.localeData()),this.add(input-day,"
                                        d ")):day}function getSetLocaleDayOfWeek(input){if(!this.isValid())return null!=input?this:NaN;var weekday=(this.day()+7-this.localeData()._week.dow)%7;return null==input?weekday:this.add(input-weekday,"
                                        d ")}function getSetISODayOfWeek(input){if(!this.isValid())return null!=input?this:NaN;if(null!=input){var weekday=parseIsoWeekday(input,this.localeData());return this.day(this.day()%7?weekday:weekday-7)}return this.day()||7}var defaultWeekdaysRegex=matchWord;function weekdaysRegex(isStrict){return this._weekdaysParseExact?(hasOwnProp(this,"
                                        _weekdaysRegex ")||computeWeekdaysParse.call(this),isStrict?this._weekdaysStrictRegex:this._weekdaysRegex):(hasOwnProp(this,"
                                        _weekdaysRegex ")||(this._weekdaysRegex=defaultWeekdaysRegex),this._weekdaysStrictRegex&&isStrict?this._weekdaysStrictRegex:this._weekdaysRegex)}var defaultWeekdaysShortRegex=matchWord;function weekdaysShortRegex(isStrict){return this._weekdaysParseExact?(hasOwnProp(this,"
                                        _weekdaysRegex ")||computeWeekdaysParse.call(this),isStrict?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(hasOwnProp(this,"
                                        _weekdaysShortRegex ")||(this._weekdaysShortRegex=defaultWeekdaysShortRegex),this._weekdaysShortStrictRegex&&isStrict?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)}var defaultWeekdaysMinRegex=matchWord;function weekdaysMinRegex(isStrict){return this._weekdaysParseExact?(hasOwnProp(this,"
                                        _weekdaysRegex ")||computeWeekdaysParse.call(this),isStrict?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(hasOwnProp(this,"
                                        _weekdaysMinRegex ")||(this._weekdaysMinRegex=defaultWeekdaysMinRegex),this._weekdaysMinStrictRegex&&isStrict?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)}function computeWeekdaysParse(){function cmpLenRev(a,b){return b.length-a.length}var minPieces=[],shortPieces=[],longPieces=[],mixedPieces=[],i,mom,minp,shortp,longp;for(i=0;i<7;i++)mom=createUTC([2e3,1]).day(i),minp=this.weekdaysMin(mom,"
                                        "),shortp=this.weekdaysShort(mom,"
                                        "),longp=this.weekdays(mom,"
                                        "),minPieces.push(minp),shortPieces.push(shortp),longPieces.push(longp),mixedPieces.push(minp),mixedPieces.push(shortp),mixedPieces.push(longp);for(minPieces.sort(cmpLenRev),shortPieces.sort(cmpLenRev),longPieces.sort(cmpLenRev),mixedPieces.sort(cmpLenRev),i=0;i<7;i++)shortPieces[i]=regexEscape(shortPieces[i]),longPieces[i]=regexEscape(longPieces[i]),mixedPieces[i]=regexEscape(mixedPieces[i]);this._weekdaysRegex=new RegExp(" ^ ("+mixedPieces.join(" | ")+")
                                        ","
                                        i "),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp(" ^ ("+longPieces.join(" | ")+")
                                        ","
                                        i "),this._weekdaysShortStrictRegex=new RegExp(" ^ ("+shortPieces.join(" | ")+")
                                        ","
                                        i "),this._weekdaysMinStrictRegex=new RegExp(" ^ ("+minPieces.join(" | ")+")
                                        ","
                                        i ")}function hFormat(){return this.hours()%12||12}function kFormat(){return this.hours()||24}function meridiem(token,lowercase){addFormatToken(token,0,0,(function(){return this.localeData().meridiem(this.hours(),this.minutes(),lowercase)}))}function matchMeridiem(isStrict,locale){return locale._meridiemParse}function localeIsPM(input){return"
                                        p "===(input+"
                                        ").toLowerCase().charAt(0)}addFormatToken("
                                        H ",["
                                        HH ",2],0,"
                                        hour "),addFormatToken("
                                        h ",["
                                        hh ",2],0,hFormat),addFormatToken("
                                        k ",["
                                        kk ",2],0,kFormat),addFormatToken("
                                        hmm ",0,0,(function(){return"
                                        "+hFormat.apply(this)+zeroFill(this.minutes(),2)})),addFormatToken("
                                        hmmss ",0,0,(function(){return"
                                        "+hFormat.apply(this)+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2)})),addFormatToken("
                                        Hmm ",0,0,(function(){return"
                                        "+this.hours()+zeroFill(this.minutes(),2)})),addFormatToken("
                                        Hmmss ",0,0,(function(){return"
                                        "+this.hours()+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2)})),meridiem("
                                        a ",!0),meridiem("
                                        A ",!1),addUnitAlias("
                                        hour ","
                                        h "),addUnitPriority("
                                        hour ",13),addRegexToken("
                                        a ",matchMeridiem),addRegexToken("
                                        A ",matchMeridiem),addRegexToken("
                                        H ",match1to2),addRegexToken("
                                        h ",match1to2),addRegexToken("
                                        k ",match1to2),addRegexToken("
                                        HH ",match1to2,match2),addRegexToken("
                                        hh ",match1to2,match2),addRegexToken("
                                        kk ",match1to2,match2),addRegexToken("
                                        hmm ",match3to4),addRegexToken("
                                        hmmss ",match5to6),addRegexToken("
                                        Hmm ",match3to4),addRegexToken("
                                        Hmmss ",match5to6),addParseToken(["
                                        H ","
                                        HH "],HOUR),addParseToken(["
                                        k ","
                                        kk "],(function(input,array,config){var kInput=toInt(input);array[HOUR]=24===kInput?0:kInput})),addParseToken(["
                                        a ","
                                        A "],(function(input,array,config){config._isPm=config._locale.isPM(input),config._meridiem=input})),addParseToken(["
                                        h ","
                                        hh "],(function(input,array,config){array[HOUR]=toInt(input),getParsingFlags(config).bigHour=!0})),addParseToken("
                                        hmm ",(function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos)),array[MINUTE]=toInt(input.substr(pos)),getParsingFlags(config).bigHour=!0})),addParseToken("
                                        hmmss ",(function(input,array,config){var pos1=input.length-4,pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1)),array[MINUTE]=toInt(input.substr(pos1,2)),array[SECOND]=toInt(input.substr(pos2)),getParsingFlags(config).bigHour=!0})),addParseToken("
                                        Hmm ",(function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos)),array[MINUTE]=toInt(input.substr(pos))})),addParseToken("
                                        Hmmss ",(function(input,array,config){var pos1=input.length-4,pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1)),array[MINUTE]=toInt(input.substr(pos1,2)),array[SECOND]=toInt(input.substr(pos2))}));var defaultLocaleMeridiemParse=/[ap]\.?m?\.?/i;function localeMeridiem(hours,minutes,isLower){return hours>11?isLower?"
                                        pm ":"
                                        PM ":isLower?"
                                        am ":"
                                        AM "}var getSetHour=makeGetSet("
                                        Hours ",!0),baseConfig={calendar:defaultCalendar,longDateFormat:defaultLongDateFormat,invalidDate:"
                                        Invalid date ",ordinal:" % d ",dayOfMonthOrdinalParse:defaultDayOfMonthOrdinalParse,relativeTime:defaultRelativeTime,months:defaultLocaleMonths,monthsShort:defaultLocaleMonthsShort,week:defaultLocaleWeek,weekdays:defaultLocaleWeekdays,weekdaysMin:defaultLocaleWeekdaysMin,weekdaysShort:defaultLocaleWeekdaysShort,meridiemParse:defaultLocaleMeridiemParse},locales={},localeFamilies={},globalLocale;function normalizeLocale(key){return key?key.toLowerCase().replace("
                                        _ "," - "):key}function chooseLocale(names){for(var i=0,j,next,locale,split;i<names.length;){for(j=(split=normalizeLocale(names[i]).split(" - ")).length,next=(next=normalizeLocale(names[i+1]))?next.split(" - "):null;j>0;){if(locale=loadLocale(split.slice(0,j).join(" - ")))return locale;if(next&&next.length>=j&&compareArrays(split,next,!0)>=j-1)break;j--}i++}return globalLocale}function loadLocale(name){var oldLocale=null;if(!locales[name]&&"
                                        undefined "!=typeof module&&module&&module.exports)try{var aliasedRequire;oldLocale=globalLocale._abbr,require(". / locale / "+name),getSetGlobalLocale(oldLocale)}catch(e){}return locales[name]}function getSetGlobalLocale(key,values){var data;return key&&((data=isUndefined(values)?getLocale(key):defineLocale(key,values))?globalLocale=data:"
                                        undefined "!=typeof console&&console.warn&&console.warn("
                                        Locale "+key+"
                                        not found.Did you forget to load it ? ")),globalLocale._abbr}function defineLocale(name,config){if(null!==config){var locale,parentConfig=baseConfig;if(config.abbr=name,null!=locales[name])deprecateSimple("
                                        defineLocaleOverride ","
                                        use moment.updateLocale(localeName, config) to change an existing locale.moment.defineLocale(localeName, config) should only be used
                                        for creating a new locale See http : //momentjs.com/guides/#/warnings/define-locale/ for more info."),parentConfig=locales[name]._config;else if(null!=config.parentLocale)if(null!=locales[config.parentLocale])parentConfig=locales[config.parentLocale]._config;else{if(null==(locale=loadLocale(config.parentLocale)))return localeFamilies[config.parentLocale]||(localeFamilies[config.parentLocale]=[]),localeFamilies[config.parentLocale].push({name:name,config:config}),null;parentConfig=locale._config}return locales[name]=new Locale(mergeConfigs(parentConfig,config)),localeFamilies[name]&&localeFamilies[name].forEach((function(x){defineLocale(x.name,x.config)})),getSetGlobalLocale(name),locales[name]}return delete locales[name],null}function updateLocale(name,config){if(null!=config){var locale,tmpLocale,parentConfig=baseConfig;null!=(tmpLocale=loadLocale(name))&&(parentConfig=tmpLocale._config),(locale=new Locale(config=mergeConfigs(parentConfig,config))).parentLocale=locales[name],locales[name]=locale,getSetGlobalLocale(name)}else null!=locales[name]&&(null!=locales[name].parentLocale?locales[name]=locales[name].parentLocale:null!=locales[name]&&delete locales[name]);return locales[name]}function getLocale(key){var locale;if(key&&key._locale&&key._locale._abbr&&(key=key._locale._abbr),!key)return globalLocale;if(!isArray(key)){if(locale=loadLocale(key))return locale;key=[key]}return chooseLocale(key)}function listLocales(){return keys(locales)}function checkOverflow(m){var overflow,a=m._a;return a&&-2===getParsingFlags(m).overflow&&(overflow=a[MONTH]<0||a[MONTH]>11?MONTH:a[DATE]<1||a[DATE]>daysInMonth(a[YEAR],a[MONTH])?DATE:a[HOUR]<0||a[HOUR]>24||24===a[HOUR]&&(0!==a[MINUTE]||0!==a[SECOND]||0!==a[MILLISECOND])?HOUR:a[MINUTE]<0||a[MINUTE]>59?MINUTE:a[SECOND]<0||a[SECOND]>59?SECOND:a[MILLISECOND]<0||a[MILLISECOND]>999?MILLISECOND:-1,getParsingFlags(m)._overflowDayOfYear&&(overflow<YEAR||overflow>DATE)&&(overflow=DATE),getParsingFlags(m)._overflowWeeks&&-1===overflow&&(overflow=WEEK),getParsingFlags(m)._overflowWeekday&&-1===overflow&&(overflow=WEEKDAY),getParsingFlags(m).overflow=overflow),m}function defaults(a,b,c){return null!=a?a:null!=b?b:c}function currentDateArray(config){var nowValue=new Date(hooks.now());return config._useUTC?[nowValue.getUTCFullYear(),nowValue.getUTCMonth(),nowValue.getUTCDate()]:[nowValue.getFullYear(),nowValue.getMonth(),nowValue.getDate()]}function configFromArray(config){var i,date,input=[],currentDate,expectedWeekday,yearToUse;if(!config._d){for(currentDate=currentDateArray(config),config._w&&null==config._a[DATE]&&null==config._a[MONTH]&&dayOfYearFromWeekInfo(config),null!=config._dayOfYear&&(yearToUse=defaults(config._a[YEAR],currentDate[YEAR]),(config._dayOfYear>daysInYear(yearToUse)||0===config._dayOfYear)&&(getParsingFlags(config)._overflowDayOfYear=!0),date=createUTCDate(yearToUse,0,config._dayOfYear),config._a[MONTH]=date.getUTCMonth(),config._a[DATE]=date.getUTCDate()),i=0;i<3&&null==config._a[i];++i)config._a[i]=input[i]=currentDate[i];for(;i<7;i++)config._a[i]=input[i]=null==config._a[i]?2===i?1:0:config._a[i];24===config._a[HOUR]&&0===config._a[MINUTE]&&0===config._a[SECOND]&&0===config._a[MILLISECOND]&&(config._nextDay=!0,config._a[HOUR]=0),config._d=(config._useUTC?createUTCDate:createDate).apply(null,input),expectedWeekday=config._useUTC?config._d.getUTCDay():config._d.getDay(),null!=config._tzm&&config._d.setUTCMinutes(config._d.getUTCMinutes()-config._tzm),config._nextDay&&(config._a[HOUR]=24),config._w&&void 0!==config._w.d&&config._w.d!==expectedWeekday&&(getParsingFlags(config).weekdayMismatch=!0)}}function dayOfYearFromWeekInfo(config){var w,weekYear,week,weekday,dow,doy,temp,weekdayOverflow;if(null!=(w=config._w).GG||null!=w.W||null!=w.E)dow=1,doy=4,weekYear=defaults(w.GG,config._a[YEAR],weekOfYear(createLocal(),1,4).year),week=defaults(w.W,1),((weekday=defaults(w.E,1))<1||weekday>7)&&(weekdayOverflow=!0);else{dow=config._locale._week.dow,doy=config._locale._week.doy;var curWeek=weekOfYear(createLocal(),dow,doy);weekYear=defaults(w.gg,config._a[YEAR],curWeek.year),week=defaults(w.w,curWeek.week),null!=w.d?((weekday=w.d)<0||weekday>6)&&(weekdayOverflow=!0):null!=w.e?(weekday=w.e+dow,(w.e<0||w.e>6)&&(weekdayOverflow=!0)):weekday=dow}week<1||week>weeksInYear(weekYear,dow,doy)?getParsingFlags(config)._overflowWeeks=!0:null!=weekdayOverflow?getParsingFlags(config)._overflowWeekday=!0:(temp=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy),config._a[YEAR]=temp.year,config._dayOfYear=temp.dayOfYear)}var extendedIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,basicIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,tzRegex=/Z|[+-]\d\d(?::?\d\d)?/,isoDates=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],isoTimes=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],aspNetJsonRegex=/^\/?Date\((\-?\d+)/i;function configFromISO(config){var i,l,string=config._i,match=extendedIsoRegex.exec(string)||basicIsoRegex.exec(string),allowTime,dateFormat,timeFormat,tzFormat;if(match){for(getParsingFlags(config).iso=!0,i=0,l=isoDates.length;i<l;i++)if(isoDates[i][1].exec(match[1])){dateFormat=isoDates[i][0],allowTime=!1!==isoDates[i][2];break}if(null==dateFormat)return void(config._isValid=!1);if(match[3]){for(i=0,l=isoTimes.length;i<l;i++)if(isoTimes[i][1].exec(match[3])){timeFormat=(match[2]||" ")+isoTimes[i][0];break}if(null==timeFormat)return void(config._isValid=!1)}if(!allowTime&&null!=timeFormat)return void(config._isValid=!1);if(match[4]){if(!tzRegex.exec(match[4]))return void(config._isValid=!1);tzFormat="Z"}config._f=dateFormat+(timeFormat||"")+(tzFormat||""),configFromStringAndFormat(config)}else config._isValid=!1}var rfc2822=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;function extractFromRFC2822Strings(yearStr,monthStr,dayStr,hourStr,minuteStr,secondStr){var result=[untruncateYear(yearStr),defaultLocaleMonthsShort.indexOf(monthStr),parseInt(dayStr,10),parseInt(hourStr,10),parseInt(minuteStr,10)];return secondStr&&result.push(parseInt(secondStr,10)),result}function untruncateYear(yearStr){var year=parseInt(yearStr,10);return year<=49?2e3+year:year<=999?1900+year:year}function preprocessRFC2822(s){return s.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,"")}function checkWeekday(weekdayStr,parsedInput,config){var weekdayProvided,weekdayActual;if(weekdayStr&&defaultLocaleWeekdaysShort.indexOf(weekdayStr)!==new Date(parsedInput[0],parsedInput[1],parsedInput[2]).getDay())return getParsingFlags(config).weekdayMismatch=!0,config._isValid=!1,!1;return!0}var obsOffsets={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function calculateOffset(obsOffset,militaryOffset,numOffset){if(obsOffset)return obsOffsets[obsOffset];if(militaryOffset)return 0;var hm=parseInt(numOffset,10),m=hm%100,h;return 60*((hm-m)/100)+m}function configFromRFC2822(config){var match=rfc2822.exec(preprocessRFC2822(config._i));if(match){var parsedArray=extractFromRFC2822Strings(match[4],match[3],match[2],match[5],match[6],match[7]);if(!checkWeekday(match[1],parsedArray,config))return;config._a=parsedArray,config._tzm=calculateOffset(match[8],match[9],match[10]),config._d=createUTCDate.apply(null,config._a),config._d.setUTCMinutes(config._d.getUTCMinutes()-config._tzm),getParsingFlags(config).rfc2822=!0}else config._isValid=!1}function configFromString(config){var matched=aspNetJsonRegex.exec(config._i);null===matched?(configFromISO(config),!1===config._isValid&&(delete config._isValid,configFromRFC2822(config),!1===config._isValid&&(delete config._isValid,hooks.createFromInputFallback(config)))):config._d=new Date(+matched[1])}function configFromStringAndFormat(config){if(config._f!==hooks.ISO_8601)if(config._f!==hooks.RFC_2822){config._a=[],getParsingFlags(config).empty=!0;var string=""+config._i,i,parsedInput,tokens,token,skipped,stringLength=string.length,totalParsedInputLength=0;for(tokens=expandFormat(config._f,config._locale).match(formattingTokens)||[],i=0;i<tokens.length;i++)token=tokens[i],(parsedInput=(string.match(getParseRegexForToken(token,config))||[])[0])&&((skipped=string.substr(0,string.indexOf(parsedInput))).length>0&&getParsingFlags(config).unusedInput.push(skipped),string=string.slice(string.indexOf(parsedInput)+parsedInput.length),totalParsedInputLength+=parsedInput.length),formatTokenFunctions[token]?(parsedInput?getParsingFlags(config).empty=!1:getParsingFlags(config).unusedTokens.push(token),addTimeToArrayFromToken(token,parsedInput,config)):config._strict&&!parsedInput&&getParsingFlags(config).unusedTokens.push(token);getParsingFlags(config).charsLeftOver=stringLength-totalParsedInputLength,string.length>0&&getParsingFlags(config).unusedInput.push(string),config._a[HOUR]<=12&&!0===getParsingFlags(config).bigHour&&config._a[HOUR]>0&&(getParsingFlags(config).bigHour=void 0),getParsingFlags(config).parsedDateParts=config._a.slice(0),getParsingFlags(config).meridiem=config._meridiem,config._a[HOUR]=meridiemFixWrap(config._locale,config._a[HOUR],config._meridiem),configFromArray(config),checkOverflow(config)}else configFromRFC2822(config);else configFromISO(config)}function meridiemFixWrap(locale,hour,meridiem){var isPm;return null==meridiem?hour:null!=locale.meridiemHour?locale.meridiemHour(hour,meridiem):null!=locale.isPM?((isPm=locale.isPM(meridiem))&&hour<12&&(hour+=12),isPm||12!==hour||(hour=0),hour):hour}function configFromStringAndArray(config){var tempConfig,bestMoment,scoreToBeat,i,currentScore;if(0===config._f.length)return getParsingFlags(config).invalidFormat=!0,void(config._d=new Date(NaN));for(i=0;i<config._f.length;i++)currentScore=0,tempConfig=copyConfig({},config),null!=config._useUTC&&(tempConfig._useUTC=config._useUTC),tempConfig._f=config._f[i],configFromStringAndFormat(tempConfig),isValid(tempConfig)&&(currentScore+=getParsingFlags(tempConfig).charsLeftOver,currentScore+=10*getParsingFlags(tempConfig).unusedTokens.length,getParsingFlags(tempConfig).score=currentScore,(null==scoreToBeat||currentScore<scoreToBeat)&&(scoreToBeat=currentScore,bestMoment=tempConfig));extend(config,bestMoment||tempConfig)}function configFromObject(config){if(!config._d){var i=normalizeObjectUnits(config._i);config._a=map([i.year,i.month,i.day||i.date,i.hour,i.minute,i.second,i.millisecond],(function(obj){return obj&&parseInt(obj,10)})),configFromArray(config)}}function createFromConfig(config){var res=new Moment(checkOverflow(prepareConfig(config)));return res._nextDay&&(res.add(1,"d"),res._nextDay=void 0),res}function prepareConfig(config){var input=config._i,format=config._f;return config._locale=config._locale||getLocale(config._l),null===input||void 0===format&&""===input?createInvalid({nullInput:!0}):("string"==typeof input&&(config._i=input=config._locale.preparse(input)),isMoment(input)?new Moment(checkOverflow(input)):(isDate(input)?config._d=input:isArray(format)?configFromStringAndArray(config):format?configFromStringAndFormat(config):configFromInput(config),isValid(config)||(config._d=null),config))}function configFromInput(config){var input=config._i;isUndefined(input)?config._d=new Date(hooks.now()):isDate(input)?config._d=new Date(input.valueOf()):"string"==typeof input?configFromString(config):isArray(input)?(config._a=map(input.slice(0),(function(obj){return parseInt(obj,10)})),configFromArray(config)):isObject(input)?configFromObject(config):isNumber(input)?config._d=new Date(input):hooks.createFromInputFallback(config)}function createLocalOrUTC(input,format,locale,strict,isUTC){var c={};return!0!==locale&&!1!==locale||(strict=locale,locale=void 0),(isObject(input)&&isObjectEmpty(input)||isArray(input)&&0===input.length)&&(input=void 0),c._isAMomentObject=!0,c._useUTC=c._isUTC=isUTC,c._l=locale,c._i=input,c._f=format,c._strict=strict,createFromConfig(c)}function createLocal(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,!1)}hooks.createFromInputFallback=deprecate("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",(function(config){config._d=new Date(config._i+(config._useUTC?" UTC":""))})),hooks.ISO_8601=function(){},hooks.RFC_2822=function(){};var prototypeMin=deprecate("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var other=createLocal.apply(null,arguments);return this.isValid()&&other.isValid()?other<this?this:other:createInvalid()})),prototypeMax=deprecate("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var other=createLocal.apply(null,arguments);return this.isValid()&&other.isValid()?other>this?this:other:createInvalid()}));function pickBy(fn,moments){var res,i;if(1===moments.length&&isArray(moments[0])&&(moments=moments[0]),!moments.length)return createLocal();for(res=moments[0],i=1;i<moments.length;++i)moments[i].isValid()&&!moments[i][fn](res)||(res=moments[i]);return res}function min(){var args;return pickBy("isBefore",[].slice.call(arguments,0))}function max(){var args;return pickBy("isAfter",[].slice.call(arguments,0))}var now=function(){return Date.now?Date.now():+new Date},ordering=["year","quarter","month","week","day","hour","minute","second","millisecond"];function isDurationValid(m){for(var key in m)if(-1===indexOf.call(ordering,key)||null!=m[key]&&isNaN(m[key]))return!1;for(var unitHasDecimal=!1,i=0;i<ordering.length;++i)if(m[ordering[i]]){if(unitHasDecimal)return!1;parseFloat(m[ordering[i]])!==toInt(m[ordering[i]])&&(unitHasDecimal=!0)}return!0}function isValid(){return this._isValid}function createInvalid(){return createDuration(NaN)}function Duration(duration){var normalizedInput=normalizeObjectUnits(duration),years=normalizedInput.year||0,quarters=normalizedInput.quarter||0,months=normalizedInput.month||0,weeks=normalizedInput.week||normalizedInput.isoWeek||0,days=normalizedInput.day||0,hours=normalizedInput.hour||0,minutes=normalizedInput.minute||0,seconds=normalizedInput.second||0,milliseconds=normalizedInput.millisecond||0;this._isValid=isDurationValid(normalizedInput),this._milliseconds=+milliseconds+1e3*seconds+6e4*minutes+1e3*hours*60*60,this._days=+days+7*weeks,this._months=+months+3*quarters+12*years,this._data={},this._locale=getLocale(),this._bubble()}function isDuration(obj){return obj instanceof Duration}function absRound(number){return number<0?-1*Math.round(-1*number):Math.round(number)}function offset(token,separator){addFormatToken(token,0,0,(function(){var offset=this.utcOffset(),sign="+";return offset<0&&(offset=-offset,sign="-"),sign+zeroFill(~~(offset/60),2)+separator+zeroFill(~~offset%60,2)}))}offset("Z",":"),offset("ZZ",""),addRegexToken("Z",matchShortOffset),addRegexToken("ZZ",matchShortOffset),addParseToken(["Z","ZZ"],(function(input,array,config){config._useUTC=!0,config._tzm=offsetFromString(matchShortOffset,input)}));var chunkOffset=/([\+\-]|\d\d)/gi;function offsetFromString(matcher,string){var matches=(string||"").match(matcher);if(null===matches)return null;var chunk,parts=((matches[matches.length-1]||[])+"").match(chunkOffset)||["-",0,0],minutes=60*parts[1]+toInt(parts[2]);return 0===minutes?0:"+"===parts[0]?minutes:-minutes}function cloneWithOffset(input,model){var res,diff;return model._isUTC?(res=model.clone(),diff=(isMoment(input)||isDate(input)?input.valueOf():createLocal(input).valueOf())-res.valueOf(),res._d.setTime(res._d.valueOf()+diff),hooks.updateOffset(res,!1),res):createLocal(input).local()}function getDateOffset(m){return 15*-Math.round(m._d.getTimezoneOffset()/15)}function getSetOffset(input,keepLocalTime,keepMinutes){var offset=this._offset||0,localAdjust;if(!this.isValid())return null!=input?this:NaN;if(null!=input){if("string"==typeof input){if(null===(input=offsetFromString(matchShortOffset,input)))return this}else Math.abs(input)<16&&!keepMinutes&&(input*=60);return!this._isUTC&&keepLocalTime&&(localAdjust=getDateOffset(this)),this._offset=input,this._isUTC=!0,null!=localAdjust&&this.add(localAdjust,"m"),offset!==input&&(!keepLocalTime||this._changeInProgress?addSubtract(this,createDuration(input-offset,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,hooks.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?offset:getDateOffset(this)}function getSetZone(input,keepLocalTime){return null!=input?("string"!=typeof input&&(input=-input),this.utcOffset(input,keepLocalTime),this):-this.utcOffset()}function setOffsetToUTC(keepLocalTime){return this.utcOffset(0,keepLocalTime)}function setOffsetToLocal(keepLocalTime){return this._isUTC&&(this.utcOffset(0,keepLocalTime),this._isUTC=!1,keepLocalTime&&this.subtract(getDateOffset(this),"m")),this}function setOffsetToParsedOffset(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var tZone=offsetFromString(matchOffset,this._i);null!=tZone?this.utcOffset(tZone):this.utcOffset(0,!0)}return this}function hasAlignedHourOffset(input){return!!this.isValid()&&(input=input?createLocal(input).utcOffset():0,(this.utcOffset()-input)%60==0)}function isDaylightSavingTime(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function isDaylightSavingTimeShifted(){if(!isUndefined(this._isDSTShifted))return this._isDSTShifted;var c={};if(copyConfig(c,this),(c=prepareConfig(c))._a){var other=c._isUTC?createUTC(c._a):createLocal(c._a);this._isDSTShifted=this.isValid()&&compareArrays(c._a,other.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function isLocal(){return!!this.isValid()&&!this._isUTC}function isUtcOffset(){return!!this.isValid()&&this._isUTC}function isUtc(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}hooks.updateOffset=function(){};var aspNetRegex=/^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,isoRegex=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function createDuration(input,key){var duration=input,match=null,sign,ret,diffRes;return isDuration(input)?duration={ms:input._milliseconds,d:input._days,M:input._months}:isNumber(input)?(duration={},key?duration[key]=input:duration.milliseconds=input):(match=aspNetRegex.exec(input))?(sign="-"===match[1]?-1:1,duration={y:0,d:toInt(match[DATE])*sign,h:toInt(match[HOUR])*sign,m:toInt(match[MINUTE])*sign,s:toInt(match[SECOND])*sign,ms:toInt(absRound(1e3*match[MILLISECOND]))*sign}):(match=isoRegex.exec(input))?(sign="-"===match[1]?-1:1,duration={y:parseIso(match[2],sign),M:parseIso(match[3],sign),w:parseIso(match[4],sign),d:parseIso(match[5],sign),h:parseIso(match[6],sign),m:parseIso(match[7],sign),s:parseIso(match[8],sign)}):null==duration?duration={}:"object"==typeof duration&&("from"in duration||"to"in duration)&&(diffRes=momentsDifference(createLocal(duration.from),createLocal(duration.to)),(duration={}).ms=diffRes.milliseconds,duration.M=diffRes.months),ret=new Duration(duration),isDuration(input)&&hasOwnProp(input,"_locale")&&(ret._locale=input._locale),ret}function parseIso(inp,sign){var res=inp&&parseFloat(inp.replace(",","."));return(isNaN(res)?0:res)*sign}function positiveMomentsDifference(base,other){var res={};return res.months=other.month()-base.month()+12*(other.year()-base.year()),base.clone().add(res.months,"M").isAfter(other)&&--res.months,res.milliseconds=+other-+base.clone().add(res.months,"M"),res}function momentsDifference(base,other){var res;return base.isValid()&&other.isValid()?(other=cloneWithOffset(other,base),base.isBefore(other)?res=positiveMomentsDifference(base,other):((res=positiveMomentsDifference(other,base)).milliseconds=-res.milliseconds,res.months=-res.months),res):{milliseconds:0,months:0}}function createAdder(direction,name){return function(val,period){var dur,tmp;return null===period||isNaN(+period)||(deprecateSimple(name,"moment()."+name+"(period, number) is deprecated. Please use moment()."+name+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),tmp=val,val=period,period=tmp),addSubtract(this,dur=createDuration(val="string"==typeof val?+val:val,period),direction),this}}function addSubtract(mom,duration,isAdding,updateOffset){var milliseconds=duration._milliseconds,days=absRound(duration._days),months=absRound(duration._months);mom.isValid()&&(updateOffset=null==updateOffset||updateOffset,months&&setMonth(mom,get(mom,"Month")+months*isAdding),days&&set(mom,"Date",get(mom,"Date")+days*isAdding),milliseconds&&mom._d.setTime(mom._d.valueOf()+milliseconds*isAdding),updateOffset&&hooks.updateOffset(mom,days||months))}createDuration.fn=Duration.prototype,createDuration.invalid=createInvalid;var add=createAdder(1,"add"),subtract=createAdder(-1,"subtract");function getCalendarFormat(myMoment,now){var diff=myMoment.diff(now,"days",!0);return diff<-6?"sameElse":diff<-1?"lastWeek":diff<0?"lastDay":diff<1?"sameDay":diff<2?"nextDay":diff<7?"nextWeek":"sameElse"}function calendar(time,formats){var now=time||createLocal(),sod=cloneWithOffset(now,this).startOf("day"),format=hooks.calendarFormat(this,sod)||"sameElse",output=formats&&(isFunction(formats[format])?formats[format].call(this,now):formats[format]);return this.format(output||this.localeData().calendar(format,this,createLocal(now)))}function clone(){return new Moment(this)}function isAfter(input,units){var localInput=isMoment(input)?input:createLocal(input);return!(!this.isValid()||!localInput.isValid())&&("millisecond"===(units=normalizeUnits(units)||"millisecond")?this.valueOf()>localInput.valueOf():localInput.valueOf()<this.clone().startOf(units).valueOf())}function isBefore(input,units){var localInput=isMoment(input)?input:createLocal(input);return!(!this.isValid()||!localInput.isValid())&&("millisecond"===(units=normalizeUnits(units)||"millisecond")?this.valueOf()<localInput.valueOf():this.clone().endOf(units).valueOf()<localInput.valueOf())}function isBetween(from,to,units,inclusivity){var localFrom=isMoment(from)?from:createLocal(from),localTo=isMoment(to)?to:createLocal(to);return!!(this.isValid()&&localFrom.isValid()&&localTo.isValid())&&(("("===(inclusivity=inclusivity||"()")[0]?this.isAfter(localFrom,units):!this.isBefore(localFrom,units))&&(")"===inclusivity[1]?this.isBefore(localTo,units):!this.isAfter(localTo,units)))}function isSame(input,units){var localInput=isMoment(input)?input:createLocal(input),inputMs;return!(!this.isValid()||!localInput.isValid())&&("millisecond"===(units=normalizeUnits(units)||"millisecond")?this.valueOf()===localInput.valueOf():(inputMs=localInput.valueOf(),this.clone().startOf(units).valueOf()<=inputMs&&inputMs<=this.clone().endOf(units).valueOf()))}function isSameOrAfter(input,units){return this.isSame(input,units)||this.isAfter(input,units)}function isSameOrBefore(input,units){return this.isSame(input,units)||this.isBefore(input,units)}function diff(input,units,asFloat){var that,zoneDelta,output;if(!this.isValid())return NaN;if(!(that=cloneWithOffset(input,this)).isValid())return NaN;switch(zoneDelta=6e4*(that.utcOffset()-this.utcOffset()),units=normalizeUnits(units)){case"year":output=monthDiff(this,that)/12;break;case"month":output=monthDiff(this,that);break;case"quarter":output=monthDiff(this,that)/3;break;case"second":output=(this-that)/1e3;break;case"minute":output=(this-that)/6e4;break;case"hour":output=(this-that)/36e5;break;case"day":output=(this-that-zoneDelta)/864e5;break;case"week":output=(this-that-zoneDelta)/6048e5;break;default:output=this-that}return asFloat?output:absFloor(output)}function monthDiff(a,b){var wholeMonthDiff=12*(b.year()-a.year())+(b.month()-a.month()),anchor=a.clone().add(wholeMonthDiff,"months"),anchor2,adjust;return-(wholeMonthDiff+(adjust=b-anchor<0?(b-anchor)/(anchor-(anchor2=a.clone().add(wholeMonthDiff-1,"months"))):(b-anchor)/((anchor2=a.clone().add(wholeMonthDiff+1,"months"))-anchor)))||0}function toString(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function toISOString(keepOffset){if(!this.isValid())return null;var utc=!0!==keepOffset,m=utc?this.clone().utc():this;return m.year()<0||m.year()>9999?formatMoment(m,utc?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):isFunction(Date.prototype.toISOString)?utc?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",formatMoment(m,"Z")):formatMoment(m,utc?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")}function inspect(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var func="moment",zone="";this.isLocal()||(func=0===this.utcOffset()?"moment.utc":"moment.parseZone",zone="Z");var prefix="["+func+'("]',year=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",datetime="-MM-DD[T]HH:mm:ss.SSS",suffix=zone+'[")]';return this.format(prefix+year+datetime+suffix)}function format(inputString){inputString||(inputString=this.isUtc()?hooks.defaultFormatUtc:hooks.defaultFormat);var output=formatMoment(this,inputString);return this.localeData().postformat(output)}function from(time,withoutSuffix){return this.isValid()&&(isMoment(time)&&time.isValid()||createLocal(time).isValid())?createDuration({to:this,from:time}).locale(this.locale()).humanize(!withoutSuffix):this.localeData().invalidDate()}function fromNow(withoutSuffix){return this.from(createLocal(),withoutSuffix)}function to(time,withoutSuffix){return this.isValid()&&(isMoment(time)&&time.isValid()||createLocal(time).isValid())?createDuration({from:this,to:time}).locale(this.locale()).humanize(!withoutSuffix):this.localeData().invalidDate()}function toNow(withoutSuffix){return this.to(createLocal(),withoutSuffix)}function locale(key){var newLocaleData;return void 0===key?this._locale._abbr:(null!=(newLocaleData=getLocale(key))&&(this._locale=newLocaleData),this)}hooks.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",hooks.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var lang=deprecate("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",(function(key){return void 0===key?this.localeData():this.locale(key)}));function localeData(){return this._locale}var MS_PER_SECOND=1e3,MS_PER_MINUTE=60*MS_PER_SECOND,MS_PER_HOUR=60*MS_PER_MINUTE,MS_PER_400_YEARS=3506328*MS_PER_HOUR;function mod(dividend,divisor){return(dividend%divisor+divisor)%divisor}function localStartOfDate(y,m,d){return y<100&&y>=0?new Date(y+400,m,d)-MS_PER_400_YEARS:new Date(y,m,d).valueOf()}function utcStartOfDate(y,m,d){return y<100&&y>=0?Date.UTC(y+400,m,d)-MS_PER_400_YEARS:Date.UTC(y,m,d)}function startOf(units){var time;if(void 0===(units=normalizeUnits(units))||"millisecond"===units||!this.isValid())return this;var startOfDate=this._isUTC?utcStartOfDate:localStartOfDate;switch(units){case"year":time=startOfDate(this.year(),0,1);break;case"quarter":time=startOfDate(this.year(),this.month()-this.month()%3,1);break;case"month":time=startOfDate(this.year(),this.month(),1);break;case"week":time=startOfDate(this.year(),this.month(),this.date()-this.weekday());break;case"isoWeek":time=startOfDate(this.year(),this.month(),this.date()-(this.isoWeekday()-1));break;case"day":case"date":time=startOfDate(this.year(),this.month(),this.date());break;case"hour":time=this._d.valueOf(),time-=mod(time+(this._isUTC?0:this.utcOffset()*MS_PER_MINUTE),MS_PER_HOUR);break;case"minute":time=this._d.valueOf(),time-=mod(time,MS_PER_MINUTE);break;case"second":time=this._d.valueOf(),time-=mod(time,MS_PER_SECOND)}return this._d.setTime(time),hooks.updateOffset(this,!0),this}function endOf(units){var time;if(void 0===(units=normalizeUnits(units))||"millisecond"===units||!this.isValid())return this;var startOfDate=this._isUTC?utcStartOfDate:localStartOfDate;switch(units){case"year":time=startOfDate(this.year()+1,0,1)-1;break;case"quarter":time=startOfDate(this.year(),this.month()-this.month()%3+3,1)-1;break;case"month":time=startOfDate(this.year(),this.month()+1,1)-1;break;case"week":time=startOfDate(this.year(),this.month(),this.date()-this.weekday()+7)-1;break;case"isoWeek":time=startOfDate(this.year(),this.month(),this.date()-(this.isoWeekday()-1)+7)-1;break;case"day":case"date":time=startOfDate(this.year(),this.month(),this.date()+1)-1;break;case"hour":time=this._d.valueOf(),time+=MS_PER_HOUR-mod(time+(this._isUTC?0:this.utcOffset()*MS_PER_MINUTE),MS_PER_HOUR)-1;break;case"minute":time=this._d.valueOf(),time+=MS_PER_MINUTE-mod(time,MS_PER_MINUTE)-1;break;case"second":time=this._d.valueOf(),time+=MS_PER_SECOND-mod(time,MS_PER_SECOND)-1}return this._d.setTime(time),hooks.updateOffset(this,!0),this}function valueOf(){return this._d.valueOf()-6e4*(this._offset||0)}function unix(){return Math.floor(this.valueOf()/1e3)}function toDate(){return new Date(this.valueOf())}function toArray(){var m=this;return[m.year(),m.month(),m.date(),m.hour(),m.minute(),m.second(),m.millisecond()]}function toObject(){var m=this;return{years:m.year(),months:m.month(),date:m.date(),hours:m.hours(),minutes:m.minutes(),seconds:m.seconds(),milliseconds:m.milliseconds()}}function toJSON(){return this.isValid()?this.toISOString():null}function isValid(){return isValid(this)}function parsingFlags(){return extend({},getParsingFlags(this))}function invalidAt(){return getParsingFlags(this).overflow}function creationData(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}}function addWeekYearFormatToken(token,getter){addFormatToken(0,[token,token.length],0,getter)}function getSetWeekYear(input){return getSetWeekYearHelper.call(this,input,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)}function getSetISOWeekYear(input){return getSetWeekYearHelper.call(this,input,this.isoWeek(),this.isoWeekday(),1,4)}function getISOWeeksInYear(){return weeksInYear(this.year(),1,4)}function getWeeksInYear(){var weekInfo=this.localeData()._week;return weeksInYear(this.year(),weekInfo.dow,weekInfo.doy)}function getSetWeekYearHelper(input,week,weekday,dow,doy){var weeksTarget;return null==input?weekOfYear(this,dow,doy).year:(week>(weeksTarget=weeksInYear(input,dow,doy))&&(week=weeksTarget),setWeekAll.call(this,input,week,weekday,dow,doy))}function setWeekAll(weekYear,week,weekday,dow,doy){var dayOfYearData=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy),date=createUTCDate(dayOfYearData.year,0,dayOfYearData.dayOfYear);return this.year(date.getUTCFullYear()),this.month(date.getUTCMonth()),this.date(date.getUTCDate()),this}function getSetQuarter(input){return null==input?Math.ceil((this.month()+1)/3):this.month(3*(input-1)+this.month()%3)}addFormatToken(0,["gg",2],0,(function(){return this.weekYear()%100})),addFormatToken(0,["GG",2],0,(function(){return this.isoWeekYear()%100})),addWeekYearFormatToken("gggg","weekYear"),addWeekYearFormatToken("ggggg","weekYear"),addWeekYearFormatToken("GGGG","isoWeekYear"),addWeekYearFormatToken("GGGGG","isoWeekYear"),addUnitAlias("weekYear","gg"),addUnitAlias("isoWeekYear","GG"),addUnitPriority("weekYear",1),addUnitPriority("isoWeekYear",1),addRegexToken("G",matchSigned),addRegexToken("g",matchSigned),addRegexToken("GG",match1to2,match2),addRegexToken("gg",match1to2,match2),addRegexToken("GGGG",match1to4,match4),addRegexToken("gggg",match1to4,match4),addRegexToken("GGGGG",match1to6,match6),addRegexToken("ggggg",match1to6,match6),addWeekParseToken(["gggg","ggggg","GGGG","GGGGG"],(function(input,week,config,token){week[token.substr(0,2)]=toInt(input)})),addWeekParseToken(["gg","GG"],(function(input,week,config,token){week[token]=hooks.parseTwoDigitYear(input)})),addFormatToken("Q",0,"Qo","quarter"),addUnitAlias("quarter","Q"),addUnitPriority("quarter",7),addRegexToken("Q",match1),addParseToken("Q",(function(input,array){array[MONTH]=3*(toInt(input)-1)})),addFormatToken("D",["DD",2],"Do","date"),addUnitAlias("date","D"),addUnitPriority("date",9),addRegexToken("D",match1to2),addRegexToken("DD",match1to2,match2),addRegexToken("Do",(function(isStrict,locale){return isStrict?locale._dayOfMonthOrdinalParse||locale._ordinalParse:locale._dayOfMonthOrdinalParseLenient})),addParseToken(["D","DD"],DATE),addParseToken("Do",(function(input,array){array[DATE]=toInt(input.match(match1to2)[0])}));var getSetDayOfMonth=makeGetSet("Date",!0);function getSetDayOfYear(input){var dayOfYear=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==input?dayOfYear:this.add(input-dayOfYear,"d")}addFormatToken("DDD",["DDDD",3],"DDDo","dayOfYear"),addUnitAlias("dayOfYear","DDD"),addUnitPriority("dayOfYear",4),addRegexToken("DDD",match1to3),addRegexToken("DDDD",match3),addParseToken(["DDD","DDDD"],(function(input,array,config){config._dayOfYear=toInt(input)})),addFormatToken("m",["mm",2],0,"minute"),addUnitAlias("minute","m"),addUnitPriority("minute",14),addRegexToken("m",match1to2),addRegexToken("mm",match1to2,match2),addParseToken(["m","mm"],MINUTE);var getSetMinute=makeGetSet("Minutes",!1);addFormatToken("s",["ss",2],0,"second"),addUnitAlias("second","s"),addUnitPriority("second",15),addRegexToken("s",match1to2),addRegexToken("ss",match1to2,match2),addParseToken(["s","ss"],SECOND);var getSetSecond=makeGetSet("Seconds",!1),token;for(addFormatToken("S",0,0,(function(){return~~(this.millisecond()/100)})),addFormatToken(0,["SS",2],0,(function(){return~~(this.millisecond()/10)})),addFormatToken(0,["SSS",3],0,"millisecond"),addFormatToken(0,["SSSS",4],0,(function(){return 10*this.millisecond()})),addFormatToken(0,["SSSSS",5],0,(function(){return 100*this.millisecond()})),addFormatToken(0,["SSSSSS",6],0,(function(){return 1e3*this.millisecond()})),addFormatToken(0,["SSSSSSS",7],0,(function(){return 1e4*this.millisecond()})),addFormatToken(0,["SSSSSSSS",8],0,(function(){return 1e5*this.millisecond()})),addFormatToken(0,["SSSSSSSSS",9],0,(function(){return 1e6*this.millisecond()})),addUnitAlias("millisecond","ms"),addUnitPriority("millisecond",16),addRegexToken("S",match1to3,match1),addRegexToken("SS",match1to3,match2),addRegexToken("SSS",match1to3,match3),token="SSSS";token.length<=9;token+="S")addRegexToken(token,matchUnsigned);function parseMs(input,array){array[MILLISECOND]=toInt(1e3*("0."+input))}for(token="S";token.length<=9;token+="S")addParseToken(token,parseMs);var getSetMillisecond=makeGetSet("Milliseconds",!1);function getZoneAbbr(){return this._isUTC?"UTC":""}function getZoneName(){return this._isUTC?"Coordinated Universal Time":""}addFormatToken("z",0,0,"zoneAbbr"),addFormatToken("zz",0,0,"zoneName");var proto=Moment.prototype;function createUnix(input){return createLocal(1e3*input)}function createInZone(){return createLocal.apply(null,arguments).parseZone()}function preParsePostFormat(string){return string}proto.add=add,proto.calendar=calendar,proto.clone=clone,proto.diff=diff,proto.endOf=endOf,proto.format=format,proto.from=from,proto.fromNow=fromNow,proto.to=to,proto.toNow=toNow,proto.get=stringGet,proto.invalidAt=invalidAt,proto.isAfter=isAfter,proto.isBefore=isBefore,proto.isBetween=isBetween,proto.isSame=isSame,proto.isSameOrAfter=isSameOrAfter,proto.isSameOrBefore=isSameOrBefore,proto.isValid=isValid,proto.lang=lang,proto.locale=locale,proto.localeData=localeData,proto.max=prototypeMax,proto.min=prototypeMin,proto.parsingFlags=parsingFlags,proto.set=stringSet,proto.startOf=startOf,proto.subtract=subtract,proto.toArray=toArray,proto.toObject=toObject,proto.toDate=toDate,proto.toISOString=toISOString,proto.inspect=inspect,proto.toJSON=toJSON,proto.toString=toString,proto.unix=unix,proto.valueOf=valueOf,proto.creationData=creationData,proto.year=getSetYear,proto.isLeapYear=getIsLeapYear,proto.weekYear=getSetWeekYear,proto.isoWeekYear=getSetISOWeekYear,proto.quarter=proto.quarters=getSetQuarter,proto.month=getSetMonth,proto.daysInMonth=getDaysInMonth,proto.week=proto.weeks=getSetWeek,proto.isoWeek=proto.isoWeeks=getSetISOWeek,proto.weeksInYear=getWeeksInYear,proto.isoWeeksInYear=getISOWeeksInYear,proto.date=getSetDayOfMonth,proto.day=proto.days=getSetDayOfWeek,proto.weekday=getSetLocaleDayOfWeek,proto.isoWeekday=getSetISODayOfWeek,proto.dayOfYear=getSetDayOfYear,proto.hour=proto.hours=getSetHour,proto.minute=proto.minutes=getSetMinute,proto.second=proto.seconds=getSetSecond,proto.millisecond=proto.milliseconds=getSetMillisecond,proto.utcOffset=getSetOffset,proto.utc=setOffsetToUTC,proto.local=setOffsetToLocal,proto.parseZone=setOffsetToParsedOffset,proto.hasAlignedHourOffset=hasAlignedHourOffset,proto.isDST=isDaylightSavingTime,proto.isLocal=isLocal,proto.isUtcOffset=isUtcOffset,proto.isUtc=isUtc,proto.isUTC=isUtc,proto.zoneAbbr=getZoneAbbr,proto.zoneName=getZoneName,proto.dates=deprecate("dates accessor is deprecated. Use date instead.",getSetDayOfMonth),proto.months=deprecate("months accessor is deprecated. Use month instead",getSetMonth),proto.years=deprecate("years accessor is deprecated. Use year instead",getSetYear),proto.zone=deprecate("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",getSetZone),proto.isDSTShifted=deprecate("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",isDaylightSavingTimeShifted);var proto=Locale.prototype;function get(format,index,field,setter){var locale=getLocale(),utc=createUTC().set(setter,index);return locale[field](utc,format)}function listMonthsImpl(format,index,field){if(isNumber(format)&&(index=format,format=void 0),format=format||"",null!=index)return get(format,index,field,"month");var i,out=[];for(i=0;i<12;i++)out[i]=get(format,i,field,"month");return out}function listWeekdaysImpl(localeSorted,format,index,field){"boolean"==typeof localeSorted?(isNumber(format)&&(index=format,format=void 0),format=format||""):(index=format=localeSorted,localeSorted=!1,isNumber(format)&&(index=format,format=void 0),format=format||"");var locale=getLocale(),shift=localeSorted?locale._week.dow:0,i;if(null!=index)return get(format,(index+shift)%7,field,"day");var out=[];for(i=0;i<7;i++)out[i]=get(format,(i+shift)%7,field,"day");return out}function listMonths(format,index){return listMonthsImpl(format,index,"months")}function listMonthsShort(format,index){return listMonthsImpl(format,index,"monthsShort")}function listWeekdays(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,"weekdays")}function listWeekdaysShort(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,"weekdaysShort")}function listWeekdaysMin(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,"weekdaysMin")}proto.calendar=calendar,proto.longDateFormat=longDateFormat,proto.invalidDate=invalidDate,proto.ordinal=ordinal,proto.preparse=preParsePostFormat,proto.postformat=preParsePostFormat,proto.relativeTime=relativeTime,proto.pastFuture=pastFuture,proto.set=set,proto.months=localeMonths,proto.monthsShort=localeMonthsShort,proto.monthsParse=localeMonthsParse,proto.monthsRegex=monthsRegex,proto.monthsShortRegex=monthsShortRegex,proto.week=localeWeek,proto.firstDayOfYear=localeFirstDayOfYear,proto.firstDayOfWeek=localeFirstDayOfWeek,proto.weekdays=localeWeekdays,proto.weekdaysMin=localeWeekdaysMin,proto.weekdaysShort=localeWeekdaysShort,proto.weekdaysParse=localeWeekdaysParse,proto.weekdaysRegex=weekdaysRegex,proto.weekdaysShortRegex=weekdaysShortRegex,proto.weekdaysMinRegex=weekdaysMinRegex,proto.isPM=localeIsPM,proto.meridiem=localeMeridiem,getSetGlobalLocale("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(number){var b=number%10,output;return number+(1===toInt(number%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th")}}),hooks.lang=deprecate("moment.lang is deprecated. Use moment.locale instead.",getSetGlobalLocale),hooks.langData=deprecate("moment.langData is deprecated. Use moment.localeData instead.",getLocale);var mathAbs=Math.abs;function abs(){var data=this._data;return this._milliseconds=mathAbs(this._milliseconds),this._days=mathAbs(this._days),this._months=mathAbs(this._months),data.milliseconds=mathAbs(data.milliseconds),data.seconds=mathAbs(data.seconds),data.minutes=mathAbs(data.minutes),data.hours=mathAbs(data.hours),data.months=mathAbs(data.months),data.years=mathAbs(data.years),this}function addSubtract(duration,input,value,direction){var other=createDuration(input,value);return duration._milliseconds+=direction*other._milliseconds,duration._days+=direction*other._days,duration._months+=direction*other._months,duration._bubble()}function add(input,value){return addSubtract(this,input,value,1)}function subtract(input,value){return addSubtract(this,input,value,-1)}function absCeil(number){return number<0?Math.floor(number):Math.ceil(number)}function bubble(){var milliseconds=this._milliseconds,days=this._days,months=this._months,data=this._data,seconds,minutes,hours,years,monthsFromDays;return milliseconds>=0&&days>=0&&months>=0||milliseconds<=0&&days<=0&&months<=0||(milliseconds+=864e5*absCeil(monthsToDays(months)+days),days=0,months=0),data.milliseconds=milliseconds%1e3,seconds=absFloor(milliseconds/1e3),data.seconds=seconds%60,minutes=absFloor(seconds/60),data.minutes=minutes%60,hours=absFloor(minutes/60),data.hours=hours%24,days+=absFloor(hours/24),months+=monthsFromDays=absFloor(daysToMonths(days)),days-=absCeil(monthsToDays(monthsFromDays)),years=absFloor(months/12),months%=12,data.days=days,data.months=months,data.years=years,this}function daysToMonths(days){return 4800*days/146097}function monthsToDays(months){return 146097*months/4800}function as(units){if(!this.isValid())return NaN;var days,months,milliseconds=this._milliseconds;if("month"===(units=normalizeUnits(units))||"quarter"===units||"year"===units)switch(days=this._days+milliseconds/864e5,months=this._months+daysToMonths(days),units){case"month":return months;case"quarter":return months/3;case"year":return months/12}else switch(days=this._days+Math.round(monthsToDays(this._months)),units){case"week":return days/7+milliseconds/6048e5;case"day":return days+milliseconds/864e5;case"hour":return 24*days+milliseconds/36e5;case"minute":return 1440*days+milliseconds/6e4;case"second":return 86400*days+milliseconds/1e3;case"millisecond":return Math.floor(864e5*days)+milliseconds;default:throw new Error("Unknown unit "+units)}}function valueOf(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*toInt(this._months/12):NaN}function makeAs(alias){return function(){return this.as(alias)}}var asMilliseconds=makeAs("ms"),asSeconds=makeAs("s"),asMinutes=makeAs("m"),asHours=makeAs("h"),asDays=makeAs("d"),asWeeks=makeAs("w"),asMonths=makeAs("M"),asQuarters=makeAs("Q"),asYears=makeAs("y");function clone(){return createDuration(this)}function get(units){return units=normalizeUnits(units),this.isValid()?this[units+"s"]():NaN}function makeGetter(name){return function(){return this.isValid()?this._data[name]:NaN}}var milliseconds=makeGetter("milliseconds"),seconds=makeGetter("seconds"),minutes=makeGetter("minutes"),hours=makeGetter("hours"),days=makeGetter("days"),months=makeGetter("months"),years=makeGetter("years");function weeks(){return absFloor(this.days()/7)}var round=Math.round,thresholds={ss:44,s:45,m:45,h:22,d:26,M:11};function substituteTimeAgo(string,number,withoutSuffix,isFuture,locale){return locale.relativeTime(number||1,!!withoutSuffix,string,isFuture)}function relativeTime(posNegDuration,withoutSuffix,locale){var duration=createDuration(posNegDuration).abs(),seconds=round(duration.as("s")),minutes=round(duration.as("m")),hours=round(duration.as("h")),days=round(duration.as("d")),months=round(duration.as("M")),years=round(duration.as("y")),a=seconds<=thresholds.ss&&["s",seconds]||seconds<thresholds.s&&["ss",seconds]||minutes<=1&&["m"]||minutes<thresholds.m&&["mm",minutes]||hours<=1&&["h"]||hours<thresholds.h&&["hh",hours]||days<=1&&["d"]||days<thresholds.d&&["dd",days]||months<=1&&["M"]||months<thresholds.M&&["MM",months]||years<=1&&["y"]||["yy",years];return a[2]=withoutSuffix,a[3]=+posNegDuration>0,a[4]=locale,substituteTimeAgo.apply(null,a)}function getSetRelativeTimeRounding(roundingFunction){return void 0===roundingFunction?round:"function"==typeof roundingFunction&&(round=roundingFunction,!0)}function getSetRelativeTimeThreshold(threshold,limit){return void 0!==thresholds[threshold]&&(void 0===limit?thresholds[threshold]:(thresholds[threshold]=limit,"s"===threshold&&(thresholds.ss=limit-1),!0))}function humanize(withSuffix){if(!this.isValid())return this.localeData().invalidDate();var locale=this.localeData(),output=relativeTime(this,!withSuffix,locale);return withSuffix&&(output=locale.pastFuture(+this,output)),locale.postformat(output)}var abs=Math.abs;function sign(x){return(x>0)-(x<0)||+x}function toISOString(){if(!this.isValid())return this.localeData().invalidDate();var seconds=abs(this._milliseconds)/1e3,days=abs(this._days),months=abs(this._months),minutes,hours,years;minutes=absFloor(seconds/60),hours=absFloor(minutes/60),seconds%=60,minutes%=60;var Y=years=absFloor(months/12),M=months%=12,D=days,h=hours,m=minutes,s=seconds?seconds.toFixed(3).replace(/\.?0+$/,""):"",total=this.asSeconds();if(!total)return"P0D";var totalSign=total<0?"-":"",ymSign=sign(this._months)!==sign(total)?"-":"",daysSign=sign(this._days)!==sign(total)?"-":"",hmsSign=sign(this._milliseconds)!==sign(total)?"-":"";return totalSign+"P"+(Y?ymSign+Y+"Y":"")+(M?ymSign+M+"M":"")+(D?daysSign+D+"D":"")+(h||m||s?"T":"")+(h?hmsSign+h+"H":"")+(m?hmsSign+m+"M":"")+(s?hmsSign+s+"S":"")}var proto=Duration.prototype;return proto.isValid=isValid,proto.abs=abs,proto.add=add,proto.subtract=subtract,proto.as=as,proto.asMilliseconds=asMilliseconds,proto.asSeconds=asSeconds,proto.asMinutes=asMinutes,proto.asHours=asHours,proto.asDays=asDays,proto.asWeeks=asWeeks,proto.asMonths=asMonths,proto.asQuarters=asQuarters,proto.asYears=asYears,proto.valueOf=valueOf,proto._bubble=bubble,proto.clone=clone,proto.get=get,proto.milliseconds=milliseconds,proto.seconds=seconds,proto.minutes=minutes,proto.hours=hours,proto.days=days,proto.weeks=weeks,proto.months=months,proto.years=years,proto.humanize=humanize,proto.toISOString=toISOString,proto.toString=toISOString,proto.toJSON=toISOString,proto.locale=locale,proto.localeData=localeData,proto.toIsoString=deprecate("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",toISOString),proto.lang=lang,addFormatToken("X",0,0,"unix"),addFormatToken("x",0,0,"valueOf"),addRegexToken("x",matchSigned),addRegexToken("X",matchTimestamp),addParseToken("X",(function(input,array,config){config._d=new Date(1e3*parseFloat(input,10))})),addParseToken("x",(function(input,array,config){config._d=new Date(toInt(input))})),hooks.version="2.24.0",setHookCallback(createLocal),hooks.fn=proto,hooks.min=min,hooks.max=max,hooks.now=now,hooks.utc=createUTC,hooks.unix=createUnix,hooks.months=listMonths,hooks.isDate=isDate,hooks.locale=getSetGlobalLocale,hooks.invalid=createInvalid,hooks.duration=createDuration,hooks.isMoment=isMoment,hooks.weekdays=listWeekdays,hooks.parseZone=createInZone,hooks.localeData=getLocale,hooks.isDuration=isDuration,hooks.monthsShort=listMonthsShort,hooks.weekdaysMin=listWeekdaysMin,hooks.defineLocale=defineLocale,hooks.updateLocale=updateLocale,hooks.locales=listLocales,hooks.weekdaysShort=listWeekdaysShort,hooks.normalizeUnits=normalizeUnits,hooks.relativeTimeRounding=getSetRelativeTimeRounding,hooks.relativeTimeThreshold=getSetRelativeTimeThreshold,hooks.calendarFormat=getCalendarFormat,hooks.prototype=proto,hooks.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"GGGG-[W]WW",MONTH:"YYYY-MM"},hooks}));