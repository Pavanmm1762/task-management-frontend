import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export function DeleteModal({ showModal, setShowModal, data, onConfirm }) {
    return (
        <Dialog open={showModal} size="xs" onClose={() => setShowModal(false)} className="dark:bg-main-dark-bg dark:text-white">
            <DialogHeader>Delete {data?.type}</DialogHeader>
            <DialogBody>
                Are you sure you want to delete this {data?.type} -{" "}
                <span className="bg-gray-200 capitalize border-b border-gray-300 dark:border-gray-600 px-1 dark:bg-gray-500">
                    {data?.name}
                </span>{" "}?
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="green"
                    onClick={() => setShowModal(false)}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="red" onClick={() => onConfirm()}>
                    <span>Delete</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
