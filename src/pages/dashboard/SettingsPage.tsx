import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Plus, Trash2, User } from "lucide-react";
import { profileApi, type NextOfKin } from "@/api/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  employment_status: z.string().optional(),
  employer_name: z.string().optional(),
  account_currency: z.string().optional(),
  account_type: z.string().optional(),
});

const nokSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  relationship: z.string().min(1, "Required"),
  phone_number: z.string().min(1, "Required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;
type NokForm = z.infer<typeof nokSchema>;

export default function SettingsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"profile" | "documents" | "nok">("profile");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const idPhotoRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const signatureRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getMyProfile().then((r) => r.data),
  });

  const updateProfile = useMutation({
    mutationFn: (data: FormData | Partial<ProfileForm>) =>
      profileApi.updateProfile(data),
    onSuccess: ({ data }) => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      setSuccessMsg(data.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    },
    onError: (err: unknown) => {
      const e = (err as { response?: { data?: { error?: string; errors?: Record<string, string[]> } } })?.response?.data;
      setServerError(e?.error ?? Object.values(e?.errors ?? {})[0]?.[0] ?? "Update failed.");
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number ?? "",
          address: profile.address ?? "",
          city: profile.city ?? "",
          date_of_birth: profile.date_of_birth ?? "",
          nationality: profile.nationality ?? "",
          gender: profile.gender ?? "",
          employment_status: profile.employment_status ?? "",
          employer_name: profile.employer_name ?? "",
          account_currency: profile.account_currency ?? "",
          account_type: profile.account_type ?? "",
        }
      : undefined,
  });

  function onSubmitProfile(values: ProfileForm) {
    setServerError(null);
    updateProfile.mutate(values);
  }

  function handlePhotoUpload(field: "photo" | "id_photo" | "signature_photo") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append(field, file);
      updateProfile.mutate(fd);
    };
  }

  const tabs = [
    { key: "profile", label: "Personal info" },
    { key: "documents", label: "Documents & KYC" },
    { key: "nok", label: "Next of kin" },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-ffh-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ffh-navy dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your profile and account preferences
        </p>
      </div>

      {/* Profile photo */}
      <Card>
        <CardContent className="flex items-center gap-5 p-5">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-ffh-navy/10 dark:bg-white/10">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-ffh-navy dark:text-white">
                  {profile?.first_name?.[0]}
                </div>
              )}
            </div>
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ffh-teal text-white shadow"
            >
              <Camera size={12} />
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload("photo")}
            />
          </div>
          <div>
            <p className="font-semibold text-ffh-navy dark:text-white">
              {profile?.full_name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
            <p className="mt-1 text-xs text-gray-400 capitalize">
              {profile?.username}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-ffh-border-dark">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "border-b-2 border-ffh-teal text-ffh-teal"
                : "text-gray-500 hover:text-ffh-navy dark:hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal info tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" error={errors.first_name?.message}>
                  <Input {...register("first_name")} />
                </Field>
                <Field label="Last name" error={errors.last_name?.message}>
                  <Input {...register("last_name")} />
                </Field>
                <Field label="Phone number" error={errors.phone_number?.message}>
                  <Input {...register("phone_number")} placeholder="+1 555 000 0000" />
                </Field>
                <Field label="Date of birth">
                  <Input type="date" {...register("date_of_birth")} />
                </Field>
                <Field label="Gender">
                  <select className="form-input" {...register("gender")}>
                    <option value="">Select…</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </Field>
                <Field label="Nationality">
                  <Input {...register("nationality")} placeholder="e.g. Kenyan" />
                </Field>
                <Field label="Address" error={errors.address?.message}>
                  <Input {...register("address")} placeholder="Street address" />
                </Field>
                <Field label="City">
                  <Input {...register("city")} placeholder="City" />
                </Field>
                <Field label="Employment status">
                  <select className="form-input" {...register("employment_status")}>
                    <option value="">Select…</option>
                    <option value="employed">Employed</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                  </select>
                </Field>
                <Field label="Employer name">
                  <Input {...register("employer_name")} placeholder="Company name" />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-gray-100 dark:border-ffh-border-dark">
                <Field label="Preferred currency">
                  <select className="form-input" {...register("account_currency")}>
                    <option value="">Select…</option>
                    <option value="us_dollar">US Dollar (USD)</option>
                    <option value="pound_sterling">Pound Sterling (GBP)</option>
                    <option value="kenya_shilling">Kenya Shilling (KES)</option>
                  </select>
                </Field>
                <Field label="Account type">
                  <select className="form-input" {...register("account_type")}>
                    <option value="">Select…</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current (Checking)</option>
                  </select>
                </Field>
              </div>

              {serverError && (
                <p className="text-sm text-ffh-danger">{serverError}</p>
              )}
              {successMsg && (
                <p className="text-sm text-ffh-teal">{successMsg}</p>
              )}

              <Button
                type="submit"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending && (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                )}
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Documents tab */}
      {activeTab === "documents" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentUpload
            label="ID / Passport photo"
            url={profile?.id_photo_url}
            inputRef={idPhotoRef}
            onChange={handlePhotoUpload("id_photo")}
            isUploading={updateProfile.isPending}
          />
          <DocumentUpload
            label="Signature photo"
            url={profile?.signature_photo_url}
            inputRef={signatureRef}
            onChange={handlePhotoUpload("signature_photo")}
            isUploading={updateProfile.isPending}
          />
        </div>
      )}

      {/* Next of kin tab */}
      {activeTab === "nok" && (
        <NextOfKinSection profileId={profile?.id} />
      )}

      <p className="pt-4 text-center text-xs text-gray-300 dark:text-gray-600">
        Built by{" "}
        <a
          href="https://edemaukabi.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition hover:text-ffh-teal dark:text-gray-500 dark:hover:text-ffh-teal"
        >
          Edema Ukabi
        </a>
      </p>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-ffh-danger">{error}</p>}
    </div>
  );
}

function DocumentUpload({
  label,
  url,
  inputRef,
  onChange,
  isUploading,
}: {
  label: string;
  url?: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-200 dark:border-ffh-border-dark hover:border-ffh-teal"
        >
          {url ? (
            <img src={url} alt={label} className="h-40 w-full object-cover" />
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-ffh-teal">
              {isUploading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <User size={24} />
                  <span className="text-xs">Click to upload</span>
                </>
              )}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm font-medium text-ffh-navy dark:text-white">{label}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
}

function NextOfKinSection({ profileId }: { profileId?: string }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["next-of-kin"],
    queryFn: () => profileApi.listNextOfKin().then((r) => r.data.results ?? r.data),
    enabled: !!profileId,
  });

  const nokList: NextOfKin[] = Array.isArray(data) ? data : [];

  const addNok = useMutation({
    mutationFn: (values: Omit<NextOfKin, "id">) => profileApi.addNextOfKin(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["next-of-kin"] });
      setShowForm(false);
    },
  });

  const deleteNok = useMutation({
    mutationFn: (id: string) => profileApi.deleteNextOfKin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["next-of-kin"] }),
  });

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<NokForm>({ resolver: zodResolver(nokSchema) });

  function onAdd(values: NokForm) {
    addNok.mutate(values);
    reset();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ffh-navy dark:text-white">Next of kin</h3>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} className="mr-1.5" />
          Add
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" error={errors.first_name?.message}>
                  <Input {...register("first_name")} />
                </Field>
                <Field label="Last name" error={errors.last_name?.message}>
                  <Input {...register("last_name")} />
                </Field>
                <Field label="Relationship" error={errors.relationship?.message}>
                  <Input {...register("relationship")} placeholder="e.g. Spouse" />
                </Field>
                <Field label="Phone number" error={errors.phone_number?.message}>
                  <Input {...register("phone_number")} placeholder="+1 555 000 0000" />
                </Field>
                <Field label="Email (optional)" error={errors.email?.message}>
                  <Input {...register("email")} type="email" />
                </Field>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addNok.isPending}>
                  {addNok.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-ffh-teal" />
        </div>
      ) : nokList.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No next of kin added yet.</p>
      ) : (
        <div className="space-y-3">
          {nokList.map((nok) => (
            <Card key={nok.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-ffh-navy dark:text-white">
                    {nok.first_name} {nok.last_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {nok.relationship} · {nok.phone_number}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNok.mutate(nok.id)}
                  disabled={deleteNok.isPending}
                  className="text-ffh-danger hover:bg-red-50 dark:hover:bg-ffh-danger/10"
                >
                  <Trash2 size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
