import React from "react";

const Table = ({ allShipmentsData, setCreateShipmentModel }) => {
  const converTime = (time) => {
    const date = new Date(time);
    const dayTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
    return dayTime;
  };

  console.log("allShipmentsData", allShipmentsData);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Create Tracking
          </h3>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi a
            adipisci, nesciunt officiis vero atque? Aperiam quia exercitationem
            reiciendis! Eligendi dolore fugiat minus unde! Itaque quisquam
            aperiam blanditiis quod earum!
          </p>
        </div>
        <div className="mt-3 md:mt-0">
          <p
            onClick={() => setCreateShipmentModel(true)}
            href="javascript:void(0)"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-gray-800 hover:bg-gray-700 
            active:bg-gray-900 md:text-sm rounded-lg md:inline-flex">
            Add Tracking
          </p>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Sender</th>
              <th className="py-3 px-6">Receiver</th>
              <th className="py-3 px-6">Pickup Time</th>
              <th className="py-3 px-6">Distance</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Delivery Time</th>
              <th className="py-3 px-6">Paid</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {allShipmentsData?.map((shipment, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.sender.slice(0, 15)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.receiver.slice(0, 15)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {converTime(shipment.pickupTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.distance} Km
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.deliveryTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.isPaid ? "Completed" : "Not Completed"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shipment.status == 0
                    ? "Pending"
                    : shipment.status == 1
                    ? "In Transit"
                    : "Delivered"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
