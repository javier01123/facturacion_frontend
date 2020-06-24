import * as actionTypes from "../actionTypes";

const initialState = {
  usuarioActualId: null,
  empresaActualId: null,
  empresas: null,
  sucursales: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EMPRESA_CHANGED_INIT:
      return {
        ...state,
        empresaActualId: action.payload.empresaId,
      };
    case actionTypes.EMPRESA_CHANGED_FINISHED:
      return {
        ...state,
        sucursales: action.payload.sucursales,
        empresaActualId: action.payload.empresaActualId,
        sucursalActualId: action.payload.sucursalActualId,
      };
    case actionTypes.LOGGED_IN:
      return {
        ...state,
        empresas: action.payload.empresas,
        sucursales: action.payload.sucursales,
        empresaActualId: action.payload.empresaActualId,
        sucursalActualId: action.payload.sucursalActualId,
        isAuthenticated: true,
      };
    case actionTypes.SUCURSAL_CHANGED:
      return {
        ...state,
        sucursalActualId: action.payload.sucursalId,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }

  // return {
  //   empresaActualId: empresaChanged(state.empresaActualId, action),
  //   ...empresaChangedFinished(state, action),
  //   ...loggedInData(state, action),
  // };
};

function empresaChanged(state = null, action) {
  switch (action.type) {
    case actionTypes.EMPRESA_CHANGED_INIT:
      return action.payload.empresaId;
    default:
      return state;
  }
}

function empresaChangedFinished(state = {}, action) {
  console.log("empresaChangedFinished", { state });
  switch (action.type) {
    case actionTypes.EMPRESA_CHANGED_FINISHED:
      return {
        sucursales: action.payload.sucursales,
        empresaActualId: action.payload.empresaActualId,
        sucursalActualId: action.payload.sucursalActualId,
      };
    default:
      return state;
  }
}

function loggedInData(state = {}, action) {
  console.log("loggedInData", { state });
  switch (action.type) {
    case actionTypes.LOGGED_IN:
      return {
        empresas: action.payload.empresas,
        sucursales: action.payload.sucursales,
        empresaActualId: action.payload.empresaActualId,
        sucursalActualId: action.payload.sucursalActualId,
      };
    default:
      return state;
  }
}

export default reducer;
