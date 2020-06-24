import * as actionTypes from "./actionTypes";

export const empresaSelectedChanged = (empresaId) => {
  return {
    type: actionTypes.EMPRESA_CHANGED_INIT,
    payload: { empresaId: empresaId },
  };
};

export const empresaSelectedChangedFinished = (payload) => {
  return {
    type: actionTypes.EMPRESA_CHANGED_FINISHED,
    payload: payload,
  };
};

export const reloadEmpresasList = () => {
  return {
    type: actionTypes.RELOAD_EMPRESAS_INIT,
  };
};

export const empresasReloaded = (empresas) => {
  return {
    type: actionTypes.EMPRESAS_RELOADED,
    payload: { empresas: empresas },
  };
};

export const sucursalSelectedChanged = (sucursalId) => {
  return {
    type: actionTypes.SUCURSAL_CHANGED,
    payload: { sucursalId: sucursalId },
  };
};

export const loginInit = () => {
  return {
    type: actionTypes.LOGIN_INIT,
  };
};

export const loggedIn = (datos) => {
  return {
    type: actionTypes.LOGGED_IN,
    payload: datos,
  };
};

export const logout=()=>{
  return{
    type: actionTypes.LOGOUT    
  }
}
