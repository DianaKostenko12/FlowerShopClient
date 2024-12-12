import React, { FC, ReactNode } from "react";
import cl from "./MyModal.module.css";

interface MyModalProps {
  children: ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
const MyModal: FC<MyModalProps> = ({ children, visible, setVisible }) => {
  const rootClasses = [cl.myModal];
  if (visible) {
    rootClasses.push(cl.active);
  }
  return (
    <div className={rootClasses.join("")}>
      <div className={cl.myModalContent}>{children}</div>
    </div>
  );
};

export default MyModal;
