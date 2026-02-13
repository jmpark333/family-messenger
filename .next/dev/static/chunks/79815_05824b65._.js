(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/family-messenger/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/family-messenger/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/family-messenger/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/family-messenger/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore
]);
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
;
}),
"[project]/family-messenger/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
;
;
const identity = (arg)=>arg;
function useStore(api, selector = identity) {
    const slice = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(api.subscribe, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "useStore.useSyncExternalStore[slice]": ()=>selector(api.getInitialState())
    }["useStore.useSyncExternalStore[slice]"], [
        api,
        selector
    ]));
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    const api = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState);
    const useBoundStore = (selector)=>useStore(api, selector);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
;
}),
"[project]/family-messenger/node_modules/peerjs-js-binarypack/dist/binarypack.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Packer",
    ()=>$0cfd7828ad59115f$export$b9ec4b114aa40074,
    "pack",
    ()=>$0cfd7828ad59115f$export$2a703dbb0cb35339,
    "unpack",
    ()=>$0cfd7828ad59115f$export$417857010dc9287f
]);
class $e8379818650e2442$export$93654d4f2d6cd524 {
    constructor(){
        this.encoder = new TextEncoder();
        this._pieces = [];
        this._parts = [];
    }
    append_buffer(data) {
        this.flush();
        this._parts.push(data);
    }
    append(data) {
        this._pieces.push(data);
    }
    flush() {
        if (this._pieces.length > 0) {
            const buf = new Uint8Array(this._pieces);
            this._parts.push(buf);
            this._pieces = [];
        }
    }
    toArrayBuffer() {
        const buffer = [];
        for (const part of this._parts)buffer.push(part);
        return $e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
    }
}
function $e8379818650e2442$var$concatArrayBuffers(bufs) {
    let size = 0;
    for (const buf of bufs)size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs){
        const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        result.set(view, offset);
        offset += buf.byteLength;
    }
    return result;
}
function $0cfd7828ad59115f$export$417857010dc9287f(data) {
    const unpacker = new $0cfd7828ad59115f$var$Unpacker(data);
    return unpacker.unpack();
}
function $0cfd7828ad59115f$export$2a703dbb0cb35339(data) {
    const packer = new $0cfd7828ad59115f$export$b9ec4b114aa40074();
    const res = packer.pack(data);
    if (res instanceof Promise) return res.then(()=>packer.getBuffer());
    return packer.getBuffer();
}
class $0cfd7828ad59115f$var$Unpacker {
    constructor(data){
        this.index = 0;
        this.dataBuffer = data;
        this.dataView = new Uint8Array(this.dataBuffer);
        this.length = this.dataBuffer.byteLength;
    }
    unpack() {
        const type = this.unpack_uint8();
        if (type < 0x80) return type;
        else if ((type ^ 0xe0) < 0x20) return (type ^ 0xe0) - 0x20;
        let size;
        if ((size = type ^ 0xa0) <= 0x0f) return this.unpack_raw(size);
        else if ((size = type ^ 0xb0) <= 0x0f) return this.unpack_string(size);
        else if ((size = type ^ 0x90) <= 0x0f) return this.unpack_array(size);
        else if ((size = type ^ 0x80) <= 0x0f) return this.unpack_map(size);
        switch(type){
            case 0xc0:
                return null;
            case 0xc1:
                return undefined;
            case 0xc2:
                return false;
            case 0xc3:
                return true;
            case 0xca:
                return this.unpack_float();
            case 0xcb:
                return this.unpack_double();
            case 0xcc:
                return this.unpack_uint8();
            case 0xcd:
                return this.unpack_uint16();
            case 0xce:
                return this.unpack_uint32();
            case 0xcf:
                return this.unpack_uint64();
            case 0xd0:
                return this.unpack_int8();
            case 0xd1:
                return this.unpack_int16();
            case 0xd2:
                return this.unpack_int32();
            case 0xd3:
                return this.unpack_int64();
            case 0xd4:
                return undefined;
            case 0xd5:
                return undefined;
            case 0xd6:
                return undefined;
            case 0xd7:
                return undefined;
            case 0xd8:
                size = this.unpack_uint16();
                return this.unpack_string(size);
            case 0xd9:
                size = this.unpack_uint32();
                return this.unpack_string(size);
            case 0xda:
                size = this.unpack_uint16();
                return this.unpack_raw(size);
            case 0xdb:
                size = this.unpack_uint32();
                return this.unpack_raw(size);
            case 0xdc:
                size = this.unpack_uint16();
                return this.unpack_array(size);
            case 0xdd:
                size = this.unpack_uint32();
                return this.unpack_array(size);
            case 0xde:
                size = this.unpack_uint16();
                return this.unpack_map(size);
            case 0xdf:
                size = this.unpack_uint32();
                return this.unpack_map(size);
        }
    }
    unpack_uint8() {
        const byte = this.dataView[this.index] & 0xff;
        this.index++;
        return byte;
    }
    unpack_uint16() {
        const bytes = this.read(2);
        const uint16 = (bytes[0] & 0xff) * 256 + (bytes[1] & 0xff);
        this.index += 2;
        return uint16;
    }
    unpack_uint32() {
        const bytes = this.read(4);
        const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
        this.index += 4;
        return uint32;
    }
    unpack_uint64() {
        const bytes = this.read(8);
        const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
        this.index += 8;
        return uint64;
    }
    unpack_int8() {
        const uint8 = this.unpack_uint8();
        return uint8 < 0x80 ? uint8 : uint8 - 256;
    }
    unpack_int16() {
        const uint16 = this.unpack_uint16();
        return uint16 < 0x8000 ? uint16 : uint16 - 65536;
    }
    unpack_int32() {
        const uint32 = this.unpack_uint32();
        return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
    }
    unpack_int64() {
        const uint64 = this.unpack_uint64();
        return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
    }
    unpack_raw(size) {
        if (this.length < this.index + size) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
        const buf = this.dataBuffer.slice(this.index, this.index + size);
        this.index += size;
        return buf;
    }
    unpack_string(size) {
        const bytes = this.read(size);
        let i = 0;
        let str = "";
        let c;
        let code;
        while(i < size){
            c = bytes[i];
            // The length of a UTF-8 sequence is specified in the first byte:
            // 0xxxxxxx means length 1,
            // 110xxxxx means length 2,
            // 1110xxxx means length 3,
            // 11110xxx means length 4.
            // 10xxxxxx is for non-initial bytes.
            if (c < 0xa0) {
                // One-byte sequence: bits 0xxxxxxx
                code = c;
                i++;
            } else if ((c ^ 0xc0) < 0x20) {
                // Two-byte sequence: bits 110xxxxx 10xxxxxx
                code = (c & 0x1f) << 6 | bytes[i + 1] & 0x3f;
                i += 2;
            } else if ((c ^ 0xe0) < 0x10) {
                // Three-byte sequence: bits 1110xxxx 10xxxxxx 10xxxxxx
                code = (c & 0x0f) << 12 | (bytes[i + 1] & 0x3f) << 6 | bytes[i + 2] & 0x3f;
                i += 3;
            } else {
                // Four-byte sequence: bits 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                code = (c & 0x07) << 18 | (bytes[i + 1] & 0x3f) << 12 | (bytes[i + 2] & 0x3f) << 6 | bytes[i + 3] & 0x3f;
                i += 4;
            }
            str += String.fromCodePoint(code);
        }
        this.index += size;
        return str;
    }
    unpack_array(size) {
        const objects = new Array(size);
        for(let i = 0; i < size; i++)objects[i] = this.unpack();
        return objects;
    }
    unpack_map(size) {
        const map = {};
        for(let i = 0; i < size; i++){
            const key = this.unpack();
            map[key] = this.unpack();
        }
        return map;
    }
    unpack_float() {
        const uint32 = this.unpack_uint32();
        const sign = uint32 >> 31;
        const exp = (uint32 >> 23 & 0xff) - 127;
        const fraction = uint32 & 0x7fffff | 0x800000;
        return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
    }
    unpack_double() {
        const h32 = this.unpack_uint32();
        const l32 = this.unpack_uint32();
        const sign = h32 >> 31;
        const exp = (h32 >> 20 & 0x7ff) - 1023;
        const hfrac = h32 & 0xfffff | 0x100000;
        const frac = hfrac * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
        return (sign === 0 ? 1 : -1) * frac;
    }
    read(length) {
        const j = this.index;
        if (j + length <= this.length) return this.dataView.subarray(j, j + length);
        else throw new Error("BinaryPackFailure: read index out of range");
    }
}
class $0cfd7828ad59115f$export$b9ec4b114aa40074 {
    getBuffer() {
        return this._bufferBuilder.toArrayBuffer();
    }
    pack(value) {
        if (typeof value === "string") this.pack_string(value);
        else if (typeof value === "number") {
            if (Math.floor(value) === value) this.pack_integer(value);
            else this.pack_double(value);
        } else if (typeof value === "boolean") {
            if (value === true) this._bufferBuilder.append(0xc3);
            else if (value === false) this._bufferBuilder.append(0xc2);
        } else if (value === undefined) this._bufferBuilder.append(0xc0);
        else if (typeof value === "object") {
            if (value === null) this._bufferBuilder.append(0xc0);
            else {
                const constructor = value.constructor;
                if (value instanceof Array) {
                    const res = this.pack_array(value);
                    if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                } else if (value instanceof ArrayBuffer) this.pack_bin(new Uint8Array(value));
                else if ("BYTES_PER_ELEMENT" in value) {
                    const v = value;
                    this.pack_bin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
                } else if (value instanceof Date) this.pack_string(value.toString());
                else if (value instanceof Blob) return value.arrayBuffer().then((buffer)=>{
                    this.pack_bin(new Uint8Array(buffer));
                    this._bufferBuilder.flush();
                });
                else if (constructor == Object || constructor.toString().startsWith("class")) {
                    const res = this.pack_object(value);
                    if (res instanceof Promise) return res.then(()=>this._bufferBuilder.flush());
                } else throw new Error(`Type "${constructor.toString()}" not yet supported`);
            }
        } else throw new Error(`Type "${typeof value}" not yet supported`);
        this._bufferBuilder.flush();
    }
    pack_bin(blob) {
        const length = blob.length;
        if (length <= 0x0f) this.pack_uint8(0xa0 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xda);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdb);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(blob);
    }
    pack_string(str) {
        const encoded = this._textEncoder.encode(str);
        const length = encoded.length;
        if (length <= 0x0f) this.pack_uint8(0xb0 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xd8);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xd9);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        this._bufferBuilder.append_buffer(encoded);
    }
    pack_array(ary) {
        const length = ary.length;
        if (length <= 0x0f) this.pack_uint8(0x90 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xdc);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdd);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index)=>{
            if (index < length) {
                const res = this.pack(ary[index]);
                if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                return packNext(index + 1);
            }
        };
        return packNext(0);
    }
    pack_integer(num) {
        if (num >= -32 && num <= 0x7f) this._bufferBuilder.append(num & 0xff);
        else if (num >= 0x00 && num <= 0xff) {
            this._bufferBuilder.append(0xcc);
            this.pack_uint8(num);
        } else if (num >= -128 && num <= 0x7f) {
            this._bufferBuilder.append(0xd0);
            this.pack_int8(num);
        } else if (num >= 0x0000 && num <= 0xffff) {
            this._bufferBuilder.append(0xcd);
            this.pack_uint16(num);
        } else if (num >= -32768 && num <= 0x7fff) {
            this._bufferBuilder.append(0xd1);
            this.pack_int16(num);
        } else if (num >= 0x00000000 && num <= 0xffffffff) {
            this._bufferBuilder.append(0xce);
            this.pack_uint32(num);
        } else if (num >= -2147483648 && num <= 0x7fffffff) {
            this._bufferBuilder.append(0xd2);
            this.pack_int32(num);
        } else if (num >= -9223372036854776000 && num <= 0x7fffffffffffffff) {
            this._bufferBuilder.append(0xd3);
            this.pack_int64(num);
        } else if (num >= 0x0000000000000000 && num <= 0xffffffffffffffff) {
            this._bufferBuilder.append(0xcf);
            this.pack_uint64(num);
        } else throw new Error("Invalid integer");
    }
    pack_double(num) {
        let sign = 0;
        if (num < 0) {
            sign = 1;
            num = -num;
        }
        const exp = Math.floor(Math.log(num) / Math.LN2);
        const frac0 = num / 2 ** exp - 1;
        const frac1 = Math.floor(frac0 * 2 ** 52);
        const b32 = 2 ** 32;
        const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 0x0fffff;
        const l32 = frac1 % b32;
        this._bufferBuilder.append(0xcb);
        this.pack_int32(h32);
        this.pack_int32(l32);
    }
    pack_object(obj) {
        const keys = Object.keys(obj);
        const length = keys.length;
        if (length <= 0x0f) this.pack_uint8(0x80 + length);
        else if (length <= 0xffff) {
            this._bufferBuilder.append(0xde);
            this.pack_uint16(length);
        } else if (length <= 0xffffffff) {
            this._bufferBuilder.append(0xdf);
            this.pack_uint32(length);
        } else throw new Error("Invalid length");
        const packNext = (index)=>{
            if (index < keys.length) {
                const prop = keys[index];
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(prop)) {
                    this.pack(prop);
                    const res = this.pack(obj[prop]);
                    if (res instanceof Promise) return res.then(()=>packNext(index + 1));
                }
                return packNext(index + 1);
            }
        };
        return packNext(0);
    }
    pack_uint8(num) {
        this._bufferBuilder.append(num);
    }
    pack_uint16(num) {
        this._bufferBuilder.append(num >> 8);
        this._bufferBuilder.append(num & 0xff);
    }
    pack_uint32(num) {
        const n = num & 0xffffffff;
        this._bufferBuilder.append((n & 0xff000000) >>> 24);
        this._bufferBuilder.append((n & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((n & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(n & 0x000000ff);
    }
    pack_uint64(num) {
        const high = num / 2 ** 32;
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 0xff000000) >>> 24);
        this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(high & 0x000000ff);
        this._bufferBuilder.append((low & 0xff000000) >>> 24);
        this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(low & 0x000000ff);
    }
    pack_int8(num) {
        this._bufferBuilder.append(num & 0xff);
    }
    pack_int16(num) {
        this._bufferBuilder.append((num & 0xff00) >> 8);
        this._bufferBuilder.append(num & 0xff);
    }
    pack_int32(num) {
        this._bufferBuilder.append(num >>> 24 & 0xff);
        this._bufferBuilder.append((num & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((num & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(num & 0x000000ff);
    }
    pack_int64(num) {
        const high = Math.floor(num / 2 ** 32);
        const low = num % 2 ** 32;
        this._bufferBuilder.append((high & 0xff000000) >>> 24);
        this._bufferBuilder.append((high & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((high & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(high & 0x000000ff);
        this._bufferBuilder.append((low & 0xff000000) >>> 24);
        this._bufferBuilder.append((low & 0x00ff0000) >>> 16);
        this._bufferBuilder.append((low & 0x0000ff00) >>> 8);
        this._bufferBuilder.append(low & 0x000000ff);
    }
    constructor(){
        this._bufferBuilder = new (0, $e8379818650e2442$export$93654d4f2d6cd524)();
        this._textEncoder = new TextEncoder();
    }
}
;
 //# sourceMappingURL=binarypack.mjs.map
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compactObject",
    ()=>compactObject,
    "deprecated",
    ()=>deprecated,
    "detectBrowser",
    ()=>detectBrowser,
    "disableLog",
    ()=>disableLog,
    "disableWarnings",
    ()=>disableWarnings,
    "extractVersion",
    ()=>extractVersion,
    "filterStats",
    ()=>filterStats,
    "log",
    ()=>log,
    "walkStats",
    ()=>walkStats,
    "wrapPeerConnectionEvent",
    ()=>wrapPeerConnectionEvent
]);
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
let logDisabled_ = true;
let deprecationWarnings_ = true;
function extractVersion(uastring, expr, pos) {
    const match = uastring.match(expr);
    return match && match.length >= pos && parseFloat(match[pos], 10);
}
function wrapPeerConnectionEvent(window1, eventNameToWrap, wrapper) {
    if (!window1.RTCPeerConnection) {
        return;
    }
    const proto = window1.RTCPeerConnection.prototype;
    const nativeAddEventListener = proto.addEventListener;
    proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
            return nativeAddEventListener.apply(this, arguments);
        }
        const wrappedCallback = (e)=>{
            const modifiedEvent = wrapper(e);
            if (modifiedEvent) {
                if (cb.handleEvent) {
                    cb.handleEvent(modifiedEvent);
                } else {
                    cb(modifiedEvent);
                }
            }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) {
            this._eventMap[eventNameToWrap] = new Map();
        }
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [
            nativeEventName,
            wrappedCallback
        ]);
    };
    const nativeRemoveEventListener = proto.removeEventListener;
    proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
            return nativeRemoveEventListener.apply(this, arguments);
        }
        if (!this._eventMap[eventNameToWrap].has(cb)) {
            return nativeRemoveEventListener.apply(this, arguments);
        }
        const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap].delete(cb);
        if (this._eventMap[eventNameToWrap].size === 0) {
            delete this._eventMap[eventNameToWrap];
        }
        if (Object.keys(this._eventMap).length === 0) {
            delete this._eventMap;
        }
        return nativeRemoveEventListener.apply(this, [
            nativeEventName,
            unwrappedCb
        ]);
    };
    Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get () {
            return this['_on' + eventNameToWrap];
        },
        set (cb) {
            if (this['_on' + eventNameToWrap]) {
                this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
                delete this['_on' + eventNameToWrap];
            }
            if (cb) {
                this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
            }
        },
        enumerable: true,
        configurable: true
    });
}
function disableLog(bool) {
    if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + typeof bool + '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
}
function disableWarnings(bool) {
    if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + typeof bool + '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}
function log() {
    if (typeof window === 'object') {
        if (logDisabled_) {
            return;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
            console.log.apply(console, arguments);
        }
    }
}
function deprecated(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
        return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
}
function detectBrowser(window1) {
    // Returned result object.
    const result = {
        browser: null,
        version: null
    };
    // Fail early if it's not a browser
    if (typeof window1 === 'undefined' || !window1.navigator || !window1.navigator.userAgent) {
        result.browser = 'Not a browser.';
        return result;
    }
    const { navigator } = window1;
    // Prefer navigator.userAgentData.
    if (navigator.userAgentData && navigator.userAgentData.brands) {
        const chromium = navigator.userAgentData.brands.find((brand)=>{
            return brand.brand === 'Chromium';
        });
        if (chromium) {
            return {
                browser: 'chrome',
                version: parseInt(chromium.version, 10)
            };
        }
    }
    if (navigator.mozGetUserMedia) {
        result.browser = 'firefox';
        result.version = parseInt(extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1));
    } else if (navigator.webkitGetUserMedia || window1.isSecureContext === false && window1.webkitRTCPeerConnection) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = parseInt(extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2));
    } else if (window1.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
        result.browser = 'safari';
        result.version = parseInt(extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1));
        result.supportsUnifiedPlan = window1.RTCRtpTransceiver && 'currentDirection' in window1.RTCRtpTransceiver.prototype;
        // Only for internal usage.
        result._safariVersion = extractVersion(navigator.userAgent, /Version\/(\d+(\.?\d+))/, 1);
    } else {
        result.browser = 'Not a supported browser.';
        return result;
    }
    return result;
}
/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */ function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
function compactObject(data) {
    if (!isObject(data)) {
        return data;
    }
    return Object.keys(data).reduce(function(accumulator, key) {
        const isObj = isObject(data[key]);
        const value = isObj ? compactObject(data[key]) : data[key];
        const isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
            return accumulator;
        }
        return Object.assign(accumulator, {
            [key]: value
        });
    }, {});
}
function walkStats(stats, base, resultSet) {
    if (!base || resultSet.has(base.id)) {
        return;
    }
    resultSet.set(base.id, base);
    Object.keys(base).forEach((name)=>{
        if (name.endsWith('Id')) {
            walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith('Ids')) {
            base[name].forEach((id)=>{
                walkStats(stats, stats.get(id), resultSet);
            });
        }
    });
}
function filterStats(result, track, outbound) {
    const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
    const filteredResult = new Map();
    if (track === null) {
        return filteredResult;
    }
    const trackStats = [];
    result.forEach((value)=>{
        if (value.type === 'track' && value.trackIdentifier === track.id) {
            trackStats.push(value);
        }
    });
    trackStats.forEach((trackStat)=>{
        result.forEach((stats)=>{
            if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
                walkStats(result, stats, filteredResult);
            }
        });
    });
    return filteredResult;
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/getusermedia.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shimGetUserMedia",
    ()=>shimGetUserMedia
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
;
const logging = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"];
function shimGetUserMedia(window, browserDetails) {
    const navigator = window && window.navigator;
    if (!navigator.mediaDevices) {
        return;
    }
    const constraintsToChrome_ = function(c) {
        if (typeof c !== 'object' || c.mandatory || c.optional) {
            return c;
        }
        const cc = {};
        Object.keys(c).forEach((key)=>{
            if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
                return;
            }
            const r = typeof c[key] === 'object' ? c[key] : {
                ideal: c[key]
            };
            if (r.exact !== undefined && typeof r.exact === 'number') {
                r.min = r.max = r.exact;
            }
            const oldname_ = function(prefix, name) {
                if (prefix) {
                    return prefix + name.charAt(0).toUpperCase() + name.slice(1);
                }
                return name === 'deviceId' ? 'sourceId' : name;
            };
            if (r.ideal !== undefined) {
                cc.optional = cc.optional || [];
                let oc = {};
                if (typeof r.ideal === 'number') {
                    oc[oldname_('min', key)] = r.ideal;
                    cc.optional.push(oc);
                    oc = {};
                    oc[oldname_('max', key)] = r.ideal;
                    cc.optional.push(oc);
                } else {
                    oc[oldname_('', key)] = r.ideal;
                    cc.optional.push(oc);
                }
            }
            if (r.exact !== undefined && typeof r.exact !== 'number') {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_('', key)] = r.exact;
            } else {
                [
                    'min',
                    'max'
                ].forEach((mix)=>{
                    if (r[mix] !== undefined) {
                        cc.mandatory = cc.mandatory || {};
                        cc.mandatory[oldname_(mix, key)] = r[mix];
                    }
                });
            }
        });
        if (c.advanced) {
            cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
    };
    const shimConstraints_ = function(constraints, func) {
        if (browserDetails.version >= 61) {
            return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && typeof constraints.audio === 'object') {
            const remap = function(obj, a, b) {
                if (a in obj && !(b in obj)) {
                    obj[b] = obj[a];
                    delete obj[a];
                }
            };
            constraints = JSON.parse(JSON.stringify(constraints));
            remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
            remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
            constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && typeof constraints.video === 'object') {
            // Shim facingMode for mobile & surface pro.
            let face = constraints.video.facingMode;
            face = face && (typeof face === 'object' ? face : {
                ideal: face
            });
            const getSupportedFacingModeLies = browserDetails.version < 66;
            if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
                delete constraints.video.facingMode;
                let matches;
                if (face.exact === 'environment' || face.ideal === 'environment') {
                    matches = [
                        'back',
                        'rear'
                    ];
                } else if (face.exact === 'user' || face.ideal === 'user') {
                    matches = [
                        'front'
                    ];
                }
                if (matches) {
                    // Look for matches in label, or use last cam for back (typical).
                    return navigator.mediaDevices.enumerateDevices().then((devices)=>{
                        devices = devices.filter((d)=>d.kind === 'videoinput');
                        let dev = devices.find((d)=>matches.some((match)=>d.label.toLowerCase().includes(match)));
                        if (!dev && devices.length && matches.includes('back')) {
                            dev = devices[devices.length - 1]; // more likely the back cam
                        }
                        if (dev) {
                            constraints.video.deviceId = face.exact ? {
                                exact: dev.deviceId
                            } : {
                                ideal: dev.deviceId
                            };
                        }
                        constraints.video = constraintsToChrome_(constraints.video);
                        logging('chrome: ' + JSON.stringify(constraints));
                        return func(constraints);
                    });
                }
            }
            constraints.video = constraintsToChrome_(constraints.video);
        }
        logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
    };
    const shimError_ = function(e) {
        if (browserDetails.version >= 64) {
            return e;
        }
        return {
            name: ({
                PermissionDeniedError: 'NotAllowedError',
                PermissionDismissedError: 'NotAllowedError',
                InvalidStateError: 'NotAllowedError',
                DevicesNotFoundError: 'NotFoundError',
                ConstraintNotSatisfiedError: 'OverconstrainedError',
                TrackStartError: 'NotReadableError',
                MediaDeviceFailedDueToShutdown: 'NotAllowedError',
                MediaDeviceKillSwitchOn: 'NotAllowedError',
                TabCaptureError: 'AbortError',
                ScreenCaptureError: 'AbortError',
                DeviceCaptureError: 'AbortError'
            })[e.name] || e.name,
            message: e.message,
            constraint: e.constraint || e.constraintName,
            toString () {
                return this.name + (this.message && ': ') + this.message;
            }
        };
    };
    const getUserMedia_ = function(constraints, onSuccess, onError) {
        shimConstraints_(constraints, (c)=>{
            navigator.webkitGetUserMedia(c, onSuccess, (e)=>{
                if (onError) {
                    onError(shimError_(e));
                }
            });
        });
    };
    navigator.getUserMedia = getUserMedia_.bind(navigator);
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    if (navigator.mediaDevices.getUserMedia) {
        const origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(cs) {
            return shimConstraints_(cs, (c)=>origGetUserMedia(c).then((stream)=>{
                    if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                        stream.getTracks().forEach((track)=>{
                            track.stop();
                        });
                        throw new DOMException('', 'NotFoundError');
                    }
                    return stream;
                }, (e)=>Promise.reject(shimError_(e))));
        };
    }
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fixNegotiationNeeded",
    ()=>fixNegotiationNeeded,
    "shimAddTrackRemoveTrack",
    ()=>shimAddTrackRemoveTrack,
    "shimAddTrackRemoveTrackWithNative",
    ()=>shimAddTrackRemoveTrackWithNative,
    "shimGetSendersWithDtmf",
    ()=>shimGetSendersWithDtmf,
    "shimMediaStream",
    ()=>shimMediaStream,
    "shimOnTrack",
    ()=>shimOnTrack,
    "shimPeerConnection",
    ()=>shimPeerConnection,
    "shimSenderReceiverGetStats",
    ()=>shimSenderReceiverGetStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$getusermedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/getusermedia.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
;
;
function shimMediaStream(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
}
function shimOnTrack(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
            get () {
                return this._ontrack;
            },
            set (f) {
                if (this._ontrack) {
                    this.removeEventListener('track', this._ontrack);
                }
                this.addEventListener('track', this._ontrack = f);
            },
            enumerable: true,
            configurable: true
        });
        const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
            if (!this._ontrackpoly) {
                this._ontrackpoly = (e)=>{
                    // onaddstream does not fire when a track is added to an existing
                    // stream. But stream.onaddtrack is implemented so we use that.
                    e.stream.addEventListener('addtrack', (te)=>{
                        let receiver;
                        if (window.RTCPeerConnection.prototype.getReceivers) {
                            receiver = this.getReceivers().find((r)=>r.track && r.track.id === te.track.id);
                        } else {
                            receiver = {
                                track: te.track
                            };
                        }
                        const event = new Event('track');
                        event.track = te.track;
                        event.receiver = receiver;
                        event.transceiver = {
                            receiver
                        };
                        event.streams = [
                            e.stream
                        ];
                        this.dispatchEvent(event);
                    });
                    e.stream.getTracks().forEach((track)=>{
                        let receiver;
                        if (window.RTCPeerConnection.prototype.getReceivers) {
                            receiver = this.getReceivers().find((r)=>r.track && r.track.id === track.id);
                        } else {
                            receiver = {
                                track
                            };
                        }
                        const event = new Event('track');
                        event.track = track;
                        event.receiver = receiver;
                        event.transceiver = {
                            receiver
                        };
                        event.streams = [
                            e.stream
                        ];
                        this.dispatchEvent(event);
                    });
                };
                this.addEventListener('addstream', this._ontrackpoly);
            }
            return origSetRemoteDescription.apply(this, arguments);
        };
    } else {
        // even if RTCRtpTransceiver is in window, it is only used and
        // emitted in unified-plan. Unfortunately this means we need
        // to unconditionally wrap the event.
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'track', (e)=>{
            if (!e.transceiver) {
                Object.defineProperty(e, 'transceiver', {
                    value: {
                        receiver: e.receiver
                    }
                });
            }
            return e;
        });
    }
}
function shimGetSendersWithDtmf(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
        const shimSenderWithDtmf = function(pc, track) {
            return {
                track,
                get dtmf () {
                    if (this._dtmf === undefined) {
                        if (track.kind === 'audio') {
                            this._dtmf = pc.createDTMFSender(track);
                        } else {
                            this._dtmf = null;
                        }
                    }
                    return this._dtmf;
                },
                _pc: pc
            };
        };
        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
            window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                this._senders = this._senders || [];
                return this._senders.slice(); // return a copy of the internal state.
            };
            const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
            window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
                let sender = origAddTrack.apply(this, arguments);
                if (!sender) {
                    sender = shimSenderWithDtmf(this, track);
                    this._senders.push(sender);
                }
                return sender;
            };
            const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
            window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
                origRemoveTrack.apply(this, arguments);
                const idx = this._senders.indexOf(sender);
                if (idx !== -1) {
                    this._senders.splice(idx, 1);
                }
            };
        }
        const origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
            this._senders = this._senders || [];
            origAddStream.apply(this, [
                stream
            ]);
            stream.getTracks().forEach((track)=>{
                this._senders.push(shimSenderWithDtmf(this, track));
            });
        };
        const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
            this._senders = this._senders || [];
            origRemoveStream.apply(this, [
                stream
            ]);
            stream.getTracks().forEach((track)=>{
                const sender = this._senders.find((s)=>s.track === track);
                if (sender) {
                    this._senders.splice(this._senders.indexOf(sender), 1);
                }
            });
        };
    } else if (typeof window === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            const senders = origGetSenders.apply(this, []);
            senders.forEach((sender)=>sender._pc = this);
            return senders;
        };
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
            get () {
                if (this._dtmf === undefined) {
                    if (this.track.kind === 'audio') {
                        this._dtmf = this._pc.createDTMFSender(this.track);
                    } else {
                        this._dtmf = null;
                    }
                }
                return this._dtmf;
            }
        });
    }
}
function shimSenderReceiverGetStats(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
    }
    // shim sender stats.
    if (!('getStats' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
            window.RTCPeerConnection.prototype.getSenders = function getSenders() {
                const senders = origGetSenders.apply(this, []);
                senders.forEach((sender)=>sender._pc = this);
                return senders;
            };
        }
        const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
            window.RTCPeerConnection.prototype.addTrack = function addTrack() {
                const sender = origAddTrack.apply(this, arguments);
                sender._pc = this;
                return sender;
            };
        }
        window.RTCRtpSender.prototype.getStats = function getStats() {
            const sender = this;
            return this._pc.getStats().then((result)=>/* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterStats"](result, sender.track, true));
        };
    }
    // shim receiver stats.
    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
            window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
                const receivers = origGetReceivers.apply(this, []);
                receivers.forEach((receiver)=>receiver._pc = this);
                return receivers;
            };
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'track', (e)=>{
            e.receiver._pc = e.srcElement;
            return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
            const receiver = this;
            return this._pc.getStats().then((result)=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterStats"](result, receiver.track, false));
        };
    }
    if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
        return;
    }
    // shim RTCPeerConnection.getStats(track).
    const origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
            const track = arguments[0];
            let sender;
            let receiver;
            let err;
            this.getSenders().forEach((s)=>{
                if (s.track === track) {
                    if (sender) {
                        err = true;
                    } else {
                        sender = s;
                    }
                }
            });
            this.getReceivers().forEach((r)=>{
                if (r.track === track) {
                    if (receiver) {
                        err = true;
                    } else {
                        receiver = r;
                    }
                }
                return r.track === track;
            });
            if (err || sender && receiver) {
                return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
            } else if (sender) {
                return sender.getStats();
            } else if (receiver) {
                return receiver.getStats();
            }
            return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
    };
}
function shimAddTrackRemoveTrackWithNative(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        return Object.keys(this._shimmedLocalStreams).map((streamId)=>this._shimmedLocalStreams[streamId][0]);
    };
    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (!stream) {
            return origAddTrack.apply(this, arguments);
        }
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        const sender = origAddTrack.apply(this, arguments);
        if (!this._shimmedLocalStreams[stream.id]) {
            this._shimmedLocalStreams[stream.id] = [
                stream,
                sender
            ];
        } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
            this._shimmedLocalStreams[stream.id].push(sender);
        }
        return sender;
    };
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        stream.getTracks().forEach((track)=>{
            const alreadyExists = this.getSenders().find((s)=>s.track === track);
            if (alreadyExists) {
                throw new DOMException('Track already exists.', 'InvalidAccessError');
            }
        });
        const existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        const newSenders = this.getSenders().filter((newSender)=>existingSenders.indexOf(newSender) === -1);
        this._shimmedLocalStreams[stream.id] = [
            stream
        ].concat(newSenders);
    };
    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        delete this._shimmedLocalStreams[stream.id];
        return origRemoveStream.apply(this, arguments);
    };
    const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
        if (sender) {
            Object.keys(this._shimmedLocalStreams).forEach((streamId)=>{
                const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
                if (idx !== -1) {
                    this._shimmedLocalStreams[streamId].splice(idx, 1);
                }
                if (this._shimmedLocalStreams[streamId].length === 1) {
                    delete this._shimmedLocalStreams[streamId];
                }
            });
        }
        return origRemoveTrack.apply(this, arguments);
    };
}
function shimAddTrackRemoveTrack(window, browserDetails) {
    if (!window.RTCPeerConnection) {
        return;
    }
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
    }
    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    const origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
        const nativeStreams = origGetLocalStreams.apply(this);
        this._reverseStreams = this._reverseStreams || {};
        return nativeStreams.map((stream)=>this._reverseStreams[stream.id]);
    };
    const origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        stream.getTracks().forEach((track)=>{
            const alreadyExists = this.getSenders().find((s)=>s.track === track);
            if (alreadyExists) {
                throw new DOMException('Track already exists.', 'InvalidAccessError');
            }
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
            const newStream = new window.MediaStream(stream.getTracks());
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            stream = newStream;
        }
        origAddStream.apply(this, [
            stream
        ]);
    };
    const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        origRemoveStream.apply(this, [
            this._streams[stream.id] || stream
        ]);
        delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
        delete this._streams[stream.id];
    };
    window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        if (this.signalingState === 'closed') {
            throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        const streams = [].slice.call(arguments, 1);
        if (streams.length !== 1 || !streams[0].getTracks().find((t)=>t === track)) {
            // this is not fully correct but all we can manage without
            // [[associated MediaStreams]] internal slot.
            throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
        }
        const alreadyExists = this.getSenders().find((s)=>s.track === track);
        if (alreadyExists) {
            throw new DOMException('Track already exists.', 'InvalidAccessError');
        }
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};
        const oldStream = this._streams[stream.id];
        if (oldStream) {
            // this is using odd Chrome behaviour, use with caution:
            // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
            // Note: we rely on the high-level addTrack/dtmf shim to
            // create the sender with a dtmf sender.
            oldStream.addTrack(track);
            // Trigger ONN async.
            Promise.resolve().then(()=>{
                this.dispatchEvent(new Event('negotiationneeded'));
            });
        } else {
            const newStream = new window.MediaStream([
                track
            ]);
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            this.addStream(newStream);
        }
        return this.getSenders().find((s)=>s.track === track);
    };
    // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach((internalId)=>{
            const externalStream = pc._reverseStreams[internalId];
            const internalStream = pc._streams[externalStream.id];
            sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
        });
        return new RTCSessionDescription({
            type: description.type,
            sdp
        });
    }
    function replaceExternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach((internalId)=>{
            const externalStream = pc._reverseStreams[internalId];
            const internalStream = pc._streams[externalStream.id];
            sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
        });
        return new RTCSessionDescription({
            type: description.type,
            sdp
        });
    }
    [
        'createOffer',
        'createAnswer'
    ].forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {
            [method] () {
                const args = arguments;
                const isLegacyCall = arguments.length && typeof arguments[0] === 'function';
                if (isLegacyCall) {
                    return nativeMethod.apply(this, [
                        (description)=>{
                            const desc = replaceInternalStreamId(this, description);
                            args[0].apply(null, [
                                desc
                            ]);
                        },
                        (err)=>{
                            if (args[1]) {
                                args[1].apply(null, err);
                            }
                        },
                        arguments[2]
                    ]);
                }
                return nativeMethod.apply(this, arguments).then((description)=>replaceInternalStreamId(this, description));
            }
        };
        window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
    const origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        if (!arguments.length || !arguments[0].type) {
            return origSetLocalDescription.apply(this, arguments);
        }
        arguments[0] = replaceExternalStreamId(this, arguments[0]);
        return origSetLocalDescription.apply(this, arguments);
    };
    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier
    const origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
    Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
        get () {
            const description = origLocalDescription.get.apply(this);
            if (description.type === '') {
                return description;
            }
            return replaceInternalStreamId(this, description);
        }
    });
    window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        if (this.signalingState === 'closed') {
            throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
        }
        // We can not yet check for sender instanceof RTCRtpSender
        // since we shim RTPSender. So we check if sender._pc is set.
        if (!sender._pc) {
            throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
        }
        const isLocal = sender._pc === this;
        if (!isLocal) {
            throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
        }
        // Search for the native stream the senders track belongs to.
        this._streams = this._streams || {};
        let stream;
        Object.keys(this._streams).forEach((streamid)=>{
            const hasTrack = this._streams[streamid].getTracks().find((track)=>sender.track === track);
            if (hasTrack) {
                stream = this._streams[streamid];
            }
        });
        if (stream) {
            if (stream.getTracks().length === 1) {
                // if this is the last track of the stream, remove the stream. This
                // takes care of any shimmed _senders.
                this.removeStream(this._reverseStreams[stream.id]);
            } else {
                // relying on the same odd chrome behaviour as above.
                stream.removeTrack(sender.track);
            }
            this.dispatchEvent(new Event('negotiationneeded'));
        }
    };
}
function shimPeerConnection(window, browserDetails) {
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
    }
    if (!window.RTCPeerConnection) {
        return;
    }
    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    if (browserDetails.version < 53) {
        [
            'setLocalDescription',
            'setRemoteDescription',
            'addIceCandidate'
        ].forEach(function(method) {
            const nativeMethod = window.RTCPeerConnection.prototype[method];
            const methodObj = {
                [method] () {
                    arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                    return nativeMethod.apply(this, arguments);
                }
            };
            window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
    }
}
function fixNegotiationNeeded(window, browserDetails) {
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'negotiationneeded', (e)=>{
        const pc = e.target;
        if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
            if (pc.signalingState !== 'stable') {
                return;
            }
        }
        return e;
    });
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fixNegotiationNeeded",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fixNegotiationNeeded"],
    "shimAddTrackRemoveTrack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimAddTrackRemoveTrack"],
    "shimAddTrackRemoveTrackWithNative",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimAddTrackRemoveTrackWithNative"],
    "shimGetSendersWithDtmf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimGetSendersWithDtmf"],
    "shimGetUserMedia",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$getusermedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimGetUserMedia"],
    "shimMediaStream",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimMediaStream"],
    "shimOnTrack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimOnTrack"],
    "shimPeerConnection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimPeerConnection"],
    "shimSenderReceiverGetStats",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimSenderReceiverGetStats"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$getusermedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/getusermedia.js [app-client] (ecmascript)");
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/getusermedia.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shimGetUserMedia",
    ()=>shimGetUserMedia
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
;
function shimGetUserMedia(window, browserDetails) {
    const navigator = window && window.navigator;
    const MediaStreamTrack = window && window.MediaStreamTrack;
    navigator.getUserMedia = function(constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deprecated"]('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    };
    if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        const remap = function(obj, a, b) {
            if (a in obj && !(b in obj)) {
                obj[b] = obj[a];
                delete obj[a];
            }
        };
        const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(c) {
            if (typeof c === 'object' && typeof c.audio === 'object') {
                c = JSON.parse(JSON.stringify(c));
                remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
                remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeGetUserMedia(c);
        };
        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
            const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
            MediaStreamTrack.prototype.getSettings = function() {
                const obj = nativeGetSettings.apply(this, arguments);
                remap(obj, 'mozAutoGainControl', 'autoGainControl');
                remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
                return obj;
            };
        }
        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
            const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
            MediaStreamTrack.prototype.applyConstraints = function(c) {
                if (this.kind === 'audio' && typeof c === 'object') {
                    c = JSON.parse(JSON.stringify(c));
                    remap(c, 'autoGainControl', 'mozAutoGainControl');
                    remap(c, 'noiseSuppression', 'mozNoiseSuppression');
                }
                return nativeApplyConstraints.apply(this, [
                    c
                ]);
            };
        }
    }
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shimGetDisplayMedia",
    ()=>shimGetDisplayMedia
]);
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
function shimGetDisplayMedia(window, preferredMediaSource) {
    if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
    }
    if (!window.navigator.mediaDevices) {
        return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
        if (!(constraints && constraints.video)) {
            const err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
            err.name = 'NotFoundError';
            // from https://heycam.github.io/webidl/#idl-DOMException-error-names
            err.code = 8;
            return Promise.reject(err);
        }
        if (constraints.video === true) {
            constraints.video = {
                mediaSource: preferredMediaSource
            };
        } else {
            constraints.video.mediaSource = preferredMediaSource;
        }
        return window.navigator.mediaDevices.getUserMedia(constraints);
    };
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shimAddTransceiver",
    ()=>shimAddTransceiver,
    "shimCreateAnswer",
    ()=>shimCreateAnswer,
    "shimCreateOffer",
    ()=>shimCreateOffer,
    "shimGetParameters",
    ()=>shimGetParameters,
    "shimOnTrack",
    ()=>shimOnTrack,
    "shimPeerConnection",
    ()=>shimPeerConnection,
    "shimRTCDataChannel",
    ()=>shimRTCDataChannel,
    "shimReceiverGetStats",
    ()=>shimReceiverGetStats,
    "shimRemoveStream",
    ()=>shimRemoveStream,
    "shimSenderGetStats",
    ()=>shimSenderGetStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$getusermedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/getusermedia.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$getdisplaymedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
;
;
;
function shimOnTrack(window) {
    if (typeof window === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
            get () {
                return {
                    receiver: this.receiver
                };
            }
        });
    }
}
function shimPeerConnection(window, browserDetails) {
    if (typeof window !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return; // probably media.peerconnection.enabled=false in about:config
    }
    if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.mozRTCPeerConnection;
    }
    if (browserDetails.version < 53) {
        // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
        [
            'setLocalDescription',
            'setRemoteDescription',
            'addIceCandidate'
        ].forEach(function(method) {
            const nativeMethod = window.RTCPeerConnection.prototype[method];
            const methodObj = {
                [method] () {
                    arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                    return nativeMethod.apply(this, arguments);
                }
            };
            window.RTCPeerConnection.prototype[method] = methodObj[method];
        });
    }
    const modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
    };
    const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;
        return nativeGetStats.apply(this, [
            selector || null
        ]).then((stats)=>{
            if (browserDetails.version < 53 && !onSucc) {
                // Shim only promise getStats with spec-hyphens in type names
                // Leave callback version alone; misc old uses of forEach before Map
                try {
                    stats.forEach((stat)=>{
                        stat.type = modernStatsTypes[stat.type] || stat.type;
                    });
                } catch (e) {
                    if (e.name !== 'TypeError') {
                        throw e;
                    }
                    // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
                    stats.forEach((stat, i)=>{
                        stats.set(i, Object.assign({}, stat, {
                            type: modernStatsTypes[stat.type] || stat.type
                        }));
                    });
                }
            }
            return stats;
        }).then(onSucc, onErr);
    };
}
function shimSenderGetStats(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
        return;
    }
    const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            const senders = origGetSenders.apply(this, []);
            senders.forEach((sender)=>sender._pc = this);
            return senders;
        };
    }
    const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            const sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
        };
    }
    window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
    };
}
function shimReceiverGetStats(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
        return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
        return;
    }
    const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
            const receivers = origGetReceivers.apply(this, []);
            receivers.forEach((receiver)=>receiver._pc = this);
            return receivers;
        };
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'track', (e)=>{
        e.receiver._pc = e.srcElement;
        return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
    };
}
function shimRemoveStream(window) {
    if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
        return;
    }
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
        __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deprecated"]('removeStream', 'removeTrack');
        this.getSenders().forEach((sender)=>{
            if (sender.track && stream.getTracks().includes(sender.track)) {
                this.removeTrack(sender);
            }
        });
    };
}
function shimRTCDataChannel(window) {
    // rename DataChannel to RTCDataChannel (native fix in FF60):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
    if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
    }
}
function shimAddTransceiver(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
    }
    const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
    if (origAddTransceiver) {
        window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
            this.setParametersPromises = [];
            // WebIDL input coercion and validation
            let sendEncodings = arguments[1] && arguments[1].sendEncodings;
            if (sendEncodings === undefined) {
                sendEncodings = [];
            }
            sendEncodings = [
                ...sendEncodings
            ];
            const shouldPerformCheck = sendEncodings.length > 0;
            if (shouldPerformCheck) {
                // If sendEncodings params are provided, validate grammar
                sendEncodings.forEach((encodingParam)=>{
                    if ('rid' in encodingParam) {
                        const ridRegex = /^[a-z0-9]{0,16}$/i;
                        if (!ridRegex.test(encodingParam.rid)) {
                            throw new TypeError('Invalid RID value provided.');
                        }
                    }
                    if ('scaleResolutionDownBy' in encodingParam) {
                        if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                            throw new RangeError('scale_resolution_down_by must be >= 1.0');
                        }
                    }
                    if ('maxFramerate' in encodingParam) {
                        if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                            throw new RangeError('max_framerate must be >= 0.0');
                        }
                    }
                });
            }
            const transceiver = origAddTransceiver.apply(this, arguments);
            if (shouldPerformCheck) {
                // Check if the init options were applied. If not we do this in an
                // asynchronous way and save the promise reference in a global object.
                // This is an ugly hack, but at the same time is way more robust than
                // checking the sender parameters before and after the createOffer
                // Also note that after the createoffer we are not 100% sure that
                // the params were asynchronously applied so we might miss the
                // opportunity to recreate offer.
                const { sender } = transceiver;
                const params = sender.getParameters();
                if (!('encodings' in params) || params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
                    params.encodings = sendEncodings;
                    sender.sendEncodings = sendEncodings;
                    this.setParametersPromises.push(sender.setParameters(params).then(()=>{
                        delete sender.sendEncodings;
                    }).catch(()=>{
                        delete sender.sendEncodings;
                    }));
                }
            }
            return transceiver;
        };
    }
}
function shimGetParameters(window) {
    if (!(typeof window === 'object' && window.RTCRtpSender)) {
        return;
    }
    const origGetParameters = window.RTCRtpSender.prototype.getParameters;
    if (origGetParameters) {
        window.RTCRtpSender.prototype.getParameters = function getParameters() {
            const params = origGetParameters.apply(this, arguments);
            if (!('encodings' in params)) {
                params.encodings = [].concat(this.sendEncodings || [
                    {}
                ]);
            }
            return params;
        };
    }
}
function shimCreateOffer(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
    }
    const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        if (this.setParametersPromises && this.setParametersPromises.length) {
            return Promise.all(this.setParametersPromises).then(()=>{
                return origCreateOffer.apply(this, arguments);
            }).finally(()=>{
                this.setParametersPromises = [];
            });
        }
        return origCreateOffer.apply(this, arguments);
    };
}
function shimCreateAnswer(window) {
    // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
    // Firefox ignores the init sendEncodings options passed to addTransceiver
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
    if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
    }
    const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
    window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        if (this.setParametersPromises && this.setParametersPromises.length) {
            return Promise.all(this.setParametersPromises).then(()=>{
                return origCreateAnswer.apply(this, arguments);
            }).finally(()=>{
                this.setParametersPromises = [];
            });
        }
        return origCreateAnswer.apply(this, arguments);
    };
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shimAddTransceiver",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimAddTransceiver"],
    "shimCreateAnswer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimCreateAnswer"],
    "shimCreateOffer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimCreateOffer"],
    "shimGetDisplayMedia",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$getdisplaymedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimGetDisplayMedia"],
    "shimGetParameters",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimGetParameters"],
    "shimGetUserMedia",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$getusermedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimGetUserMedia"],
    "shimOnTrack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimOnTrack"],
    "shimPeerConnection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimPeerConnection"],
    "shimRTCDataChannel",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimRTCDataChannel"],
    "shimReceiverGetStats",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimReceiverGetStats"],
    "shimRemoveStream",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimRemoveStream"],
    "shimSenderGetStats",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["shimSenderGetStats"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$getusermedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/getusermedia.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$getdisplaymedia$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js [app-client] (ecmascript)");
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/safari/safari_shim.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shimAudioContext",
    ()=>shimAudioContext,
    "shimCallbacksAPI",
    ()=>shimCallbacksAPI,
    "shimConstraints",
    ()=>shimConstraints,
    "shimCreateOfferLegacy",
    ()=>shimCreateOfferLegacy,
    "shimGetUserMedia",
    ()=>shimGetUserMedia,
    "shimLocalStreamsAPI",
    ()=>shimLocalStreamsAPI,
    "shimRTCIceServerUrls",
    ()=>shimRTCIceServerUrls,
    "shimRemoteStreamsAPI",
    ()=>shimRemoteStreamsAPI,
    "shimTrackEventTransceiver",
    ()=>shimTrackEventTransceiver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ 'use strict';
;
function shimLocalStreamsAPI(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
            if (!this._localStreams) {
                this._localStreams = [];
            }
            return this._localStreams;
        };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
        const _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
            if (!this._localStreams) {
                this._localStreams = [];
            }
            if (!this._localStreams.includes(stream)) {
                this._localStreams.push(stream);
            }
            // Try to emulate Chrome's behaviour of adding in audio-video order.
            // Safari orders by track id.
            stream.getAudioTracks().forEach((track)=>_addTrack.call(this, track, stream));
            stream.getVideoTracks().forEach((track)=>_addTrack.call(this, track, stream));
        };
        window.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
            if (streams) {
                streams.forEach((stream)=>{
                    if (!this._localStreams) {
                        this._localStreams = [
                            stream
                        ];
                    } else if (!this._localStreams.includes(stream)) {
                        this._localStreams.push(stream);
                    }
                });
            }
            return _addTrack.apply(this, arguments);
        };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
            if (!this._localStreams) {
                this._localStreams = [];
            }
            const index = this._localStreams.indexOf(stream);
            if (index === -1) {
                return;
            }
            this._localStreams.splice(index, 1);
            const tracks = stream.getTracks();
            this.getSenders().forEach((sender)=>{
                if (tracks.includes(sender.track)) {
                    this.removeTrack(sender);
                }
            });
        };
    }
}
function shimRemoteStreamsAPI(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
            return this._remoteStreams ? this._remoteStreams : [];
        };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
            get () {
                return this._onaddstream;
            },
            set (f) {
                if (this._onaddstream) {
                    this.removeEventListener('addstream', this._onaddstream);
                    this.removeEventListener('track', this._onaddstreampoly);
                }
                this.addEventListener('addstream', this._onaddstream = f);
                this.addEventListener('track', this._onaddstreampoly = (e)=>{
                    e.streams.forEach((stream)=>{
                        if (!this._remoteStreams) {
                            this._remoteStreams = [];
                        }
                        if (this._remoteStreams.includes(stream)) {
                            return;
                        }
                        this._remoteStreams.push(stream);
                        const event = new Event('addstream');
                        event.stream = stream;
                        this.dispatchEvent(event);
                    });
                });
            }
        });
        const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
            const pc = this;
            if (!this._onaddstreampoly) {
                this.addEventListener('track', this._onaddstreampoly = function(e) {
                    e.streams.forEach((stream)=>{
                        if (!pc._remoteStreams) {
                            pc._remoteStreams = [];
                        }
                        if (pc._remoteStreams.indexOf(stream) >= 0) {
                            return;
                        }
                        pc._remoteStreams.push(stream);
                        const event = new Event('addstream');
                        event.stream = stream;
                        pc.dispatchEvent(event);
                    });
                });
            }
            return origSetRemoteDescription.apply(pc, arguments);
        };
    }
}
function shimCallbacksAPI(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
    }
    const prototype = window.RTCPeerConnection.prototype;
    const origCreateOffer = prototype.createOffer;
    const origCreateAnswer = prototype.createAnswer;
    const setLocalDescription = prototype.setLocalDescription;
    const setRemoteDescription = prototype.setRemoteDescription;
    const addIceCandidate = prototype.addIceCandidate;
    prototype.createOffer = function createOffer(successCallback, failureCallback) {
        const options = arguments.length >= 2 ? arguments[2] : arguments[0];
        const promise = origCreateOffer.apply(this, [
            options
        ]);
        if (!failureCallback) {
            return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
        const options = arguments.length >= 2 ? arguments[2] : arguments[0];
        const promise = origCreateAnswer.apply(this, [
            options
        ]);
        if (!failureCallback) {
            return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    let withCallback = function(description, successCallback, failureCallback) {
        const promise = setLocalDescription.apply(this, [
            description
        ]);
        if (!failureCallback) {
            return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;
    withCallback = function(description, successCallback, failureCallback) {
        const promise = setRemoteDescription.apply(this, [
            description
        ]);
        if (!failureCallback) {
            return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;
    withCallback = function(candidate, successCallback, failureCallback) {
        const promise = addIceCandidate.apply(this, [
            candidate
        ]);
        if (!failureCallback) {
            return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
}
function shimGetUserMedia(window) {
    const navigator = window && window.navigator;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        const mediaDevices = navigator.mediaDevices;
        const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = (constraints)=>{
            return _getUserMedia(shimConstraints(constraints));
        };
    }
    if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = (function getUserMedia(constraints, cb, errcb) {
            navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
        }).bind(navigator);
    }
}
function shimConstraints(constraints) {
    if (constraints && constraints.video !== undefined) {
        return Object.assign({}, constraints, {
            video: __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["compactObject"](constraints.video)
        });
    }
    return constraints;
}
function shimRTCIceServerUrls(window) {
    if (!window.RTCPeerConnection) {
        return;
    }
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    const OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
        if (pcConfig && pcConfig.iceServers) {
            const newIceServers = [];
            for(let i = 0; i < pcConfig.iceServers.length; i++){
                let server = pcConfig.iceServers[i];
                if (server.urls === undefined && server.url) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deprecated"]('RTCIceServer.url', 'RTCIceServer.urls');
                    server = JSON.parse(JSON.stringify(server));
                    server.urls = server.url;
                    delete server.url;
                    newIceServers.push(server);
                } else {
                    newIceServers.push(pcConfig.iceServers[i]);
                }
            }
            pcConfig.iceServers = newIceServers;
        }
        return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ('generateCertificate' in OrigPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
            get () {
                return OrigPeerConnection.generateCertificate;
            }
        });
    }
}
function shimTrackEventTransceiver(window) {
    // Add event.transceiver member over deprecated event.receiver
    if (typeof window === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
            get () {
                return {
                    receiver: this.receiver
                };
            }
        });
    }
}
function shimCreateOfferLegacy(window) {
    const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
        if (offerOptions) {
            if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
                // support bit values
                offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
            }
            const audioTransceiver = this.getTransceivers().find((transceiver)=>transceiver.receiver.track.kind === 'audio');
            if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
                if (audioTransceiver.direction === 'sendrecv') {
                    if (audioTransceiver.setDirection) {
                        audioTransceiver.setDirection('sendonly');
                    } else {
                        audioTransceiver.direction = 'sendonly';
                    }
                } else if (audioTransceiver.direction === 'recvonly') {
                    if (audioTransceiver.setDirection) {
                        audioTransceiver.setDirection('inactive');
                    } else {
                        audioTransceiver.direction = 'inactive';
                    }
                }
            } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
                this.addTransceiver('audio', {
                    direction: 'recvonly'
                });
            }
            if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
                // support bit values
                offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
            }
            const videoTransceiver = this.getTransceivers().find((transceiver)=>transceiver.receiver.track.kind === 'video');
            if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
                if (videoTransceiver.direction === 'sendrecv') {
                    if (videoTransceiver.setDirection) {
                        videoTransceiver.setDirection('sendonly');
                    } else {
                        videoTransceiver.direction = 'sendonly';
                    }
                } else if (videoTransceiver.direction === 'recvonly') {
                    if (videoTransceiver.setDirection) {
                        videoTransceiver.setDirection('inactive');
                    } else {
                        videoTransceiver.direction = 'inactive';
                    }
                }
            } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
                this.addTransceiver('video', {
                    direction: 'recvonly'
                });
            }
        }
        return origCreateOffer.apply(this, arguments);
    };
}
function shimAudioContext(window) {
    if (typeof window !== 'object' || window.AudioContext) {
        return;
    }
    window.AudioContext = window.webkitAudioContext;
}
}),
"[project]/family-messenger/node_modules/sdp/sdp.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-env node */ // SDP helpers.
const SDPUtils = {};
// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
    return Math.random().toString(36).substring(2, 12);
};
// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();
// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
    return blob.trim().split('\n').map((line)=>line.trim());
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
    const parts = blob.split('\nm=');
    return parts.map((part, index)=>(index > 0 ? 'm=' + part : part).trim() + '\r\n');
};
// Returns the session description.
SDPUtils.getDescription = function(blob) {
    const sections = SDPUtils.splitSections(blob);
    return sections && sections[0];
};
// Returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
    const sections = SDPUtils.splitSections(blob);
    sections.shift();
    return sections;
};
// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
    return SDPUtils.splitLines(blob).filter((line)=>line.indexOf(prefix) === 0);
};
// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
// Input can be prefixed with a=.
SDPUtils.parseCandidate = function(line) {
    let parts;
    // Parse both variants.
    if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
    } else {
        parts = line.substring(10).split(' ');
    }
    const candidate = {
        foundation: parts[0],
        component: {
            1: 'rtp',
            2: 'rtcp'
        }[parts[1]] || parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4],
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
    };
    for(let i = 8; i < parts.length; i += 2){
        switch(parts[i]){
            case 'raddr':
                candidate.relatedAddress = parts[i + 1];
                break;
            case 'rport':
                candidate.relatedPort = parseInt(parts[i + 1], 10);
                break;
            case 'tcptype':
                candidate.tcpType = parts[i + 1];
                break;
            case 'ufrag':
                candidate.ufrag = parts[i + 1]; // for backward compatibility.
                candidate.usernameFragment = parts[i + 1];
                break;
            default:
                if (candidate[parts[i]] === undefined) {
                    candidate[parts[i]] = parts[i + 1];
                }
                break;
        }
    }
    return candidate;
};
// Translates a candidate object into SDP candidate attribute.
// This does not include the a= prefix!
SDPUtils.writeCandidate = function(candidate) {
    const sdp = [];
    sdp.push(candidate.foundation);
    const component = candidate.component;
    if (component === 'rtp') {
        sdp.push(1);
    } else if (component === 'rtcp') {
        sdp.push(2);
    } else {
        sdp.push(component);
    }
    sdp.push(candidate.protocol.toUpperCase());
    sdp.push(candidate.priority);
    sdp.push(candidate.address || candidate.ip);
    sdp.push(candidate.port);
    const type = candidate.type;
    sdp.push('typ');
    sdp.push(type);
    if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
    }
    if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
    }
    if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
    }
    return 'candidate:' + sdp.join(' ');
};
// Parses an ice-options line, returns an array of option tags.
// Sample input:
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
    return line.substring(14).split(' ');
};
// Parses a rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
    let parts = line.substring(9).split(' ');
    const parsed = {
        payloadType: parseInt(parts.shift(), 10)
    };
    parts = parts[0].split('/');
    parsed.name = parts[0];
    parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
    parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
    // legacy alias, got renamed back to channels in ORTC.
    parsed.numChannels = parsed.channels;
    return parsed;
};
// Generates a rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
    let pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
    }
    const channels = codec.channels || codec.numChannels || 1;
    return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
};
// Parses a extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
    const parts = line.substring(9).split(' ');
    return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1],
        attributes: parts.slice(2).join(' ')
    };
};
// Generates an extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
    return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + (headerExtension.attributes ? ' ' + headerExtension.attributes : '') + '\r\n';
};
// Parses a fmtp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
// Non-key-value such as telephone-events `0-15` get parsed as
// {`0-15`:undefined}
SDPUtils.parseFmtp = function(line) {
    const parsed = {};
    let kv;
    const parts = line.substring(line.indexOf(' ') + 1).split(';');
    for(let j = 0; j < parts.length; j++){
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
    }
    return parsed;
};
// Generates a fmtp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
    let line = '';
    let pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
    }
    if (codec.parameters && Object.keys(codec.parameters).length) {
        const params = [];
        Object.keys(codec.parameters).forEach((param)=>{
            if (codec.parameters[param] !== undefined) {
                params.push(param + '=' + codec.parameters[param]);
            } else {
                params.push(param);
            }
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
    }
    return line;
};
// Parses a rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
    const parts = line.substring(line.indexOf(' ') + 1).split(' ');
    return {
        type: parts.shift(),
        parameter: parts.join(' ')
    };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
    let lines = '';
    let pt = codec.payloadType;
    if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
    }
    if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach((fb)=>{
            lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
        });
    }
    return lines;
};
// Parses a RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
    const sp = line.indexOf(' ');
    const parts = {
        ssrc: parseInt(line.substring(7, sp), 10)
    };
    const colon = line.indexOf(':', sp);
    if (colon > -1) {
        parts.attribute = line.substring(sp + 1, colon);
        parts.value = line.substring(colon + 1);
    } else {
        parts.attribute = line.substring(sp + 1);
    }
    return parts;
};
// Parse a ssrc-group line (see RFC 5576). Sample input:
// a=ssrc-group:semantics 12 34
SDPUtils.parseSsrcGroup = function(line) {
    const parts = line.substring(13).split(' ');
    return {
        semantics: parts.shift(),
        ssrcs: parts.map((ssrc)=>parseInt(ssrc, 10))
    };
};
// Extracts the MID (RFC 5888) from a media section.
// Returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
    const mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
    if (mid) {
        return mid.substring(6);
    }
};
// Parses a fingerprint line for DTLS-SRTP.
SDPUtils.parseFingerprint = function(line) {
    const parts = line.substring(14).split(' ');
    return {
        algorithm: parts[0].toLowerCase(),
        value: parts[1].toUpperCase()
    };
};
// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
    const lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:');
    // Note: a=setup line is ignored since we use the 'auto' role in Edge.
    return {
        role: 'auto',
        fingerprints: lines.map(SDPUtils.parseFingerprint)
    };
};
// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
    let sdp = 'a=setup:' + setupType + '\r\n';
    params.fingerprints.forEach((fp)=>{
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
    });
    return sdp;
};
// Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
SDPUtils.parseCryptoLine = function(line) {
    const parts = line.substring(9).split(' ');
    return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3)
    };
};
SDPUtils.writeCryptoLine = function(parameters) {
    return 'a=crypto:' + parameters.tag + ' ' + parameters.cryptoSuite + ' ' + (typeof parameters.keyParams === 'object' ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') + '\r\n';
};
// Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
SDPUtils.parseCryptoKeyParams = function(keyParams) {
    if (keyParams.indexOf('inline:') !== 0) {
        return null;
    }
    const parts = keyParams.substring(7).split('|');
    return {
        keyMethod: 'inline',
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(':')[1] : undefined
    };
};
SDPUtils.writeCryptoKeyParams = function(keyParams) {
    return keyParams.keyMethod + ':' + keyParams.keySalt + (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') + (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
};
// Extracts all SDES parameters.
SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
    const lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
    return lines.map(SDPUtils.parseCryptoLine);
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
    const ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
    const pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];
    if (!(ufrag && pwd)) {
        return null;
    }
    return {
        usernameFragment: ufrag.substring(12),
        password: pwd.substring(10)
    };
};
// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
    let sdp = 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
    if (params.iceLite) {
        sdp += 'a=ice-lite\r\n';
    }
    return sdp;
};
// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
    const description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
    };
    const lines = SDPUtils.splitLines(mediaSection);
    const mline = lines[0].split(' ');
    description.profile = mline[2];
    for(let i = 3; i < mline.length; i++){
        const pt = mline[i];
        const rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
            const codec = SDPUtils.parseRtpMap(rtpmapline);
            const fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
            // Only the first a=fmtp:<pt> is considered.
            codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
            codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
            description.codecs.push(codec);
            // parse FEC mechanisms from rtpmap lines.
            switch(codec.name.toUpperCase()){
                case 'RED':
                case 'ULPFEC':
                    description.fecMechanisms.push(codec.name.toUpperCase());
                    break;
                default:
                    break;
            }
        }
    }
    SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach((line)=>{
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
    });
    const wildcardRtcpFb = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:* ').map(SDPUtils.parseRtcpFb);
    description.codecs.forEach((codec)=>{
        wildcardRtcpFb.forEach((fb)=>{
            const duplicate = codec.rtcpFeedback.find((existingFeedback)=>{
                return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
            });
            if (!duplicate) {
                codec.rtcpFeedback.push(fb);
            }
        });
    });
    // FIXME: parse rtcp.
    return description;
};
// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
    let sdp = '';
    // Build the mline.
    sdp += 'm=' + kind + ' ';
    sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
    sdp += ' ' + (caps.profile || 'UDP/TLS/RTP/SAVPF') + ' ';
    sdp += caps.codecs.map((codec)=>{
        if (codec.preferredPayloadType !== undefined) {
            return codec.preferredPayloadType;
        }
        return codec.payloadType;
    }).join(' ') + '\r\n';
    sdp += 'c=IN IP4 0.0.0.0\r\n';
    sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';
    // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
    caps.codecs.forEach((codec)=>{
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
    });
    let maxptime = 0;
    caps.codecs.forEach((codec)=>{
        if (codec.maxptime > maxptime) {
            maxptime = codec.maxptime;
        }
    });
    if (maxptime > 0) {
        sdp += 'a=maxptime:' + maxptime + '\r\n';
    }
    if (caps.headerExtensions) {
        caps.headerExtensions.forEach((extension)=>{
            sdp += SDPUtils.writeExtmap(extension);
        });
    }
    // FIXME: write fecMechanisms.
    return sdp;
};
// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
    const encodingParameters = [];
    const description = SDPUtils.parseRtpParameters(mediaSection);
    const hasRed = description.fecMechanisms.indexOf('RED') !== -1;
    const hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;
    // filter a=ssrc:... cname:, ignore PlanB-msid
    const ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map((line)=>SDPUtils.parseSsrcMedia(line)).filter((parts)=>parts.attribute === 'cname');
    const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
    let secondarySsrc;
    const flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map((line)=>{
        const parts = line.substring(17).split(' ');
        return parts.map((part)=>parseInt(part, 10));
    });
    if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
    }
    description.codecs.forEach((codec)=>{
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
            let encParam = {
                ssrc: primarySsrc,
                codecPayloadType: parseInt(codec.parameters.apt, 10)
            };
            if (primarySsrc && secondarySsrc) {
                encParam.rtx = {
                    ssrc: secondarySsrc
                };
            }
            encodingParameters.push(encParam);
            if (hasRed) {
                encParam = JSON.parse(JSON.stringify(encParam));
                encParam.fec = {
                    ssrc: primarySsrc,
                    mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
                };
                encodingParameters.push(encParam);
            }
        }
    });
    if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
            ssrc: primarySsrc
        });
    }
    // we support both b=AS and b=TIAS but interpret AS as TIAS.
    let bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
    if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) {
            bandwidth = parseInt(bandwidth[0].substring(7), 10);
        } else if (bandwidth[0].indexOf('b=AS:') === 0) {
            // use formula from JSEP to convert b=AS to TIAS value.
            bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
        } else {
            bandwidth = undefined;
        }
        encodingParameters.forEach((params)=>{
            params.maxBitrate = bandwidth;
        });
    }
    return encodingParameters;
};
// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
    const rtcpParameters = {};
    // Gets the first SSRC. Note that with RTX there might be multiple
    // SSRCs.
    const remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map((line)=>SDPUtils.parseSsrcMedia(line)).filter((obj)=>obj.attribute === 'cname')[0];
    if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
    }
    // Edge uses the compound attribute instead of reducedSize
    // compound is !reducedSize
    const rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
    rtcpParameters.reducedSize = rsize.length > 0;
    rtcpParameters.compound = rsize.length === 0;
    // parses the rtcp-mux attrіbute.
    // Note that Edge does not support unmuxed RTCP.
    const mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
    rtcpParameters.mux = mux.length > 0;
    return rtcpParameters;
};
SDPUtils.writeRtcpParameters = function(rtcpParameters) {
    let sdp = '';
    if (rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
    }
    if (rtcpParameters.mux) {
        sdp += 'a=rtcp-mux\r\n';
    }
    if (rtcpParameters.ssrc !== undefined && rtcpParameters.cname) {
        sdp += 'a=ssrc:' + rtcpParameters.ssrc + ' cname:' + rtcpParameters.cname + '\r\n';
    }
    return sdp;
};
// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
    let parts;
    const spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
    if (spec.length === 1) {
        parts = spec[0].substring(7).split(' ');
        return {
            stream: parts[0],
            track: parts[1]
        };
    }
    const planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map((line)=>SDPUtils.parseSsrcMedia(line)).filter((msidParts)=>msidParts.attribute === 'msid');
    if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return {
            stream: parts[0],
            track: parts[1]
        };
    }
};
// SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05
SDPUtils.parseSctpDescription = function(mediaSection) {
    const mline = SDPUtils.parseMLine(mediaSection);
    const maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
    let maxMessageSize;
    if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
    }
    if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
    }
    const sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
    if (sctpPort.length > 0) {
        return {
            port: parseInt(sctpPort[0].substring(12), 10),
            protocol: mline.fmt,
            maxMessageSize
        };
    }
    const sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
    if (sctpMapLines.length > 0) {
        const parts = sctpMapLines[0].substring(10).split(' ');
        return {
            port: parseInt(parts[0], 10),
            protocol: parts[1],
            maxMessageSize
        };
    }
};
// SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)
SDPUtils.writeSctpDescription = function(media, sctp) {
    let output = [];
    if (media.protocol !== 'DTLS/SCTP') {
        output = [
            'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
            'c=IN IP4 0.0.0.0\r\n',
            'a=sctp-port:' + sctp.port + '\r\n'
        ];
    } else {
        output = [
            'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
            'c=IN IP4 0.0.0.0\r\n',
            'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
        ];
    }
    if (sctp.maxMessageSize !== undefined) {
        output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
    }
    return output.join('');
};
// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
    return Math.random().toString().substr(2, 22);
};
// Write boiler plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
    let sessionId;
    const version = sessVer !== undefined ? sessVer : 2;
    if (sessId) {
        sessionId = sessId;
    } else {
        sessionId = SDPUtils.generateSessionId();
    }
    const user = sessUser || 'thisisadapterortc';
    // FIXME: sess-id should be an NTP timestamp.
    return 'v=0\r\n' + 'o=' + user + ' ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
};
// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
    // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
    const lines = SDPUtils.splitLines(mediaSection);
    for(let i = 0; i < lines.length; i++){
        switch(lines[i]){
            case 'a=sendrecv':
            case 'a=sendonly':
            case 'a=recvonly':
            case 'a=inactive':
                return lines[i].substring(2);
            default:
        }
    }
    if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
    }
    return 'sendrecv';
};
SDPUtils.getKind = function(mediaSection) {
    const lines = SDPUtils.splitLines(mediaSection);
    const mline = lines[0].split(' ');
    return mline[0].substring(2);
};
SDPUtils.isRejected = function(mediaSection) {
    return mediaSection.split(' ', 2)[1] === '0';
};
SDPUtils.parseMLine = function(mediaSection) {
    const lines = SDPUtils.splitLines(mediaSection);
    const parts = lines[0].substring(2).split(' ');
    return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
    };
};
SDPUtils.parseOLine = function(mediaSection) {
    const line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
    const parts = line.substring(2).split(' ');
    return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
    };
};
// a very naive interpretation of a valid SDP.
SDPUtils.isValidSDP = function(blob) {
    if (typeof blob !== 'string' || blob.length === 0) {
        return false;
    }
    const lines = SDPUtils.splitLines(blob);
    for(let i = 0; i < lines.length; i++){
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
            return false;
        }
    // TODO: check the modifier a bit more.
    }
    return true;
};
// Expose public methods.
if ("TURBOPACK compile-time truthy", 1) {
    module.exports = SDPUtils;
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/common_shim.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "removeExtmapAllowMixed",
    ()=>removeExtmapAllowMixed,
    "shimAddIceCandidateNullOrEmpty",
    ()=>shimAddIceCandidateNullOrEmpty,
    "shimConnectionState",
    ()=>shimConnectionState,
    "shimMaxMessageSize",
    ()=>shimMaxMessageSize,
    "shimParameterlessSetLocalDescription",
    ()=>shimParameterlessSetLocalDescription,
    "shimRTCIceCandidate",
    ()=>shimRTCIceCandidate,
    "shimRTCIceCandidateRelayProtocol",
    ()=>shimRTCIceCandidateRelayProtocol,
    "shimSendThrowTypeError",
    ()=>shimSendThrowTypeError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/sdp/sdp.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
;
;
function shimRTCIceCandidate(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
        return;
    }
    const NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if (typeof args === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
            args = JSON.parse(JSON.stringify(args));
            args.candidate = args.candidate.substring(2);
        }
        if (args.candidate && args.candidate.length) {
            // Augment the native candidate with the parsed fields.
            const nativeCandidate = new NativeRTCIceCandidate(args);
            const parsedCandidate = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parseCandidate(args.candidate);
            for(const key in parsedCandidate){
                if (!(key in nativeCandidate)) {
                    Object.defineProperty(nativeCandidate, key, {
                        value: parsedCandidate[key]
                    });
                }
            }
            // Override serializer to not serialize the extra attributes.
            nativeCandidate.toJSON = function toJSON() {
                return {
                    candidate: nativeCandidate.candidate,
                    sdpMid: nativeCandidate.sdpMid,
                    sdpMLineIndex: nativeCandidate.sdpMLineIndex,
                    usernameFragment: nativeCandidate.usernameFragment
                };
            };
            return nativeCandidate;
        }
        return new NativeRTCIceCandidate(args);
    };
    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'icecandidate', (e)=>{
        if (e.candidate) {
            Object.defineProperty(e, 'candidate', {
                value: new window.RTCIceCandidate(e.candidate),
                writable: 'false'
            });
        }
        return e;
    });
}
function shimRTCIceCandidateRelayProtocol(window) {
    if (!window.RTCIceCandidate || window.RTCIceCandidate && 'relayProtocol' in window.RTCIceCandidate.prototype) {
        return;
    }
    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'icecandidate', (e)=>{
        if (e.candidate) {
            const parsedCandidate = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parseCandidate(e.candidate.candidate);
            if (parsedCandidate.type === 'relay') {
                // This is a libwebrtc-specific mapping of local type preference
                // to relayProtocol.
                e.candidate.relayProtocol = ({
                    0: 'tls',
                    1: 'tcp',
                    2: 'udp'
                })[parsedCandidate.priority >> 24];
            }
        }
        return e;
    });
}
function shimMaxMessageSize(window, browserDetails) {
    if (!window.RTCPeerConnection) {
        return;
    }
    if (!('sctp' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
            get () {
                return typeof this._sctp === 'undefined' ? null : this._sctp;
            }
        });
    }
    const sctpInDescription = function(description) {
        if (!description || !description.sdp) {
            return false;
        }
        const sections = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].splitSections(description.sdp);
        sections.shift();
        return sections.some((mediaSection)=>{
            const mLine = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parseMLine(mediaSection);
            return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
        });
    };
    const getRemoteFirefoxVersion = function(description) {
        // TODO: Is there a better solution for detecting Firefox?
        const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
            return -1;
        }
        const version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
    };
    const getCanSendMaxMessageSize = function(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        let canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
            if (browserDetails.version < 57) {
                if (remoteIsFirefox === -1) {
                    // FF < 57 will send in 16 KiB chunks using the deprecated PPID
                    // fragmentation.
                    canSendMaxMessageSize = 16384;
                } else {
                    // However, other FF (and RAWRTC) can reassemble PPID-fragmented
                    // messages. Thus, supporting ~2 GiB when sending.
                    canSendMaxMessageSize = 2147483637;
                }
            } else if (browserDetails.version < 60) {
                // Currently, all FF >= 57 will reset the remote maximum message size
                // to the default value when a data channel is created at a later
                // stage. :(
                // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
                canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
            } else {
                // FF >= 60 supports sending ~2 GiB
                canSendMaxMessageSize = 2147483637;
            }
        }
        return canSendMaxMessageSize;
    };
    const getMaxMessageSize = function(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        let maxMessageSize = 65536;
        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
            maxMessageSize = 65535;
        }
        const match = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].matchPrefix(description.sdp, 'a=max-message-size:');
        if (match.length > 0) {
            maxMessageSize = parseInt(match[0].substring(19), 10);
        } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
            // If the maximum message size is not present in the remote SDP and
            // both local and remote are Firefox, the remote peer can receive
            // ~2 GiB.
            maxMessageSize = 2147483637;
        }
        return maxMessageSize;
    };
    const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
        this._sctp = null;
        // Chrome decided to not expose .sctp in plan-b mode.
        // As usual, adapter.js has to do an 'ugly worakaround'
        // to cover up the mess.
        if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
            const { sdpSemantics } = this.getConfiguration();
            if (sdpSemantics === 'plan-b') {
                Object.defineProperty(this, 'sctp', {
                    get () {
                        return typeof this._sctp === 'undefined' ? null : this._sctp;
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }
        if (sctpInDescription(arguments[0])) {
            // Check if the remote is FF.
            const isFirefox = getRemoteFirefoxVersion(arguments[0]);
            // Get the maximum message size the local peer is capable of sending
            const canSendMMS = getCanSendMaxMessageSize(isFirefox);
            // Get the maximum message size of the remote peer.
            const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
            // Determine final maximum message size
            let maxMessageSize;
            if (canSendMMS === 0 && remoteMMS === 0) {
                maxMessageSize = Number.POSITIVE_INFINITY;
            } else if (canSendMMS === 0 || remoteMMS === 0) {
                maxMessageSize = Math.max(canSendMMS, remoteMMS);
            } else {
                maxMessageSize = Math.min(canSendMMS, remoteMMS);
            }
            // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
            // attribute.
            const sctp = {};
            Object.defineProperty(sctp, 'maxMessageSize', {
                get () {
                    return maxMessageSize;
                }
            });
            this._sctp = sctp;
        }
        return origSetRemoteDescription.apply(this, arguments);
    };
}
function shimSendThrowTypeError(window) {
    if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
        return;
    }
    // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
    function wrapDcSend(dc, pc) {
        const origDataChannelSend = dc.send;
        dc.send = function send() {
            const data = arguments[0];
            const length = data.length || data.size || data.byteLength;
            if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
                throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
            }
            return origDataChannelSend.apply(dc, arguments);
        };
    }
    const origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
        const dataChannel = origCreateDataChannel.apply(this, arguments);
        wrapDcSend(dataChannel, this);
        return dataChannel;
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapPeerConnectionEvent"](window, 'datachannel', (e)=>{
        wrapDcSend(e.channel, e.target);
        return e;
    });
}
function shimConnectionState(window) {
    if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
        return;
    }
    const proto = window.RTCPeerConnection.prototype;
    Object.defineProperty(proto, 'connectionState', {
        get () {
            return ({
                completed: 'connected',
                checking: 'connecting'
            })[this.iceConnectionState] || this.iceConnectionState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(proto, 'onconnectionstatechange', {
        get () {
            return this._onconnectionstatechange || null;
        },
        set (cb) {
            if (this._onconnectionstatechange) {
                this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
                delete this._onconnectionstatechange;
            }
            if (cb) {
                this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
            }
        },
        enumerable: true,
        configurable: true
    });
    [
        'setLocalDescription',
        'setRemoteDescription'
    ].forEach((method)=>{
        const origMethod = proto[method];
        proto[method] = function() {
            if (!this._connectionstatechangepoly) {
                this._connectionstatechangepoly = (e)=>{
                    const pc = e.target;
                    if (pc._lastConnectionState !== pc.connectionState) {
                        pc._lastConnectionState = pc.connectionState;
                        const newEvent = new Event('connectionstatechange', e);
                        pc.dispatchEvent(newEvent);
                    }
                    return e;
                };
                this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
            }
            return origMethod.apply(this, arguments);
        };
    });
}
function removeExtmapAllowMixed(window, browserDetails) {
    /* remove a=extmap-allow-mixed for webrtc.org < M71 */ if (!window.RTCPeerConnection) {
        return;
    }
    if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
        return;
    }
    if (browserDetails.browser === 'safari' && browserDetails._safariVersion >= 13.1) {
        return;
    }
    const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
            const sdp = desc.sdp.split('\n').filter((line)=>{
                return line.trim() !== 'a=extmap-allow-mixed';
            }).join('\n');
            // Safari enforces read-only-ness of RTCSessionDescription fields.
            if (window.RTCSessionDescription && desc instanceof window.RTCSessionDescription) {
                arguments[0] = new window.RTCSessionDescription({
                    type: desc.type,
                    sdp
                });
            } else {
                desc.sdp = sdp;
            }
        }
        return nativeSRD.apply(this, arguments);
    };
}
function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
    // Support for addIceCandidate(null or undefined)
    // as well as addIceCandidate({candidate: "", ...})
    // https://bugs.chromium.org/p/chromium/issues/detail?id=978582
    // Note: must be called before other polyfills which change the signature.
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
        return;
    }
    const nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
    if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) {
        return;
    }
    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
        if (!arguments[0]) {
            if (arguments[1]) {
                arguments[1].apply(null);
            }
            return Promise.resolve();
        }
        // Firefox 68+ emits and processes {candidate: "", ...}, ignore
        // in older versions.
        // Native support for ignoring exists for Chrome M77+.
        // Safari ignores as well, exact version unknown but works in the same
        // version that also ignores addIceCandidate(null).
        if ((browserDetails.browser === 'chrome' && browserDetails.version < 78 || browserDetails.browser === 'firefox' && browserDetails.version < 68 || browserDetails.browser === 'safari') && arguments[0] && arguments[0].candidate === '') {
            return Promise.resolve();
        }
        return nativeAddIceCandidate.apply(this, arguments);
    };
}
function shimParameterlessSetLocalDescription(window, browserDetails) {
    if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) {
        return;
    }
    const nativeSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
    if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) {
        return;
    }
    window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
        let desc = arguments[0] || {};
        if (typeof desc !== 'object' || desc.type && desc.sdp) {
            return nativeSetLocalDescription.apply(this, arguments);
        }
        // The remaining steps should technically happen when SLD comes off the
        // RTCPeerConnection's operations chain (not ahead of going on it), but
        // this is too difficult to shim. Instead, this shim only covers the
        // common case where the operations chain is empty. This is imperfect, but
        // should cover many cases. Rationale: Even if we can't reduce the glare
        // window to zero on imperfect implementations, there's value in tapping
        // into the perfect negotiation pattern that several browsers support.
        desc = {
            type: desc.type,
            sdp: desc.sdp
        };
        if (!desc.type) {
            switch(this.signalingState){
                case 'stable':
                case 'have-local-offer':
                case 'have-remote-pranswer':
                    desc.type = 'offer';
                    break;
                default:
                    desc.type = 'answer';
                    break;
            }
        }
        if (desc.sdp || desc.type !== 'offer' && desc.type !== 'answer') {
            return nativeSetLocalDescription.apply(this, [
                desc
            ]);
        }
        const func = desc.type === 'offer' ? this.createOffer : this.createAnswer;
        return func.apply(this).then((d)=>nativeSetLocalDescription.apply(this, [
                d
            ]));
    };
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/adapter_factory.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adapterFactory",
    ()=>adapterFactory
]);
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/utils.js [app-client] (ecmascript)");
// Browser shims.
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/safari/safari_shim.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/common_shim.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/sdp/sdp.js [app-client] (ecmascript)");
;
;
;
;
;
;
function adapterFactory({ window } = {}, options = {
    shimChrome: true,
    shimFirefox: true,
    shimSafari: true
}) {
    // Utils.
    const logging = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["log"];
    const browserDetails = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["detectBrowser"](window);
    const adapter = {
        browserDetails,
        commonShim: __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__,
        extractVersion: __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractVersion"],
        disableLog: __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["disableLog"],
        disableWarnings: __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["disableWarnings"],
        // Expose sdp as a convenience. For production apps include directly.
        sdp: __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$sdp$2f$sdp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__
    };
    // Shim browser if found.
    switch(browserDetails.browser){
        case 'chrome':
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ || !__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimPeerConnection || !options.shimChrome) {
                logging('Chrome shim is not included in this adapter release.');
                return adapter;
            }
            if (browserDetails.version === null) {
                logging('Chrome shim can not determine version, not shimming.');
                return adapter;
            }
            logging('adapter.js shimming chrome.');
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__;
            // Must be called before shimPeerConnection.
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimAddIceCandidateNullOrEmpty"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimParameterlessSetLocalDescription"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimGetUserMedia(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimMediaStream(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimPeerConnection(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimOnTrack(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimAddTrackRemoveTrack(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimGetSendersWithDtmf(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimSenderReceiverGetStats(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$chrome$2f$chrome_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.fixNegotiationNeeded(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimRTCIceCandidate"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimRTCIceCandidateRelayProtocol"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimConnectionState"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimMaxMessageSize"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimSendThrowTypeError"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeExtmapAllowMixed"](window, browserDetails);
            break;
        case 'firefox':
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ || !__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimPeerConnection || !options.shimFirefox) {
                logging('Firefox shim is not included in this adapter release.');
                return adapter;
            }
            logging('adapter.js shimming firefox.');
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__;
            // Must be called before shimPeerConnection.
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimAddIceCandidateNullOrEmpty"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimParameterlessSetLocalDescription"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimGetUserMedia(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimPeerConnection(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimOnTrack(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimRemoveStream(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimSenderGetStats(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimReceiverGetStats(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimRTCDataChannel(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimAddTransceiver(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimGetParameters(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimCreateOffer(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$firefox$2f$firefox_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimCreateAnswer(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimRTCIceCandidate"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimConnectionState"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimMaxMessageSize"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimSendThrowTypeError"](window, browserDetails);
            break;
        case 'safari':
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ || !options.shimSafari) {
                logging('Safari shim is not included in this adapter release.');
                return adapter;
            }
            logging('adapter.js shimming safari.');
            // Export to the adapter global object visible in the browser.
            adapter.browserShim = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__;
            // Must be called before shimCallbackAPI.
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimAddIceCandidateNullOrEmpty"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimParameterlessSetLocalDescription"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimRTCIceServerUrls(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimCreateOfferLegacy(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimCallbacksAPI(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimLocalStreamsAPI(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimRemoteStreamsAPI(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimTrackEventTransceiver(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimGetUserMedia(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$safari$2f$safari_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.shimAudioContext(window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimRTCIceCandidate"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimRTCIceCandidateRelayProtocol"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimMaxMessageSize"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shimSendThrowTypeError"](window, browserDetails);
            __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$common_shim$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeExtmapAllowMixed"](window, browserDetails);
            break;
        default:
            logging('Unsupported browser!');
            break;
    }
    return adapter;
}
}),
"[project]/family-messenger/node_modules/webrtc-adapter/src/js/adapter_core.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$adapter_factory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/adapter_factory.js [app-client] (ecmascript)");
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */ /* eslint-env node */ 'use strict';
;
const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$adapter_factory$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adapterFactory"])({
    window: typeof window === 'undefined' ? undefined : window
});
const __TURBOPACK__default__export__ = adapter;
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Integer Utility
__turbopack_context__.s([
    "UINT32_MAX",
    ()=>UINT32_MAX,
    "getInt64",
    ()=>getInt64,
    "getUint64",
    ()=>getUint64,
    "setInt64",
    ()=>setInt64,
    "setUint64",
    ()=>setUint64
]);
var UINT32_MAX = 4294967295;
function setUint64(view, offset, value) {
    var high = value / 4294967296;
    var low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
    var high = Math.floor(value / 4294967296);
    var low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
    var high = view.getInt32(offset);
    var low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
}
function getUint64(view, offset) {
    var high = view.getUint32(offset);
    var low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
} //# sourceMappingURL=int.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEXT_DECODER_THRESHOLD",
    ()=>TEXT_DECODER_THRESHOLD,
    "TEXT_ENCODER_THRESHOLD",
    ()=>TEXT_ENCODER_THRESHOLD,
    "utf8Count",
    ()=>utf8Count,
    "utf8DecodeJs",
    ()=>utf8DecodeJs,
    "utf8DecodeTD",
    ()=>utf8DecodeTD,
    "utf8EncodeJs",
    ()=>utf8EncodeJs,
    "utf8EncodeTE",
    ()=>utf8EncodeTE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/* eslint-disable @typescript-eslint/no-unnecessary-condition */ var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs [app-client] (ecmascript)");
var _a, _b, _c;
;
var TEXT_ENCODING_AVAILABLE = (typeof __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === "undefined" || ((_a = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === null || __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === void 0 ? void 0 : __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env) === null || _a === void 0 ? void 0 : _a["TEXT_ENCODING"]) !== "never") && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
function utf8Count(str) {
    var strLength = str.length;
    var byteLength = 0;
    var pos = 0;
    while(pos < strLength){
        var value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            byteLength++;
            continue;
        } else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            byteLength += 2;
        } else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    var extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                byteLength += 3;
            } else {
                // 4-byte
                byteLength += 4;
            }
        }
    }
    return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
    var strLength = str.length;
    var offset = outputOffset;
    var pos = 0;
    while(pos < strLength){
        var value = str.charCodeAt(pos++);
        if ((value & 0xffffff80) === 0) {
            // 1-byte
            output[offset++] = value;
            continue;
        } else if ((value & 0xfffff800) === 0) {
            // 2-bytes
            output[offset++] = value >> 6 & 0x1f | 0xc0;
        } else {
            // handle surrogate pair
            if (value >= 0xd800 && value <= 0xdbff) {
                // high surrogate
                if (pos < strLength) {
                    var extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) === 0xdc00) {
                        ++pos;
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                    }
                }
            }
            if ((value & 0xffff0000) === 0) {
                // 3-byte
                output[offset++] = value >> 12 & 0x0f | 0xe0;
                output[offset++] = value >> 6 & 0x3f | 0x80;
            } else {
                // 4-byte
                output[offset++] = value >> 18 & 0x07 | 0xf0;
                output[offset++] = value >> 12 & 0x3f | 0x80;
                output[offset++] = value >> 6 & 0x3f | 0x80;
            }
        }
        output[offset++] = value & 0x3f | 0x80;
    }
}
var sharedTextEncoder = TEXT_ENCODING_AVAILABLE ? new TextEncoder() : undefined;
var TEXT_ENCODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"] : typeof __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && ((_b = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === null || __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === void 0 ? void 0 : __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env) === null || _b === void 0 ? void 0 : _b["TEXT_ENCODING"]) !== "force" ? 200 : 0;
function utf8EncodeTEencode(str, output, outputOffset) {
    output.set(sharedTextEncoder.encode(str), outputOffset);
}
function utf8EncodeTEencodeInto(str, output, outputOffset) {
    sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
var utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
    var offset = inputOffset;
    var end = offset + byteLength;
    var units = [];
    var result = "";
    while(offset < end){
        var byte1 = bytes[offset++];
        if ((byte1 & 0x80) === 0) {
            // 1 byte
            units.push(byte1);
        } else if ((byte1 & 0xe0) === 0xc0) {
            // 2 bytes
            var byte2 = bytes[offset++] & 0x3f;
            units.push((byte1 & 0x1f) << 6 | byte2);
        } else if ((byte1 & 0xf0) === 0xe0) {
            // 3 bytes
            var byte2 = bytes[offset++] & 0x3f;
            var byte3 = bytes[offset++] & 0x3f;
            units.push((byte1 & 0x1f) << 12 | byte2 << 6 | byte3);
        } else if ((byte1 & 0xf8) === 0xf0) {
            // 4 bytes
            var byte2 = bytes[offset++] & 0x3f;
            var byte3 = bytes[offset++] & 0x3f;
            var byte4 = bytes[offset++] & 0x3f;
            var unit = (byte1 & 0x07) << 0x12 | byte2 << 0x0c | byte3 << 0x06 | byte4;
            if (unit > 0xffff) {
                unit -= 0x10000;
                units.push(unit >>> 10 & 0x3ff | 0xd800);
                unit = 0xdc00 | unit & 0x3ff;
            }
            units.push(unit);
        } else {
            units.push(byte1);
        }
        if (units.length >= CHUNK_SIZE) {
            result += String.fromCharCode.apply(String, units);
            units.length = 0;
        }
    }
    if (units.length > 0) {
        result += String.fromCharCode.apply(String, units);
    }
    return result;
}
var sharedTextDecoder = TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
var TEXT_DECODER_THRESHOLD = !TEXT_ENCODING_AVAILABLE ? __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"] : typeof __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && ((_c = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === null || __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] === void 0 ? void 0 : __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env) === null || _c === void 0 ? void 0 : _c["TEXT_DECODER"]) !== "force" ? 200 : 0;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
    var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
    return sharedTextDecoder.decode(stringBytes);
} //# sourceMappingURL=utf8.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/ExtData.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtData",
    ()=>ExtData
]);
/**
 * ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
 */ var ExtData = function() {
    function ExtData(type, data) {
        this.type = type;
        this.data = data;
    }
    return ExtData;
}();
;
 //# sourceMappingURL=ExtData.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/DecodeError.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DecodeError",
    ()=>DecodeError
]);
var __extends = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var DecodeError = function(_super) {
    __extends(DecodeError, _super);
    function DecodeError(message) {
        var _this = _super.call(this, message) || this;
        // fix the prototype chain in a cross-platform way
        var proto = Object.create(DecodeError.prototype);
        Object.setPrototypeOf(_this, proto);
        Object.defineProperty(_this, "name", {
            configurable: true,
            enumerable: false,
            value: DecodeError.name
        });
        return _this;
    }
    return DecodeError;
}(Error);
;
 //# sourceMappingURL=DecodeError.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/timestamp.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXT_TIMESTAMP",
    ()=>EXT_TIMESTAMP,
    "decodeTimestampExtension",
    ()=>decodeTimestampExtension,
    "decodeTimestampToTimeSpec",
    ()=>decodeTimestampToTimeSpec,
    "encodeDateToTimeSpec",
    ()=>encodeDateToTimeSpec,
    "encodeTimeSpecToTimestamp",
    ()=>encodeTimeSpecToTimestamp,
    "encodeTimestampExtension",
    ()=>encodeTimestampExtension,
    "timestampExtension",
    ()=>timestampExtension
]);
// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/DecodeError.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs [app-client] (ecmascript)");
;
;
var EXT_TIMESTAMP = -1;
var TIMESTAMP32_MAX_SEC = 0x100000000 - 1; // 32-bit unsigned int
var TIMESTAMP64_MAX_SEC = 0x400000000 - 1; // 34-bit unsigned int
function encodeTimeSpecToTimestamp(_a) {
    var sec = _a.sec, nsec = _a.nsec;
    if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
        // Here sec >= 0 && nsec >= 0
        if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
            // timestamp 32 = { sec32 (unsigned) }
            var rv = new Uint8Array(4);
            var view = new DataView(rv.buffer);
            view.setUint32(0, sec);
            return rv;
        } else {
            // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
            var secHigh = sec / 0x100000000;
            var secLow = sec & 0xffffffff;
            var rv = new Uint8Array(8);
            var view = new DataView(rv.buffer);
            // nsec30 | secHigh2
            view.setUint32(0, nsec << 2 | secHigh & 0x3);
            // secLow32
            view.setUint32(4, secLow);
            return rv;
        }
    } else {
        // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
        var rv = new Uint8Array(12);
        var view = new DataView(rv.buffer);
        view.setUint32(0, nsec);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setInt64"])(view, 4, sec);
        return rv;
    }
}
function encodeDateToTimeSpec(date) {
    var msec = date.getTime();
    var sec = Math.floor(msec / 1e3);
    var nsec = (msec - sec * 1e3) * 1e6;
    // Normalizes { sec, nsec } to ensure nsec is unsigned.
    var nsecInSec = Math.floor(nsec / 1e9);
    return {
        sec: sec + nsecInSec,
        nsec: nsec - nsecInSec * 1e9
    };
}
function encodeTimestampExtension(object) {
    if (object instanceof Date) {
        var timeSpec = encodeDateToTimeSpec(object);
        return encodeTimeSpecToTimestamp(timeSpec);
    } else {
        return null;
    }
}
function decodeTimestampToTimeSpec(data) {
    var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    // data may be 32, 64, or 96 bits
    switch(data.byteLength){
        case 4:
            {
                // timestamp 32 = { sec32 }
                var sec = view.getUint32(0);
                var nsec = 0;
                return {
                    sec: sec,
                    nsec: nsec
                };
            }
        case 8:
            {
                // timestamp 64 = { nsec30, sec34 }
                var nsec30AndSecHigh2 = view.getUint32(0);
                var secLow32 = view.getUint32(4);
                var sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
                var nsec = nsec30AndSecHigh2 >>> 2;
                return {
                    sec: sec,
                    nsec: nsec
                };
            }
        case 12:
            {
                // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
                var sec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInt64"])(view, 4);
                var nsec = view.getUint32(0);
                return {
                    sec: sec,
                    nsec: nsec
                };
            }
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(data.length));
    }
}
function decodeTimestampExtension(data) {
    var timeSpec = decodeTimestampToTimeSpec(data);
    return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
    type: EXT_TIMESTAMP,
    encode: encodeTimestampExtension,
    decode: decodeTimestampExtension
}; //# sourceMappingURL=timestamp.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/ExtensionCodec.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtensionCodec",
    ()=>ExtensionCodec
]);
// ExtensionCodec to handle MessagePack extensions
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/ExtData.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/timestamp.mjs [app-client] (ecmascript)");
;
;
var ExtensionCodec = function() {
    function ExtensionCodec() {
        // built-in extensions
        this.builtInEncoders = [];
        this.builtInDecoders = [];
        // custom extensions
        this.encoders = [];
        this.decoders = [];
        this.register(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$timestamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timestampExtension"]);
    }
    ExtensionCodec.prototype.register = function(_a) {
        var type = _a.type, encode = _a.encode, decode = _a.decode;
        if (type >= 0) {
            // custom extensions
            this.encoders[type] = encode;
            this.decoders[type] = decode;
        } else {
            // built-in extensions
            var index = 1 + type;
            this.builtInEncoders[index] = encode;
            this.builtInDecoders[index] = decode;
        }
    };
    ExtensionCodec.prototype.tryToEncode = function(object, context) {
        // built-in extensions
        for(var i = 0; i < this.builtInEncoders.length; i++){
            var encodeExt = this.builtInEncoders[i];
            if (encodeExt != null) {
                var data = encodeExt(object, context);
                if (data != null) {
                    var type = -1 - i;
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtData"](type, data);
                }
            }
        }
        // custom extensions
        for(var i = 0; i < this.encoders.length; i++){
            var encodeExt = this.encoders[i];
            if (encodeExt != null) {
                var data = encodeExt(object, context);
                if (data != null) {
                    var type = i;
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtData"](type, data);
                }
            }
        }
        if (object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtData"]) {
            // to keep ExtData as is
            return object;
        }
        return null;
    };
    ExtensionCodec.prototype.decode = function(data, type, context) {
        var decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
        if (decodeExt) {
            return decodeExt(data, type, context);
        } else {
            // decode() does not fail, returns ExtData instead.
            return new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtData$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtData"](type, data);
        }
    };
    ExtensionCodec.defaultCodec = new ExtensionCodec();
    return ExtensionCodec;
}();
;
 //# sourceMappingURL=ExtensionCodec.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/typedArrays.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDataView",
    ()=>createDataView,
    "ensureUint8Array",
    ()=>ensureUint8Array
]);
function ensureUint8Array(buffer) {
    if (buffer instanceof Uint8Array) {
        return buffer;
    } else if (ArrayBuffer.isView(buffer)) {
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else if (buffer instanceof ArrayBuffer) {
        return new Uint8Array(buffer);
    } else {
        // ArrayLike<number>
        return Uint8Array.from(buffer);
    }
}
function createDataView(buffer) {
    if (buffer instanceof ArrayBuffer) {
        return new DataView(buffer);
    }
    var bufferView = ensureUint8Array(buffer);
    return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
} //# sourceMappingURL=typedArrays.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/Encoder.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_INITIAL_BUFFER_SIZE",
    ()=>DEFAULT_INITIAL_BUFFER_SIZE,
    "DEFAULT_MAX_DEPTH",
    ()=>DEFAULT_MAX_DEPTH,
    "Encoder",
    ()=>Encoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/ExtensionCodec.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/typedArrays.mjs [app-client] (ecmascript)");
;
;
;
;
var DEFAULT_MAX_DEPTH = 100;
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = function() {
    function Encoder(extensionCodec, context, maxDepth, initialBufferSize, sortKeys, forceFloat32, ignoreUndefined, forceIntegerToFloat) {
        if (extensionCodec === void 0) {
            extensionCodec = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtensionCodec"].defaultCodec;
        }
        if (context === void 0) {
            context = undefined;
        }
        if (maxDepth === void 0) {
            maxDepth = DEFAULT_MAX_DEPTH;
        }
        if (initialBufferSize === void 0) {
            initialBufferSize = DEFAULT_INITIAL_BUFFER_SIZE;
        }
        if (sortKeys === void 0) {
            sortKeys = false;
        }
        if (forceFloat32 === void 0) {
            forceFloat32 = false;
        }
        if (ignoreUndefined === void 0) {
            ignoreUndefined = false;
        }
        if (forceIntegerToFloat === void 0) {
            forceIntegerToFloat = false;
        }
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxDepth = maxDepth;
        this.initialBufferSize = initialBufferSize;
        this.sortKeys = sortKeys;
        this.forceFloat32 = forceFloat32;
        this.ignoreUndefined = ignoreUndefined;
        this.forceIntegerToFloat = forceIntegerToFloat;
        this.pos = 0;
        this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
        this.bytes = new Uint8Array(this.view.buffer);
    }
    Encoder.prototype.reinitializeState = function() {
        this.pos = 0;
    };
    /**
     * This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
     *
     * @returns Encodes the object and returns a shared reference the encoder's internal buffer.
     */ Encoder.prototype.encodeSharedRef = function(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.subarray(0, this.pos);
    };
    /**
     * @returns Encodes the object and returns a copy of the encoder's internal buffer.
     */ Encoder.prototype.encode = function(object) {
        this.reinitializeState();
        this.doEncode(object, 1);
        return this.bytes.slice(0, this.pos);
    };
    Encoder.prototype.doEncode = function(object, depth) {
        if (depth > this.maxDepth) {
            throw new Error("Too deep objects in depth ".concat(depth));
        }
        if (object == null) {
            this.encodeNil();
        } else if (typeof object === "boolean") {
            this.encodeBoolean(object);
        } else if (typeof object === "number") {
            this.encodeNumber(object);
        } else if (typeof object === "string") {
            this.encodeString(object);
        } else {
            this.encodeObject(object, depth);
        }
    };
    Encoder.prototype.ensureBufferSizeToWrite = function(sizeToWrite) {
        var requiredSize = this.pos + sizeToWrite;
        if (this.view.byteLength < requiredSize) {
            this.resizeBuffer(requiredSize * 2);
        }
    };
    Encoder.prototype.resizeBuffer = function(newSize) {
        var newBuffer = new ArrayBuffer(newSize);
        var newBytes = new Uint8Array(newBuffer);
        var newView = new DataView(newBuffer);
        newBytes.set(this.bytes);
        this.view = newView;
        this.bytes = newBytes;
    };
    Encoder.prototype.encodeNil = function() {
        this.writeU8(0xc0);
    };
    Encoder.prototype.encodeBoolean = function(object) {
        if (object === false) {
            this.writeU8(0xc2);
        } else {
            this.writeU8(0xc3);
        }
    };
    Encoder.prototype.encodeNumber = function(object) {
        if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
            if (object >= 0) {
                if (object < 0x80) {
                    // positive fixint
                    this.writeU8(object);
                } else if (object < 0x100) {
                    // uint 8
                    this.writeU8(0xcc);
                    this.writeU8(object);
                } else if (object < 0x10000) {
                    // uint 16
                    this.writeU8(0xcd);
                    this.writeU16(object);
                } else if (object < 0x100000000) {
                    // uint 32
                    this.writeU8(0xce);
                    this.writeU32(object);
                } else {
                    // uint 64
                    this.writeU8(0xcf);
                    this.writeU64(object);
                }
            } else {
                if (object >= -0x20) {
                    // negative fixint
                    this.writeU8(0xe0 | object + 0x20);
                } else if (object >= -0x80) {
                    // int 8
                    this.writeU8(0xd0);
                    this.writeI8(object);
                } else if (object >= -0x8000) {
                    // int 16
                    this.writeU8(0xd1);
                    this.writeI16(object);
                } else if (object >= -0x80000000) {
                    // int 32
                    this.writeU8(0xd2);
                    this.writeI32(object);
                } else {
                    // int 64
                    this.writeU8(0xd3);
                    this.writeI64(object);
                }
            }
        } else {
            // non-integer numbers
            if (this.forceFloat32) {
                // float 32
                this.writeU8(0xca);
                this.writeF32(object);
            } else {
                // float 64
                this.writeU8(0xcb);
                this.writeF64(object);
            }
        }
    };
    Encoder.prototype.writeStringHeader = function(byteLength) {
        if (byteLength < 32) {
            // fixstr
            this.writeU8(0xa0 + byteLength);
        } else if (byteLength < 0x100) {
            // str 8
            this.writeU8(0xd9);
            this.writeU8(byteLength);
        } else if (byteLength < 0x10000) {
            // str 16
            this.writeU8(0xda);
            this.writeU16(byteLength);
        } else if (byteLength < 0x100000000) {
            // str 32
            this.writeU8(0xdb);
            this.writeU32(byteLength);
        } else {
            throw new Error("Too long string: ".concat(byteLength, " bytes in UTF-8"));
        }
    };
    Encoder.prototype.encodeString = function(object) {
        var maxHeaderSize = 1 + 4;
        var strLength = object.length;
        if (strLength > __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_ENCODER_THRESHOLD"]) {
            var byteLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8Count"])(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8EncodeTE"])(object, this.bytes, this.pos);
            this.pos += byteLength;
        } else {
            var byteLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8Count"])(object);
            this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
            this.writeStringHeader(byteLength);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8EncodeJs"])(object, this.bytes, this.pos);
            this.pos += byteLength;
        }
    };
    Encoder.prototype.encodeObject = function(object, depth) {
        // try to encode objects with custom codec first of non-primitives
        var ext = this.extensionCodec.tryToEncode(object, this.context);
        if (ext != null) {
            this.encodeExtension(ext);
        } else if (Array.isArray(object)) {
            this.encodeArray(object, depth);
        } else if (ArrayBuffer.isView(object)) {
            this.encodeBinary(object);
        } else if (typeof object === "object") {
            this.encodeMap(object, depth);
        } else {
            // symbol, function and other special object come here unless extensionCodec handles them.
            throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(object)));
        }
    };
    Encoder.prototype.encodeBinary = function(object) {
        var size = object.byteLength;
        if (size < 0x100) {
            // bin 8
            this.writeU8(0xc4);
            this.writeU8(size);
        } else if (size < 0x10000) {
            // bin 16
            this.writeU8(0xc5);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // bin 32
            this.writeU8(0xc6);
            this.writeU32(size);
        } else {
            throw new Error("Too large binary: ".concat(size));
        }
        var bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureUint8Array"])(object);
        this.writeU8a(bytes);
    };
    Encoder.prototype.encodeArray = function(object, depth) {
        var size = object.length;
        if (size < 16) {
            // fixarray
            this.writeU8(0x90 + size);
        } else if (size < 0x10000) {
            // array 16
            this.writeU8(0xdc);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // array 32
            this.writeU8(0xdd);
            this.writeU32(size);
        } else {
            throw new Error("Too large array: ".concat(size));
        }
        for(var _i = 0, object_1 = object; _i < object_1.length; _i++){
            var item = object_1[_i];
            this.doEncode(item, depth + 1);
        }
    };
    Encoder.prototype.countWithoutUndefined = function(object, keys) {
        var count = 0;
        for(var _i = 0, keys_1 = keys; _i < keys_1.length; _i++){
            var key = keys_1[_i];
            if (object[key] !== undefined) {
                count++;
            }
        }
        return count;
    };
    Encoder.prototype.encodeMap = function(object, depth) {
        var keys = Object.keys(object);
        if (this.sortKeys) {
            keys.sort();
        }
        var size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
        if (size < 16) {
            // fixmap
            this.writeU8(0x80 + size);
        } else if (size < 0x10000) {
            // map 16
            this.writeU8(0xde);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // map 32
            this.writeU8(0xdf);
            this.writeU32(size);
        } else {
            throw new Error("Too large map object: ".concat(size));
        }
        for(var _i = 0, keys_2 = keys; _i < keys_2.length; _i++){
            var key = keys_2[_i];
            var value = object[key];
            if (!(this.ignoreUndefined && value === undefined)) {
                this.encodeString(key);
                this.doEncode(value, depth + 1);
            }
        }
    };
    Encoder.prototype.encodeExtension = function(ext) {
        var size = ext.data.length;
        if (size === 1) {
            // fixext 1
            this.writeU8(0xd4);
        } else if (size === 2) {
            // fixext 2
            this.writeU8(0xd5);
        } else if (size === 4) {
            // fixext 4
            this.writeU8(0xd6);
        } else if (size === 8) {
            // fixext 8
            this.writeU8(0xd7);
        } else if (size === 16) {
            // fixext 16
            this.writeU8(0xd8);
        } else if (size < 0x100) {
            // ext 8
            this.writeU8(0xc7);
            this.writeU8(size);
        } else if (size < 0x10000) {
            // ext 16
            this.writeU8(0xc8);
            this.writeU16(size);
        } else if (size < 0x100000000) {
            // ext 32
            this.writeU8(0xc9);
            this.writeU32(size);
        } else {
            throw new Error("Too large extension object: ".concat(size));
        }
        this.writeI8(ext.type);
        this.writeU8a(ext.data);
    };
    Encoder.prototype.writeU8 = function(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setUint8(this.pos, value);
        this.pos++;
    };
    Encoder.prototype.writeU8a = function(values) {
        var size = values.length;
        this.ensureBufferSizeToWrite(size);
        this.bytes.set(values, this.pos);
        this.pos += size;
    };
    Encoder.prototype.writeI8 = function(value) {
        this.ensureBufferSizeToWrite(1);
        this.view.setInt8(this.pos, value);
        this.pos++;
    };
    Encoder.prototype.writeU16 = function(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setUint16(this.pos, value);
        this.pos += 2;
    };
    Encoder.prototype.writeI16 = function(value) {
        this.ensureBufferSizeToWrite(2);
        this.view.setInt16(this.pos, value);
        this.pos += 2;
    };
    Encoder.prototype.writeU32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setUint32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeI32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setInt32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeF32 = function(value) {
        this.ensureBufferSizeToWrite(4);
        this.view.setFloat32(this.pos, value);
        this.pos += 4;
    };
    Encoder.prototype.writeF64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        this.view.setFloat64(this.pos, value);
        this.pos += 8;
    };
    Encoder.prototype.writeU64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setUint64"])(this.view, this.pos, value);
        this.pos += 8;
    };
    Encoder.prototype.writeI64 = function(value) {
        this.ensureBufferSizeToWrite(8);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setInt64"])(this.view, this.pos, value);
        this.pos += 8;
    };
    return Encoder;
}();
;
 //# sourceMappingURL=Encoder.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/prettyByte.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prettyByte",
    ()=>prettyByte
]);
function prettyByte(byte) {
    return "".concat(byte < 0 ? "-" : "", "0x").concat(Math.abs(byte).toString(16).padStart(2, "0"));
} //# sourceMappingURL=prettyByte.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/CachedKeyDecoder.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CachedKeyDecoder",
    ()=>CachedKeyDecoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs [app-client] (ecmascript)");
;
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = function() {
    function CachedKeyDecoder(maxKeyLength, maxLengthPerKey) {
        if (maxKeyLength === void 0) {
            maxKeyLength = DEFAULT_MAX_KEY_LENGTH;
        }
        if (maxLengthPerKey === void 0) {
            maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY;
        }
        this.maxKeyLength = maxKeyLength;
        this.maxLengthPerKey = maxLengthPerKey;
        this.hit = 0;
        this.miss = 0;
        // avoid `new Array(N)`, which makes a sparse array,
        // because a sparse array is typically slower than a non-sparse array.
        this.caches = [];
        for(var i = 0; i < this.maxKeyLength; i++){
            this.caches.push([]);
        }
    }
    CachedKeyDecoder.prototype.canBeCached = function(byteLength) {
        return byteLength > 0 && byteLength <= this.maxKeyLength;
    };
    CachedKeyDecoder.prototype.find = function(bytes, inputOffset, byteLength) {
        var records = this.caches[byteLength - 1];
        FIND_CHUNK: for(var _i = 0, records_1 = records; _i < records_1.length; _i++){
            var record = records_1[_i];
            var recordBytes = record.bytes;
            for(var j = 0; j < byteLength; j++){
                if (recordBytes[j] !== bytes[inputOffset + j]) {
                    continue FIND_CHUNK;
                }
            }
            return record.str;
        }
        return null;
    };
    CachedKeyDecoder.prototype.store = function(bytes, value) {
        var records = this.caches[bytes.length - 1];
        var record = {
            bytes: bytes,
            str: value
        };
        if (records.length >= this.maxLengthPerKey) {
            // `records` are full!
            // Set `record` to an arbitrary position.
            records[Math.random() * records.length | 0] = record;
        } else {
            records.push(record);
        }
    };
    CachedKeyDecoder.prototype.decode = function(bytes, inputOffset, byteLength) {
        var cachedValue = this.find(bytes, inputOffset, byteLength);
        if (cachedValue != null) {
            this.hit++;
            return cachedValue;
        }
        this.miss++;
        var str = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8DecodeJs"])(bytes, inputOffset, byteLength);
        // Ensure to copy a slice of bytes because the byte may be NodeJS Buffer and Buffer#slice() returns a reference to its internal ArrayBuffer.
        var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
        this.store(slicedCopyOfBytes, str);
        return str;
    };
    return CachedKeyDecoder;
}();
;
 //# sourceMappingURL=CachedKeyDecoder.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/Decoder.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataViewIndexOutOfBoundsError",
    ()=>DataViewIndexOutOfBoundsError,
    "Decoder",
    ()=>Decoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/prettyByte.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/ExtensionCodec.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/int.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/utf8.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/typedArrays.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$CachedKeyDecoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/CachedKeyDecoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/DecodeError.mjs [app-client] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __asyncValues = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__asyncValues || function(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i);
    //TURBOPACK unreachable
    ;
    function verb(n) {
        i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v) {
            resolve({
                value: v,
                done: d
            });
        }, reject);
    }
};
var __await = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__await || function(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var __asyncGenerator = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__asyncGenerator || function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        if (g[n]) i[n] = function(v) {
            return new Promise(function(a, b) {
                q.push([
                    n,
                    v,
                    a,
                    b
                ]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
};
;
;
;
;
;
;
;
var isValidMapKeyType = function(key) {
    var keyType = typeof key;
    return keyType === "string" || keyType === "number";
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = new DataView(new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
var DataViewIndexOutOfBoundsError = function() {
    try {
        // IE11: The spec says it should throw RangeError,
        // IE11: but in IE11 it throws TypeError.
        EMPTY_VIEW.getInt8(0);
    } catch (e) {
        return e.constructor;
    }
    throw new Error("never reached");
}();
var MORE_DATA = new DataViewIndexOutOfBoundsError("Insufficient data");
var sharedCachedKeyDecoder = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$CachedKeyDecoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CachedKeyDecoder"]();
var Decoder = function() {
    function Decoder(extensionCodec, context, maxStrLength, maxBinLength, maxArrayLength, maxMapLength, maxExtLength, keyDecoder) {
        if (extensionCodec === void 0) {
            extensionCodec = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$ExtensionCodec$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtensionCodec"].defaultCodec;
        }
        if (context === void 0) {
            context = undefined;
        }
        if (maxStrLength === void 0) {
            maxStrLength = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        }
        if (maxBinLength === void 0) {
            maxBinLength = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        }
        if (maxArrayLength === void 0) {
            maxArrayLength = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        }
        if (maxMapLength === void 0) {
            maxMapLength = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        }
        if (maxExtLength === void 0) {
            maxExtLength = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UINT32_MAX"];
        }
        if (keyDecoder === void 0) {
            keyDecoder = sharedCachedKeyDecoder;
        }
        this.extensionCodec = extensionCodec;
        this.context = context;
        this.maxStrLength = maxStrLength;
        this.maxBinLength = maxBinLength;
        this.maxArrayLength = maxArrayLength;
        this.maxMapLength = maxMapLength;
        this.maxExtLength = maxExtLength;
        this.keyDecoder = keyDecoder;
        this.totalPos = 0;
        this.pos = 0;
        this.view = EMPTY_VIEW;
        this.bytes = EMPTY_BYTES;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack = [];
    }
    Decoder.prototype.reinitializeState = function() {
        this.totalPos = 0;
        this.headByte = HEAD_BYTE_REQUIRED;
        this.stack.length = 0;
    // view, bytes, and pos will be re-initialized in setBuffer()
    };
    Decoder.prototype.setBuffer = function(buffer) {
        this.bytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureUint8Array"])(buffer);
        this.view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDataView"])(this.bytes);
        this.pos = 0;
    };
    Decoder.prototype.appendBuffer = function(buffer) {
        if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
            this.setBuffer(buffer);
        } else {
            var remainingData = this.bytes.subarray(this.pos);
            var newData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$typedArrays$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureUint8Array"])(buffer);
            // concat remainingData + newData
            var newBuffer = new Uint8Array(remainingData.length + newData.length);
            newBuffer.set(remainingData);
            newBuffer.set(newData, remainingData.length);
            this.setBuffer(newBuffer);
        }
    };
    Decoder.prototype.hasRemaining = function(size) {
        return this.view.byteLength - this.pos >= size;
    };
    Decoder.prototype.createExtraByteError = function(posToShow) {
        var _a = this, view = _a.view, pos = _a.pos;
        return new RangeError("Extra ".concat(view.byteLength - pos, " of ").concat(view.byteLength, " byte(s) found at buffer[").concat(posToShow, "]"));
    };
    /**
     * @throws {@link DecodeError}
     * @throws {@link RangeError}
     */ Decoder.prototype.decode = function(buffer) {
        this.reinitializeState();
        this.setBuffer(buffer);
        var object = this.doDecodeSync();
        if (this.hasRemaining(1)) {
            throw this.createExtraByteError(this.pos);
        }
        return object;
    };
    Decoder.prototype.decodeMulti = function(buffer) {
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    this.reinitializeState();
                    this.setBuffer(buffer);
                    _a.label = 1;
                case 1:
                    if (!this.hasRemaining(1)) return [
                        3 /*break*/ ,
                        3
                    ];
                    return [
                        4 /*yield*/ ,
                        this.doDecodeSync()
                    ];
                case 2:
                    _a.sent();
                    return [
                        3 /*break*/ ,
                        1
                    ];
                case 3:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    };
    Decoder.prototype.decodeAsync = function(stream) {
        var stream_1, stream_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function() {
            var decoded, object, buffer, e_1_1, _b, headByte, pos, totalPos;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        decoded = false;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([
                            1,
                            6,
                            7,
                            12
                        ]);
                        stream_1 = __asyncValues(stream);
                        _c.label = 2;
                    case 2:
                        return [
                            4 /*yield*/ ,
                            stream_1.next()
                        ];
                    case 3:
                        if (!(stream_1_1 = _c.sent(), !stream_1_1.done)) return [
                            3 /*break*/ ,
                            5
                        ];
                        buffer = stream_1_1.value;
                        if (decoded) {
                            throw this.createExtraByteError(this.totalPos);
                        }
                        this.appendBuffer(buffer);
                        try {
                            object = this.doDecodeSync();
                            decoded = true;
                        } catch (e) {
                            if (!(e instanceof DataViewIndexOutOfBoundsError)) {
                                throw e; // rethrow
                            }
                        // fallthrough
                        }
                        this.totalPos += this.pos;
                        _c.label = 4;
                    case 4:
                        return [
                            3 /*break*/ ,
                            2
                        ];
                    case 5:
                        return [
                            3 /*break*/ ,
                            12
                        ];
                    case 6:
                        e_1_1 = _c.sent();
                        e_1 = {
                            error: e_1_1
                        };
                        return [
                            3 /*break*/ ,
                            12
                        ];
                    case 7:
                        _c.trys.push([
                            7,
                            ,
                            10,
                            11
                        ]);
                        if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1.return))) return [
                            3 /*break*/ ,
                            9
                        ];
                        return [
                            4 /*yield*/ ,
                            _a.call(stream_1)
                        ];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        return [
                            3 /*break*/ ,
                            11
                        ];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 11:
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 12:
                        if (decoded) {
                            if (this.hasRemaining(1)) {
                                throw this.createExtraByteError(this.totalPos);
                            }
                            return [
                                2 /*return*/ ,
                                object
                            ];
                        }
                        _b = this, headByte = _b.headByte, pos = _b.pos, totalPos = _b.totalPos;
                        throw new RangeError("Insufficient data in parsing ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prettyByte"])(headByte), " at ").concat(totalPos, " (").concat(pos, " in the current buffer)"));
                }
            });
        });
    };
    Decoder.prototype.decodeArrayStream = function(stream) {
        return this.decodeMultiAsync(stream, true);
    };
    Decoder.prototype.decodeStream = function(stream) {
        return this.decodeMultiAsync(stream, false);
    };
    Decoder.prototype.decodeMultiAsync = function(stream, isArray) {
        return __asyncGenerator(this, arguments, function decodeMultiAsync_1() {
            var isArrayHeaderRequired, arrayItemsLeft, stream_2, stream_2_1, buffer, e_2, e_3_1;
            var e_3, _a;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        isArrayHeaderRequired = isArray;
                        arrayItemsLeft = -1;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([
                            1,
                            13,
                            14,
                            19
                        ]);
                        stream_2 = __asyncValues(stream);
                        _b.label = 2;
                    case 2:
                        return [
                            4 /*yield*/ ,
                            __await(stream_2.next())
                        ];
                    case 3:
                        if (!(stream_2_1 = _b.sent(), !stream_2_1.done)) return [
                            3 /*break*/ ,
                            12
                        ];
                        buffer = stream_2_1.value;
                        if (isArray && arrayItemsLeft === 0) {
                            throw this.createExtraByteError(this.totalPos);
                        }
                        this.appendBuffer(buffer);
                        if (isArrayHeaderRequired) {
                            arrayItemsLeft = this.readArraySize();
                            isArrayHeaderRequired = false;
                            this.complete();
                        }
                        _b.label = 4;
                    case 4:
                        _b.trys.push([
                            4,
                            9,
                            ,
                            10
                        ]);
                        _b.label = 5;
                    case 5:
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                        return [
                            4 /*yield*/ ,
                            __await(this.doDecodeSync())
                        ];
                    case 6:
                        return [
                            4 /*yield*/ ,
                            _b.sent()
                        ];
                    case 7:
                        _b.sent();
                        if (--arrayItemsLeft === 0) {
                            return [
                                3 /*break*/ ,
                                8
                            ];
                        }
                        return [
                            3 /*break*/ ,
                            5
                        ];
                    case 8:
                        return [
                            3 /*break*/ ,
                            10
                        ];
                    case 9:
                        e_2 = _b.sent();
                        if (!(e_2 instanceof DataViewIndexOutOfBoundsError)) {
                            throw e_2; // rethrow
                        }
                        return [
                            3 /*break*/ ,
                            10
                        ];
                    case 10:
                        this.totalPos += this.pos;
                        _b.label = 11;
                    case 11:
                        return [
                            3 /*break*/ ,
                            2
                        ];
                    case 12:
                        return [
                            3 /*break*/ ,
                            19
                        ];
                    case 13:
                        e_3_1 = _b.sent();
                        e_3 = {
                            error: e_3_1
                        };
                        return [
                            3 /*break*/ ,
                            19
                        ];
                    case 14:
                        _b.trys.push([
                            14,
                            ,
                            17,
                            18
                        ]);
                        if (!(stream_2_1 && !stream_2_1.done && (_a = stream_2.return))) return [
                            3 /*break*/ ,
                            16
                        ];
                        return [
                            4 /*yield*/ ,
                            __await(_a.call(stream_2))
                        ];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16:
                        return [
                            3 /*break*/ ,
                            18
                        ];
                    case 17:
                        if (e_3) throw e_3.error;
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 18:
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 19:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Decoder.prototype.doDecodeSync = function() {
        DECODE: while(true){
            var headByte = this.readHeadByte();
            var object = void 0;
            if (headByte >= 0xe0) {
                // negative fixint (111x xxxx) 0xe0 - 0xff
                object = headByte - 0x100;
            } else if (headByte < 0xc0) {
                if (headByte < 0x80) {
                    // positive fixint (0xxx xxxx) 0x00 - 0x7f
                    object = headByte;
                } else if (headByte < 0x90) {
                    // fixmap (1000 xxxx) 0x80 - 0x8f
                    var size = headByte - 0x80;
                    if (size !== 0) {
                        this.pushMapState(size);
                        this.complete();
                        continue DECODE;
                    } else {
                        object = {};
                    }
                } else if (headByte < 0xa0) {
                    // fixarray (1001 xxxx) 0x90 - 0x9f
                    var size = headByte - 0x90;
                    if (size !== 0) {
                        this.pushArrayState(size);
                        this.complete();
                        continue DECODE;
                    } else {
                        object = [];
                    }
                } else {
                    // fixstr (101x xxxx) 0xa0 - 0xbf
                    var byteLength = headByte - 0xa0;
                    object = this.decodeUtf8String(byteLength, 0);
                }
            } else if (headByte === 0xc0) {
                // nil
                object = null;
            } else if (headByte === 0xc2) {
                // false
                object = false;
            } else if (headByte === 0xc3) {
                // true
                object = true;
            } else if (headByte === 0xca) {
                // float 32
                object = this.readF32();
            } else if (headByte === 0xcb) {
                // float 64
                object = this.readF64();
            } else if (headByte === 0xcc) {
                // uint 8
                object = this.readU8();
            } else if (headByte === 0xcd) {
                // uint 16
                object = this.readU16();
            } else if (headByte === 0xce) {
                // uint 32
                object = this.readU32();
            } else if (headByte === 0xcf) {
                // uint 64
                object = this.readU64();
            } else if (headByte === 0xd0) {
                // int 8
                object = this.readI8();
            } else if (headByte === 0xd1) {
                // int 16
                object = this.readI16();
            } else if (headByte === 0xd2) {
                // int 32
                object = this.readI32();
            } else if (headByte === 0xd3) {
                // int 64
                object = this.readI64();
            } else if (headByte === 0xd9) {
                // str 8
                var byteLength = this.lookU8();
                object = this.decodeUtf8String(byteLength, 1);
            } else if (headByte === 0xda) {
                // str 16
                var byteLength = this.lookU16();
                object = this.decodeUtf8String(byteLength, 2);
            } else if (headByte === 0xdb) {
                // str 32
                var byteLength = this.lookU32();
                object = this.decodeUtf8String(byteLength, 4);
            } else if (headByte === 0xdc) {
                // array 16
                var size = this.readU16();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = [];
                }
            } else if (headByte === 0xdd) {
                // array 32
                var size = this.readU32();
                if (size !== 0) {
                    this.pushArrayState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = [];
                }
            } else if (headByte === 0xde) {
                // map 16
                var size = this.readU16();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = {};
                }
            } else if (headByte === 0xdf) {
                // map 32
                var size = this.readU32();
                if (size !== 0) {
                    this.pushMapState(size);
                    this.complete();
                    continue DECODE;
                } else {
                    object = {};
                }
            } else if (headByte === 0xc4) {
                // bin 8
                var size = this.lookU8();
                object = this.decodeBinary(size, 1);
            } else if (headByte === 0xc5) {
                // bin 16
                var size = this.lookU16();
                object = this.decodeBinary(size, 2);
            } else if (headByte === 0xc6) {
                // bin 32
                var size = this.lookU32();
                object = this.decodeBinary(size, 4);
            } else if (headByte === 0xd4) {
                // fixext 1
                object = this.decodeExtension(1, 0);
            } else if (headByte === 0xd5) {
                // fixext 2
                object = this.decodeExtension(2, 0);
            } else if (headByte === 0xd6) {
                // fixext 4
                object = this.decodeExtension(4, 0);
            } else if (headByte === 0xd7) {
                // fixext 8
                object = this.decodeExtension(8, 0);
            } else if (headByte === 0xd8) {
                // fixext 16
                object = this.decodeExtension(16, 0);
            } else if (headByte === 0xc7) {
                // ext 8
                var size = this.lookU8();
                object = this.decodeExtension(size, 1);
            } else if (headByte === 0xc8) {
                // ext 16
                var size = this.lookU16();
                object = this.decodeExtension(size, 2);
            } else if (headByte === 0xc9) {
                // ext 32
                var size = this.lookU32();
                object = this.decodeExtension(size, 4);
            } else {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Unrecognized type byte: ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prettyByte"])(headByte)));
            }
            this.complete();
            var stack = this.stack;
            while(stack.length > 0){
                // arrays and maps
                var state = stack[stack.length - 1];
                if (state.type === 0 /* State.ARRAY */ ) {
                    state.array[state.position] = object;
                    state.position++;
                    if (state.position === state.size) {
                        stack.pop();
                        object = state.array;
                    } else {
                        continue DECODE;
                    }
                } else if (state.type === 1 /* State.MAP_KEY */ ) {
                    if (!isValidMapKeyType(object)) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("The type of key must be string or number but " + typeof object);
                    }
                    if (object === "__proto__") {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("The key __proto__ is not allowed");
                    }
                    state.key = object;
                    state.type = 2 /* State.MAP_VALUE */ ;
                    continue DECODE;
                } else {
                    // it must be `state.type === State.MAP_VALUE` here
                    state.map[state.key] = object;
                    state.readCount++;
                    if (state.readCount === state.size) {
                        stack.pop();
                        object = state.map;
                    } else {
                        state.key = null;
                        state.type = 1 /* State.MAP_KEY */ ;
                        continue DECODE;
                    }
                }
            }
            return object;
        }
    };
    Decoder.prototype.readHeadByte = function() {
        if (this.headByte === HEAD_BYTE_REQUIRED) {
            this.headByte = this.readU8();
        // console.log("headByte", prettyByte(this.headByte));
        }
        return this.headByte;
    };
    Decoder.prototype.complete = function() {
        this.headByte = HEAD_BYTE_REQUIRED;
    };
    Decoder.prototype.readArraySize = function() {
        var headByte = this.readHeadByte();
        switch(headByte){
            case 0xdc:
                return this.readU16();
            case 0xdd:
                return this.readU32();
            default:
                {
                    if (headByte < 0xa0) {
                        return headByte - 0x90;
                    } else {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Unrecognized array type byte: ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$prettyByte$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prettyByte"])(headByte)));
                    }
                }
        }
    };
    Decoder.prototype.pushMapState = function(size) {
        if (size > this.maxMapLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Max length exceeded: map length (".concat(size, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
        }
        this.stack.push({
            type: 1 /* State.MAP_KEY */ ,
            size: size,
            key: null,
            readCount: 0,
            map: {}
        });
    };
    Decoder.prototype.pushArrayState = function(size) {
        if (size > this.maxArrayLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Max length exceeded: array length (".concat(size, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
        }
        this.stack.push({
            type: 0 /* State.ARRAY */ ,
            size: size,
            array: new Array(size),
            position: 0
        });
    };
    Decoder.prototype.decodeUtf8String = function(byteLength, headerOffset) {
        var _a;
        if (byteLength > this.maxStrLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Max length exceeded: UTF-8 byte length (".concat(byteLength, ") > maxStrLength (").concat(this.maxStrLength, ")"));
        }
        if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
            throw MORE_DATA;
        }
        var offset = this.pos + headerOffset;
        var object;
        if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) {
            object = this.keyDecoder.decode(this.bytes, offset, byteLength);
        } else if (byteLength > __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEXT_DECODER_THRESHOLD"]) {
            object = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8DecodeTD"])(this.bytes, offset, byteLength);
        } else {
            object = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$utf8$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utf8DecodeJs"])(this.bytes, offset, byteLength);
        }
        this.pos += headerOffset + byteLength;
        return object;
    };
    Decoder.prototype.stateIsMapKey = function() {
        if (this.stack.length > 0) {
            var state = this.stack[this.stack.length - 1];
            return state.type === 1 /* State.MAP_KEY */ ;
        }
        return false;
    };
    Decoder.prototype.decodeBinary = function(byteLength, headOffset) {
        if (byteLength > this.maxBinLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Max length exceeded: bin length (".concat(byteLength, ") > maxBinLength (").concat(this.maxBinLength, ")"));
        }
        if (!this.hasRemaining(byteLength + headOffset)) {
            throw MORE_DATA;
        }
        var offset = this.pos + headOffset;
        var object = this.bytes.subarray(offset, offset + byteLength);
        this.pos += headOffset + byteLength;
        return object;
    };
    Decoder.prototype.decodeExtension = function(size, headOffset) {
        if (size > this.maxExtLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$DecodeError$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DecodeError"]("Max length exceeded: ext length (".concat(size, ") > maxExtLength (").concat(this.maxExtLength, ")"));
        }
        var extType = this.view.getInt8(this.pos + headOffset);
        var data = this.decodeBinary(size, headOffset + 1 /* extType */ );
        return this.extensionCodec.decode(data, extType, this.context);
    };
    Decoder.prototype.lookU8 = function() {
        return this.view.getUint8(this.pos);
    };
    Decoder.prototype.lookU16 = function() {
        return this.view.getUint16(this.pos);
    };
    Decoder.prototype.lookU32 = function() {
        return this.view.getUint32(this.pos);
    };
    Decoder.prototype.readU8 = function() {
        var value = this.view.getUint8(this.pos);
        this.pos++;
        return value;
    };
    Decoder.prototype.readI8 = function() {
        var value = this.view.getInt8(this.pos);
        this.pos++;
        return value;
    };
    Decoder.prototype.readU16 = function() {
        var value = this.view.getUint16(this.pos);
        this.pos += 2;
        return value;
    };
    Decoder.prototype.readI16 = function() {
        var value = this.view.getInt16(this.pos);
        this.pos += 2;
        return value;
    };
    Decoder.prototype.readU32 = function() {
        var value = this.view.getUint32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readI32 = function() {
        var value = this.view.getInt32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readU64 = function() {
        var value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUint64"])(this.view, this.pos);
        this.pos += 8;
        return value;
    };
    Decoder.prototype.readI64 = function() {
        var value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$int$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInt64"])(this.view, this.pos);
        this.pos += 8;
        return value;
    };
    Decoder.prototype.readF32 = function() {
        var value = this.view.getFloat32(this.pos);
        this.pos += 4;
        return value;
    };
    Decoder.prototype.readF64 = function() {
        var value = this.view.getFloat64(this.pos);
        this.pos += 8;
        return value;
    };
    return Decoder;
}();
;
 //# sourceMappingURL=Decoder.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/stream.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "asyncIterableFromStream",
    ()=>asyncIterableFromStream,
    "ensureAsyncIterable",
    ()=>ensureAsyncIterable,
    "isAsyncIterable",
    ()=>isAsyncIterable
]);
// utility for whatwg streams
var __generator = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __await = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__await || function(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var __asyncGenerator = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__asyncGenerator || function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        if (g[n]) i[n] = function(v) {
            return new Promise(function(a, b) {
                q.push([
                    n,
                    v,
                    a,
                    b
                ]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
};
function isAsyncIterable(object) {
    return object[Symbol.asyncIterator] != null;
}
function assertNonNull(value) {
    if (value == null) {
        throw new Error("Assertion Failure: value must not be null nor undefined");
    }
}
function asyncIterableFromStream(stream) {
    return __asyncGenerator(this, arguments, function asyncIterableFromStream_1() {
        var reader, _a, done, value;
        return __generator(this, function(_b) {
            switch(_b.label){
                case 0:
                    reader = stream.getReader();
                    _b.label = 1;
                case 1:
                    _b.trys.push([
                        1,
                        ,
                        9,
                        10
                    ]);
                    _b.label = 2;
                case 2:
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    return [
                        4 /*yield*/ ,
                        __await(reader.read())
                    ];
                case 3:
                    _a = _b.sent(), done = _a.done, value = _a.value;
                    if (!done) return [
                        3 /*break*/ ,
                        5
                    ];
                    return [
                        4 /*yield*/ ,
                        __await(void 0)
                    ];
                case 4:
                    return [
                        2 /*return*/ ,
                        _b.sent()
                    ];
                case 5:
                    assertNonNull(value);
                    return [
                        4 /*yield*/ ,
                        __await(value)
                    ];
                case 6:
                    return [
                        4 /*yield*/ ,
                        _b.sent()
                    ];
                case 7:
                    _b.sent();
                    return [
                        3 /*break*/ ,
                        2
                    ];
                case 8:
                    return [
                        3 /*break*/ ,
                        10
                    ];
                case 9:
                    reader.releaseLock();
                    return [
                        7 /*endfinally*/ 
                    ];
                case 10:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
}
function ensureAsyncIterable(streamLike) {
    if (isAsyncIterable(streamLike)) {
        return streamLike;
    } else {
        return asyncIterableFromStream(streamLike);
    }
} //# sourceMappingURL=stream.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/decode.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "decodeMulti",
    ()=>decodeMulti,
    "defaultDecodeOptions",
    ()=>defaultDecodeOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/Decoder.mjs [app-client] (ecmascript)");
;
var defaultDecodeOptions = {};
function decode(buffer, options) {
    if (options === void 0) {
        options = defaultDecodeOptions;
    }
    var decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decode(buffer);
}
function decodeMulti(buffer, options) {
    if (options === void 0) {
        options = defaultDecodeOptions;
    }
    var decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeMulti(buffer);
} //# sourceMappingURL=decode.mjs.map
}),
"[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/decodeAsync.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeArrayStream",
    ()=>decodeArrayStream,
    "decodeAsync",
    ()=>decodeAsync,
    "decodeMultiStream",
    ()=>decodeMultiStream,
    "decodeStream",
    ()=>decodeStream
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/Decoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/utils/stream.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/decode.mjs [app-client] (ecmascript)");
var __awaiter = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = ("TURBOPACK compile-time value", void 0) && ("TURBOPACK compile-time value", void 0).__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g;
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
;
;
;
function decodeAsync(streamLike, options) {
    if (options === void 0) {
        options = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultDecodeOptions"];
    }
    return __awaiter(this, void 0, void 0, function() {
        var stream, decoder;
        return __generator(this, function(_a) {
            stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAsyncIterable"])(streamLike);
            decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
            return [
                2 /*return*/ ,
                decoder.decodeAsync(stream)
            ];
        });
    });
}
function decodeArrayStream(streamLike, options) {
    if (options === void 0) {
        options = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultDecodeOptions"];
    }
    var stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAsyncIterable"])(streamLike);
    var decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeArrayStream(stream);
}
function decodeMultiStream(streamLike, options) {
    if (options === void 0) {
        options = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultDecodeOptions"];
    }
    var stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$utils$2f$stream$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureAsyncIterable"])(streamLike);
    var decoder = new __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Decoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Decoder"](options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeStream(stream);
}
function decodeStream(streamLike, options) {
    if (options === void 0) {
        options = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decode$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultDecodeOptions"];
    }
    return decodeMultiStream(streamLike, options);
} //# sourceMappingURL=decodeAsync.mjs.map
}),
"[project]/family-messenger/node_modules/peerjs/dist/bundler.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseConnectionErrorType",
    ()=>$78455e22dea96b8c$export$7974935686149686,
    "BufferedConnection",
    ()=>$a229bedbcaa6ca23$export$ff7c9d4c11d94e8b,
    "ConnectionType",
    ()=>$78455e22dea96b8c$export$3157d57b4135e3bc,
    "DataConnectionErrorType",
    ()=>$78455e22dea96b8c$export$49ae800c114df41d,
    "MsgPack",
    ()=>$6e39230ab36396ad$export$80f5de1a66c4d624,
    "MsgPackPeer",
    ()=>$1e0aff16be2c328e$export$d72c7bf8eef50853,
    "Peer",
    ()=>$416260bce337df90$export$ecd1fc136c422448,
    "PeerError",
    ()=>$23779d1881157a18$export$98871882f492de82,
    "PeerErrorType",
    ()=>$78455e22dea96b8c$export$9547aaa2e39030ff,
    "SerializationType",
    ()=>$78455e22dea96b8c$export$89f507cf986a947,
    "ServerMessageType",
    ()=>$78455e22dea96b8c$export$adb4a1754da6f10d,
    "SocketEventType",
    ()=>$78455e22dea96b8c$export$3b5c4a4b6354f023,
    "StreamConnection",
    ()=>$20dbe68149d7aad9$export$72aa44612e2200cd,
    "default",
    ()=>$dd0187d7f28e386f$export$2e2bcd8739ae039,
    "util",
    ()=>$4f4134156c446392$export$7debb50ef11d5e0b
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2d$js$2d$binarypack$2f$dist$2f$binarypack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/peerjs-js-binarypack/dist/binarypack.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$adapter_core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/webrtc-adapter/src/js/adapter_core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Encoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/Encoder.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/@msgpack/msgpack/dist.es5+esm/decodeAsync.mjs [app-client] (ecmascript)");
;
;
;
function $parcel$export(e, n, v, s) {
    Object.defineProperty(e, n, {
        get: v,
        set: s,
        enumerable: true,
        configurable: true
    });
}
class $fcbcc7538a6776d5$export$f1c5f4c9cb95390b {
    constructor(){
        this.chunkedMTU = 16300 // The original 60000 bytes setting does not work when sending data from Firefox to Chrome, which is "cut off" after 16384 bytes and delivered individually.
        ;
        // Binary stuff
        this._dataCount = 1;
        this.chunk = (blob)=>{
            const chunks = [];
            const size = blob.byteLength;
            const total = Math.ceil(size / this.chunkedMTU);
            let index = 0;
            let start = 0;
            while(start < size){
                const end = Math.min(size, start + this.chunkedMTU);
                const b = blob.slice(start, end);
                const chunk = {
                    __peerData: this._dataCount,
                    n: index,
                    data: b,
                    total: total
                };
                chunks.push(chunk);
                start = end;
                index++;
            }
            this._dataCount++;
            return chunks;
        };
    }
}
function $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
    let size = 0;
    for (const buf of bufs)size += buf.byteLength;
    const result = new Uint8Array(size);
    let offset = 0;
    for (const buf of bufs){
        result.set(buf, offset);
        offset += buf.byteLength;
    }
    return result;
}
const $fb63e766cfafaab9$var$webRTCAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$adapter_core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]).default || (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$webrtc$2d$adapter$2f$src$2f$js$2f$adapter_core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const $fb63e766cfafaab9$export$25be9502477c137d = new class {
    isWebRTCSupported() {
        return typeof RTCPeerConnection !== "undefined";
    }
    isBrowserSupported() {
        const browser = this.getBrowser();
        const version = this.getVersion();
        const validBrowser = this.supportedBrowsers.includes(browser);
        if (!validBrowser) return false;
        if (browser === "chrome") return version >= this.minChromeVersion;
        if (browser === "firefox") return version >= this.minFirefoxVersion;
        if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
        return false;
    }
    getBrowser() {
        return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
    }
    getVersion() {
        return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
    }
    isUnifiedPlanSupported() {
        const browser = this.getBrowser();
        const version = $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
        if (browser === "chrome" && version < this.minChromeVersion) return false;
        if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
        if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return false;
        let tempPc;
        let supported = false;
        try {
            tempPc = new RTCPeerConnection();
            tempPc.addTransceiver("audio");
            supported = true;
        } catch (e) {} finally{
            if (tempPc) tempPc.close();
        }
        return supported;
    }
    toString() {
        return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
    }
    constructor(){
        this.isIOS = typeof navigator !== "undefined" ? [
            "iPad",
            "iPhone",
            "iPod"
        ].includes(navigator.platform) : false;
        this.supportedBrowsers = [
            "firefox",
            "chrome",
            "safari"
        ];
        this.minFirefoxVersion = 59;
        this.minChromeVersion = 72;
        this.minSafariVersion = 605;
    }
}();
const $9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id)=>{
    // Allow empty ids
    return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
};
const $0e5fd1585784c252$export$4e61f672936bec77 = ()=>Math.random().toString(36).slice(2);
const $4f4134156c446392$var$DEFAULT_CONFIG = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        },
        {
            urls: [
                "turn:eu-0.turn.peerjs.com:3478",
                "turn:us-0.turn.peerjs.com:3478"
            ],
            username: "peerjs",
            credential: "peerjsp"
        }
    ],
    sdpSemantics: "unified-plan"
};
class $4f4134156c446392$export$f8f26dd395d7e1bd extends (0, $fcbcc7538a6776d5$export$f1c5f4c9cb95390b) {
    noop() {}
    blobToArrayBuffer(blob, cb) {
        const fr = new FileReader();
        fr.onload = function(evt) {
            if (evt.target) cb(evt.target.result);
        };
        fr.readAsArrayBuffer(blob);
        return fr;
    }
    binaryStringToArrayBuffer(binary) {
        const byteArray = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++)byteArray[i] = binary.charCodeAt(i) & 0xff;
        return byteArray.buffer;
    }
    isSecure() {
        return location.protocol === "https:";
    }
    constructor(...args){
        super(...args), this.CLOUD_HOST = "0.peerjs.com", this.CLOUD_PORT = 443, this.chunkedBrowsers = {
            Chrome: 1,
            chrome: 1
        }, this.defaultConfig = $4f4134156c446392$var$DEFAULT_CONFIG, this.browser = (0, $fb63e766cfafaab9$export$25be9502477c137d).getBrowser(), this.browserVersion = (0, $fb63e766cfafaab9$export$25be9502477c137d).getVersion(), this.pack = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2d$js$2d$binarypack$2f$dist$2f$binarypack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pack"], this.unpack = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2d$js$2d$binarypack$2f$dist$2f$binarypack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unpack"], /**
	 * A hash of WebRTC features mapped to booleans that correspond to whether the feature is supported by the current browser.
	 *
	 * :::caution
	 * Only the properties documented here are guaranteed to be present on `util.supports`
	 * :::
	 */ this.supports = function() {
            const supported = {
                browser: (0, $fb63e766cfafaab9$export$25be9502477c137d).isBrowserSupported(),
                webRTC: (0, $fb63e766cfafaab9$export$25be9502477c137d).isWebRTCSupported(),
                audioVideo: false,
                data: false,
                binaryBlob: false,
                reliable: false
            };
            if (!supported.webRTC) return supported;
            let pc;
            try {
                pc = new RTCPeerConnection($4f4134156c446392$var$DEFAULT_CONFIG);
                supported.audioVideo = true;
                let dc;
                try {
                    dc = pc.createDataChannel("_PEERJSTEST", {
                        ordered: true
                    });
                    supported.data = true;
                    supported.reliable = !!dc.ordered;
                    // Binary test
                    try {
                        dc.binaryType = "blob";
                        supported.binaryBlob = !(0, $fb63e766cfafaab9$export$25be9502477c137d).isIOS;
                    } catch (e) {}
                } catch (e) {} finally{
                    if (dc) dc.close();
                }
            } catch (e) {} finally{
                if (pc) pc.close();
            }
            return supported;
        }(), this.validateId = (0, $9a84a32bf0bf36bb$export$f35f128fd59ea256), this.randomToken = (0, $0e5fd1585784c252$export$4e61f672936bec77);
    }
}
const $4f4134156c446392$export$7debb50ef11d5e0b = new $4f4134156c446392$export$f8f26dd395d7e1bd();
const $257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
var $257947e92926277a$export$243e62d78d3b544d = /*#__PURE__*/ function(LogLevel) {
    /**
	 * Prints no logs.
	 */ LogLevel[LogLevel["Disabled"] = 0] = "Disabled";
    /**
	 * Prints only errors.
	 */ LogLevel[LogLevel["Errors"] = 1] = "Errors";
    /**
	 * Prints errors and warnings.
	 */ LogLevel[LogLevel["Warnings"] = 2] = "Warnings";
    /**
	 * Prints all logs.
	 */ LogLevel[LogLevel["All"] = 3] = "All";
    return LogLevel;
}({});
class $257947e92926277a$var$Logger {
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(logLevel) {
        this._logLevel = logLevel;
    }
    log(...args) {
        if (this._logLevel >= 3) this._print(3, ...args);
    }
    warn(...args) {
        if (this._logLevel >= 2) this._print(2, ...args);
    }
    error(...args) {
        if (this._logLevel >= 1) this._print(1, ...args);
    }
    setLogFunction(fn) {
        this._print = fn;
    }
    _print(logLevel, ...rest) {
        const copy = [
            $257947e92926277a$var$LOG_PREFIX,
            ...rest
        ];
        for(const i in copy)if (copy[i] instanceof Error) copy[i] = "(" + copy[i].name + ") " + copy[i].message;
        if (logLevel >= 3) console.log(...copy);
        else if (logLevel >= 2) console.warn("WARNING", ...copy);
        else if (logLevel >= 1) console.error("ERROR", ...copy);
    }
    constructor(){
        this._logLevel = 0;
    }
}
var $257947e92926277a$export$2e2bcd8739ae039 = new $257947e92926277a$var$Logger();
var $c4dcfd1d1ea86647$exports = {};
'use strict';
var $c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty, $c4dcfd1d1ea86647$var$prefix = '~';
/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */ function $c4dcfd1d1ea86647$var$Events() {}
//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
    $c4dcfd1d1ea86647$var$Events.prototype = Object.create(null);
    //
    // This hack is needed because the `__proto__` property is still inherited in
    // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
    //
    if (!new $c4dcfd1d1ea86647$var$Events().__proto__) $c4dcfd1d1ea86647$var$prefix = false;
}
/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */ function $c4dcfd1d1ea86647$var$EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
}
/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */ function $c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once) {
    if (typeof fn !== 'function') throw new TypeError('The listener must be a function');
    var listener = new $c4dcfd1d1ea86647$var$EE(fn, context || emitter, once), evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
    else emitter._events[evt] = [
        emitter._events[evt],
        listener
    ];
    return emitter;
}
/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */ function $c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0) emitter._events = new $c4dcfd1d1ea86647$var$Events();
    else delete emitter._events[evt];
}
/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */ function $c4dcfd1d1ea86647$var$EventEmitter() {
    this._events = new $c4dcfd1d1ea86647$var$Events();
    this._eventsCount = 0;
}
/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0) return names;
    for(name in events = this._events)if ($c4dcfd1d1ea86647$var$has.call(events, name)) names.push($c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
    if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
    return names;
};
/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
    if (!handlers) return [];
    if (handlers.fn) return [
        handlers.fn
    ];
    for(var i = 0, l = handlers.length, ee = new Array(l); i < l; i++)ee[i] = handlers[i].fn;
    return ee;
};
/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, listeners = this._events[evt];
    if (!listeners) return 0;
    if (listeners.fn) return 1;
    return listeners.length;
};
/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt]) return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);
        switch(len){
            case 1:
                return listeners.fn.call(listeners.context), true;
            case 2:
                return listeners.fn.call(listeners.context, a1), true;
            case 3:
                return listeners.fn.call(listeners.context, a1, a2), true;
            case 4:
                return listeners.fn.call(listeners.context, a1, a2, a3), true;
            case 5:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
            case 6:
                return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for(i = 1, args = new Array(len - 1); i < len; i++)args[i - 1] = arguments[i];
        listeners.fn.apply(listeners.context, args);
    } else {
        var length = listeners.length, j;
        for(i = 0; i < length; i++){
            if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);
            switch(len){
                case 1:
                    listeners[i].fn.call(listeners[i].context);
                    break;
                case 2:
                    listeners[i].fn.call(listeners[i].context, a1);
                    break;
                case 3:
                    listeners[i].fn.call(listeners[i].context, a1, a2);
                    break;
                case 4:
                    listeners[i].fn.call(listeners[i].context, a1, a2, a3);
                    break;
                default:
                    if (!args) for(j = 1, args = new Array(len - 1); j < len; j++)args[j - 1] = arguments[j];
                    listeners[i].fn.apply(listeners[i].context, args);
            }
        }
    }
    return true;
};
/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
    return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
};
/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
    return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
};
/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
    if (!this._events[evt]) return this;
    if (!fn) {
        $c4dcfd1d1ea86647$var$clearEvent(this, evt);
        return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
        for(var i = 0, events = [], length = listeners.length; i < length; i++)if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
        //
        // Reset the array, or remove it completely if we have no more listeners.
        //
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    }
    return this;
};
/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
        evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
        if (this._events[evt]) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
    } else {
        this._events = new $c4dcfd1d1ea86647$var$Events();
        this._eventsCount = 0;
    }
    return this;
};
//
// Alias methods names because people roll like that.
//
$c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
$c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
//
// Expose the prefix.
//
$c4dcfd1d1ea86647$var$EventEmitter.prefixed = $c4dcfd1d1ea86647$var$prefix;
//
// Allow `EventEmitter` to be imported as module namespace.
//
$c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $c4dcfd1d1ea86647$var$EventEmitter;
$c4dcfd1d1ea86647$exports = $c4dcfd1d1ea86647$var$EventEmitter;
var $78455e22dea96b8c$exports = {};
$parcel$export($78455e22dea96b8c$exports, "ConnectionType", ()=>$78455e22dea96b8c$export$3157d57b4135e3bc);
$parcel$export($78455e22dea96b8c$exports, "PeerErrorType", ()=>$78455e22dea96b8c$export$9547aaa2e39030ff);
$parcel$export($78455e22dea96b8c$exports, "BaseConnectionErrorType", ()=>$78455e22dea96b8c$export$7974935686149686);
$parcel$export($78455e22dea96b8c$exports, "DataConnectionErrorType", ()=>$78455e22dea96b8c$export$49ae800c114df41d);
$parcel$export($78455e22dea96b8c$exports, "SerializationType", ()=>$78455e22dea96b8c$export$89f507cf986a947);
$parcel$export($78455e22dea96b8c$exports, "SocketEventType", ()=>$78455e22dea96b8c$export$3b5c4a4b6354f023);
$parcel$export($78455e22dea96b8c$exports, "ServerMessageType", ()=>$78455e22dea96b8c$export$adb4a1754da6f10d);
var $78455e22dea96b8c$export$3157d57b4135e3bc = /*#__PURE__*/ function(ConnectionType) {
    ConnectionType["Data"] = "data";
    ConnectionType["Media"] = "media";
    return ConnectionType;
}({});
var $78455e22dea96b8c$export$9547aaa2e39030ff = /*#__PURE__*/ function(PeerErrorType) {
    /**
	 * The client's browser does not support some or all WebRTC features that you are trying to use.
	 */ PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
    /**
	 * You've already disconnected this peer from the server and can no longer make any new connections on it.
	 */ PeerErrorType["Disconnected"] = "disconnected";
    /**
	 * The ID passed into the Peer constructor contains illegal characters.
	 */ PeerErrorType["InvalidID"] = "invalid-id";
    /**
	 * The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
	 */ PeerErrorType["InvalidKey"] = "invalid-key";
    /**
	 * Lost or cannot establish a connection to the signalling server.
	 */ PeerErrorType["Network"] = "network";
    /**
	 * The peer you're trying to connect to does not exist.
	 */ PeerErrorType["PeerUnavailable"] = "peer-unavailable";
    /**
	 * PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
	 */ PeerErrorType["SslUnavailable"] = "ssl-unavailable";
    /**
	 * Unable to reach the server.
	 */ PeerErrorType["ServerError"] = "server-error";
    /**
	 * An error from the underlying socket.
	 */ PeerErrorType["SocketError"] = "socket-error";
    /**
	 * The underlying socket closed unexpectedly.
	 */ PeerErrorType["SocketClosed"] = "socket-closed";
    /**
	 * The ID passed into the Peer constructor is already taken.
	 *
	 * :::caution
	 * This error is not fatal if your peer has open peer-to-peer connections.
	 * This can happen if you attempt to {@apilink Peer.reconnect} a peer that has been disconnected from the server,
	 * but its old ID has now been taken.
	 * :::
	 */ PeerErrorType["UnavailableID"] = "unavailable-id";
    /**
	 * Native WebRTC errors.
	 */ PeerErrorType["WebRTC"] = "webrtc";
    return PeerErrorType;
}({});
var $78455e22dea96b8c$export$7974935686149686 = /*#__PURE__*/ function(BaseConnectionErrorType) {
    BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
    BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
    return BaseConnectionErrorType;
}({});
var $78455e22dea96b8c$export$49ae800c114df41d = /*#__PURE__*/ function(DataConnectionErrorType) {
    DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
    DataConnectionErrorType["MessageToBig"] = "message-too-big";
    return DataConnectionErrorType;
}({});
var $78455e22dea96b8c$export$89f507cf986a947 = /*#__PURE__*/ function(SerializationType) {
    SerializationType["Binary"] = "binary";
    SerializationType["BinaryUTF8"] = "binary-utf8";
    SerializationType["JSON"] = "json";
    SerializationType["None"] = "raw";
    return SerializationType;
}({});
var $78455e22dea96b8c$export$3b5c4a4b6354f023 = /*#__PURE__*/ function(SocketEventType) {
    SocketEventType["Message"] = "message";
    SocketEventType["Disconnected"] = "disconnected";
    SocketEventType["Error"] = "error";
    SocketEventType["Close"] = "close";
    return SocketEventType;
}({});
var $78455e22dea96b8c$export$adb4a1754da6f10d = /*#__PURE__*/ function(ServerMessageType) {
    ServerMessageType["Heartbeat"] = "HEARTBEAT";
    ServerMessageType["Candidate"] = "CANDIDATE";
    ServerMessageType["Offer"] = "OFFER";
    ServerMessageType["Answer"] = "ANSWER";
    ServerMessageType["Open"] = "OPEN";
    ServerMessageType["Error"] = "ERROR";
    ServerMessageType["IdTaken"] = "ID-TAKEN";
    ServerMessageType["InvalidKey"] = "INVALID-KEY";
    ServerMessageType["Leave"] = "LEAVE";
    ServerMessageType["Expire"] = "EXPIRE";
    return ServerMessageType;
}({});
const $520832d44ba058c8$export$83d89fbfd8236492 = "1.5.5";
class $8f5bfa60836d261d$export$4798917dbf149b79 extends (0, $c4dcfd1d1ea86647$exports.EventEmitter) {
    constructor(secure, host, port, path, key, pingInterval = 5000){
        super(), this.pingInterval = pingInterval, this._disconnected = true, this._messagesQueue = [];
        const wsProtocol = secure ? "wss://" : "ws://";
        this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
    }
    start(id, token) {
        this._id = id;
        const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
        if (!!this._socket || !this._disconnected) return;
        this._socket = new WebSocket(wsUrl + "&version=" + (0, $520832d44ba058c8$export$83d89fbfd8236492));
        this._disconnected = false;
        this._socket.onmessage = (event)=>{
            let data;
            try {
                data = JSON.parse(event.data);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Server message received:", data);
            } catch (e) {
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Invalid server message", event.data);
                return;
            }
            this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Message, data);
        };
        this._socket.onclose = (event)=>{
            if (this._disconnected) return;
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Socket closed.", event);
            this._cleanup();
            this._disconnected = true;
            this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected);
        };
        // Take care of the queue of connections if necessary and make sure Peer knows
        // socket is open.
        this._socket.onopen = ()=>{
            if (this._disconnected) return;
            this._sendQueuedMessages();
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Socket open");
            this._scheduleHeartbeat();
        };
    }
    _scheduleHeartbeat() {
        this._wsPingTimer = setTimeout(()=>{
            this._sendHeartbeat();
        }, this.pingInterval);
    }
    _sendHeartbeat() {
        if (!this._wsOpen()) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Cannot send heartbeat, because socket closed`);
            return;
        }
        const message = JSON.stringify({
            type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Heartbeat
        });
        this._socket.send(message);
        this._scheduleHeartbeat();
    }
    /** Is the websocket currently open? */ _wsOpen() {
        return !!this._socket && this._socket.readyState === 1;
    }
    /** Send queued messages. */ _sendQueuedMessages() {
        //Create copy of queue and clear it,
        //because send method push the message back to queue if smth will go wrong
        const copiedQueue = [
            ...this._messagesQueue
        ];
        this._messagesQueue = [];
        for (const message of copiedQueue)this.send(message);
    }
    /** Exposed send for DC & Peer. */ send(data) {
        if (this._disconnected) return;
        // If we didn't get an ID yet, we can't yet send anything so we should queue
        // up these messages.
        if (!this._id) {
            this._messagesQueue.push(data);
            return;
        }
        if (!data.type) {
            this.emit((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Error, "Invalid message");
            return;
        }
        if (!this._wsOpen()) return;
        const message = JSON.stringify(data);
        this._socket.send(message);
    }
    close() {
        if (this._disconnected) return;
        this._cleanup();
        this._disconnected = true;
    }
    _cleanup() {
        if (this._socket) {
            this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
            this._socket.close();
            this._socket = undefined;
        }
        clearTimeout(this._wsPingTimer);
    }
}
class $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a {
    constructor(connection){
        this.connection = connection;
    }
    /** Returns a PeerConnection object set up correctly (for data, media). */ startConnection(options) {
        const peerConnection = this._startPeerConnection();
        // Set the connection's PC.
        this.connection.peerConnection = peerConnection;
        if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media && options._stream) this._addTracksToConnection(options._stream, peerConnection);
        // What do we need to do now?
        if (options.originator) {
            const dataConnection = this.connection;
            const config = {
                ordered: !!options.reliable
            };
            const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
            dataConnection._initializeDataChannel(dataChannel);
            this._makeOffer();
        } else this.handleSDP("OFFER", options.sdp);
    }
    /** Start a PC. */ _startPeerConnection() {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Creating RTCPeerConnection.");
        const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
        this._setupListeners(peerConnection);
        return peerConnection;
    }
    /** Set up various WebRTC listeners. */ _setupListeners(peerConnection) {
        const peerId = this.connection.peer;
        const connectionId = this.connection.connectionId;
        const connectionType = this.connection.type;
        const provider = this.connection.provider;
        // ICE CANDIDATES.
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for ICE candidates.");
        peerConnection.onicecandidate = (evt)=>{
            if (!evt.candidate || !evt.candidate.candidate) return;
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Received ICE candidates for ${peerId}:`, evt.candidate);
            provider.socket.send({
                type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate,
                payload: {
                    candidate: evt.candidate,
                    type: connectionType,
                    connectionId: connectionId
                },
                dst: peerId
            });
        };
        peerConnection.oniceconnectionstatechange = ()=>{
            switch(peerConnection.iceConnectionState){
                case "failed":
                    (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is failed, closing connections to " + peerId);
                    this.connection.emitError((0, $78455e22dea96b8c$export$7974935686149686).NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
                    this.connection.close();
                    break;
                case "closed":
                    (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState is closed, closing connections to " + peerId);
                    this.connection.emitError((0, $78455e22dea96b8c$export$7974935686149686).ConnectionClosed, "Connection to " + peerId + " closed.");
                    this.connection.close();
                    break;
                case "disconnected":
                    (0, $257947e92926277a$export$2e2bcd8739ae039).log("iceConnectionState changed to disconnected on the connection with " + peerId);
                    break;
                case "completed":
                    peerConnection.onicecandidate = ()=>{};
                    break;
            }
            this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
        };
        // DATACONNECTION.
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for data channel");
        // Fired between offer and answer, so options should already be saved
        // in the options hash.
        peerConnection.ondatachannel = (evt)=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Received data channel");
            const dataChannel = evt.channel;
            const connection = provider.getConnection(peerId, connectionId);
            connection._initializeDataChannel(dataChannel);
        };
        // MEDIACONNECTION.
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Listening for remote stream");
        peerConnection.ontrack = (evt)=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Received remote stream");
            const stream = evt.streams[0];
            const connection = provider.getConnection(peerId, connectionId);
            if (connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
                const mediaConnection = connection;
                this._addStreamToMediaConnection(stream, mediaConnection);
            }
        };
    }
    cleanup() {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Cleaning up PeerConnection to " + this.connection.peer);
        const peerConnection = this.connection.peerConnection;
        if (!peerConnection) return;
        this.connection.peerConnection = null;
        //unsubscribe from all PeerConnection's events
        peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = ()=>{};
        const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
        let dataChannelNotClosed = false;
        const dataChannel = this.connection.dataChannel;
        if (dataChannel) dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
        if (peerConnectionNotClosed || dataChannelNotClosed) peerConnection.close();
    }
    async _makeOffer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
            const offer = await peerConnection.createOffer(this.connection.options.constraints);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created offer.");
            if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
            try {
                await peerConnection.setLocalDescription(offer);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Set localDescription:", offer, `for:${this.connection.peer}`);
                let payload = {
                    sdp: offer,
                    type: this.connection.type,
                    connectionId: this.connection.connectionId,
                    metadata: this.connection.metadata
                };
                if (this.connection.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
                    const dataConnection = this.connection;
                    payload = {
                        ...payload,
                        label: dataConnection.label,
                        reliable: dataConnection.reliable,
                        serialization: dataConnection.serialization
                    };
                }
                provider.socket.send({
                    type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer,
                    payload: payload,
                    dst: this.connection.peer
                });
            } catch (err) {
                // TODO: investigate why _makeOffer is being called from the answer
                if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
                    provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
                    (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
                }
            }
        } catch (err_1) {
            provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to createOffer, ", err_1);
        }
    }
    async _makeAnswer() {
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        try {
            const answer = await peerConnection.createAnswer();
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Created answer.");
            if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
            try {
                await peerConnection.setLocalDescription(answer);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
                provider.socket.send({
                    type: (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer,
                    payload: {
                        sdp: answer,
                        type: this.connection.type,
                        connectionId: this.connection.connectionId
                    },
                    dst: this.connection.peer
                });
            } catch (err) {
                provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
                (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setLocalDescription, ", err);
            }
        } catch (err_1) {
            provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err_1);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to create answer, ", err_1);
        }
    }
    /** Handle an SDP. */ async handleSDP(type, sdp) {
        sdp = new RTCSessionDescription(sdp);
        const peerConnection = this.connection.peerConnection;
        const provider = this.connection.provider;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Setting remote description", sdp);
        const self = this;
        try {
            await peerConnection.setRemoteDescription(sdp);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Set remoteDescription:${type} for:${this.connection.peer}`);
            if (type === "OFFER") await self._makeAnswer();
        } catch (err) {
            provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to setRemoteDescription, ", err);
        }
    }
    /** Handle a candidate. */ async handleCandidate(ice) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`handleCandidate:`, ice);
        try {
            await this.connection.peerConnection.addIceCandidate(ice);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Added ICE candidate for:${this.connection.peer}`);
        } catch (err) {
            this.connection.provider.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).WebRTC, err);
            (0, $257947e92926277a$export$2e2bcd8739ae039).log("Failed to handleCandidate, ", err);
        }
    }
    _addTracksToConnection(stream, peerConnection) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add tracks from stream ${stream.id} to peer connection`);
        if (!peerConnection.addTrack) return (0, $257947e92926277a$export$2e2bcd8739ae039).error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
        stream.getTracks().forEach((track)=>{
            peerConnection.addTrack(track, stream);
        });
    }
    _addStreamToMediaConnection(stream, mediaConnection) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
        mediaConnection.addStream(stream);
    }
}
class $23779d1881157a18$export$6a678e589c8a4542 extends (0, $c4dcfd1d1ea86647$exports.EventEmitter) {
    /**
	 * Emits a typed error message.
	 *
	 * @internal
	 */ emitError(type, err) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error:", err);
        // @ts-ignore
        this.emit("error", new $23779d1881157a18$export$98871882f492de82(`${type}`, err));
    }
}
class $23779d1881157a18$export$98871882f492de82 extends Error {
    /**
	 * @internal
	 */ constructor(type, err){
        if (typeof err === "string") super(err);
        else {
            super();
            Object.assign(this, err);
        }
        this.type = type;
    }
}
class $5045192fc6d387ba$export$23a2a68283c24d80 extends (0, $23779d1881157a18$export$6a678e589c8a4542) {
    /**
	 * Whether the media connection is active (e.g. your call has been answered).
	 * You can check this if you want to set a maximum wait time for a one-sided call.
	 */ get open() {
        return this._open;
    }
    constructor(/**
		 * The ID of the peer on the other end of this connection.
		 */ peer, provider, options){
        super(), this.peer = peer, this.provider = provider, this.options = options, this._open = false;
        this.metadata = options.metadata;
    }
}
class $5c1d08c7c57da9a3$export$4a84e95a2324ac29 extends (0, $5045192fc6d387ba$export$23a2a68283c24d80) {
    static #_ = this.ID_PREFIX = "mc_";
    /**
	 * For media connections, this is always 'media'.
	 */ get type() {
        return (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media;
    }
    get localStream() {
        return this._localStream;
    }
    get remoteStream() {
        return this._remoteStream;
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this._localStream = this.options._stream;
        this.connectionId = this.options.connectionId || $5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + (0, $4f4134156c446392$export$7debb50ef11d5e0b).randomToken();
        this._negotiator = new (0, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
        if (this._localStream) this._negotiator.startConnection({
            _stream: this._localStream,
            originator: true
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = ()=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
            this.emit("willCloseOnRemote");
        };
        this.dataChannel.onclose = ()=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
            this.close();
        };
    }
    addStream(remoteStream) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log("Receiving stream", remoteStream);
        this._remoteStream = remoteStream;
        super.emit("stream", remoteStream); // Should we call this `open`?
    }
    /**
	 * @internal
	 */ handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        switch(message.type){
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
                // Forward to negotiator
                this._negotiator.handleSDP(type, payload.sdp);
                this._open = true;
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
                this._negotiator.handleCandidate(payload.candidate);
                break;
            default:
                (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Unrecognized message type:${type} from peer:${this.peer}`);
                break;
        }
    }
    /**
     * When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
     * `answer` on the media connection provided by the callback to accept the call
     * and optionally send your own media stream.

     *
     * @param stream A WebRTC media stream.
     * @param options
     * @returns
     */ answer(stream, options = {}) {
        if (this._localStream) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
            return;
        }
        this._localStream = stream;
        if (options && options.sdpTransform) this.options.sdpTransform = options.sdpTransform;
        this._negotiator.startConnection({
            ...this.options._payload,
            _stream: stream
        });
        // Retrieve lost messages stored because PeerConnection not set up.
        const messages = this.provider._getMessages(this.connectionId);
        for (const message of messages)this.handleMessage(message);
        this._open = true;
    }
    /**
	 * Exposed functionality for users.
	 */ /**
	 * Closes the media connection.
	 */ close() {
        if (this._negotiator) {
            this._negotiator.cleanup();
            this._negotiator = null;
        }
        this._localStream = null;
        this._remoteStream = null;
        if (this.provider) {
            this.provider._removeConnection(this);
            this.provider = null;
        }
        if (this.options && this.options._stream) this.options._stream = null;
        if (!this.open) return;
        this._open = false;
        super.emit("close");
    }
}
class $abf266641927cd89$export$2c4e825dc9120f87 {
    constructor(_options){
        this._options = _options;
    }
    _buildRequest(method) {
        const protocol = this._options.secure ? "https" : "http";
        const { host: host, port: port, path: path, key: key } = this._options;
        const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
        // TODO: Why timestamp, why random?
        url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
        url.searchParams.set("version", (0, $520832d44ba058c8$export$83d89fbfd8236492));
        return fetch(url.href, {
            referrerPolicy: this._options.referrerPolicy
        });
    }
    /** Get a unique ID from the server via XHR and initialize with it. */ async retrieveId() {
        try {
            const response = await this._buildRequest("id");
            if (response.status !== 200) throw new Error(`Error. Status:${response.status}`);
            return response.text();
        } catch (error) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving ID", error);
            let pathError = "";
            if (this._options.path === "/" && this._options.host !== (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
            throw new Error("Could not get an ID from the server." + pathError);
        }
    }
    /** @deprecated */ async listAllPeers() {
        try {
            const response = await this._buildRequest("peers");
            if (response.status !== 200) {
                if (response.status === 401) {
                    let helpfulError = "";
                    if (this._options.host === (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
                    else helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
                    throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
                }
                throw new Error(`Error. Status:${response.status}`);
            }
            return response.json();
        } catch (error) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).error("Error retrieving list peers", error);
            throw new Error("Could not get list peers from the server." + error);
        }
    }
}
class $6366c4ca161bc297$export$d365f7ad9d7df9c9 extends (0, $5045192fc6d387ba$export$23a2a68283c24d80) {
    static #_ = this.ID_PREFIX = "dc_";
    static #_2 = this.MAX_BUFFERED_AMOUNT = 8388608;
    get type() {
        return (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data;
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options);
        this.connectionId = this.options.connectionId || $6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + (0, $0e5fd1585784c252$export$4e61f672936bec77)();
        this.label = this.options.label || this.connectionId;
        this.reliable = !!this.options.reliable;
        this._negotiator = new (0, $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a)(this);
        this._negotiator.startConnection(this.options._payload || {
            originator: true,
            reliable: this.reliable
        });
    }
    /** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
        this.dataChannel = dc;
        this.dataChannel.onopen = ()=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc connection success`);
            this._open = true;
            this.emit("open");
        };
        this.dataChannel.onmessage = (e)=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc onmessage:`, e.data);
        // this._handleDataMessage(e);
        };
        this.dataChannel.onclose = ()=>{
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} dc closed for:`, this.peer);
            this.close();
        };
    }
    /**
	 * Exposed functionality for users.
	 */ /** Allows user to close connection. */ close(options) {
        if (options?.flush) {
            this.send({
                __peerData: {
                    type: "close"
                }
            });
            return;
        }
        if (this._negotiator) {
            this._negotiator.cleanup();
            this._negotiator = null;
        }
        if (this.provider) {
            this.provider._removeConnection(this);
            this.provider = null;
        }
        if (this.dataChannel) {
            this.dataChannel.onopen = null;
            this.dataChannel.onmessage = null;
            this.dataChannel.onclose = null;
            this.dataChannel = null;
        }
        if (!this.open) return;
        this._open = false;
        super.emit("close");
    }
    /** Allows user to send data. */ send(data, chunked = false) {
        if (!this.open) {
            this.emitError((0, $78455e22dea96b8c$export$49ae800c114df41d).NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
            return;
        }
        return this._send(data, chunked);
    }
    async handleMessage(message) {
        const payload = message.payload;
        switch(message.type){
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Answer:
                await this._negotiator.handleSDP(message.type, payload.sdp);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Candidate:
                await this._negotiator.handleCandidate(payload.candidate);
                break;
            default:
                (0, $257947e92926277a$export$2e2bcd8739ae039).warn("Unrecognized message type:", message.type, "from peer:", this.peer);
                break;
        }
    }
}
class $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b extends (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9) {
    get bufferSize() {
        return this._bufferSize;
    }
    _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.addEventListener("message", (e)=>this._handleDataMessage(e));
    }
    _bufferedSend(msg) {
        if (this._buffering || !this._trySend(msg)) {
            this._buffer.push(msg);
            this._bufferSize = this._buffer.length;
        }
    }
    // Returns true if the send succeeds.
    _trySend(msg) {
        if (!this.open) return false;
        if (this.dataChannel.bufferedAmount > (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT) {
            this._buffering = true;
            setTimeout(()=>{
                this._buffering = false;
                this._tryBuffer();
            }, 50);
            return false;
        }
        try {
            this.dataChannel.send(msg);
        } catch (e) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
            this._buffering = true;
            this.close();
            return false;
        }
        return true;
    }
    // Try to send the first message in the buffer.
    _tryBuffer() {
        if (!this.open) return;
        if (this._buffer.length === 0) return;
        const msg = this._buffer[0];
        if (this._trySend(msg)) {
            this._buffer.shift();
            this._bufferSize = this._buffer.length;
            this._tryBuffer();
        }
    }
    close(options) {
        if (options?.flush) {
            this.send({
                __peerData: {
                    type: "close"
                }
            });
            return;
        }
        this._buffer = [];
        this._bufferSize = 0;
        super.close();
    }
    constructor(...args){
        super(...args), this._buffer = [], this._bufferSize = 0, this._buffering = false;
    }
}
class $9fcfddb3ae148f88$export$f0a5a64d5bb37108 extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    close(options) {
        super.close(options);
        this._chunkedData = {};
    }
    constructor(peerId, provider, options){
        super(peerId, provider, options), this.chunker = new (0, $fcbcc7538a6776d5$export$f1c5f4c9cb95390b)(), this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).Binary, this._chunkedData = {};
    }
    // Handles a DataChannel message.
    _handleDataMessage({ data: data }) {
        const deserializedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2d$js$2d$binarypack$2f$dist$2f$binarypack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unpack"])(data);
        // PeerJS specific message
        const peerData = deserializedData["__peerData"];
        if (peerData) {
            if (peerData.type === "close") {
                this.close();
                return;
            }
            // Chunked data -- piece things back together.
            // @ts-ignore
            this._handleChunk(deserializedData);
            return;
        }
        this.emit("data", deserializedData);
    }
    _handleChunk(data) {
        const id = data.__peerData;
        const chunkInfo = this._chunkedData[id] || {
            data: [],
            count: 0,
            total: data.total
        };
        chunkInfo.data[data.n] = new Uint8Array(data.data);
        chunkInfo.count++;
        this._chunkedData[id] = chunkInfo;
        if (chunkInfo.total === chunkInfo.count) {
            // Clean up before making the recursive call to `_handleDataMessage`.
            delete this._chunkedData[id];
            // We've received all the chunks--time to construct the complete data.
            // const data = new Blob(chunkInfo.data);
            const data = (0, $fcbcc7538a6776d5$export$52c89ebcdc4f53f2)(chunkInfo.data);
            this._handleDataMessage({
                data: data
            });
        }
    }
    _send(data, chunked) {
        const blob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$peerjs$2d$js$2d$binarypack$2f$dist$2f$binarypack$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pack"])(data);
        if (blob instanceof Promise) return this._send_blob(blob);
        if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
            this._sendChunks(blob);
            return;
        }
        this._bufferedSend(blob);
    }
    async _send_blob(blobPromise) {
        const blob = await blobPromise;
        if (blob.byteLength > this.chunker.chunkedMTU) {
            this._sendChunks(blob);
            return;
        }
        this._bufferedSend(blob);
    }
    _sendChunks(blob) {
        const blobs = this.chunker.chunk(blob);
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
        for (const blob of blobs)this.send(blob, true);
    }
}
class $bbaee3f15f714663$export$6f88fe47d32c9c94 extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    _handleDataMessage({ data: data }) {
        super.emit("data", data);
    }
    _send(data, _chunked) {
        this._bufferedSend(data);
    }
    constructor(...args){
        super(...args), this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).None;
    }
}
class $817f931e3f9096cf$export$48880ac635f47186 extends (0, $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b) {
    // Handles a DataChannel message.
    _handleDataMessage({ data: data }) {
        const deserializedData = this.parse(this.decoder.decode(data));
        // PeerJS specific message
        const peerData = deserializedData["__peerData"];
        if (peerData && peerData.type === "close") {
            this.close();
            return;
        }
        this.emit("data", deserializedData);
    }
    _send(data, _chunked) {
        const encodedData = this.encoder.encode(this.stringify(data));
        if (encodedData.byteLength >= (0, $4f4134156c446392$export$7debb50ef11d5e0b).chunkedMTU) {
            this.emitError((0, $78455e22dea96b8c$export$49ae800c114df41d).MessageToBig, "Message too big for JSON channel");
            return;
        }
        this._bufferedSend(encodedData);
    }
    constructor(...args){
        super(...args), this.serialization = (0, $78455e22dea96b8c$export$89f507cf986a947).JSON, this.encoder = new TextEncoder(), this.decoder = new TextDecoder(), this.stringify = JSON.stringify, this.parse = JSON.parse;
    }
}
class $416260bce337df90$var$PeerOptions {
}
class $416260bce337df90$export$ecd1fc136c422448 extends (0, $23779d1881157a18$export$6a678e589c8a4542) {
    static #_ = this.DEFAULT_KEY = "peerjs";
    /**
	 * The brokering ID of this peer
	 *
	 * If no ID was specified in {@apilink Peer | the constructor},
	 * this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
	 */ get id() {
        return this._id;
    }
    get options() {
        return this._options;
    }
    get open() {
        return this._open;
    }
    /**
	 * @internal
	 */ get socket() {
        return this._socket;
    }
    /**
	 * A hash of all connections associated with this peer, keyed by the remote peer's ID.
	 * @deprecated
	 * Return type will change from Object to Map<string,[]>
	 */ get connections() {
        const plainConnections = Object.create(null);
        for (const [k, v] of this._connections)plainConnections[k] = v;
        return plainConnections;
    }
    /**
	 * true if this peer and all of its connections can no longer be used.
	 */ get destroyed() {
        return this._destroyed;
    }
    /**
	 * false if there is an active connection to the PeerServer.
	 */ get disconnected() {
        return this._disconnected;
    }
    constructor(id, options){
        super(), this._serializers = {
            raw: (0, $bbaee3f15f714663$export$6f88fe47d32c9c94),
            json: (0, $817f931e3f9096cf$export$48880ac635f47186),
            binary: (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108),
            "binary-utf8": (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108),
            default: (0, $9fcfddb3ae148f88$export$f0a5a64d5bb37108)
        }, this._id = null, this._lastServerId = null, this._destroyed = false // Connections have been killed
        , this._disconnected = false // Connection to PeerServer killed but P2P connections still active
        , this._open = false // Sockets and such are not yet open.
        , this._connections = new Map() // All connections for this peer.
        , this._lostMessages = new Map() // src => [list of messages]
        ;
        let userId;
        // Deal with overloading
        if (id && id.constructor == Object) options = id;
        else if (id) userId = id.toString();
        // Configurize options
        options = {
            debug: 0,
            host: (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST,
            port: (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_PORT,
            path: "/",
            key: $416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY,
            token: (0, $4f4134156c446392$export$7debb50ef11d5e0b).randomToken(),
            config: (0, $4f4134156c446392$export$7debb50ef11d5e0b).defaultConfig,
            referrerPolicy: "strict-origin-when-cross-origin",
            serializers: {},
            ...options
        };
        this._options = options;
        this._serializers = {
            ...this._serializers,
            ...this.options.serializers
        };
        // Detect relative URL host.
        if (this._options.host === "/") this._options.host = window.location.hostname;
        // Set path correctly.
        if (this._options.path) {
            if (this._options.path[0] !== "/") this._options.path = "/" + this._options.path;
            if (this._options.path[this._options.path.length - 1] !== "/") this._options.path += "/";
        }
        // Set whether we use SSL to same as current host
        if (this._options.secure === undefined && this._options.host !== (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = (0, $4f4134156c446392$export$7debb50ef11d5e0b).isSecure();
        else if (this._options.host == (0, $4f4134156c446392$export$7debb50ef11d5e0b).CLOUD_HOST) this._options.secure = true;
        // Set a custom log function if present
        if (this._options.logFunction) (0, $257947e92926277a$export$2e2bcd8739ae039).setLogFunction(this._options.logFunction);
        (0, $257947e92926277a$export$2e2bcd8739ae039).logLevel = this._options.debug || 0;
        this._api = new (0, $abf266641927cd89$export$2c4e825dc9120f87)(options);
        this._socket = this._createServerConnection();
        // Sanity checks
        // Ensure WebRTC supported
        if (!(0, $4f4134156c446392$export$7debb50ef11d5e0b).supports.audioVideo && !(0, $4f4134156c446392$export$7debb50ef11d5e0b).supports.data) {
            this._delayedAbort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).BrowserIncompatible, "The current browser does not support WebRTC");
            return;
        }
        // Ensure alphanumeric id
        if (!!userId && !(0, $4f4134156c446392$export$7debb50ef11d5e0b).validateId(userId)) {
            this._delayedAbort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).InvalidID, `ID "${userId}" is invalid`);
            return;
        }
        if (userId) this._initialize(userId);
        else this._api.retrieveId().then((id)=>this._initialize(id)).catch((error)=>this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
    }
    _createServerConnection() {
        const socket = new (0, $8f5bfa60836d261d$export$4798917dbf149b79)(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Message, (data)=>{
            this._handleMessage(data);
        });
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Error, (error)=>{
            this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).SocketError, error);
        });
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Disconnected, ()=>{
            if (this.disconnected) return;
            this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Network, "Lost connection to server.");
            this.disconnect();
        });
        socket.on((0, $78455e22dea96b8c$export$3b5c4a4b6354f023).Close, ()=>{
            if (this.disconnected) return;
            this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).SocketClosed, "Underlying socket is already closed.");
        });
        return socket;
    }
    /** Initialize a connection with the server. */ _initialize(id) {
        this._id = id;
        this.socket.start(id, this._options.token);
    }
    /** Handles messages from the server. */ _handleMessage(message) {
        const type = message.type;
        const payload = message.payload;
        const peerId = message.src;
        switch(type){
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Open:
                this._lastServerId = this.id;
                this._open = true;
                this.emit("open", this.id);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Error:
                this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, payload.msg);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).IdTaken:
                this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).UnavailableID, `ID "${this.id}" is taken`);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).InvalidKey:
                this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).InvalidKey, `API KEY "${this._options.key}" is invalid`);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Leave:
                (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Received leave message from ${peerId}`);
                this._cleanupPeer(peerId);
                this._connections.delete(peerId);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Expire:
                this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).PeerUnavailable, `Could not connect to peer ${peerId}`);
                break;
            case (0, $78455e22dea96b8c$export$adb4a1754da6f10d).Offer:
                {
                    // we should consider switching this to CALL/CONNECT, but this is the least breaking option.
                    const connectionId = payload.connectionId;
                    let connection = this.getConnection(peerId, connectionId);
                    if (connection) {
                        connection.close();
                        (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Offer received for existing Connection ID:${connectionId}`);
                    }
                    // Create a new connection.
                    if (payload.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Media) {
                        const mediaConnection = new (0, $5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peerId, this, {
                            connectionId: connectionId,
                            _payload: payload,
                            metadata: payload.metadata
                        });
                        connection = mediaConnection;
                        this._addConnection(peerId, connection);
                        this.emit("call", mediaConnection);
                    } else if (payload.type === (0, $78455e22dea96b8c$export$3157d57b4135e3bc).Data) {
                        const dataConnection = new this._serializers[payload.serialization](peerId, this, {
                            connectionId: connectionId,
                            _payload: payload,
                            metadata: payload.metadata,
                            label: payload.label,
                            serialization: payload.serialization,
                            reliable: payload.reliable
                        });
                        connection = dataConnection;
                        this._addConnection(peerId, connection);
                        this.emit("connection", dataConnection);
                    } else {
                        (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`Received malformed connection type:${payload.type}`);
                        return;
                    }
                    // Find messages.
                    const messages = this._getMessages(connectionId);
                    for (const message of messages)connection.handleMessage(message);
                    break;
                }
            default:
                {
                    if (!payload) {
                        (0, $257947e92926277a$export$2e2bcd8739ae039).warn(`You received a malformed message from ${peerId} of type ${type}`);
                        return;
                    }
                    const connectionId = payload.connectionId;
                    const connection = this.getConnection(peerId, connectionId);
                    if (connection && connection.peerConnection) connection.handleMessage(message);
                    else if (connectionId) this._storeMessage(connectionId, message);
                    else (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You received an unrecognized message:", message);
                    break;
                }
        }
    }
    /** Stores messages without a set up connection, to be claimed later. */ _storeMessage(connectionId, message) {
        if (!this._lostMessages.has(connectionId)) this._lostMessages.set(connectionId, []);
        this._lostMessages.get(connectionId).push(message);
    }
    /**
	 * Retrieve messages from lost message store
	 * @internal
	 */ //TODO Change it to private
    _getMessages(connectionId) {
        const messages = this._lostMessages.get(connectionId);
        if (messages) {
            this._lostMessages.delete(connectionId);
            return messages;
        }
        return [];
    }
    /**
	 * Connects to the remote peer specified by id and returns a data connection.
	 * @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
	 * @param options for specifying details about Peer Connection
	 */ connect(peer, options = {}) {
        options = {
            serialization: "default",
            ...options
        };
        if (this.disconnected) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
            this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            return;
        }
        const dataConnection = new this._serializers[options.serialization](peer, this, options);
        this._addConnection(peer, dataConnection);
        return dataConnection;
    }
    /**
	 * Calls the remote peer specified by id and returns a media connection.
	 * @param peer The brokering ID of the remote peer (their peer.id).
	 * @param stream The caller's media stream
	 * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
	 */ call(peer, stream, options = {}) {
        if (this.disconnected) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
            this.emitError((0, $78455e22dea96b8c$export$9547aaa2e39030ff).Disconnected, "Cannot connect to new Peer after disconnecting from server.");
            return;
        }
        if (!stream) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
            return;
        }
        const mediaConnection = new (0, $5c1d08c7c57da9a3$export$4a84e95a2324ac29)(peer, this, {
            ...options,
            _stream: stream
        });
        this._addConnection(peer, mediaConnection);
        return mediaConnection;
    }
    /** Add a data/media connection to this peer. */ _addConnection(peerId, connection) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
        if (!this._connections.has(peerId)) this._connections.set(peerId, []);
        this._connections.get(peerId).push(connection);
    }
    //TODO should be private
    _removeConnection(connection) {
        const connections = this._connections.get(connection.peer);
        if (connections) {
            const index = connections.indexOf(connection);
            if (index !== -1) connections.splice(index, 1);
        }
        //remove from lost messages
        this._lostMessages.delete(connection.connectionId);
    }
    /** Retrieve a data/media connection for this peer. */ getConnection(peerId, connectionId) {
        const connections = this._connections.get(peerId);
        if (!connections) return null;
        for (const connection of connections){
            if (connection.connectionId === connectionId) return connection;
        }
        return null;
    }
    _delayedAbort(type, message) {
        setTimeout(()=>{
            this._abort(type, message);
        }, 0);
    }
    /**
	 * Emits an error message and destroys the Peer.
	 * The Peer is not destroyed if it's in a disconnected state, in which case
	 * it retains its disconnected state and its existing connections.
	 */ _abort(type, message) {
        (0, $257947e92926277a$export$2e2bcd8739ae039).error("Aborting!");
        this.emitError(type, message);
        if (!this._lastServerId) this.destroy();
        else this.disconnect();
    }
    /**
	 * Destroys the Peer: closes all active connections as well as the connection
	 * to the server.
	 *
	 * :::caution
	 * This cannot be undone; the respective peer object will no longer be able
	 * to create or receive any connections, its ID will be forfeited on the server,
	 * and all of its data and media connections will be closed.
	 * :::
	 */ destroy() {
        if (this.destroyed) return;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Destroy peer with ID:${this.id}`);
        this.disconnect();
        this._cleanup();
        this._destroyed = true;
        this.emit("close");
    }
    /** Disconnects every connection on this peer. */ _cleanup() {
        for (const peerId of this._connections.keys()){
            this._cleanupPeer(peerId);
            this._connections.delete(peerId);
        }
        this.socket.removeAllListeners();
    }
    /** Closes all connections to this peer. */ _cleanupPeer(peerId) {
        const connections = this._connections.get(peerId);
        if (!connections) return;
        for (const connection of connections)connection.close();
    }
    /**
	 * Disconnects the Peer's connection to the PeerServer. Does not close any
	 *  active connections.
	 * Warning: The peer can no longer create or accept connections after being
	 *  disconnected. It also cannot reconnect to the server.
	 */ disconnect() {
        if (this.disconnected) return;
        const currentId = this.id;
        (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Disconnect peer with ID:${currentId}`);
        this._disconnected = true;
        this._open = false;
        this.socket.close();
        this._lastServerId = currentId;
        this._id = null;
        this.emit("disconnected", currentId);
    }
    /** Attempts to reconnect with the same ID.
	 *
	 * Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
	 * Destroyed peers cannot be reconnected.
	 * If the connection fails (as an example, if the peer's old ID is now taken),
	 * the peer's existing connections will not close, but any associated errors events will fire.
	 */ reconnect() {
        if (this.disconnected && !this.destroyed) {
            (0, $257947e92926277a$export$2e2bcd8739ae039).log(`Attempting reconnection to server with ID ${this._lastServerId}`);
            this._disconnected = false;
            this._initialize(this._lastServerId);
        } else if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
        else if (!this.disconnected && !this.open) (0, $257947e92926277a$export$2e2bcd8739ae039).error("In a hurry? We're still trying to make the initial connection!");
        else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
    }
    /**
	 * Get a list of available peer IDs. If you're running your own server, you'll
	 * want to set allow_discovery: true in the PeerServer options. If you're using
	 * the cloud server, email team@peerjs.com to get the functionality enabled for
	 * your key.
	 */ listAllPeers(cb = (_)=>{}) {
        this._api.listAllPeers().then((peers)=>cb(peers)).catch((error)=>this._abort((0, $78455e22dea96b8c$export$9547aaa2e39030ff).ServerError, error));
    }
}
class $20dbe68149d7aad9$export$72aa44612e2200cd extends (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9) {
    constructor(peerId, provider, options){
        super(peerId, provider, {
            ...options,
            reliable: true
        }), this._CHUNK_SIZE = 32768, this._splitStream = new TransformStream({
            transform: (chunk, controller)=>{
                for(let split = 0; split < chunk.length; split += this._CHUNK_SIZE)controller.enqueue(chunk.subarray(split, split + this._CHUNK_SIZE));
            }
        }), this._rawSendStream = new WritableStream({
            write: async (chunk, controller)=>{
                const openEvent = new Promise((resolve)=>this.dataChannel.addEventListener("bufferedamountlow", resolve, {
                        once: true
                    }));
                // if we can send the chunk now, send it
                // if not, we wait until at least half of the sending buffer is free again
                await (this.dataChannel.bufferedAmount <= (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT - chunk.byteLength || openEvent);
                // TODO: what can go wrong here?
                try {
                    this.dataChannel.send(chunk);
                } catch (e) {
                    (0, $257947e92926277a$export$2e2bcd8739ae039).error(`DC#:${this.connectionId} Error when sending:`, e);
                    controller.error(e);
                    this.close();
                }
            }
        }), this.writer = this._splitStream.writable.getWriter(), this._rawReadStream = new ReadableStream({
            start: (controller)=>{
                this.once("open", ()=>{
                    this.dataChannel.addEventListener("message", (e)=>{
                        controller.enqueue(e.data);
                    });
                });
            }
        });
        this._splitStream.readable.pipeTo(this._rawSendStream);
    }
    _initializeDataChannel(dc) {
        super._initializeDataChannel(dc);
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.bufferedAmountLowThreshold = (0, $6366c4ca161bc297$export$d365f7ad9d7df9c9).MAX_BUFFERED_AMOUNT / 2;
    }
}
class $6e39230ab36396ad$export$80f5de1a66c4d624 extends (0, $20dbe68149d7aad9$export$72aa44612e2200cd) {
    constructor(peerId, provider, options){
        super(peerId, provider, options), this.serialization = "MsgPack", this._encoder = new (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$Encoder$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Encoder"])();
        (async ()=>{
            for await (const msg of (0, __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f40$msgpack$2f$msgpack$2f$dist$2e$es5$2b$esm$2f$decodeAsync$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeMultiStream"])(this._rawReadStream)){
                // @ts-ignore
                if (msg.__peerData?.type === "close") {
                    this.close();
                    return;
                }
                this.emit("data", msg);
            }
        })();
    }
    _send(data) {
        return this.writer.write(this._encoder.encode(data));
    }
}
class $1e0aff16be2c328e$export$d72c7bf8eef50853 extends (0, $416260bce337df90$export$ecd1fc136c422448) {
    constructor(...args){
        super(...args), this._serializers = {
            MsgPack: $6e39230ab36396ad$export$80f5de1a66c4d624,
            default: (0, $6e39230ab36396ad$export$80f5de1a66c4d624)
        };
    }
}
var $dd0187d7f28e386f$export$2e2bcd8739ae039 = (0, $416260bce337df90$export$ecd1fc136c422448);
;
 //# sourceMappingURL=bundler.mjs.map
}),
"[project]/family-messenger/node_modules/qrcode.react/lib/esm/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QRCodeCanvas",
    ()=>QRCodeCanvas,
    "QRCodeSVG",
    ()=>QRCodeSVG
]);
// src/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/family-messenger/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __spreadValues = (a, b)=>{
    for(var prop in b || (b = {}))if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)){
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
};
var __objRest = (source, exclude)=>{
    var target = {};
    for(var prop in source)if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols) for (var prop of __getOwnPropSymbols(source)){
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
    }
    return target;
};
;
// src/third-party/qrcodegen/index.ts
/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */ var qrcodegen;
((qrcodegen2)=>{
    const _QrCode = class _QrCode {
        /*-- Constructor (low level) and fields --*/ // Creates a new QR Code with the given version number,
        // error correction level, data codeword bytes, and mask number.
        // This is a low-level API that most users should not use directly.
        // A mid-level API is the encodeSegments() function.
        constructor(version, errorCorrectionLevel, dataCodewords, msk){
            this.version = version;
            this.errorCorrectionLevel = errorCorrectionLevel;
            // The modules of this QR Code (false = light, true = dark).
            // Immutable after constructor finishes. Accessed through getModule().
            this.modules = [];
            // Indicates function modules that are not subjected to masking. Discarded when constructor finishes.
            this.isFunction = [];
            if (version < _QrCode.MIN_VERSION || version > _QrCode.MAX_VERSION) throw new RangeError("Version value out of range");
            if (msk < -1 || msk > 7) throw new RangeError("Mask value out of range");
            this.size = version * 4 + 17;
            let row = [];
            for(let i = 0; i < this.size; i++)row.push(false);
            for(let i = 0; i < this.size; i++){
                this.modules.push(row.slice());
                this.isFunction.push(row.slice());
            }
            this.drawFunctionPatterns();
            const allCodewords = this.addEccAndInterleave(dataCodewords);
            this.drawCodewords(allCodewords);
            if (msk == -1) {
                let minPenalty = 1e9;
                for(let i = 0; i < 8; i++){
                    this.applyMask(i);
                    this.drawFormatBits(i);
                    const penalty = this.getPenaltyScore();
                    if (penalty < minPenalty) {
                        msk = i;
                        minPenalty = penalty;
                    }
                    this.applyMask(i);
                }
            }
            assert(0 <= msk && msk <= 7);
            this.mask = msk;
            this.applyMask(msk);
            this.drawFormatBits(msk);
            this.isFunction = [];
        }
        /*-- Static factory functions (high level) --*/ // Returns a QR Code representing the given Unicode text string at the given error correction level.
        // As a conservative upper bound, this function is guaranteed to succeed for strings that have 738 or fewer
        // Unicode code points (not UTF-16 code units) if the low error correction level is used. The smallest possible
        // QR Code version is automatically chosen for the output. The ECC level of the result may be higher than the
        // ecl argument if it can be done without increasing the version.
        static encodeText(text, ecl) {
            const segs = qrcodegen2.QrSegment.makeSegments(text);
            return _QrCode.encodeSegments(segs, ecl);
        }
        // Returns a QR Code representing the given binary data at the given error correction level.
        // This function always encodes using the binary segment mode, not any text mode. The maximum number of
        // bytes allowed is 2953. The smallest possible QR Code version is automatically chosen for the output.
        // The ECC level of the result may be higher than the ecl argument if it can be done without increasing the version.
        static encodeBinary(data, ecl) {
            const seg = qrcodegen2.QrSegment.makeBytes(data);
            return _QrCode.encodeSegments([
                seg
            ], ecl);
        }
        /*-- Static factory functions (mid level) --*/ // Returns a QR Code representing the given segments with the given encoding parameters.
        // The smallest possible QR Code version within the given range is automatically
        // chosen for the output. Iff boostEcl is true, then the ECC level of the result
        // may be higher than the ecl argument if it can be done without increasing the
        // version. The mask number is either between 0 to 7 (inclusive) to force that
        // mask, or -1 to automatically choose an appropriate mask (which may be slow).
        // This function allows the user to create a custom sequence of segments that switches
        // between modes (such as alphanumeric and byte) to encode text in less space.
        // This is a mid-level API; the high-level API is encodeText() and encodeBinary().
        static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
            if (!(_QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode.MAX_VERSION) || mask < -1 || mask > 7) throw new RangeError("Invalid value");
            let version;
            let dataUsedBits;
            for(version = minVersion;; version++){
                const dataCapacityBits2 = _QrCode.getNumDataCodewords(version, ecl) * 8;
                const usedBits = QrSegment.getTotalBits(segs, version);
                if (usedBits <= dataCapacityBits2) {
                    dataUsedBits = usedBits;
                    break;
                }
                if (version >= maxVersion) throw new RangeError("Data too long");
            }
            for (const newEcl of [
                _QrCode.Ecc.MEDIUM,
                _QrCode.Ecc.QUARTILE,
                _QrCode.Ecc.HIGH
            ]){
                if (boostEcl && dataUsedBits <= _QrCode.getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
            }
            let bb = [];
            for (const seg of segs){
                appendBits(seg.mode.modeBits, 4, bb);
                appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
                for (const b of seg.getData())bb.push(b);
            }
            assert(bb.length == dataUsedBits);
            const dataCapacityBits = _QrCode.getNumDataCodewords(version, ecl) * 8;
            assert(bb.length <= dataCapacityBits);
            appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
            appendBits(0, (8 - bb.length % 8) % 8, bb);
            assert(bb.length % 8 == 0);
            for(let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17)appendBits(padByte, 8, bb);
            let dataCodewords = [];
            while(dataCodewords.length * 8 < bb.length)dataCodewords.push(0);
            bb.forEach((b, i)=>dataCodewords[i >>> 3] |= b << 7 - (i & 7));
            return new _QrCode(version, ecl, dataCodewords, mask);
        }
        /*-- Accessor methods --*/ // Returns the color of the module (pixel) at the given coordinates, which is false
        // for light or true for dark. The top left corner has the coordinates (x=0, y=0).
        // If the given coordinates are out of bounds, then false (light) is returned.
        getModule(x, y) {
            return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
        }
        // Modified to expose modules for easy access
        getModules() {
            return this.modules;
        }
        /*-- Private helper methods for constructor: Drawing function modules --*/ // Reads this object's version field, and draws and marks all function modules.
        drawFunctionPatterns() {
            for(let i = 0; i < this.size; i++){
                this.setFunctionModule(6, i, i % 2 == 0);
                this.setFunctionModule(i, 6, i % 2 == 0);
            }
            this.drawFinderPattern(3, 3);
            this.drawFinderPattern(this.size - 4, 3);
            this.drawFinderPattern(3, this.size - 4);
            const alignPatPos = this.getAlignmentPatternPositions();
            const numAlign = alignPatPos.length;
            for(let i = 0; i < numAlign; i++){
                for(let j = 0; j < numAlign; j++){
                    if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0)) this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
                }
            }
            this.drawFormatBits(0);
            this.drawVersion();
        }
        // Draws two copies of the format bits (with its own error correction code)
        // based on the given mask and this object's error correction level field.
        drawFormatBits(mask) {
            const data = this.errorCorrectionLevel.formatBits << 3 | mask;
            let rem = data;
            for(let i = 0; i < 10; i++)rem = rem << 1 ^ (rem >>> 9) * 1335;
            const bits = (data << 10 | rem) ^ 21522;
            assert(bits >>> 15 == 0);
            for(let i = 0; i <= 5; i++)this.setFunctionModule(8, i, getBit(bits, i));
            this.setFunctionModule(8, 7, getBit(bits, 6));
            this.setFunctionModule(8, 8, getBit(bits, 7));
            this.setFunctionModule(7, 8, getBit(bits, 8));
            for(let i = 9; i < 15; i++)this.setFunctionModule(14 - i, 8, getBit(bits, i));
            for(let i = 0; i < 8; i++)this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
            for(let i = 8; i < 15; i++)this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
            this.setFunctionModule(8, this.size - 8, true);
        }
        // Draws two copies of the version bits (with its own error correction code),
        // based on this object's version field, iff 7 <= version <= 40.
        drawVersion() {
            if (this.version < 7) return;
            let rem = this.version;
            for(let i = 0; i < 12; i++)rem = rem << 1 ^ (rem >>> 11) * 7973;
            const bits = this.version << 12 | rem;
            assert(bits >>> 18 == 0);
            for(let i = 0; i < 18; i++){
                const color = getBit(bits, i);
                const a = this.size - 11 + i % 3;
                const b = Math.floor(i / 3);
                this.setFunctionModule(a, b, color);
                this.setFunctionModule(b, a, color);
            }
        }
        // Draws a 9*9 finder pattern including the border separator,
        // with the center module at (x, y). Modules can be out of bounds.
        drawFinderPattern(x, y) {
            for(let dy = -4; dy <= 4; dy++){
                for(let dx = -4; dx <= 4; dx++){
                    const dist = Math.max(Math.abs(dx), Math.abs(dy));
                    const xx = x + dx;
                    const yy = y + dy;
                    if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size) this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
                }
            }
        }
        // Draws a 5*5 alignment pattern, with the center module
        // at (x, y). All modules must be in bounds.
        drawAlignmentPattern(x, y) {
            for(let dy = -2; dy <= 2; dy++){
                for(let dx = -2; dx <= 2; dx++)this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
            }
        }
        // Sets the color of a module and marks it as a function module.
        // Only used by the constructor. Coordinates must be in bounds.
        setFunctionModule(x, y, isDark) {
            this.modules[y][x] = isDark;
            this.isFunction[y][x] = true;
        }
        /*-- Private helper methods for constructor: Codewords and masking --*/ // Returns a new byte string representing the given data with the appropriate error correction
        // codewords appended to it, based on this object's version and error correction level.
        addEccAndInterleave(data) {
            const ver = this.version;
            const ecl = this.errorCorrectionLevel;
            if (data.length != _QrCode.getNumDataCodewords(ver, ecl)) throw new RangeError("Invalid argument");
            const numBlocks = _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
            const blockEccLen = _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
            const rawCodewords = Math.floor(_QrCode.getNumRawDataModules(ver) / 8);
            const numShortBlocks = numBlocks - rawCodewords % numBlocks;
            const shortBlockLen = Math.floor(rawCodewords / numBlocks);
            let blocks = [];
            const rsDiv = _QrCode.reedSolomonComputeDivisor(blockEccLen);
            for(let i = 0, k = 0; i < numBlocks; i++){
                let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
                k += dat.length;
                const ecc = _QrCode.reedSolomonComputeRemainder(dat, rsDiv);
                if (i < numShortBlocks) dat.push(0);
                blocks.push(dat.concat(ecc));
            }
            let result = [];
            for(let i = 0; i < blocks[0].length; i++){
                blocks.forEach((block, j)=>{
                    if (i != shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]);
                });
            }
            assert(result.length == rawCodewords);
            return result;
        }
        // Draws the given sequence of 8-bit codewords (data and error correction) onto the entire
        // data area of this QR Code. Function modules need to be marked off before this is called.
        drawCodewords(data) {
            if (data.length != Math.floor(_QrCode.getNumRawDataModules(this.version) / 8)) throw new RangeError("Invalid argument");
            let i = 0;
            for(let right = this.size - 1; right >= 1; right -= 2){
                if (right == 6) right = 5;
                for(let vert = 0; vert < this.size; vert++){
                    for(let j = 0; j < 2; j++){
                        const x = right - j;
                        const upward = (right + 1 & 2) == 0;
                        const y = upward ? this.size - 1 - vert : vert;
                        if (!this.isFunction[y][x] && i < data.length * 8) {
                            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
                            i++;
                        }
                    }
                }
            }
            assert(i == data.length * 8);
        }
        // XORs the codeword modules in this QR Code with the given mask pattern.
        // The function modules must be marked and the codeword bits must be drawn
        // before masking. Due to the arithmetic of XOR, calling applyMask() with
        // the same mask value a second time will undo the mask. A final well-formed
        // QR Code needs exactly one (not zero, two, etc.) mask applied.
        applyMask(mask) {
            if (mask < 0 || mask > 7) throw new RangeError("Mask value out of range");
            for(let y = 0; y < this.size; y++){
                for(let x = 0; x < this.size; x++){
                    let invert;
                    switch(mask){
                        case 0:
                            invert = (x + y) % 2 == 0;
                            break;
                        case 1:
                            invert = y % 2 == 0;
                            break;
                        case 2:
                            invert = x % 3 == 0;
                            break;
                        case 3:
                            invert = (x + y) % 3 == 0;
                            break;
                        case 4:
                            invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
                            break;
                        case 5:
                            invert = x * y % 2 + x * y % 3 == 0;
                            break;
                        case 6:
                            invert = (x * y % 2 + x * y % 3) % 2 == 0;
                            break;
                        case 7:
                            invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
                            break;
                        default:
                            throw new Error("Unreachable");
                    }
                    if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
                }
            }
        }
        // Calculates and returns the penalty score based on state of this QR Code's current modules.
        // This is used by the automatic mask choice algorithm to find the mask pattern that yields the lowest score.
        getPenaltyScore() {
            let result = 0;
            for(let y = 0; y < this.size; y++){
                let runColor = false;
                let runX = 0;
                let runHistory = [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ];
                for(let x = 0; x < this.size; x++){
                    if (this.modules[y][x] == runColor) {
                        runX++;
                        if (runX == 5) result += _QrCode.PENALTY_N1;
                        else if (runX > 5) result++;
                    } else {
                        this.finderPenaltyAddHistory(runX, runHistory);
                        if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
                        runColor = this.modules[y][x];
                        runX = 1;
                    }
                }
                result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode.PENALTY_N3;
            }
            for(let x = 0; x < this.size; x++){
                let runColor = false;
                let runY = 0;
                let runHistory = [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ];
                for(let y = 0; y < this.size; y++){
                    if (this.modules[y][x] == runColor) {
                        runY++;
                        if (runY == 5) result += _QrCode.PENALTY_N1;
                        else if (runY > 5) result++;
                    } else {
                        this.finderPenaltyAddHistory(runY, runHistory);
                        if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
                        runColor = this.modules[y][x];
                        runY = 1;
                    }
                }
                result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode.PENALTY_N3;
            }
            for(let y = 0; y < this.size - 1; y++){
                for(let x = 0; x < this.size - 1; x++){
                    const color = this.modules[y][x];
                    if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1]) result += _QrCode.PENALTY_N2;
                }
            }
            let dark = 0;
            for (const row of this.modules)dark = row.reduce((sum, color)=>sum + (color ? 1 : 0), dark);
            const total = this.size * this.size;
            const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
            assert(0 <= k && k <= 9);
            result += k * _QrCode.PENALTY_N4;
            assert(0 <= result && result <= 2568888);
            return result;
        }
        /*-- Private helper functions --*/ // Returns an ascending list of positions of alignment patterns for this version number.
        // Each position is in the range [0,177), and are used on both the x and y axes.
        // This could be implemented as lookup table of 40 variable-length lists of integers.
        getAlignmentPatternPositions() {
            if (this.version == 1) return [];
            else {
                const numAlign = Math.floor(this.version / 7) + 2;
                const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
                let result = [
                    6
                ];
                for(let pos = this.size - 7; result.length < numAlign; pos -= step)result.splice(1, 0, pos);
                return result;
            }
        }
        // Returns the number of data bits that can be stored in a QR Code of the given version number, after
        // all function modules are excluded. This includes remainder bits, so it might not be a multiple of 8.
        // The result is in the range [208, 29648]. This could be implemented as a 40-entry lookup table.
        static getNumRawDataModules(ver) {
            if (ver < _QrCode.MIN_VERSION || ver > _QrCode.MAX_VERSION) throw new RangeError("Version number out of range");
            let result = (16 * ver + 128) * ver + 64;
            if (ver >= 2) {
                const numAlign = Math.floor(ver / 7) + 2;
                result -= (25 * numAlign - 10) * numAlign - 55;
                if (ver >= 7) result -= 36;
            }
            assert(208 <= result && result <= 29648);
            return result;
        }
        // Returns the number of 8-bit data (i.e. not error correction) codewords contained in any
        // QR Code of the given version number and error correction level, with remainder bits discarded.
        // This stateless pure function could be implemented as a (40*4)-cell lookup table.
        static getNumDataCodewords(ver, ecl) {
            return Math.floor(_QrCode.getNumRawDataModules(ver) / 8) - _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
        }
        // Returns a Reed-Solomon ECC generator polynomial for the given degree. This could be
        // implemented as a lookup table over all possible parameter values, instead of as an algorithm.
        static reedSolomonComputeDivisor(degree) {
            if (degree < 1 || degree > 255) throw new RangeError("Degree out of range");
            let result = [];
            for(let i = 0; i < degree - 1; i++)result.push(0);
            result.push(1);
            let root = 1;
            for(let i = 0; i < degree; i++){
                for(let j = 0; j < result.length; j++){
                    result[j] = _QrCode.reedSolomonMultiply(result[j], root);
                    if (j + 1 < result.length) result[j] ^= result[j + 1];
                }
                root = _QrCode.reedSolomonMultiply(root, 2);
            }
            return result;
        }
        // Returns the Reed-Solomon error correction codeword for the given data and divisor polynomials.
        static reedSolomonComputeRemainder(data, divisor) {
            let result = divisor.map((_)=>0);
            for (const b of data){
                const factor = b ^ result.shift();
                result.push(0);
                divisor.forEach((coef, i)=>result[i] ^= _QrCode.reedSolomonMultiply(coef, factor));
            }
            return result;
        }
        // Returns the product of the two given field elements modulo GF(2^8/0x11D). The arguments and result
        // are unsigned 8-bit integers. This could be implemented as a lookup table of 256*256 entries of uint8.
        static reedSolomonMultiply(x, y) {
            if (x >>> 8 != 0 || y >>> 8 != 0) throw new RangeError("Byte out of range");
            let z = 0;
            for(let i = 7; i >= 0; i--){
                z = z << 1 ^ (z >>> 7) * 285;
                z ^= (y >>> i & 1) * x;
            }
            assert(z >>> 8 == 0);
            return z;
        }
        // Can only be called immediately after a light run is added, and
        // returns either 0, 1, or 2. A helper function for getPenaltyScore().
        finderPenaltyCountPatterns(runHistory) {
            const n = runHistory[1];
            assert(n <= this.size * 3);
            const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
            return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
        }
        // Must be called at the end of a line (row or column) of modules. A helper function for getPenaltyScore().
        finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
            if (currentRunColor) {
                this.finderPenaltyAddHistory(currentRunLength, runHistory);
                currentRunLength = 0;
            }
            currentRunLength += this.size;
            this.finderPenaltyAddHistory(currentRunLength, runHistory);
            return this.finderPenaltyCountPatterns(runHistory);
        }
        // Pushes the given value to the front and drops the last value. A helper function for getPenaltyScore().
        finderPenaltyAddHistory(currentRunLength, runHistory) {
            if (runHistory[0] == 0) currentRunLength += this.size;
            runHistory.pop();
            runHistory.unshift(currentRunLength);
        }
    };
    /*-- Constants and tables --*/ // The minimum version number supported in the QR Code Model 2 standard.
    _QrCode.MIN_VERSION = 1;
    // The maximum version number supported in the QR Code Model 2 standard.
    _QrCode.MAX_VERSION = 40;
    // For use in getPenaltyScore(), when evaluating which mask is best.
    _QrCode.PENALTY_N1 = 3;
    _QrCode.PENALTY_N2 = 3;
    _QrCode.PENALTY_N3 = 40;
    _QrCode.PENALTY_N4 = 10;
    _QrCode.ECC_CODEWORDS_PER_BLOCK = [
        // Version: (note that index 0 is for padding, and is set to an illegal value)
        //0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
        [
            -1,
            7,
            10,
            15,
            20,
            26,
            18,
            20,
            24,
            30,
            18,
            20,
            24,
            26,
            30,
            22,
            24,
            28,
            30,
            28,
            28,
            28,
            28,
            30,
            30,
            26,
            28,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30
        ],
        // Low
        [
            -1,
            10,
            16,
            26,
            18,
            24,
            16,
            18,
            22,
            22,
            26,
            30,
            22,
            22,
            24,
            24,
            28,
            28,
            26,
            26,
            26,
            26,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28,
            28
        ],
        // Medium
        [
            -1,
            13,
            22,
            18,
            26,
            18,
            24,
            18,
            22,
            20,
            24,
            28,
            26,
            24,
            20,
            30,
            24,
            28,
            28,
            26,
            30,
            28,
            30,
            30,
            30,
            30,
            28,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30
        ],
        // Quartile
        [
            -1,
            17,
            28,
            22,
            16,
            22,
            28,
            26,
            26,
            24,
            28,
            24,
            28,
            22,
            24,
            24,
            30,
            28,
            28,
            26,
            28,
            30,
            24,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30,
            30
        ]
    ];
    _QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
        // Version: (note that index 0 is for padding, and is set to an illegal value)
        //0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40    Error correction level
        [
            -1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            4,
            4,
            4,
            4,
            4,
            6,
            6,
            6,
            6,
            7,
            8,
            8,
            9,
            9,
            10,
            12,
            12,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            19,
            20,
            21,
            22,
            24,
            25
        ],
        // Low
        [
            -1,
            1,
            1,
            1,
            2,
            2,
            4,
            4,
            4,
            5,
            5,
            5,
            8,
            9,
            9,
            10,
            10,
            11,
            13,
            14,
            16,
            17,
            17,
            18,
            20,
            21,
            23,
            25,
            26,
            28,
            29,
            31,
            33,
            35,
            37,
            38,
            40,
            43,
            45,
            47,
            49
        ],
        // Medium
        [
            -1,
            1,
            1,
            2,
            2,
            4,
            4,
            6,
            6,
            8,
            8,
            8,
            10,
            12,
            16,
            12,
            17,
            16,
            18,
            21,
            20,
            23,
            23,
            25,
            27,
            29,
            34,
            34,
            35,
            38,
            40,
            43,
            45,
            48,
            51,
            53,
            56,
            59,
            62,
            65,
            68
        ],
        // Quartile
        [
            -1,
            1,
            1,
            2,
            4,
            4,
            4,
            5,
            6,
            8,
            8,
            11,
            11,
            16,
            16,
            18,
            16,
            19,
            21,
            25,
            25,
            25,
            34,
            30,
            32,
            35,
            37,
            40,
            42,
            45,
            48,
            51,
            54,
            57,
            60,
            63,
            66,
            70,
            74,
            77,
            81
        ]
    ];
    let QrCode = _QrCode;
    qrcodegen2.QrCode = _QrCode;
    function appendBits(val, len, bb) {
        if (len < 0 || len > 31 || val >>> len != 0) throw new RangeError("Value out of range");
        for(let i = len - 1; i >= 0; i--)bb.push(val >>> i & 1);
    }
    function getBit(x, i) {
        return (x >>> i & 1) != 0;
    }
    function assert(cond) {
        if (!cond) throw new Error("Assertion error");
    }
    const _QrSegment = class _QrSegment {
        /*-- Constructor (low level) and fields --*/ // Creates a new QR Code segment with the given attributes and data.
        // The character count (numChars) must agree with the mode and the bit buffer length,
        // but the constraint isn't checked. The given bit buffer is cloned and stored.
        constructor(mode, numChars, bitData){
            this.mode = mode;
            this.numChars = numChars;
            this.bitData = bitData;
            if (numChars < 0) throw new RangeError("Invalid argument");
            this.bitData = bitData.slice();
        }
        /*-- Static factory functions (mid level) --*/ // Returns a segment representing the given binary data encoded in
        // byte mode. All input byte arrays are acceptable. Any text string
        // can be converted to UTF-8 bytes and encoded as a byte mode segment.
        static makeBytes(data) {
            let bb = [];
            for (const b of data)appendBits(b, 8, bb);
            return new _QrSegment(_QrSegment.Mode.BYTE, data.length, bb);
        }
        // Returns a segment representing the given string of decimal digits encoded in numeric mode.
        static makeNumeric(digits) {
            if (!_QrSegment.isNumeric(digits)) throw new RangeError("String contains non-numeric characters");
            let bb = [];
            for(let i = 0; i < digits.length;){
                const n = Math.min(digits.length - i, 3);
                appendBits(parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
                i += n;
            }
            return new _QrSegment(_QrSegment.Mode.NUMERIC, digits.length, bb);
        }
        // Returns a segment representing the given text string encoded in alphanumeric mode.
        // The characters allowed are: 0 to 9, A to Z (uppercase only), space,
        // dollar, percent, asterisk, plus, hyphen, period, slash, colon.
        static makeAlphanumeric(text) {
            if (!_QrSegment.isAlphanumeric(text)) throw new RangeError("String contains unencodable characters in alphanumeric mode");
            let bb = [];
            let i;
            for(i = 0; i + 2 <= text.length; i += 2){
                let temp = _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
                temp += _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
                appendBits(temp, 11, bb);
            }
            if (i < text.length) appendBits(_QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
            return new _QrSegment(_QrSegment.Mode.ALPHANUMERIC, text.length, bb);
        }
        // Returns a new mutable list of zero or more segments to represent the given Unicode text string.
        // The result may use various segment modes and switch modes to optimize the length of the bit stream.
        static makeSegments(text) {
            if (text == "") return [];
            else if (_QrSegment.isNumeric(text)) return [
                _QrSegment.makeNumeric(text)
            ];
            else if (_QrSegment.isAlphanumeric(text)) return [
                _QrSegment.makeAlphanumeric(text)
            ];
            else return [
                _QrSegment.makeBytes(_QrSegment.toUtf8ByteArray(text))
            ];
        }
        // Returns a segment representing an Extended Channel Interpretation
        // (ECI) designator with the given assignment value.
        static makeEci(assignVal) {
            let bb = [];
            if (assignVal < 0) throw new RangeError("ECI assignment value out of range");
            else if (assignVal < 1 << 7) appendBits(assignVal, 8, bb);
            else if (assignVal < 1 << 14) {
                appendBits(2, 2, bb);
                appendBits(assignVal, 14, bb);
            } else if (assignVal < 1e6) {
                appendBits(6, 3, bb);
                appendBits(assignVal, 21, bb);
            } else throw new RangeError("ECI assignment value out of range");
            return new _QrSegment(_QrSegment.Mode.ECI, 0, bb);
        }
        // Tests whether the given string can be encoded as a segment in numeric mode.
        // A string is encodable iff each character is in the range 0 to 9.
        static isNumeric(text) {
            return _QrSegment.NUMERIC_REGEX.test(text);
        }
        // Tests whether the given string can be encoded as a segment in alphanumeric mode.
        // A string is encodable iff each character is in the following set: 0 to 9, A to Z
        // (uppercase only), space, dollar, percent, asterisk, plus, hyphen, period, slash, colon.
        static isAlphanumeric(text) {
            return _QrSegment.ALPHANUMERIC_REGEX.test(text);
        }
        /*-- Methods --*/ // Returns a new copy of the data bits of this segment.
        getData() {
            return this.bitData.slice();
        }
        // (Package-private) Calculates and returns the number of bits needed to encode the given segments at
        // the given version. The result is infinity if a segment has too many characters to fit its length field.
        static getTotalBits(segs, version) {
            let result = 0;
            for (const seg of segs){
                const ccbits = seg.mode.numCharCountBits(version);
                if (seg.numChars >= 1 << ccbits) return Infinity;
                result += 4 + ccbits + seg.bitData.length;
            }
            return result;
        }
        // Returns a new array of bytes representing the given string encoded in UTF-8.
        static toUtf8ByteArray(str) {
            str = encodeURI(str);
            let result = [];
            for(let i = 0; i < str.length; i++){
                if (str.charAt(i) != "%") result.push(str.charCodeAt(i));
                else {
                    result.push(parseInt(str.substring(i + 1, i + 3), 16));
                    i += 2;
                }
            }
            return result;
        }
    };
    /*-- Constants --*/ // Describes precisely all strings that are encodable in numeric mode.
    _QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
    // Describes precisely all strings that are encodable in alphanumeric mode.
    _QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
    // The set of all legal characters in alphanumeric mode,
    // where each character value maps to the index in the string.
    _QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
    let QrSegment = _QrSegment;
    qrcodegen2.QrSegment = _QrSegment;
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2)=>{
    let QrCode;
    ((QrCode2)=>{
        const _Ecc = class _Ecc {
            // The QR Code can tolerate about 30% erroneous codewords
            /*-- Constructor and fields --*/ constructor(ordinal, formatBits){
                this.ordinal = ordinal;
                this.formatBits = formatBits;
            }
        };
        /*-- Constants --*/ _Ecc.LOW = new _Ecc(0, 1);
        // The QR Code can tolerate about  7% erroneous codewords
        _Ecc.MEDIUM = new _Ecc(1, 0);
        // The QR Code can tolerate about 15% erroneous codewords
        _Ecc.QUARTILE = new _Ecc(2, 3);
        // The QR Code can tolerate about 25% erroneous codewords
        _Ecc.HIGH = new _Ecc(3, 2);
        let Ecc = _Ecc;
        QrCode2.Ecc = _Ecc;
    })(QrCode = qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
})(qrcodegen || (qrcodegen = {}));
((qrcodegen2)=>{
    let QrSegment;
    ((QrSegment2)=>{
        const _Mode = class _Mode {
            /*-- Constructor and fields --*/ constructor(modeBits, numBitsCharCount){
                this.modeBits = modeBits;
                this.numBitsCharCount = numBitsCharCount;
            }
            /*-- Method --*/ // (Package-private) Returns the bit width of the character count field for a segment in
            // this mode in a QR Code at the given version number. The result is in the range [0, 16].
            numCharCountBits(ver) {
                return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
            }
        };
        /*-- Constants --*/ _Mode.NUMERIC = new _Mode(1, [
            10,
            12,
            14
        ]);
        _Mode.ALPHANUMERIC = new _Mode(2, [
            9,
            11,
            13
        ]);
        _Mode.BYTE = new _Mode(4, [
            8,
            16,
            16
        ]);
        _Mode.KANJI = new _Mode(8, [
            8,
            10,
            12
        ]);
        _Mode.ECI = new _Mode(7, [
            0,
            0,
            0
        ]);
        let Mode = _Mode;
        QrSegment2.Mode = _Mode;
    })(QrSegment = qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
})(qrcodegen || (qrcodegen = {}));
var qrcodegen_default = qrcodegen;
// src/index.tsx
/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */ var ERROR_LEVEL_MAP = {
    L: qrcodegen_default.QrCode.Ecc.LOW,
    M: qrcodegen_default.QrCode.Ecc.MEDIUM,
    Q: qrcodegen_default.QrCode.Ecc.QUARTILE,
    H: qrcodegen_default.QrCode.Ecc.HIGH
};
var DEFAULT_SIZE = 128;
var DEFAULT_LEVEL = "L";
var DEFAULT_BGCOLOR = "#FFFFFF";
var DEFAULT_FGCOLOR = "#000000";
var DEFAULT_INCLUDEMARGIN = false;
var DEFAULT_MINVERSION = 1;
var SPEC_MARGIN_SIZE = 4;
var DEFAULT_MARGIN_SIZE = 0;
var DEFAULT_IMG_SCALE = 0.1;
function generatePath(modules, margin = 0) {
    const ops = [];
    modules.forEach(function(row, y) {
        let start = null;
        row.forEach(function(cell, x) {
            if (!cell && start !== null) {
                ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
                start = null;
                return;
            }
            if (x === row.length - 1) {
                if (!cell) {
                    return;
                }
                if (start === null) {
                    ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
                } else {
                    ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
                }
                return;
            }
            if (cell && start === null) {
                start = x;
            }
        });
    });
    return ops.join("");
}
function excavateModules(modules, excavation) {
    return modules.slice().map((row, y)=>{
        if (y < excavation.y || y >= excavation.y + excavation.h) {
            return row;
        }
        return row.map((cell, x)=>{
            if (x < excavation.x || x >= excavation.x + excavation.w) {
                return cell;
            }
            return false;
        });
    });
}
function getImageSettings(cells, size, margin, imageSettings) {
    if (imageSettings == null) {
        return null;
    }
    const numCells = cells.length + margin * 2;
    const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
    const scale = numCells / size;
    const w = (imageSettings.width || defaultSize) * scale;
    const h = (imageSettings.height || defaultSize) * scale;
    const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
    const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
    const opacity = imageSettings.opacity == null ? 1 : imageSettings.opacity;
    let excavation = null;
    if (imageSettings.excavate) {
        let floorX = Math.floor(x);
        let floorY = Math.floor(y);
        let ceilW = Math.ceil(w + x - floorX);
        let ceilH = Math.ceil(h + y - floorY);
        excavation = {
            x: floorX,
            y: floorY,
            w: ceilW,
            h: ceilH
        };
    }
    const crossOrigin = imageSettings.crossOrigin;
    return {
        x,
        y,
        h,
        w,
        excavation,
        opacity,
        crossOrigin
    };
}
function getMarginSize(includeMargin, marginSize) {
    if (marginSize != null) {
        return Math.max(Math.floor(marginSize), 0);
    }
    return includeMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
}
function useQRCode({ value, level, minVersion, includeMargin, marginSize, imageSettings, size, boostLevel }) {
    let qrcode = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "useQRCode.useMemo[qrcode]": ()=>{
            const values = Array.isArray(value) ? value : [
                value
            ];
            const segments = values.reduce({
                "useQRCode.useMemo[qrcode].segments": (accum, v)=>{
                    accum.push(...qrcodegen_default.QrSegment.makeSegments(v));
                    return accum;
                }
            }["useQRCode.useMemo[qrcode].segments"], []);
            return qrcodegen_default.QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion, void 0, void 0, boostLevel);
        }
    }["useQRCode.useMemo[qrcode]"], [
        value,
        level,
        minVersion,
        boostLevel
    ]);
    const { cells, margin, numCells, calculatedImageSettings } = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "useQRCode.useMemo": ()=>{
            let cells2 = qrcode.getModules();
            const margin2 = getMarginSize(includeMargin, marginSize);
            const numCells2 = cells2.length + margin2 * 2;
            const calculatedImageSettings2 = getImageSettings(cells2, size, margin2, imageSettings);
            return {
                cells: cells2,
                margin: margin2,
                numCells: numCells2,
                calculatedImageSettings: calculatedImageSettings2
            };
        }
    }["useQRCode.useMemo"], [
        qrcode,
        size,
        imageSettings,
        includeMargin,
        marginSize
    ]);
    return {
        qrcode,
        margin,
        cells,
        numCells,
        calculatedImageSettings
    };
}
var SUPPORTS_PATH2D = function() {
    try {
        new Path2D().addPath(new Path2D());
    } catch (e) {
        return false;
    }
    return true;
}();
var QRCodeCanvas = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(function QRCodeCanvas2(props, forwardedRef) {
    const _a = props, { value, size = DEFAULT_SIZE, level = DEFAULT_LEVEL, bgColor = DEFAULT_BGCOLOR, fgColor = DEFAULT_FGCOLOR, includeMargin = DEFAULT_INCLUDEMARGIN, minVersion = DEFAULT_MINVERSION, boostLevel, marginSize, imageSettings } = _a, extraProps = __objRest(_a, [
        "value",
        "size",
        "level",
        "bgColor",
        "fgColor",
        "includeMargin",
        "minVersion",
        "boostLevel",
        "marginSize",
        "imageSettings"
    ]);
    const _b = extraProps, { style } = _b, otherProps = __objRest(_b, [
        "style"
    ]);
    const imgSrc = imageSettings == null ? void 0 : imageSettings.src;
    const _canvas = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const _image = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
    const setCanvasRef = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useCallback({
        "QRCodeCanvas.QRCodeCanvas2.useCallback[setCanvasRef]": (node)=>{
            _canvas.current = node;
            if (typeof forwardedRef === "function") {
                forwardedRef(node);
            } else if (forwardedRef) {
                forwardedRef.current = node;
            }
        }
    }["QRCodeCanvas.QRCodeCanvas2.useCallback[setCanvasRef]"], [
        forwardedRef
    ]);
    const [isImgLoaded, setIsImageLoaded] = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
        value,
        level,
        minVersion,
        boostLevel,
        includeMargin,
        marginSize,
        imageSettings,
        size
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "QRCodeCanvas.QRCodeCanvas2.useEffect": ()=>{
            if (_canvas.current != null) {
                const canvas = _canvas.current;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    return;
                }
                let cellsToDraw = cells;
                const image = _image.current;
                const haveImageToRender = calculatedImageSettings != null && image !== null && image.complete && image.naturalHeight !== 0 && image.naturalWidth !== 0;
                if (haveImageToRender) {
                    if (calculatedImageSettings.excavation != null) {
                        cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
                    }
                }
                const pixelRatio = window.devicePixelRatio || 1;
                canvas.height = canvas.width = size * pixelRatio;
                const scale = size / numCells * pixelRatio;
                ctx.scale(scale, scale);
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, numCells, numCells);
                ctx.fillStyle = fgColor;
                if (SUPPORTS_PATH2D) {
                    ctx.fill(new Path2D(generatePath(cellsToDraw, margin)));
                } else {
                    cells.forEach({
                        "QRCodeCanvas.QRCodeCanvas2.useEffect": function(row, rdx) {
                            row.forEach({
                                "QRCodeCanvas.QRCodeCanvas2.useEffect": function(cell, cdx) {
                                    if (cell) {
                                        ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
                                    }
                                }
                            }["QRCodeCanvas.QRCodeCanvas2.useEffect"]);
                        }
                    }["QRCodeCanvas.QRCodeCanvas2.useEffect"]);
                }
                if (calculatedImageSettings) {
                    ctx.globalAlpha = calculatedImageSettings.opacity;
                }
                if (haveImageToRender) {
                    ctx.drawImage(image, calculatedImageSettings.x + margin, calculatedImageSettings.y + margin, calculatedImageSettings.w, calculatedImageSettings.h);
                }
            }
        }
    }["QRCodeCanvas.QRCodeCanvas2.useEffect"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "QRCodeCanvas.QRCodeCanvas2.useEffect": ()=>{
            setIsImageLoaded(false);
        }
    }["QRCodeCanvas.QRCodeCanvas2.useEffect"], [
        imgSrc
    ]);
    const canvasStyle = __spreadValues({
        height: size,
        width: size
    }, style);
    let img = null;
    if (imgSrc != null) {
        img = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("img", {
            src: imgSrc,
            key: imgSrc,
            style: {
                display: "none"
            },
            onLoad: ()=>{
                setIsImageLoaded(true);
            },
            ref: _image,
            crossOrigin: calculatedImageSettings == null ? void 0 : calculatedImageSettings.crossOrigin
        });
    }
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("canvas", __spreadValues({
        style: canvasStyle,
        height: size,
        width: size,
        ref: setCanvasRef,
        role: "img"
    }, otherProps)), img);
});
QRCodeCanvas.displayName = "QRCodeCanvas";
var QRCodeSVG = __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(function QRCodeSVG2(props, forwardedRef) {
    const _a = props, { value, size = DEFAULT_SIZE, level = DEFAULT_LEVEL, bgColor = DEFAULT_BGCOLOR, fgColor = DEFAULT_FGCOLOR, includeMargin = DEFAULT_INCLUDEMARGIN, minVersion = DEFAULT_MINVERSION, boostLevel, title, marginSize, imageSettings } = _a, otherProps = __objRest(_a, [
        "value",
        "size",
        "level",
        "bgColor",
        "fgColor",
        "includeMargin",
        "minVersion",
        "boostLevel",
        "title",
        "marginSize",
        "imageSettings"
    ]);
    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
        value,
        level,
        minVersion,
        boostLevel,
        includeMargin,
        marginSize,
        imageSettings,
        size
    });
    let cellsToDraw = cells;
    let image = null;
    if (imageSettings != null && calculatedImageSettings != null) {
        if (calculatedImageSettings.excavation != null) {
            cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
        }
        image = /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("image", {
            href: imageSettings.src,
            height: calculatedImageSettings.h,
            width: calculatedImageSettings.w,
            x: calculatedImageSettings.x + margin,
            y: calculatedImageSettings.y + margin,
            preserveAspectRatio: "none",
            opacity: calculatedImageSettings.opacity,
            crossOrigin: calculatedImageSettings.crossOrigin
        });
    }
    const fgPath = generatePath(cellsToDraw, margin);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("svg", __spreadValues({
        height: size,
        width: size,
        viewBox: `0 0 ${numCells} ${numCells}`,
        ref: forwardedRef,
        role: "img"
    }, otherProps), !!title && /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("title", null, title), /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("path", {
        fill: bgColor,
        d: `M0,0 h${numCells}v${numCells}H0z`,
        shapeRendering: "crispEdges"
    }), /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$family$2d$messenger$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("path", {
        fill: fgColor,
        d: fgPath,
        shapeRendering: "crispEdges"
    }), image);
});
QRCodeSVG.displayName = "QRCodeSVG";
;
}),
]);

//# sourceMappingURL=79815_05824b65._.js.map