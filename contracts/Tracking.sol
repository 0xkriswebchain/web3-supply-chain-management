// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracking {
    enum ShipmentStatus {
        Pending,
        InTransit,
        Delivered
    }

    // Shipment struct for backend
    struct Shipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    // TypeShipment struct for front-end
    struct TypeShipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    TypeShipment[] typeShipments;

    mapping(address => Shipment[]) public shipments;

    uint256 public shipmentCount;

    event ShipmentCreated(
        address indexed sender, address indexed receiver, uint256 pickupTime, uint256 distance, uint256 price
    );
    event ShipInTransit(address indexed sender, address indexed receiver, uint256 pickupTime);
    event ShipmentDelivered(address indexed sender, address indexed receiver, uint256 deliveryTime);
    event ShipmentPaid(address indexed sender, address indexed receiver, uint256 amount);

    constructor() {
        shipmentCount = 0;
    }

    function createShipment(address _receiver, uint256 _pickupTime, uint256 _distance, uint256 _price) public payable {
        require(msg.value >= _price, "Insufficient payment for creating shipment");
        require(_receiver != address(0), "Invalid address");

        Shipment memory shipment =
            Shipment(msg.sender, _receiver, _pickupTime, 0, _distance, _price, ShipmentStatus.Pending, false);

        shipments[msg.sender].push(shipment);
        shipmentCount++;

        typeShipments.push(
            TypeShipment(msg.sender, _receiver, _pickupTime, 0, _distance, _price, ShipmentStatus.Pending, false)
        );

        emit ShipmentCreated(msg.sender, _receiver, _pickupTime, _distance, _price);
    }

    function startShipment(address _sender, address _receiver, uint256 _index) public {
        Shipment storage shipment = shipments[_sender][_index]; // get the shipment by index
        TypeShipment storage typeShipment = typeShipments[_index]; // get the typeShipment by index

        require(shipment.receiver == _receiver, "Invalid receiver address");
        require(shipment.status == ShipmentStatus.Pending, "Shipment is not pending");

        shipment.status = ShipmentStatus.InTransit;
        typeShipment.status = ShipmentStatus.InTransit;

        emit ShipInTransit(_sender, _receiver, shipment.pickupTime);
    }

    function completeShipment(address _sender, address _receiver, uint256 _index) public {
        Shipment storage shipment = shipments[_sender][_index]; // get the shipment by index
        TypeShipment storage typeShipment = typeShipments[_index]; // get the typeShipment by index

        require(shipment.receiver == _receiver, "Invalid receiver address");
        require(shipment.status == ShipmentStatus.InTransit, "Shipment is not in transit");
        require(!shipment.isPaid, "Shipment already paid");

        shipment.status = ShipmentStatus.Delivered;
        shipment.deliveryTime = block.timestamp;
        typeShipment.status = ShipmentStatus.Delivered;
        typeShipment.deliveryTime = block.timestamp;

        uint256 amount = shipment.price;
        payable(shipment.sender).transfer(amount);
        shipment.isPaid = true;
        typeShipment.isPaid = true;

        emit ShipmentDelivered(_sender, _receiver, shipment.deliveryTime);
        emit ShipmentPaid(_sender, _receiver, amount);
    }

    function getShipment(address _sender, uint256 _index)
        public
        view
        returns (address, address, uint256, uint256, uint256, uint256, ShipmentStatus, bool)
    {
        Shipment memory shipment = shipments[_sender][_index];
        return (
            shipment.sender,
            shipment.receiver,
            shipment.pickupTime,
            shipment.deliveryTime,
            shipment.distance,
            shipment.price,
            shipment.status,
            shipment.isPaid
        );
    }

    function getShipmentCount(address _sender) public view returns (uint256) {
        return shipments[_sender].length;
    }

    function getAllTransactions() public view returns (TypeShipment[] memory) {
        return typeShipments;
    }
}
