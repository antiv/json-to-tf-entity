
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var self="https://api.tempo.io/core/3/worklogs/12600";var tempoWorklogId=126;var jiraWorklogId=10100;var issue={self:"https://my-cloud-instance.atlassian.net/rest/api/2/issue/DUM-1",key:"DUM-1"};var timeSpentSeconds=3600;var billableSeconds=5200;var startDate="2017-02-06";var startTime="20:06:00";var description="Investigating a problem with our external database system";var createdAt="2017-02-06T16:41:41Z";var updatedAt="2017-02-06T16:41:41Z";var author={self:"https://my-cloud-instance.atlassian.net/rest/api/2/user?accountId=1111aaaa2222bbbb3333cccc",accountId:"1111aaaa2222bbbb3333cccc",displayName:"John Brown"};var attributes={self:"https://api.tempo.io/core/3/worklogs/126/work-attribute-values",values:[{key:"_DELIVERED_",value:true},{key:"_EXTERNALREF_",value:"EXT-44556"},{key:"_COLOR_",value:"red"}]};var test = {self:self,tempoWorklogId:tempoWorklogId,jiraWorklogId:jiraWorklogId,issue:issue,timeSpentSeconds:timeSpentSeconds,billableSeconds:billableSeconds,startDate:startDate,startTime:startTime,description:description,createdAt:createdAt,updatedAt:updatedAt,author:author,attributes:attributes};

    var jsonTest = /*#__PURE__*/Object.freeze({
        __proto__: null,
        self: self,
        tempoWorklogId: tempoWorklogId,
        jiraWorklogId: jiraWorklogId,
        issue: issue,
        timeSpentSeconds: timeSpentSeconds,
        billableSeconds: billableSeconds,
        startDate: startDate,
        startTime: startTime,
        description: description,
        createdAt: createdAt,
        updatedAt: updatedAt,
        author: author,
        attributes: attributes,
        'default': test
    });

    const template = `// ============================================================================
// BRAINTRIBE TECHNOLOGY GMBH - www.braintribe.com
// Copyright BRAINTRIBE TECHNOLOGY GMBH, Austria, 2002-2018 - All Rights Reserved
// It is strictly forbidden to copy, modify, distribute or use this code without written permission
// To this file the Braintribe License Agreement applies.
// ============================================================================

package {modelPackage};

import com.braintribe.model.generic.GenericEntity;
import com.braintribe.model.generic.reflection.EntityType;
import com.braintribe.model.generic.reflection.EntityTypes;

public interface {entityName} extends GenericEntity {

	EntityType<{entityName}> T = EntityTypes.T({entityName}.class);
	
	/* Constants for each property name. */
	{constants}
	
	{code}
}`;

    const createEntity = (modelPackage, entityName, props) => {
        console.log({ props });
        let result = {};
        const constants = props
            .map((e) => {
            return 'String ' + e.name + ' = "' + e.name + '";';
        })
            .join('\n\t');
        const code = props
            .map((e) => {
            return (getCapital(e.type == 'object' ? e.name : e.type) +
                ' get' +
                getCapital(e.name) +
                '();\n\tvoid' +
                ' set' +
                getCapital(e.name) +
                '(' +
                getCapital(e.type == 'object' ? e.name : e.type) +
                ' ' +
                e.name +
                ');');
        })
            .join('\n\n\t');
        result[entityName] = template
            .replaceAll('{modelPackage}', modelPackage)
            .replaceAll('{entityName}', entityName)
            .replaceAll('{constants}', constants)
            .replaceAll('{code}', code);
        props.forEach((e) => {
            if (e.type == 'object') {
                const tmp = createEntity(modelPackage, getCapital(e.name), getChild(e.val));
                result = Object.assign(Object.assign({}, result), tmp);
            }
            else if (e.type.startsWith('list<')) {
                const tmp = createEntity(modelPackage, getCapital(e.name), getChild(e.val[0]));
                result = Object.assign(Object.assign({}, result), tmp);
            }
        });
        // console.log({ result });
        return result;
    };
    function getChild(val) {
        return Object.entries(val).map((n) => {
            return {
                name: n[0],
                type: Array.isArray(n[1]) ? `list<${getCapital(n[0])}>` : typeof n[1],
                val: n[1],
            };
        });
    }
    function getCapital(type) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    /* src/widgets/Tabs.svelte generated by Svelte v3.46.4 */

    const file$1 = "src/widgets/Tabs.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:2) {#each items as item}
    function create_each_block_1(ctx) {
    	let li;
    	let span;
    	let t0_value = /*item*/ ctx[3].label + "";
    	let t0;
    	let t1;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-6hef0q");
    			add_location(span, file$1, 10, 6, 248);

    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*activeTabValue*/ ctx[0] === /*item*/ ctx[3].value
    			? 'active'
    			: '') + " svelte-6hef0q"));

    			add_location(li, file$1, 9, 4, 183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(/*handleClick*/ ctx[2](/*item*/ ctx[3].value))) /*handleClick*/ ctx[2](/*item*/ ctx[3].value).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 2 && t0_value !== (t0_value = /*item*/ ctx[3].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*activeTabValue, items*/ 3 && li_class_value !== (li_class_value = "" + (null_to_empty(/*activeTabValue*/ ctx[0] === /*item*/ ctx[3].value
    			? 'active'
    			: '') + " svelte-6hef0q"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(9:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if activeTabValue == item.value}
    function create_if_block(ctx) {
    	let div;
    	let pre;
    	let t0_value = /*item*/ ctx[3].content + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			pre = element("pre");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(pre, file$1, 18, 6, 488);
    			attr_dev(div, "class", "box bg-dark svelte-6hef0q");
    			add_location(div, file$1, 16, 4, 398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, pre);
    			append_dev(pre, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 2 && t0_value !== (t0_value = /*item*/ ctx[3].content + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:2) {#if activeTabValue == item.value}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#each items as item}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*activeTabValue*/ ctx[0] == /*item*/ ctx[3].value && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*activeTabValue*/ ctx[0] == /*item*/ ctx[3].value) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:0) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let ul;
    	let t;
    	let each1_anchor;
    	let each_value_1 = /*items*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    			attr_dev(ul, "class", "svelte-6hef0q");
    			add_location(ul, file$1, 7, 0, 150);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeTabValue, items, handleClick*/ 7) {
    				each_value_1 = /*items*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*items, activeTabValue*/ 3) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	let { items = [] } = $$props;
    	let { activeTabValue = 0 } = $$props;
    	const handleClick = tabValue => () => $$invalidate(0, activeTabValue = tabValue);
    	const writable_props = ['items', 'activeTabValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('activeTabValue' in $$props) $$invalidate(0, activeTabValue = $$props.activeTabValue);
    	};

    	$$self.$capture_state = () => ({ items, activeTabValue, handleClick });

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('activeTabValue' in $$props) $$invalidate(0, activeTabValue = $$props.activeTabValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeTabValue, items, handleClick];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { items: 1, activeTabValue: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get items() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeTabValue() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeTabValue(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let nav;
    	let div0;
    	let span;
    	let t1;
    	let div7;
    	let div6;
    	let div4;
    	let div1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div2;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div3;
    	let label2;
    	let t9;
    	let textarea;
    	let t10;
    	let div5;
    	let tabs_1;
    	let current;
    	let mounted;
    	let dispose;

    	tabs_1 = new Tabs({
    			props: { items: /*tabs*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "JsonToEntity";
    			t1 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Package:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Main Entity Name:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "JSON String:";
    			t9 = space();
    			textarea = element("textarea");
    			t10 = space();
    			div5 = element("div");
    			create_component(tabs_1.$$.fragment);
    			attr_dev(span, "class", "navbar-brand mb-0 h1");
    			add_location(span, file, 31, 4, 955);
    			attr_dev(div0, "class", "container-fluid");
    			add_location(div0, file, 30, 2, 921);
    			attr_dev(nav, "class", "navbar navbar-dark bg-dark");
    			add_location(nav, file, 29, 0, 878);
    			attr_dev(label0, "for", "modelPackage");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file, 38, 8, 1137);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control bg-dark");
    			attr_dev(input0, "name", "modelPackage");
    			attr_dev(input0, "id", "modelPackage");
    			add_location(input0, file, 39, 8, 1207);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file, 37, 6, 1110);
    			attr_dev(label1, "for", "entityName");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file, 48, 8, 1426);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control bg-dark");
    			attr_dev(input1, "name", "entityName");
    			attr_dev(input1, "id", "entityName");
    			add_location(input1, file, 49, 8, 1503);
    			attr_dev(div2, "class", "mb-3");
    			add_location(div2, file, 47, 6, 1399);
    			attr_dev(label2, "for", "json");
    			attr_dev(label2, "class", "form-label");
    			add_location(label2, file, 59, 8, 1717);
    			attr_dev(textarea, "class", "form-control bg-dark");
    			attr_dev(textarea, "id", "json");
    			attr_dev(textarea, "name", "json");
    			attr_dev(textarea, "rows", "30");
    			add_location(textarea, file, 60, 8, 1783);
    			attr_dev(div3, "class", "mb-3");
    			add_location(div3, file, 58, 6, 1690);
    			attr_dev(div4, "class", "col-4 pt-2");
    			add_location(div4, file, 36, 4, 1079);
    			attr_dev(div5, "class", "col-8");
    			add_location(div5, file, 69, 4, 1961);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file, 35, 2, 1057);
    			attr_dev(div7, "class", "container mt-5");
    			add_location(div7, file, 34, 0, 1026);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			append_dev(div0, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t3);
    			append_dev(div1, input0);
    			set_input_value(input0, /*modelPackage*/ ctx[1]);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t6);
    			append_dev(div2, input1);
    			set_input_value(input1, /*entityName*/ ctx[0]);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t9);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*json*/ ctx[2]);
    			append_dev(div6, t10);
    			append_dev(div6, div5);
    			mount_component(tabs_1, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*modelPackage*/ 2 && input0.value !== /*modelPackage*/ ctx[1]) {
    				set_input_value(input0, /*modelPackage*/ ctx[1]);
    			}

    			if (dirty & /*entityName*/ 1 && input1.value !== /*entityName*/ ctx[0]) {
    				set_input_value(input1, /*entityName*/ ctx[0]);
    			}

    			if (dirty & /*json*/ 4) {
    				set_input_value(textarea, /*json*/ ctx[2]);
    			}

    			const tabs_1_changes = {};
    			if (dirty & /*tabs*/ 8) tabs_1_changes.items = /*tabs*/ ctx[3];
    			tabs_1.$set(tabs_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div7);
    			destroy_component(tabs_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let tabs;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let entityName = 'Worklog';
    	let modelPackage = 'dt1.test.from.json';
    	let response = {};
    	let props = [];
    	let json = JSON.stringify(jsonTest, null, 4);
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		modelPackage = this.value;
    		$$invalidate(1, modelPackage);
    	}

    	function input1_input_handler() {
    		entityName = this.value;
    		$$invalidate(0, entityName);
    	}

    	function textarea_input_handler() {
    		json = this.value;
    		$$invalidate(2, json);
    	}

    	$$self.$capture_state = () => ({
    		jsonTest,
    		createEntity,
    		getCapital,
    		Tabs,
    		entityName,
    		modelPackage,
    		response,
    		props,
    		json,
    		tabs
    	});

    	$$self.$inject_state = $$props => {
    		if ('entityName' in $$props) $$invalidate(0, entityName = $$props.entityName);
    		if ('modelPackage' in $$props) $$invalidate(1, modelPackage = $$props.modelPackage);
    		if ('response' in $$props) $$invalidate(4, response = $$props.response);
    		if ('props' in $$props) $$invalidate(5, props = $$props.props);
    		if ('json' in $$props) $$invalidate(2, json = $$props.json);
    		if ('tabs' in $$props) $$invalidate(3, tabs = $$props.tabs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*json*/ 4) {
    			if (json) {
    				try {
    					$$invalidate(5, props = Object.entries(JSON.parse(json)).map(e => {
    						return {
    							name: e[0],
    							type: Array.isArray(e[1])
    							? `list<${getCapital(e[0])}>`
    							: typeof e[1],
    							val: e[1]
    						};
    					}));
    				} catch(error) {
    					console.error(error);
    				} //TODO: show message
    			}
    		}

    		if ($$self.$$.dirty & /*modelPackage, entityName, props*/ 35) {
    			$$invalidate(4, response = createEntity(modelPackage, entityName, props));
    		}

    		if ($$self.$$.dirty & /*response*/ 16) {
    			$$invalidate(3, tabs = Object.entries(response).map((item, idx) => {
    				return {
    					label: item[0],
    					value: idx,
    					content: item[1]
    				};
    			}));
    		}
    	};

    	return [
    		entityName,
    		modelPackage,
    		json,
    		tabs,
    		response,
    		props,
    		input0_input_handler,
    		input1_input_handler,
    		textarea_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
