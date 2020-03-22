import React from "react";
import PropTypes from "prop-types";

import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";

import { confirmable, createConfirmation } from "react-confirm";

class Confirmation extends React.Component {
    render() {
        const {
            proceedLabel,
            cancelLabel,
            title,
            colorButton,
            confirmation,
            show,
            proceed
        } = this.props;
        return (
            <Modal
                className="modal-dialog-centered"
                toggle={() => proceed(false)}
                isOpen={show}

            >
                <ModalHeader>
                    {title} 
                </ModalHeader>
                <ModalBody>{confirmation}</ModalBody>
                <ModalFooter>
                    <Button onClick={() => proceed(false)}>{cancelLabel}</Button>
                    <Button
                        color={colorButton}
                        onClick={() => proceed(true)}
                    >
                        {proceedLabel}
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

Confirmation.propTypes = {
    okLabbel: PropTypes.string,
    cancelLabel: PropTypes.string,
    title: PropTypes.string,
    colorButton: PropTypes.string,
    confirmation: PropTypes.string,
    show: PropTypes.bool,
    proceed: PropTypes.func,
    enableEscape: PropTypes.bool
};

export function confirm(
    confirmation,
    proceedLabel = "OK",
    cancelLabel = "cancel",
    title,
    colorButton,
    options = {}
) {
    return createConfirmation(confirmable(Confirmation))({
        confirmation,
        proceedLabel,
        cancelLabel,
        title,
        colorButton,
        ...options
    });
}