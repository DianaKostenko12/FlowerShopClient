import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface OrderModalProps {
  id: number;
  name: string;
  price: number;
  show: boolean;
  handleClose: () => void;
}

interface OrderBouquet {
  bouquetId: number;
  bouquetName: string;
  bouquetCount: number;
  bouquetPrice: number;
}

function OrderModal({ id, name, price, show, handleClose }: OrderModalProps) {
  const [count, setCount] = useState<number>(0);

  const orderBouquet = () => {
    handleClose();
    const orderBouquetInfo = {
      bouquetId: id,
      bouquetName: name,
      bouquetCount: count,
      bouquetPrice: price,
    };

    const existingOrdersJson = localStorage.getItem("orderBouquets");
    const existingOrders: OrderBouquet[] = existingOrdersJson
      ? JSON.parse(existingOrdersJson)
      : [];

    const existingBouquetIndex = existingOrders.findIndex(
      (bouquet) => bouquet.bouquetId === id,
    );

    if (existingBouquetIndex !== -1) {
      existingOrders[existingBouquetIndex].bouquetCount += count;
    } else {
      existingOrders.push(orderBouquetInfo);
    }

    localStorage.setItem("orderBouquets", JSON.stringify(existingOrders));
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Введіть бажану к-сть букетів</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="number"
            className="form-control form-control-sm"
            value={count}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) {
                setCount(value);
              } else {
                alert("Введіть тільки додатне число!");
              }
            }}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрити
          </Button>
          <Button variant="primary" onClick={orderBouquet}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderModal;
