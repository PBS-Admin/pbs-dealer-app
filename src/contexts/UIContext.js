'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from './UserContext';

const UIContext = createContext(undefined);

export const UI_ACTIONS = {
  SET_ACTIVE_BUILDING: 'SET_ACTIVE_BUILDING',
  SET_ACTIVE_CARD: 'SET_ACTIVE_CARD',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  UPDATE_CAMERA_STATE: 'UPDATE_CAMERA_STATE',
  UPDATE_DIALOG: 'UPDATE_DIALOG',
  SHOW_TOAST: 'SHOW_TOAST',
  CLEAR_TOAST: 'CLEAR_TOAST',
  SET_LOADING: 'SET_LOADING',
};

export const getNavItems = (activeBuilding) => [
  { id: 'quote-info', label: 'Project Information' },
  { id: 'building-project', label: 'Building Project' },
  {
    id: 'bldg-layout',
    label: `Building ${String.fromCharCode(activeBuilding + 65)} - Layout`,
  },
  {
    id: 'bldg-partitions',
    label: `Building ${String.fromCharCode(activeBuilding + 65)} - Partitions`,
  },
  {
    id: 'bldg-roof-options',
    label: `Building ${String.fromCharCode(activeBuilding + 65)} - Roof Options`,
  },
  {
    id: 'bldg-wall-options',
    label: `Building ${String.fromCharCode(activeBuilding + 65)} - Wall Options`,
  },
  {
    id: 'bldg-openings',
    label: `Building ${String.fromCharCode(activeBuilding + 65)} - Openings`,
  },
  { id: 'accessories', label: 'Accessories' },
  { id: 'notes', label: 'Notes' },
  { id: 'finalize-quote', label: 'Finalize Quote' },
];

const initialState = {
  // Navigation state
  activeBuilding: 0,
  activeCard: 'quote-info',
  currentIndex: 0,
  isSidebarOpen: true,
  camera: {
    position: null,
    target: null,
    view: 'ISO',
  },
  // Dialog states
  dialogs: {
    copyBuilding: { isOpen: false, data: null },
    deleteBuilding: {
      isOpen: false,
      data: null,
    },
    deleteQuote: {
      isOpen: false,
      data: {
        quoteId: null,
        quoteName: '',
        redirectUrl: null,
        onSuccess: null,
      },
    },

    validation: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onlyConfirm: false,
    },

    loader: {
      isOpen: false,
      title: 'Loading',
      message: '',
    },
  },

  // Toast notifications
  toast: {
    isOpen: false,
    title: '',
    message: '',
    type: '',
    timeout: 3000,
  },
};

function uiReducer(state, action) {
  switch (action.type) {
    case UI_ACTIONS.SET_ACTIVE_BUILDING:
      return {
        ...state,
        activeBuilding: action.payload,
      };

    case UI_ACTIONS.SET_ACTIVE_CARD:
      return {
        ...state,
        activeCard: action.payload,
      };

    case UI_ACTIONS.SET_CURRENT_INDEX: {
      const items = getNavItems(state.activeBuilding);
      return {
        ...state,
        currentIndex: action.payload,
        activeCard: items[action.payload].id,
      };
    }

    case UI_ACTIONS.UPDATE_CAMERA_STATE:
      return {
        ...state,
        camera: {
          ...state.camera,
          position: action.payload.position || state.camera.position,
          target: action.payload.target || state.camera.target,
          view: action.payload.view || state.camera.view,
        },
      };

    case UI_ACTIONS.UPDATE_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.payload.name]: {
            ...state.dialogs[action.payload.name],
            ...action.payload.data,
          },
        },
      };

    case UI_ACTIONS.SHOW_TOAST:
      return {
        ...state,
        toast: {
          isOpen: true,
          ...action.payload,
        },
      };

    case UI_ACTIONS.CLEAR_TOAST:
      return {
        ...state,
        toast: {
          ...initialState.toast,
          isOpen: false,
        },
      };

    case UI_ACTIONS.SET_LOADING:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          loader: {
            isOpen: action.payload.isLoading,
            title: 'Loading',
            message: action.payload.message || '',
          },
        },
      };

    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  const router = useRouter();
  const { deleteQuote } = useUserContext();

  // Navigation actions
  const setActiveBuilding = useCallback((index) => {
    dispatch({
      type: UI_ACTIONS.SET_ACTIVE_BUILDING,
      payload: index,
    });
  }, []);

  const setActiveCard = useCallback((card) => {
    dispatch({
      type: UI_ACTIONS.SET_ACTIVE_CARD,
      payload: card,
    });
  }, []);

  const handlePrev = useCallback(() => {
    const navItems = getNavItems(state.activeBuilding);
    dispatch({
      type: UI_ACTIONS.SET_CURRENT_INDEX,
      payload:
        state.currentIndex > 0 ? state.currentIndex - 1 : navItems.length - 1,
    });
  }, [state.currentIndex, state.activeBuilding]);

  const handleNext = useCallback(() => {
    const navItems = getNavItems(state.activeBuilding);
    dispatch({
      type: UI_ACTIONS.SET_CURRENT_INDEX,
      payload:
        state.currentIndex < navItems.length - 1 ? state.currentIndex + 1 : 0,
    });
  }, [state.currentIndex, state.activeBuilding]);

  const handleDotClick = useCallback((index) => {
    dispatch({
      type: UI_ACTIONS.SET_CURRENT_INDEX,
      payload: index,
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: UI_ACTIONS.TOGGLE_SIDEBAR });
  }, []);

  const updateCameraState = useCallback(
    (position, target, view) => {
      // Only update if there's actually a change
      const currentState = state.camera;
      const positionChanged =
        position &&
        (!currentState.position ||
          position.x !== currentState.position.x ||
          position.y !== currentState.position.y ||
          position.z !== currentState.position.z);

      const targetChanged =
        target &&
        (!currentState.target ||
          target.x !== currentState.target.x ||
          target.y !== currentState.target.y ||
          target.z !== currentState.target.z);

      const viewChanged = view && view !== currentState.view;

      if (positionChanged || targetChanged || viewChanged) {
        dispatch({
          type: UI_ACTIONS.UPDATE_CAMERA_STATE,
          payload: {
            position: position
              ? {
                  x: position.x,
                  y: position.y,
                  z: position.z,
                }
              : currentState.position,
            target: target
              ? {
                  x: target.x,
                  y: target.y,
                  z: target.z,
                }
              : currentState.target,
            view: view || currentState.view,
          },
        });
      }
    },
    [state.camera]
  );

  // Dialog management
  const updateDialog = useCallback((dialogName, dialogData) => {
    dispatch({
      type: UI_ACTIONS.UPDATE_DIALOG,
      payload: { name: dialogName, data: dialogData },
    });
  }, []);

  // Centralized delete quote handling
  const openDeleteQuoteDialog = useCallback(
    (quoteId, quoteName, redirectUrl, onSuccess) => {
      updateDialog('deleteQuote', {
        isOpen: true,
        data: {
          quoteId,
          quoteName,
          redirectUrl,
          onSuccess,
        },
      });
    },
    [updateDialog]
  );

  // Loading state
  const setLoading = useCallback((isLoading, message = '') => {
    dispatch({
      type: UI_ACTIONS.SET_LOADING,
      payload: { isLoading, message },
    });
  }, []);

  // Toast management
  const showToast = useCallback(
    ({ title, message, type = 'info', timeout = 3000 }) => {
      dispatch({
        type: UI_ACTIONS.SHOW_TOAST,
        payload: { title, message, type, timeout },
      });

      if (timeout > 0) {
        setTimeout(() => {
          dispatch({ type: UI_ACTIONS.CLEAR_TOAST });
        }, timeout);
      }
    },
    []
  );

  const handleDeleteQuote = useCallback(async () => {
    const { quoteId, redirectUrl, onSuccess } = state.dialogs.deleteQuote.data;

    try {
      const success = await deleteQuote(quoteId); // Using deleteQuote from UserContext

      if (success) {
        showToast({
          title: 'Success',
          message: 'Quote deleted successfully',
          type: 'success',
        });

        if (onSuccess) {
          await onSuccess();
        }
      } else {
        throw new Error('Failed to delete quote');
      }

      // Close dialog
      updateDialog('deleteQuote', { isOpen: false, data: null });

      // Redirect if URL provided
      if (redirectUrl) {
        router.replace(redirectUrl);
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast({
        title: 'Error',
        message: error.message || 'Failed to delete quote',
        type: 'error',
      });
    }
  }, [
    state.dialogs.deleteQuote.data,
    router,
    showToast,
    updateDialog,
    deleteQuote,
  ]);

  const value = {
    // Navigation state
    activeBuilding: state.activeBuilding,
    activeCard: state.activeCard,
    currentIndex: state.currentIndex,
    navItems: getNavItems(state.activeBuilding),
    isSidebarOpen: state.isSidebarOpen,

    camera: state.camera,
    updateCameraState,

    // Dialog states
    dialogs: state.dialogs,
    toast: state.toast,

    // Navigation actions
    setActiveBuilding,
    setActiveCard,
    handlePrev,
    handleNext,
    handleDotClick,
    toggleSidebar,

    // Dialog actions
    updateDialog,
    openDeleteQuoteDialog,
    handleDeleteQuote,
    setLoading,
    showToast,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
}
