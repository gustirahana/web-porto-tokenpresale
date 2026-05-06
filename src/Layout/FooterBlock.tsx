import React from "react";

import logoDark from '../assets/images/logo-dark.svg'
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";


const FooterBlock = () => {
    return (
        <React.Fragment>
            <div className="auth-sidefooter">
                <Row>
                    <div className="col my-1">
                        <p className="m-0">&#169; SP ADST 2025</p>
                    </div>
                </Row>
            </div>
        </React.Fragment>
    );
};

export default FooterBlock;