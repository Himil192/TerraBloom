


// import { useModal } from "../../Hooks/useModal";
// import React, { useEffect, useState } from "react";
// import { Modal } from "../ui/model";
// import Button from "../ui/button/Button";
// import Input from "../../form/input/InputField";
// import Label from "../../form/switch/Label";
// import { db, auth } from "../../firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { showSuccess, showError } from "../../utils/toastUtils";
// import { onAuthStateChanged } from "firebase/auth";

// export default function UserMetaCard() {
//     const [user, setUser] = useState(null);
//     const [imageUrl, setImageUrl] = useState("/images/user/owner.jpg");
//     const [uploading, setUploading] = useState(false);
//     const { isOpen, openModal, closeModal } = useModal();
//     const [userData, setUserData] = useState(null);
//     const [uid, setUid] = useState(null);
//     const [isSaving, setIsSaving] = useState(false);
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         profilePicture: "",
//         role: "",
//     });
//     const [showImagePreview, setShowImagePreview] = useState(false);


//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("upload_preset", "user_profiles");

//         try {
//             setUploading(true);
//             const res = await fetch("https://api.cloudinary.com/v1_1/dkortynzs/image/upload", {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await res.json();
//             if (data.secure_url) {
//                 setImageUrl(data.secure_url);
//                 showSuccess("Image uploaded successfully!");
//             }
//         } catch (error) {
//             showError("Image upload failed.");
//             console.error("Image upload error:", error);
//         } finally {
//             setUploading(false);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 setUser(user);
//                 const uid = user.uid;
//                 setUid(uid);

//                 try {
//                     const docRef = doc(db, "users", uid);
//                     const docSnap = await getDoc(docRef);

//                     if (docSnap.exists()) {
//                         const data = docSnap.data();
//                         setUserData(data);
//                         setFormData({
//                             firstName: data.firstname || "",
//                             lastName: data.lastname || "",
//                             email: user.email || "",
//                             profilePicture: data.photoURL || "",
//                             role: data.role || "",
//                         });
//                         setImageUrl(data.photoURL || "");
//                     }
//                 } catch (error) {
//                     showError("Failed to fetch user data");
//                     console.error("Error fetching user data:", error);
//                 }
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     const handleSave = async () => {
//         try {
//             if (!uid) return;
//             setIsSaving(true);
//             const docRef = doc(db, "users", uid);
//             await updateDoc(docRef, {
//                 photoURL: imageUrl,
//             });

//             showSuccess("Profile picture updated successfully!");
//             closeModal();
//         } catch (error) {
//             showError("Failed to update profile picture.");
//             console.error("Update error:", error);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <>
//             <div className="p-5 border  border-gray-200 rounded-2xl lg:p-6">
//                 <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//                     <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
//                         <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full">
//                             {/* {imageUrl ? (
//                                 <img src={imageUrl} alt="user" className="object-cover w-full h-full" />
//                             ) : (
//                                 <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700">
//                                     {(formData.firstName || "U")
//                                         .split(" ")
//                                         .map((word) => word.charAt(0))
//                                         .join("")
//                                         .toUpperCase()
//                                         .substring(0, 2)}
//                                 </div>
//                             )} */}
//                             {imageUrl ? (
//                                 <img
//                                     src={imageUrl}
//                                     alt="user"
//                                     className="object-cover w-full h-full cursor-pointer"
//                                     onClick={() => setShowImagePreview(true)}
//                                 />
//                             ) : (
//                                 <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700">
//                                     {(formData.firstName || "U")
//                                         .split(" ")
//                                         .map((word) => word.charAt(0))
//                                         .join("")
//                                         .toUpperCase()
//                                         .substring(0, 2)}
//                                 </div>
//                             )}
//                             <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//                                 <div className="relative">
//                                     {/* Close Button */}
//                                     <button
//                                         onClick={closeModal}
//                                         className="absolute top-2 right-2 text-gray-100 text-3xl z-10"
//                                     >
//                                         &times;
//                                     </button>

//                                     {/* Large Image Preview */}
//                                     <img
//                                         src={imageUrl}
//                                         alt="Preview"
//                                         className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
//                                     />
//                                 </div>
//                             </Modal>

//                         </div>
//                         <div className="order-3 xl:order-2">
//                             <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left">
//                                 {formData.firstName} {formData.lastName}
//                             </h4>
//                             <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
//                                 <p className="text-sm text-gray-500">{formData.role}</p>
//                                 <div className="hidden h-3.5 w-px bg-gray-300 xl:block"></div>
//                                 <p className="text-sm text-gray-500">{formData.email}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <button
//                         onClick={openModal}
//                         className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 cursor-pointer lg:inline-flex lg:w-auto"
//                     >
//                         <svg
//                             className="fill-current"
//                             width="18"
//                             height="18"
//                             viewBox="0 0 18 18"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 clipRule="evenodd"
//                                 d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
//                             />
//                         </svg>
//                         Edit
//                     </button>
//                 </div>
//             </div>

//             {/* Modal content */}
//             <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
// <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl lg:p-11">
//     <div className="px-2 pr-14">
//         <h4 className="mb-2 text-2xl font-semibold text-gray-800">
//             Edit Personal Information
//         </h4>
//         <p className="mb-6 text-sm text-gray-500 lg:mb-7">
//             Update your profile picture below.
//         </p>

//         <div className="mb-5">
//             <Label text="Profile Picture" />
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="mt-2"
//             />
//             {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
//             {imageUrl && (
//                 <img
//                     src={imageUrl}
//                     alt="Preview"
//                     className="mt-4 w-24 h-24 rounded-full object-cover"
//                 />
//             )}
//         </div>

//         <div className="mt-8 flex justify-end gap-4">
//             <Button onClick={closeModal} type="button" variant="secondary">
//                 Cancel
//             </Button>
//             {/* <Button onClick={handleSave} type="button" variant="primary">
//                                                              Save
//                                                          </Button> */}

//             <Button
//                 type="button"
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="flex items-center gap-2"
//             >
//                 {isSaving && (
//                     <svg
//                         className="w-4 h-4 animate-spin text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                     >
//                         <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                         ></circle>
//                         <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4l-3 3 3 3H4z"
//                         ></path>
//                     </svg>
//                 )}
//                 {isSaving ? "Saving..." : "Save"}
//             </Button>


//         </div>

//     </div>
// </div>
//             </Modal >
//         </>
//     );
// }


import { useModal } from "../../Hooks/useModal";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/model";
import Button from "../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/switch/Label";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { showSuccess, showError } from "../../utils/toastUtils";
import { onAuthStateChanged } from "firebase/auth";

export default function UserMetaCard() {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState("/images/user/owner.jpg");
    const [uploading, setUploading] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
    const [userData, setUserData] = useState(null);
    const [uid, setUid] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profilePicture: "",
        role: "",
    });
    const [showImagePreview, setShowImagePreview] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "user_profiles");

        try {
            setUploading(true);
            const res = await fetch("https://api.cloudinary.com/v1_1/dkortynzs/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.secure_url) {
                setImageUrl(data.secure_url);
                showSuccess("Image uploaded successfully!");
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            showError("Image upload failed.");
            console.error("Image upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
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
                            email: user.email || "",
                            profilePicture: data.photoURL || "",
                            role: data.role || "",
                        });
                        setImageUrl(data.photoURL || "/images/user/owner.jpg");
                    }
                } catch (error) {
                    showError("Failed to fetch user data");
                    console.error("Error fetching user data:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        try {
            if (!uid) return;
            setIsSaving(true);
            const docRef = doc(db, "users", uid);
            await updateDoc(docRef, {
                photoURL: imageUrl,
            });

            showSuccess("Profile picture updated successfully!");
            closeModal();
        } catch (error) {
            showError("Failed to update profile picture.");
            console.error("Update error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full relative group">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="user"
                                    className="object-cover w-full h-full cursor-pointer"
                                    onClick={() => setShowImagePreview(true)}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700">
                                    {(formData.firstName || "U")
                                        .split(" ")
                                        .map((word) => word.charAt(0))
                                        .join("")
                                        .toUpperCase()
                                        .substring(0, 2)}
                                </div>
                            )}
                            {showImagePreview && (
                                <Modal isOpen={showImagePreview} onClose={() => setShowImagePreview(false)} className="max-w-[700px] m-4">
                                    <div className="relative">

                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
                                        />
                                    </div>
                                </Modal>
                            )}
                        </div>

                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left">
                                {formData.firstName} {formData.lastName}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500">{formData.role}</p>
                                <div className="hidden h-3.5 w-px bg-gray-300 xl:block"></div>
                                <p className="text-sm text-gray-500">{formData.email}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 cursor-pointer lg:inline-flex lg:w-auto"
                    >
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.27339 14.6934 5.56629L14.0305 6.2292L11.0618 3.26047L11.7247 2.59756C12.0176 2.30466 12.4925 2.30466 12.7854 2.59756L12.9698 2.78206Z"
                            />
                        </svg>
                        Edit
                    </button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800">
                            Edit Personal Information
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 lg:mb-7">
                            Update your profile picture below.
                        </p>

                        <div className="mb-5">
                            <Label text="Profile Picture" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mt-2"
                            />
                            {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="mt-4 w-24 h-24 rounded-full object-cover"
                                />
                            )}
                        </div>

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

                    </div>
                </div>
            </Modal>
        </>
    );
}
