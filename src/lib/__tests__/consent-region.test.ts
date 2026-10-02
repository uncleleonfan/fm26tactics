import { describe, it, expect } from "vitest";
import {
  CONSENT_COOKIE,
  CONSENT_REGION_COOKIE,
  adsAllowed,
  adsAllowedOnClient,
  isConsentRegionVisitor,
  needsAdConsent,
  needsConsentPrompt,
} from "../consent-region";

const region = `${CONSENT_REGION_COOKIE}=1`;
const outside = `${CONSENT_REGION_COOKIE}=0`;
const granted = `${region}; ${CONSENT_COOKIE}=granted`;
const denied = `${region}; ${CONSENT_COOKIE}=denied`;

describe("needsAdConsent", () => {
  it("covers the EEA and the UK", () => {
    for (const country of [
      "DE", "FR", "NL", "PT", "ES", "IT", "PL", "SE", "IE", "NO", "IS", "LI", "GB",
    ]) {
      expect(needsAdConsent(country), country).toBe(true);
    }
  });

  it("leaves the main non-consent markets alone", () => {
    for (const country of ["US", "CA", "BR", "TR", "ID", "IN", "KR", "AU", "JP"]) {
      expect(needsAdConsent(country), country).toBe(false);
    }
  });

  it("is case-insensitive and tolerates whitespace", () => {
    expect(needsAdConsent("de")).toBe(true);
    expect(needsAdConsent(" gb ")).toBe(true);
  });

  it("treats missing geo data as no consent needed, so local dev works", () => {
    expect(needsAdConsent(undefined)).toBe(false);
    expect(needsAdConsent(null)).toBe(false);
    expect(needsAdConsent("")).toBe(false);
  });
});

describe("region cookie", () => {
  it("detects the region marker among other cookies", () => {
    expect(isConsentRegionVisitor(`_ga=GA1.1.123; ${region}`)).toBe(true);
  });

  it("does not confuse a non-region visitor with a region one", () => {
    expect(isConsentRegionVisitor(outside)).toBe(false);
    expect(isConsentRegionVisitor("")).toBe(false);
    expect(isConsentRegionVisitor("_ga=GA1.1.123")).toBe(false);
  });

  it("does not match a prefix of another cookie name", () => {
    expect(isConsentRegionVisitor(`${CONSENT_REGION_COOKIE}_x=1`)).toBe(false);
  });
});

describe("adsAllowed", () => {
  it("allows ads outside the consent regions without any decision", () => {
    expect(adsAllowed(outside)).toBe(true);
    expect(adsAllowed("")).toBe(true);
  });

  it("blocks ads in a consent region until the visitor accepts", () => {
    expect(adsAllowed(region)).toBe(false);
    expect(adsAllowed(denied)).toBe(false);
  });

  it("allows ads in a consent region once granted", () => {
    expect(adsAllowed(granted)).toBe(true);
    expect(adsAllowed(`${region}; _ga=GA1.1.123; ${CONSENT_COOKIE}=granted`)).toBe(true);
  });

  it("ignores an unrecognised consent value", () => {
    expect(adsAllowed(`${region}; ${CONSENT_COOKIE}=maybe`)).toBe(false);
  });
});

describe("needsConsentPrompt", () => {
  it("asks only in a consent region without a decision", () => {
    expect(needsConsentPrompt(region)).toBe(true);
  });

  it("does not ask outside the consent regions", () => {
    expect(needsConsentPrompt(outside)).toBe(false);
    expect(needsConsentPrompt("")).toBe(false);
  });

  it("does not ask again once the visitor has decided", () => {
    expect(needsConsentPrompt(granted)).toBe(false);
    expect(needsConsentPrompt(denied)).toBe(false);
  });
});

describe("adsAllowedOnClient", () => {
  it("fails closed when there is no document (server render)", () => {
    expect(typeof document).toBe("undefined");
    expect(adsAllowedOnClient()).toBe(false);
  });
});
