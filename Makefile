LUA_VERSION= 5.4.3
LUA_INCLUDE= includes/lua-$(LUA_VERSION)
LUA_SOURCE= $(LUA_INCLUDE)/src

LUA_JS= lua.js
LUA_WASM= lua.wasm

OUTDIR= vm

EXPORTED_FUNCTIONS=['_luaL_openlibs', '_luaL_newstate', '_luaL_loadstring', '_lua_pcallk', '_lua_gettop', '_lua_tolstring', '_lua_settop', '_lua_getglobal', '_lua_pushstring', '_lua_createtable', '_lua_settable', '_lua_setglobal', '_lua_getfield', '_lua_type', '_lua_typename']

WASM_PARAMS= -s WASM=1 -s EXPORTED_FUNCTIONS="$(EXPORTED_FUNCTIONS)" -s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap']" -s ALLOW_MEMORY_GROWTH=1

install:
	mkdir vm
	cd $(LUA_SOURCE) && make generic LUA_T='lua.js' CC='emcc $(WASM_PARAMS)' AR='emar rcu' RANLIB='emranlib'
	cd $(LUA_SOURCE) && cp $(LUA_JS) $(CURDIR)/$(OUTDIR)/$(LUA_JS)
	cd $(LUA_SOURCE) && cp $(LUA_WASM) $(CURDIR)/$(OUTDIR)/$(LUA_WASM)

clean:
	rm -rf vm
	cd $(LUA_SOURCE) && rm *.o *.wasm *.js
