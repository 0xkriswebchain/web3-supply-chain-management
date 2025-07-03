import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "hardhat";

// Internal Import
import tracking from "../Context/Tracking.json";

const ContractAddress = process.env.NEXT_CONTRACT_ADDRESS;
const CONTRACT_ABI = tracking.abi;

// Fetch Contract

const fetchContract = (signerorProvider) => {
  new ethers.Contract(ContractAddress, CONTRACT_ABI, signerorProvider);
};

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  // State variable
  const DappName = "Tracking Dapp";
  const [currentUser, setcurrentUser] = useState("");

  const createShipment = async (shipmentData) => {
    console.log("Creating Shipment:", shipmentData);
    const { receiver, pickupTime, distance, price } = shipmentData;

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.utils.parseEther(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );

      await createItem.wait();
      console.log("Shipment created successfully:", createItem);
    } catch (error) {
      console.log("Error in creating shipment", error);
    }
  };

  const getAllShipment = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipments = await contract.getAllTransactions();
      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));

      return allShipments;
    } catch (error) {
      console.log("Error in getting all shipments", error);
    }
  };

  const getShipmentsCount = async () => {
    try {
      if (!window.ethereum) {
        return console.log("Please install MetaMask");
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipmentCount = await contract.getShipmentCount(accounts[0]);
      return shipmentCount.toNumber();
    } catch (error) {
      console.log("Error in getting shipments count", error);
    }
  };

  const completeShipment = async (completeShip) => {
    console.log("Completing Shipment:", completeShip);
    const { receiver, index } = completeShip;

    try {
      if (!window.ethereum) {
        return console.log("Please install MetaMask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );
      transaction.wait();
      console.log("Shipment completed successfully:", transaction);
    } catch (error) {
      console.log("Error in completing shipment", error);
    }
  };

  const getShipment = async (index) => {
    console.log(index * 1); // Convert index to number
    try {
      if (!window.ethereum) {
        return "Install Metamask";
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index * 1);

      const singleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };
      return singleShipment;
    } catch (error) {
      console.log("Error in getting shipment", error);
    }
  };

  const startShipment = async (getProduct) => {
    console.log("Starting Shipment:", getProduct);
    const { receiver, index } = getProduct;

    try {
      if (!window.ethereum) {
        return console.log("Please install MetaMask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index * 1,
        {
          gasLimit: 300000,
        }
      );
      shipment.wait();
      console.log("Shipment started successfully:", shipment);
    } catch (error) {
      console.log("Error in starting shipment", error);
    }
  };

  // Check Wallet Connection
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        return console.log("Please install MetaMask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setcurrentUser(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      return "Not connected to wallet";
    }
  };

  // Connect Wallet Function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return console.log("Please install MetaMask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setcurrentUser(accounts[0]);
    } catch (error) {
      console.log("Error in connecting wallet", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        DappName,
        currentUser,
        connectWallet,
        createShipment,
        getAllShipment,
        getShipmentsCount,
        completeShipment,
        getShipment,
        startShipment,
      }}>
      {children}
    </TrackingContext.Provider>
  );
};
