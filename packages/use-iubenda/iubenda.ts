import axios from "axios";
import { useEffect, useReducer } from "react";

import { IUBENDA_ACCOUNT_ID } from "constants/env";

import Sentry from "helpers/sentry";

export enum PolicyType {
  TERMS = "terms-and-conditions",
  PRIVACY = "privacy-policy",
}

export enum FetchStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

const REQUEST_LOADING = "fetch/loading";
const REQUEST_SUCCESS = "fetch/success";
const REQUEST_ERROR = "fetch/error";

interface RequestPending {
  type: typeof REQUEST_LOADING;
}

interface RequestSuccess {
  type: typeof REQUEST_SUCCESS;
  payload: {
    policy: string;
  };
}

interface RequestError {
  type: typeof REQUEST_ERROR;
  payload: {
    error: Error;
  };
}

type RequestAction = RequestPending | RequestSuccess | RequestError;

interface RequestState {
  error: Error | null;
  policy: string;
  status: FetchStatus;
}

const initialState = {
  error: null,
  policy: "",
  status: FetchStatus.IDLE,
};

const reducer = (state: RequestState, action: RequestAction) => {
  switch (action.type) {
    case REQUEST_LOADING:
      return {
        ...state,
        error: null,
        policy: "",
        status: FetchStatus.LOADING,
      };
    case REQUEST_SUCCESS:
      return {
        ...state,
        error: null,
        policy: action.payload.policy,
        status: FetchStatus.SUCCESS,
      };
    case REQUEST_ERROR:
      return {
        ...state,
        error: action.payload.error,
        policy: "",
        status: FetchStatus.ERROR,
      };
    default:
      return state;
  }
};

export interface UseIubendaParams {
  accountId?: string;
  policyType: PolicyType;
}

export interface UseIubendaResult {
  loading: boolean;
  error: Error | null;
  policy: string;
}

export const useIubenda = ({
  accountId = IUBENDA_ACCOUNT_ID,
  policyType,
}: UseIubendaParams): UseIubendaResult => {
  const [{ error, policy, status }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!accountId) {
      dispatch({
        type: REQUEST_ERROR,
        payload: { error: new Error("Missing Iubenda Account Id") },
      });
    } else if (status === FetchStatus.IDLE) {
      dispatch({ type: REQUEST_LOADING });

      axios
        .get(`https://www.iubenda.com/api/${policyType}/${accountId}/no-markup`)
        .then((resp) => {
          dispatch({ type: REQUEST_SUCCESS, payload: { policy: resp.data?.content || "" } });
        })
        .catch((err) => {
          Sentry.captureException(err);
          dispatch({ type: REQUEST_ERROR, payload: { error: err } });
        });
    }
  }, [accountId, status, policyType]);

  return {
    error,
    loading: status === FetchStatus.LOADING,
    policy,
  };
};
