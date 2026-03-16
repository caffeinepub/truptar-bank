import { useCallback, useState } from "react";
import type { UserProfile, backendInterface } from "../backend.d";

export interface ProfileStore {
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    dob: string;
    gender: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
  username: string;
  contactInfo: {
    email: string;
    phone: string;
    countryCode: string;
  };
  emailVerified: boolean;
  kycData: {
    country: string;
    dob: string;
    idNumber: string;
    idType: string;
    kycStatus: "form" | "pending" | "approved" | "rejected";
  };
  preferences: {
    notifTransactions: boolean;
    notifSecurity: boolean;
    notifPromo: boolean;
    language: string;
  };
  twoFAMethod: "email" | "app" | null;
  twoFAEnabled: boolean;
  totpSetupStep: "idle" | "setup" | "enabled";
  totpSecret: string;
  emailTwoFAEnabled: boolean;
}

export type SyncStatus = "idle" | "loading" | "saving" | "synced" | "error";

const STORAGE_KEY = "truptar_profile";

const DEFAULT_PROFILE: ProfileStore = {
  personalInfo: {
    firstName: "",
    lastName: "",
    fullName: "",
    dob: "",
    gender: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
  },
  username: "",
  contactInfo: {
    email: "",
    phone: "",
    countryCode: "+234",
  },
  emailVerified: false,
  kycData: {
    country: "",
    dob: "",
    idNumber: "",
    idType: "Passport",
    kycStatus: "form",
  },
  preferences: {
    notifTransactions: false,
    notifSecurity: false,
    notifPromo: false,
    language: "English",
  },
  twoFAMethod: null,
  twoFAEnabled: false,
  totpSetupStep: "idle",
  totpSecret: "",
  emailTwoFAEnabled: false,
};

function loadProfile(): ProfileStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<ProfileStore>;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      personalInfo: { ...DEFAULT_PROFILE.personalInfo, ...parsed.personalInfo },
      contactInfo: { ...DEFAULT_PROFILE.contactInfo, ...parsed.contactInfo },
      kycData: { ...DEFAULT_PROFILE.kycData, ...parsed.kycData },
      preferences: { ...DEFAULT_PROFILE.preferences, ...parsed.preferences },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function toBackendProfile(p: ProfileStore): UserProfile {
  return {
    contactInfo: p.contactInfo,
    emailVerified: p.emailVerified,
    username: p.username,
    totpSecret: p.totpSecret,
    preferences: p.preferences,
    emailTwoFAEnabled: p.emailTwoFAEnabled,
    twoFAEnabled: p.twoFAEnabled,
    twoFAMethod: p.twoFAMethod ?? "",
    personalInfo: p.personalInfo,
    kycData: {
      dob: p.kycData.dob,
      country: p.kycData.country,
      idNumber: p.kycData.idNumber,
      kycStatus: p.kycData.kycStatus,
      idType: p.kycData.idType,
    },
  };
}

function fromBackendProfile(
  bp: UserProfile,
  existing: ProfileStore,
): ProfileStore {
  const kycStatus =
    (bp.kycData.kycStatus as ProfileStore["kycData"]["kycStatus"]) ?? "form";
  const twoFAMethod = (
    bp.twoFAMethod === "" ? null : bp.twoFAMethod
  ) as ProfileStore["twoFAMethod"];
  return {
    ...existing,
    personalInfo: { ...DEFAULT_PROFILE.personalInfo, ...bp.personalInfo },
    contactInfo: { ...DEFAULT_PROFILE.contactInfo, ...bp.contactInfo },
    kycData: { ...DEFAULT_PROFILE.kycData, ...bp.kycData, kycStatus },
    preferences: { ...DEFAULT_PROFILE.preferences, ...bp.preferences },
    username: bp.username,
    emailVerified: bp.emailVerified,
    totpSecret: bp.totpSecret,
    emailTwoFAEnabled: bp.emailTwoFAEnabled,
    twoFAEnabled: bp.twoFAEnabled,
    twoFAMethod,
    // preserve local-only UI state
    totpSetupStep: existing.totpSetupStep,
  };
}

export function useProfileStore() {
  const [profile, setProfile] = useState<ProfileStore>(loadProfile);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  const loadFromBackend = useCallback(async (actor: backendInterface) => {
    setSyncStatus("loading");
    try {
      const result = await actor.getCallerUserProfile();
      // Motoko Option<T> arrives as [T] | [] or null
      let bp: UserProfile | null = null;
      if (Array.isArray(result)) {
        bp = result.length > 0 ? (result[0] as UserProfile) : null;
      } else {
        bp = result as UserProfile | null;
      }
      if (bp) {
        setProfile((prev) => {
          const merged = fromBackendProfile(bp as UserProfile, prev);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      }
      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  }, []);

  const updateProfile = useCallback(
    (partial: Partial<ProfileStore>, actor?: backendInterface) => {
      setProfile((prev) => {
        const next: ProfileStore = {
          ...prev,
          ...partial,
          personalInfo: {
            ...prev.personalInfo,
            ...(partial.personalInfo ?? {}),
          },
          contactInfo: {
            ...prev.contactInfo,
            ...(partial.contactInfo ?? {}),
          },
          kycData: {
            ...prev.kycData,
            ...(partial.kycData ?? {}),
          },
          preferences: {
            ...prev.preferences,
            ...(partial.preferences ?? {}),
          },
        };
        // Optimistic local save
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // storage might be full or unavailable
        }
        // Async backend save if actor provided
        if (actor) {
          setSyncStatus("saving");
          actor
            .saveCallerUserProfile(toBackendProfile(next))
            .then(() => setSyncStatus("synced"))
            .catch(() => setSyncStatus("error"));
        }
        return next;
      });
    },
    [],
  );

  return { profile, updateProfile, syncStatus, loadFromBackend };
}
