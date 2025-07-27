

// import React, { useEffect, useState } from "react";
// import { useModal } from "../../Hooks/useModal";
// import { Modal } from "../ui/model";
// import Button from "../ui/button/Button";
// import Input from "../../form/input/InputField";
// import { db } from "../../firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { showSuccess, showError } from "../../utils/toastUtils";

// export default function UserInfoCard() {
//     const { isOpen, openModal, closeModal } = useModal();

//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         role: "",
//     });
//     const [isSaving, setIsSaving] = useState(false);
//     const [userData, setUserData] = useState(null);
//     const uid = localStorage.getItem("uid");

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (!uid) {
//                 console.log("UID not found in localStorage");
//                 return;
//             }

//             try {
//                 const docRef = doc(db, "users", uid);
//                 const docSnap = await getDoc(docRef);

//                 if (docSnap.exists()) {
//                     const data = docSnap.data();
//                     setUserData(data);
//                     setFormData({
//                         firstName: data.firstname || "",
//                         lastName: data.lastname || "",
//                         email: data.email || "",
//                         phone: data.phone || "",
//                         role: data.role || "",
//                     });
//                 } else {
//                     console.log("No user document found");
//                 }
//             } catch (error) {
//                 showError("Failed to fetch user data");
//                 console.error("Error fetching user data:", error);
//             }
//         };

//         fetchUserData();
//     }, [uid]);

//     const handleSave = async () => {
//         setIsSaving(true);
//         try {
//             const docRef = doc(db, "users", uid);
//             await updateDoc(docRef, {
//                 firstname: formData.firstName,
//                 lastname: formData.lastName,
//                 phone: formData.phone,
//                 // email and role usually should not be editable unless intentional
//             });

//             showSuccess("Profile updated successfully!");
//             closeModal();
//         } catch (error) {
//             showError("Failed to update profile");
//             console.error("Update error:", error);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     if (!userData) return <div className="p-5">Loading...</div>;

//     return (
//         <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
//             <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                 <div>
//                     <h4 className="text-lg font-semibold text-gray-800 lg:mb-6">Personal Information</h4>
//                     <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
//                         {["firstName", "lastName", "email", "phone", "role"].map((field, index) => (
//                             <div key={index}>
//                                 <p className="mb-2 text-xs text-gray-500 capitalize">{field.replace(/([A-Z])/g, ' $1')}</p>
//                                 <p className="text-sm font-medium text-gray-800">{formData[field]}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <button
//                     onClick={openModal}
//                     className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800  lg:inline-flex lg:w-auto"
//                 >
//                     <svg
//                         className="fill-current"
//                         width="18"
//                         height="18"
//                         viewBox="0 0 18 18"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             fillRule="evenodd"
//                             clipRule="evenodd"
//                             d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
//                             fill="currentColor"
//                         />
//                     </svg>
//                     Edit
//                 </button>
//             </div >

//             <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//                 <div className="w-full max-w-[700px] rounded-3xl bg-white p-4 lg:p-11">
//                     <h4 className="mb-2 text-2xl font-semibold text-gray-800">Edit Personal Information</h4>
//                     <p className="mb-6 text-sm text-gray-500 lg:mb-7">
//                         Update your details to keep your profile up-to-date.
//                     </p>
//                     <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
//                         {["firstName", "lastName", "phone"].map((field) => (
//                             <div key={field}>
//                                 <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
//                                     {field.replace(/([A-Z])/g, ' $1')}
//                                 </label>
//                                 <Input
//                                     name={field}
//                                     value={formData[field]}
//                                     onChange={handleChange}
//                                     type="text"
//                                 />
//                             </div>
//                         ))}

//                         <div className="mt-4 flex justify-end">
//                             <Button type="button" onClick={handleSave} isLoading={isSaving}>
//                                 Save Changes
//                             </Button>
//                         </div>
//                     </form>
//                 </div>
//             </Modal>
//         </div >
//     );
// }




import React, { useEffect, useState } from "react";
import { useModal } from "../../Hooks/useModal";
import { Modal } from "../ui/model";
import Button from "../ui/button/Button";
import Input from "../../form/input/InputField";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { showSuccess, showError } from "../../utils/toastUtils";
import { onAuthStateChanged } from "firebase/auth";

export default function UserInfoCard() {
    const { isOpen, openModal, closeModal } = useModal();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState(null);
    const [uid, setUid] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                setUid(uid);

                try {
                    const docRef = doc(db, "users", uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        setFormData({
                            firstName: data.firstname || "",
                            lastName: data.lastname || "",
                            email: user.email || "", // email from Firebase Auth
                            phone: data.phone || "",
                            role: data.role || "",
                        });
                    } else {
                        console.log("User document not found");
                    }
                } catch (error) {
                    showError("Failed to fetch user data");
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log("User not authenticated");
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    const handleSave = async () => {
        if (!uid) return;

        setIsSaving(true);
        try {
            const docRef = doc(db, "users", uid);
            await updateDoc(docRef, {
                firstname: formData.firstName,
                lastname: formData.lastName,
                phone: formData.phone,
                // email and role not updated here
            });

            showSuccess("Profile updated successfully!");
            closeModal();
        } catch (error) {
            showError("Failed to update profile");
            console.error("Update error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!userData) return <div className="p-5">Loading...</div>;

    return (
        <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 lg:mb-6">Personal Information</h4>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        {["firstName", "lastName", "email", "phone", "role"].map((field, index) => (
                            <div key={index}>
                                <p className="mb-2 text-xs text-gray-500 capitalize">{field.replace(/([A-Z])/g, ' $1')}</p>
                                <p className="text-sm font-medium text-gray-800">{formData[field]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium cursor-pointer text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800  lg:inline-flex lg:w-auto"
                >
                    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill="currentColor"
                        />
                    </svg>
                    Edit
                </button>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="w-full max-w-[700px] rounded-3xl bg-white p-4 lg:p-11">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800">Edit Personal Information</h4>
                    <p className="mb-6 text-sm text-gray-500 lg:mb-7">
                        Update your details to keep your profile up-to-date.
                    </p>
                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        {["firstName", "lastName", "phone"].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-medium mb-1 text-gray-700 capitalize">
                                    {field.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <Input
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    type="text"
                                />
                            </div>
                        ))}

                        <div className="mt-8 flex justify-end gap-4">
                            <Button onClick={closeModal} type="button" variant="secondary">
                                Cancel
                            </Button>
                            {/* <Button onClick={handleSave} type="button" variant="primary">
                                                      Save
                                                  </Button> */}

                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2"
                            >
                                {isSaving && (
                                    <svg
                                        className="w-4 h-4 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4l-3 3 3 3H4z"
                                        ></path>
                                    </svg>
                                )}
                                {isSaving ? "Saving..." : "Save"}
                            </Button>


                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
