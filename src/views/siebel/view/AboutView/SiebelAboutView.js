import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCollapse,
} from "@coreui/react";

import "./SiebelAboutView.css";

const SiebelAboutView = () => {
  const [accordion, setAccordion] = useState(0);

  return (
    <CCard>
      <CCardHeader className="header-first-lvl">
        ABOUT SIEBEL
        <small className="small-text-muted"> view </small>
      </CCardHeader>

      <CCardBody className="body-first-lvl">
        <CCard>
          <CCardHeader id="headingOne" className="collapse-header">
            <CButton
              block
              className="text-left m-0 p-0"
              onClick={() => setAccordion(accordion === 0 ? null : 0)}
            >
              <h5 className="m-0 p-0">Siebel</h5>
            </CButton>
          </CCardHeader>
          <CCollapse show={accordion === 0}>
            <CCardBody className="collapse-body">
              <b>Siebel</b>&nbsp;— американская компания, производитель
              программного обеспечения для организаций, пионер и долговременный
              лидер рынка CRM-систем , поглощённая в начале 2006 года
              корпорацией Oracle за $ 5,8&nbsp;млрд. Основана в 1993 году
              Томасом Зибелем ( англ. &nbsp; Thomas Siebel ), руководившим
              компанией всё время её существования и Патрисией Хаус ( англ.
              &nbsp; Patricia House ). Основной продукт компании&nbsp;—
              одноимённая тиражируемая система управления взаимоотношениями с
              клиентами, с 2006 года распространяемая новым правообладателем под
              наименованием Oracle Siebel CRM .
              <br />
              Фигурировала под официальными наименованиями{" "}
              <b>Siebel Systems, Inc.</b>, <b>Siebel CRM Systems, Inc.</b>
            </CCardBody>
          </CCollapse>
        </CCard>
        <CCard>
          <CCardHeader id="headingTwo" className="collapse-header">
            <CButton
              block
              className="text-left m-0 p-0"
              onClick={() => setAccordion(accordion === 1 ? null : 1)}
            >
              <h5 className="m-0 p-0">История</h5>
            </CButton>
          </CCardHeader>
          <CCollapse show={accordion === 1}>
            <CCardBody className="collapse-body">
              Компания основана в 1993 году Томасом Зибелем и Патрисией Хаус в
              городе Сан-Матео ( штат Калифорния ). В 1980-е годы основатели
              компании работали в корпорации Oracle , позднее Зибель занимал
              пост генерального директора компании Gain Technology , которая
              была поглощена корпорацией Sybase в 1992 году. Хаус заняла пост
              вице-президента по маркетингу, а руководил компанией Зибель.
              Основной целью компания ставила создание программной системы для
              крупных организаций, обеспечивающей управление всеми аспектами
              взаимоотношений с заказчиками.
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCardBody>
    </CCard>
  );
};

export default SiebelAboutView;
