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
  luaL_openlibs = Module.cwrap('luaL_openlibs', 'number', ['number'])
  luaL_newstate = Module.cwrap('luaL_newstate', 'number', [])
  luaL_loadstring = Module.cwrap('luaL_loadstring', 'number', ['number', 'string'])
  lua_pcallk = Module.cwrap('lua_pcallk', 'number', ['number', 'number', 'number', 'number', 'number', 'number'])
  lua_gettop = Module.cwrap('lua_gettop', 'number', ['number'])
  lua_settop = Module.cwrap('lua_settop', 'number', ['number', 'number'])
  lua_tolstring = Module.cwrap('lua_tolstring', 'string', ['number', 'number', 'number'])
  lua_getglobal = Module.cwrap('lua_getglobal', 'string', ['number', 'string'])
  lua_createtable = Module.cwrap('lua_createtable', 'string', ['number', 'number', 'number'])
  lua_pushstring = Module.cwrap('lua_pushstring', 'number', ['string'])
  lua_settable = Module.cwrap('lua_settable', 'number', ['number'])
  lua_setglobal = Module.cwrap('lua_setglobal', 'number', ['number', 'string'])
  lua_getfield = Module.cwrap('lua_getfield', 'number', ['number', 'number', 'string'])
  lua_type = Module.cwrap('lua_type', 'number', ['number', 'number'])
  lua_typename = Module.cwrap('lua_typename', 'number', ['number', 'number'])
}

function dofile(luaState, script) {
  let stackSize

  if (luaL_loadstring(luaState, script) == 0) {
    const call = lua_pcallk(luaState, 0, -1, 0, 0)

    if (call !== 0) {
      stackSize = lua_gettop(luaState)
      throw new Error(lua_tolstring(luaState, stackSize))
    }
  } else {
    stackSize = lua_gettop(luaState)
    throw new Error(lua_tolstring(luaState, stackSize))
  }
}

function bootLua() {
  let luaState = null
  let result = ''

  return (script) => {
    if (luaState == null) {
      luaState = luaL_newstate()

      luaL_openlibs(luaState)
    }

    try {
      lua_createtable(luaState, 0, 1)

      lua_setglobal(luaState, "life")

      dofile(luaState, script)

      // call life:main()
      // lua_getglobal(luaState, "life")
      // lua_getfield(luaState, -1, "main")

      lua_getglobal(luaState, "main")

      let call = lua_pcallk(luaState, 0, 1)

      if (call !== 0) {
        throw new Error(lua_tolstring(luaState, lua_gettop(luaState)))
      }
    } catch (error) {
      console.error(error)

      lua_settop(luaState, -1, lua_gettop(luaState))

      return ''
    }

    let stackSize = lua_gettop(luaState)

    result = lua_tolstring(luaState, stackSize)

    lua_settop(luaState, -1, stackSize)

    return result
  }
}
