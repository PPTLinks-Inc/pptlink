/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {FaExpand} from 'react-icons/fa'

import React from "react";
import {
  Worker,
  Icon,
  MinimalButton,
  Position,
  SpecialZoomLevel,
  Tooltip,
  Viewer,
} from "@react-pdf-viewer/core";
import {
  pageNavigationPlugin,
  RenderGoToPageProps,
} from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

import disableScrollPlugin from "./disableScrollPlugin";

const Slide = ({ fileUrl }) => {
  const disableScrollPluginInstance = disableScrollPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div
        className="rpv-core__viewer full-screen"
        style={{
          height: "550px",
          border: "1px solid black",
        //   margin: "auto",
          width: '70vw',
          display:'flex !important' ,
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            left: '-3rem',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <GoToPreviousPage>
            {(props) => (
              <Tooltip
                position={Position.BottomCenter}
                target={
                  <MinimalButton onClick={props.onClick}>
                    <Icon size={16}>
                      <path d="M18.4.5,5.825,11.626a.5.5,0,0,0,0,.748L18.4,23.5" />
                    </Icon>
                  </MinimalButton>
                }
                content={() => "Previous page"}
                offset={{ left: 0, top: 8 }}
              />
            )}
          </GoToPreviousPage>
        </div>

        <div
          style={{
            right: '-3rem',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          <GoToNextPage>
            {(props) => (
              <Tooltip
                position={Position.BottomCenter}
                target={
                  <MinimalButton onClick={props.onClick}>
                    <Icon size={16}>
                      <path d="M5.651,23.5,18.227,12.374a.5.5,0,0,0,0-.748L5.651.5" />
                    </Icon>
                  </MinimalButton>
                }
                content={() => "Next page"}
                offset={{ left: 0, top: 8 }}
              />
            )}
          </GoToNextPage>
        </div>

        <Viewer
          fileUrl="/PCB.pdf"
          plugins={[disableScrollPluginInstance, pageNavigationPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
        />
      </div>
      <button className='absolute bottom-12 right-0 '> 
      <FaExpand size={'30px'} color='black' />
      </button>
    </Worker>
  );
};

export default Slide;
