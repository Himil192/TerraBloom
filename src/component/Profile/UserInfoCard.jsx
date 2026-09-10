import { useEffect, useMemo, useState } from "react";
import {
    BadgeCheck,
    CalendarDays,
    Lock,
    Mail,
    PencilLine,
    Phone,
    ShieldCheck,
    TriangleAlert,
    UserRound,
} from "lucide-react";
import { useModal } from "../../Hooks/useModal";
import { Modal } from "../ui/model";
import Button from "../ui/button/Button";
import FormField, { ModalActions } from "./FormField";
import Input from "../../form/input/InputField";
import Label from "../../form/switch/Label";
import { PERSONAL_FIELDS, docPatchFromForm, formValuesFromDoc, validateFields } from "./profileSchema";
import useUserProfile from "../../Hooks/useUserProfile";

function InfoRow({ icon, label, children }) {
    // Capitalized local so JSX <Icon /> usage stays lint-safe in this config.
    const Icon = icon;
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--glass-highlight)]">
                <Icon className="h-4 w-4 text-secondary" />
            </div>
            <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
                <div className="text-sm font-medium break-words text-strong">{children}</div>
            </div>
        </div>
    );
}

const NotSet = () => <span className="font-normal italic text-muted">Not provided yet</span>;

export default function UserInfoCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const { data, authUser, loading, error, retry, saveFields } = useUserProfile();

    const [form, setForm] = useState(() => formValuesFromDoc(PERSONAL_FIELDS));
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    // Re-seed the form each time the modal opens (or the doc changes).
    useEffect(() => {
        if (isOpen) {
            setForm(formValuesFromDoc(PERSONAL_FIELDS, data));
            setErrors({});
            setSubmitted(false);
        }
    }, [isOpen, data]);

    const dirty = useMemo(() => {
        const seed = formValuesFromDoc(PERSONAL_FIELDS, data);
        return PERSONAL_FIELDS.some((f) => (form[f.name] || "").trim() !== (seed[f.name] || "").trim());
    }, [form, data]);

    const attemptClose = () => {
        if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return;
        closeModal();
    };

    const setField = (name, value) => {
        const next = { ...form, [name]: value };
        setForm(next);
        // Once the user has attempted a submit, re-validate live as they type.
        if (submitted) setErrors(validateFields(PERSONAL_FIELDS, next));
    };

    const handleBlur = (name) => {
        const def = PERSONAL_FIELDS.find((f) => f.name === name);
        const msg = def?.validate?.(form[name] || "") || undefined;
        setErrors((prev) => ({ ...prev, [name]: msg }));
    };

    const reset = () => {
        setForm(formValuesFromDoc(PERSONAL_FIELDS, data));
        setErrors({});
        setSubmitted(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nextErrors = validateFields(PERSONAL_FIELDS, form);
        setErrors(nextErrors);
        setSubmitted(true);
        if (Object.values(nextErrors).some(Boolean)) return;

        setSaving(true);
        const ok = await saveFields(docPatchFromForm(PERSONAL_FIELDS, form), "Personal details");
        setSaving(false);
        if (ok) closeModal();
    };

    if (loading) {
        return (
            <div className="glass rounded-2xl border border-subtle p-5 lg:p-6">
                <div className="h-5 w-44 animate-pulse rounded bg-[var(--glass-highlight-strong)]" />
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[var(--glass-highlight)]" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-20 animate-pulse rounded bg-[var(--glass-highlight)]" />
                                <div className="h-4 w-32 animate-pulse rounded bg-[var(--glass-highlight)]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass rounded-2xl border border-subtle p-5 lg:p-6">
                <div className="flex items-center gap-3 text-danger">
                    <TriangleAlert className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={retry}>
                    Try again
                </Button>
            </div>
        );
    }

    const fullName = [data?.firstname, data?.lastname].filter(Boolean).join(" ").trim();
    const email = authUser?.email || data?.email || "";
    const memberSince = authUser?.metadata?.creationTimestamp
        ? new Date(authUser.metadata.creationTimestamp).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
          })
        : null;

    return (
        <div className="glass rounded-2xl border border-subtle p-5 lg:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-strong">Personal information</h4>
                    <p className="mt-0.5 text-sm text-muted">How your account appears across TerraBloom.</p>
                </div>
                <Button variant="outline" size="sm" onClick={openModal} startIcon={<PencilLine className="h-4 w-4" />}>
                    Edit
                </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <InfoRow icon={UserRound} label="Full name">
                    {fullName || <NotSet />}
                </InfoRow>

                <InfoRow icon={Mail} label="Email">
                    <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate">{email || <NotSet />}</span>
                        {authUser?.emailVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <BadgeCheck className="h-3 w-3" /> Verified
                            </span>
                        ) : email ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <TriangleAlert className="h-3 w-3" /> Unverified
                            </span>
                        ) : null}
                    </span>
                </InfoRow>

                <InfoRow icon={Phone} label="Phone">
                    {data?.phone || <NotSet />}
                </InfoRow>

                <InfoRow icon={ShieldCheck} label="Account type">
                    <span className="inline-flex items-center rounded-full border border-subtle bg-[var(--glass-highlight)] px-2.5 py-0.5 text-xs font-semibold text-secondary">
                        {data?.role === "admin" ? "Administrator" : "Member"}
                    </span>
                </InfoRow>

                {memberSince && (
                    <InfoRow icon={CalendarDays} label="Member since">
                        {memberSince}
                    </InfoRow>
                )}
            </div>

            <Modal isOpen={isOpen} onClose={attemptClose} className="max-w-[640px] m-4">
                <form onSubmit={handleSubmit} className="w-full max-w-[640px] p-5 lg:p-8">
                    <h4 className="text-xl font-semibold text-strong">Edit personal details</h4>
                    <p className="mt-1 text-sm text-secondary">
                        Keep your name and phone current — we use them on your orders and delivery updates.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {PERSONAL_FIELDS.map((f) => (
                            <FormField
                                key={f.name}
                                field={f}
                                value={form[f.name] || ""}
                                onChange={(e) => setField(f.name, e.target.value)}
                                onBlur={() => handleBlur(f.name)}
                                error={errors[f.name]}
                                disabled={saving}
                            />
                        ))}
                    </div>

                    {/* Read-only account fields — managed by sign-in, not editable here. */}
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="pf-email" className="flex items-center gap-1.5">
                                Email <Lock className="h-3 w-3 text-muted" />
                            </Label>
                            <Input id="pf-email" value={email} disabled hint="Sign-in detail — contact support to change it." />
                        </div>
                        <div>
                            <Label htmlFor="pf-role" className="flex items-center gap-1.5">
                                Account type <Lock className="h-3 w-3 text-muted" />
                            </Label>
                            <Input
                                id="pf-role"
                                value={data?.role === "admin" ? "Administrator" : "Member"}
                                disabled
                                hint="Set automatically when your account was created."
                            />
                        </div>
                    </div>

                    <ModalActions
                        onCancel={attemptClose}
                        onReset={reset}
                        showReset={dirty}
                        saving={saving}
                        dirty={dirty}
                        label="Save changes"
                    />
                </form>
            </Modal>
        </div>
    );
}
