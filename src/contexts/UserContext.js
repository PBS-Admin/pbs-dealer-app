'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { useSession } from 'next-auth/react';

const UserContext = createContext(undefined);

export const USER_ACTIONS = {
  SET_COMPANY_DATA: 'SET_COMPANY_DATA',
  SET_QUOTES: 'SET_QUOTES',
  UPDATE_QUOTES: 'UPDATE_QUOTES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

const initialState = {
  companyData: null, // Company details
  quotes: [],
  rsms: {},
  projectManagers: {},
  estimators: {},
  isLoading: false,
  error: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_COMPANY_DATA:
      return {
        ...state,
        companyData: action.payload.company,
        rsms: action.payload.rsms,
        projectManagers: action.payload.projectManagers,
        estimators: action.payload.estimators,
      };
    case USER_ACTIONS.SET_QUOTES:
      return {
        ...state,
        quotes: action.payload,
      };

    case USER_ACTIONS.UPDATE_QUOTES:
      return {
        ...state,
        quotes: action.payload(state.quotes),
      };
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    if (session?.user?.company) {
      fetchCompanyData(session.user.company);
    }
  }, [session?.user?.company]);

  const fetchCompanyData = async (companyId) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: null });

      const response = await fetch(
        `/api/auth/company-data?company=${companyId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }

      const data = await response.json();
      dispatch({
        type: USER_ACTIONS.SET_COMPANY_DATA,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_ACTIONS.SET_ERROR,
        payload: error.message,
      });
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const fetchQuotes = useCallback(
    async (forceRefresh = false) => {
      if (!session?.user?.company) return;

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: null });

      try {
        const response = await fetch(`/api/auth/open`, {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
          next: { revalidate: 0 },
        });

        if (!response.ok) throw new Error('Failed to fetch quotes');

        const data = await response.json();
        dispatch({ type: USER_ACTIONS.SET_QUOTES, payload: data.quotes });
      } catch (err) {
        console.error('Error fetching quotes:', err);
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: err.message });
      } finally {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    },
    [session?.user?.company]
  );

  useEffect(() => {
    fetchQuotes(true);
  }, [fetchQuotes]);

  const deleteQuote = useCallback(async (quoteId) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete quote');
      }

      dispatch({
        type: USER_ACTIONS.UPDATE_QUOTES,
        payload: (quotes) => quotes.filter((quote) => quote.ID !== quoteId),
      });

      return true;
    } catch (error) {
      console.error('Error deleting quote:', error);
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      return false;
    } finally {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  const copyQuote = useCallback(
    async (quoteId) => {
      if (!session?.user?.id) return false;

      try {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

        const response = await fetch(`/api/auth/quote/${quoteId}`);
        if (!response.ok) throw new Error('Failed to fetch quote');

        const data = await response.json();
        const saveResponse = await fetch('/api/auth/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentQuote: 0,
            user: {
              company: data.quote.Company,
              id: session.user.id,
            },
            state: JSON.parse(data.quote.QuoteData),
          }),
        });

        if (!saveResponse.ok) throw new Error('Failed to save copied quote');

        const saveData = await saveResponse.json();
        if (isNaN(saveData.message.quoteId)) {
          throw new Error('Invalid quote ID received');
        }

        const newQuote = {
          ...data.quote,
          ID: saveData.message.quoteId,
          Quote: saveData.message.quoteNum,
        };

        dispatch({
          type: USER_ACTIONS.UPDATE_QUOTES,
          payload: (quotes) => [...quotes, newQuote],
        });

        return true;
      } catch (error) {
        console.error('Error copying quote:', error);
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
        return false;
      } finally {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    },
    [session?.user?.id]
  );

  const switchCompany = useCallback(
    async (companyId) => {
      try {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: null });

        // First update session
        await updateSession({
          ...session,
          user: {
            ...session.user,
            company: companyId,
          },
        });

        // Then fetch new company data
        await fetchCompanyData(companyId);
      } catch (error) {
        dispatch({
          type: USER_ACTIONS.SET_ERROR,
          payload: 'Failed to switch company',
        });
      } finally {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
      }
    },
    [session, updateSession]
  );

  const hasPermission = useCallback(
    (requiredLevel) => {
      return session?.user?.permission >= requiredLevel;
    },
    [session?.user?.permission]
  );

  // Helper function to get names from IDs
  const getNameById = useCallback(
    (id, type = 'rsm') => {
      // console.log('id: ' + id + 'type: ' + type);
      let lookup;
      switch (type) {
        case 'rsm':
          lookup = state.rsms;
          break;
        case 'pm':
          lookup = state.projectManagers;
          break;
        case 'estimator':
          lookup = state.estimators;
          break;
        default:
          lookup = state.rsms;
          break;
      }
      return lookup[id] || '';
    },
    [state.rsms, state.projectManagers, state.estimators]
  );

  const value = {
    companyData: state.companyData,
    quotes: state.quotes,
    rsms: state.rsms,
    projectManagers: state.projectManagers,
    estimators: state.estimators,
    isLoading: state.isLoading,
    error: state.error,
    switchCompany,
    hasPermission,
    getNameById,
    fetchCompanyData,
    fetchQuotes,
    deleteQuote,
    copyQuote,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
