var Module = {
  preRun: [initWrappers],
  onRuntimeInitialized: () => {
    const event = new CustomEvent('lua-loaded', {
      detail: { bootLua }
    })

    window.dispatchEvent(event)
  }
}

function initWrappers(){
  luaL_openlibs = Module.cwrap('luaL_openlibs', 'number', ['number']);
  luaL_newstate = Module.cwrap('luaL_newstate', 'number', []);
  luaL_loadstring = Module.cwrap('luaL_loadstring', 'number', ['number', 'string']);
  lua_pcallk = Module.cwrap('lua_pcallk', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);
  lua_gettop = Module.cwrap('lua_gettop', 'number', ['number']);
  lua_settop = Module.cwrap('lua_settop', 'number', ['number', 'number']);
  lua_tolstring = Module.cwrap('lua_tolstring', 'string', ['number', 'number', 'number']);
}

function bootLua() {
  let luaState = null
  let result = ''

  return (script) => {
    if (luaState == null) {
      luaState = luaL_newstate()

      luaL_openlibs(luaState)
    }

    if (luaL_loadstring(luaState, script) == 0) {
      if (lua_pcallk(luaState, 0, -1, 0, 0) == 0) {
        console.log('Success!')
      } else {
        console.log('Failed')
      }
    } else {
      console.log('Compilation failed')
    }

    let stackSize = lua_gettop(luaState)

    for (let i = 0; i <= stackSize; i++) {
      result += lua_tolstring(luaState, i);
    }

    lua_settop(luaState, -1, stackSize)

    return result
  }
}
