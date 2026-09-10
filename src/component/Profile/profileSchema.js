// Shared field metadata + validators for the profile forms.
// One source of truth for labels, placeholders, autocomplete hints, widths
// and error messages — used by UserInfoCard (personal details) and
// UserAddressCard (address), so the two forms can never drift apart.

const NAME_RE = /^[\p{L}][\p{L}\s.'-]{1,39}$/u; // 2-40: letters, spaces, ' . -
const PERSON_RE = /^[\p{L}\p{N}\s.'()-]{2,60}$/u; // city / state / country
const PHONE_RE = /^\+?\d{7,15}$/; // 7-15 digits, optional leading +
const POSTAL_RE = /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/; // 3-10 chars, PIN/ZIP friendly

const isBlank = (v) => !v || !v.trim();
const tooLong = (v, max) => v.trim().length > max;

export const PERSONAL_FIELDS = [
    {
        name: "firstName",
        docKey: "firstname",
        label: "First name",
        placeholder: "e.g. Aarav",
        autoComplete: "given-name",
        required: true,
        maxLength: 40,
        colSpan: 1,
        validate: (v) =>
            isBlank(v)
                ? "First name is required."
                : NAME_RE.test(v.trim())
                  ? null
                  : "Use 2-40 letters — spaces, apostrophes and hyphens are fine.",
    },
    {
        name: "lastName",
        docKey: "lastname",
        label: "Last name",
        placeholder: "e.g. Sharma",
        autoComplete: "family-name",
        required: true,
        maxLength: 40,
        colSpan: 1,
        validate: (v) =>
            isBlank(v)
                ? "Last name is required."
                : NAME_RE.test(v.trim())
                  ? null
                  : "Use 2-40 letters — spaces, apostrophes and hyphens are fine.",
    },
    {
        name: "phone",
        docKey: "phone",
        label: "Phone number",
        placeholder: "e.g. +91 98765 43210",
        autoComplete: "tel",
        required: false,
        maxLength: 20,
        colSpan: 2,
        hint: "For delivery updates on your orders. We never share it.",
        validate: (v) => {
            if (isBlank(v)) return null; // optional field
            const compact = v.replace(/[\s()-]/g, "");
            return PHONE_RE.test(compact)
                ? null
                : "Enter a valid number: 7-15 digits with an optional + prefix.";
        },
    },
];

export const ADDRESS_FIELDS = [
    {
        name: "address1",
        docKey: "addressline1",
        label: "Address line 1",
        placeholder: "House / flat no, building, street, area",
        autoComplete: "address-line1",
        required: true,
        maxLength: 100,
        colSpan: 2,
        validate: (v) =>
            isBlank(v)
                ? "Street address is required."
                : v.trim().length < 5
                  ? "Add a little more detail (at least 5 characters)."
                  : tooLong(v, 100)
                    ? "Keep it under 100 characters."
                    : null,
    },
    {
        name: "address2",
        docKey: "addressline2",
        label: "Address line 2",
        placeholder: "Landmark, apartment, floor (optional)",
        autoComplete: "address-line2",
        required: false,
        maxLength: 100,
        colSpan: 2,
        validate: (v) => (tooLong(v, 100) ? "Keep it under 100 characters." : null),
    },
    {
        name: "city",
        docKey: "city",
        label: "City",
        placeholder: "e.g. Bengaluru",
        autoComplete: "address-level2",
        required: true,
        maxLength: 60,
        colSpan: 1,
        validate: (v) =>
            isBlank(v) ? "City is required." : PERSON_RE.test(v.trim()) ? null : "Use 2-60 letters or numbers.",
    },
    {
        name: "state",
        docKey: "state",
        label: "State",
        placeholder: "e.g. Karnataka",
        autoComplete: "address-level1",
        required: true,
        maxLength: 60,
        colSpan: 1,
        validate: (v) =>
            isBlank(v) ? "State is required." : PERSON_RE.test(v.trim()) ? null : "Use 2-60 letters or numbers.",
    },
    {
        name: "postalCode",
        docKey: "postalcode",
        label: "Postal code",
        placeholder: "e.g. 560001",
        autoComplete: "postal-code",
        required: true,
        maxLength: 10,
        colSpan: 1,
        validate: (v) =>
            isBlank(v)
                ? "Postal code is required."
                : POSTAL_RE.test(v.trim())
                  ? null
                  : "3-10 letters or numbers — e.g. 560001.",
    },
    {
        name: "country",
        docKey: "country",
        label: "Country",
        placeholder: "e.g. India",
        autoComplete: "country-name",
        required: true,
        maxLength: 60,
        colSpan: 1,
        validate: (v) =>
            isBlank(v) ? "Country is required." : PERSON_RE.test(v.trim()) ? null : "Use 2-60 letters or numbers.",
    },
];

/** Seed a form-values object ({name: value}) from a Firestore user doc. */
export const formValuesFromDoc = (fields, data = {}) =>
    Object.fromEntries(fields.map((f) => [f.name, data[f.docKey] || ""]));

/** Build a Firestore update patch (doc keys, trimmed) from form values. */
export const docPatchFromForm = (fields, values) =>
    Object.fromEntries(fields.map((f) => [f.docKey, (values[f.name] || "").trim()]));

/** Validate a values object against a field list → { [name]: error | undefined } */
export const validateFields = (fields, values) =>
    Object.fromEntries(
        fields.map((f) => [f.name, f.validate ? f.validate(values[f.name] || "") : undefined])
    );
