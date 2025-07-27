import { UnavailabilityError } from "expo-modules-core";

import ExponentWebBrowser from "./expo-web-browser";

import {
  AuthSessionOpenOptions,
  WebBrowserAuthSessionResult,
  WebBrowserOpenOptions,
  WebBrowserRedirectResult,
  WebBrowserResult,
  WebBrowserResultType,
} from "expo-web-browser";
import {
  AppState,
  EmitterSubscription,
  Platform,
  AppStateStatus,
} from "react-native";

import * as Linking from "expo-linking";

import { RedirectEvent } from "expo-web-browser/build/WebBrowser.types";

export const useOpenBrowserAsync = () => {
  function processOptions(options: WebBrowserOpenOptions) {
    return {
      ...options,
      controlsColor: options.controlsColor,
      toolbarColor: options.toolbarColor,
      secondaryToolbarColor: options.secondaryToolbarColor,
    };
  }

  function authSessionIsNativelySupported(): boolean {
    return Platform.OS !== "android";
  }

  async function openAuthSessionPolyfillAsync(
    startUrl: string,
    returnUrl?: string | null,
    browserParams: WebBrowserOpenOptions = {}
  ): Promise<WebBrowserAuthSessionResult> {
    let redirectSubscription: EmitterSubscription | null = null;

    if (redirectSubscription) {
      throw new Error(
        `The WebBrowser's auth session is in an invalid state with a redirect handler set when it should not be`
      );
    }

    let onWebBrowserCloseAndroid: null | (() => void) = null;

    if (onWebBrowserCloseAndroid) {
      throw new Error(
        `WebBrowser is already open, only one can be open at a time`
      );
    }

    async function openBrowserAsync(
      url: string,
      browserParams: WebBrowserOpenOptions = {}
    ): Promise<WebBrowserResult> {
      if (!ExponentWebBrowser.openBrowserAsync) {
        throw new UnavailabilityError("WebBrowser", "openBrowserAsync");
      }

      return await ExponentWebBrowser.openBrowserAsync(
        url,
        processOptions(browserParams)
      );
    }

    function onAppStateChangeAndroid(state: AppStateStatus) {
      let isAppStateAvailable: boolean = AppState.currentState !== null;

      if (!isAppStateAvailable) {
        isAppStateAvailable = true;
        return;
      }

      if (state === "active" && onWebBrowserCloseAndroid) {
        onWebBrowserCloseAndroid();
      }
    }

    function waitForRedirectAsync(
      returnUrl?: string | null
    ): Promise<WebBrowserRedirectResult> {
      // Note that this Promise never resolves when `returnUrl` is nullish
      return new Promise((resolve) => {
        const redirectHandler = (event: RedirectEvent) => {
          if (returnUrl && event.url.startsWith(returnUrl)) {
            resolve({ url: event.url, type: "success" });
          }
        };

        redirectSubscription = Linking.addEventListener("url", redirectHandler);
      });
    }

    function stopWaitingForRedirect() {
      if (!redirectSubscription) {
        throw new Error(
          `The WebBrowser auth session is in an invalid state with no redirect handler when one should be set`
        );
      }

      redirectSubscription.remove();
      redirectSubscription = null;
    }

    async function openBrowserAndWaitAndroidAsync(
      startUrl: string,
      browserParams: WebBrowserOpenOptions = {}
    ): Promise<WebBrowserResult> {
      const appStateChangedToActive = new Promise<void>((resolve) => {
        onWebBrowserCloseAndroid = resolve;
      });

      const stateChangeSubscription = AppState.addEventListener(
        "change",
        onAppStateChangeAndroid
      );

      let result: WebBrowserResult = { type: WebBrowserResultType.CANCEL };
      let type: string | null = null;

      try {
        ({ type } = await openBrowserAsync(startUrl, browserParams));
      } catch (e) {
        stateChangeSubscription.remove();
        onWebBrowserCloseAndroid = null;
        throw e;
      }

      if (type === "opened") {
        await appStateChangedToActive;
        result = { type: WebBrowserResultType.DISMISS };
      }

      stateChangeSubscription.remove();
      onWebBrowserCloseAndroid = null;
      return result;
    }

    try {
      if (Platform.OS === "android") {
        const responseBrowserAsync = await openBrowserAndWaitAndroidAsync(
          startUrl,
          browserParams
        );

        await waitForRedirectAsync(returnUrl);

        return {
          ...responseBrowserAsync,
        };
      } else {
        return await Promise.race([
          openBrowserAsync(startUrl, browserParams),

          waitForRedirectAsync(returnUrl),
        ]);
      }
    } finally {
      // We can't dismiss the browser on Android, only call this when it's available.
      // Users on Android need to manually press the 'x' button in Chrome Custom Tabs, sadly.
      if (ExponentWebBrowser.dismissBrowser) {
        ExponentWebBrowser.dismissBrowser();
      }

      stopWaitingForRedirect();
    }
  }

  async function openAuthSessionAsync(
    url: string,
    redirectUrl?: string | null,
    options: AuthSessionOpenOptions = {}
  ): Promise<WebBrowserAuthSessionResult> {
    if (authSessionIsNativelySupported()) {
      if (!ExponentWebBrowser.openAuthSessionAsync) {
        throw new UnavailabilityError("WebBrowser", "openAuthSessionAsync");
      }

      if (["ios", "macos", "web"].includes(Platform.OS)) {
        return ExponentWebBrowser.openAuthSessionAsync(
          url,
          redirectUrl,
          processOptions(options)
        );
      }
      return ExponentWebBrowser.openAuthSessionAsync(url, redirectUrl);
    } else {
      return openAuthSessionPolyfillAsync(url, redirectUrl, options);
    }
  }

  return {
    openAuthSessionAsync,
  };
};
