"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

/// LIFESAVER WHAT A FUNCTION
// appends data into formData
function appendFormData(formData, data, parentKey = "") {
  if (data && typeof data === "object" && !(data instanceof File)) {
    // Iterate over each key in the object
    Object.keys(data).forEach((key) => {
      appendFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else {
    // Append the field if it's not an object (base case)
    formData.append(parentKey, data);
  }
}

async function fetchPropertyData(formData) {
  const res = await fetch("/api/properties", {
    method: "POST",
    // headers: {
    // "Content-Type": "application/json",
    // "Content-Type": "multipart/form-data",
    // },
    body: formData,
  });

  const data = await res.json();
  return data;
}

function AddPropertyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const routeTo = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      name: "",
      description: "",
      location: {
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
      beds: "",
      baths: "",
      square_feet: "",
      amenities: [],
      rates: {
        weekly: "",
        monthly: "",
        nightly: "",
      },
      seller_info: {
        name: "",
        email: "",
        phone: "",
      },
      images: [],
    },
  });

  const onSumbit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      appendFormData(formData, data);
      reset();
      const resp = await fetchPropertyData(formData);
      routeTo.push(`/properties/${resp}`);
      toast.success("Property Created");
    } catch (err) {
      console.log(err);
      toast.error("Failed To Create");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="cursor-not-allowed absolute opacity-50 bg-[#ffffff] top-0 w-full h-full left-0 right-0 bottom-0 z-10"></div>
      )}
      <form encType="multipart/form-data" onSubmit={handleSubmit(onSumbit)}>
        <h2 className="mb-6 text-3xl font-semibold text-center text-blue-600">
          Add Property
        </h2>

        <div className="relative mb-4">
          <label htmlFor="type" className="block mb-2 font-bold text-gray-700">
            Property Type
          </label>
          <select
            id="type"
            name="type"
            className="w-full px-3 py-2 border rounded"
            {...register("type", {
              required: "Please Specify Type",
            })}
          >
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="House">House</option>
            <option value="Cabin Or Cottage">Cabin or Cottage</option>
            <option value="Room">Room</option>
            <option value="Studio">Studio</option>
            <option value="Other">Other</option>
          </select>
          {errors?.type?.message && (
            <div className="flex items-center gap-2 px-1 font-mono text-xs font-bold">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-500">{errors?.type?.message}</span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Listing Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border rounded"
            placeholder="eg. Beautiful Apartment In Delhi"
            {...register("name", { required: "Enter Name of your listing" })}
          />
          {errors?.name?.message && (
            <div className="flex items-center gap-2 px-1 font-mono text-xs font-bold">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-500">{errors?.name?.message}</span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 font-bold text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border rounded"
            rows="4"
            placeholder="Add an optional description of your property"
            {...register("description")}
          ></textarea>
        </div>

        <div className="p-4 mb-4 bg-blue-50">
          <label className="block mb-2 font-bold text-gray-700">Location</label>
          <div className="relative">
            <input
              type="text"
              id="address"
              name="location.address"
              className="w-full px-3 py-2 mb-2 border rounded"
              placeholder="Address"
              {...register("location.address", {
                required: "Provide address name",
              })}
            />
            {errors?.location?.address?.message && (
              <div className="absolute top-[40%] -translate-y-1/2 right-0 flex items-center px-1 font-mono text-xs font-bold gap-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-red-500">
                  {errors?.location?.address?.message}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              id="city"
              name="location.city"
              className="w-full px-3 py-2 mb-2 border rounded"
              placeholder="City"
              {...register("location.city", { required: "Provide city name" })}
            />
            {errors?.location?.city?.message && (
              <div className="absolute top-[40%] -translate-y-1/2 right-0 flex items-center px-1 font-mono text-xs font-bold gap-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-red-500">
                  {errors?.location?.city?.message}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              id="state"
              name="location.state"
              className="w-full px-3 py-2 mb-2 border rounded"
              placeholder="State"
              {...register("location.state", {
                required: "Provide state name",
              })}
            />
            {errors?.location?.state?.message && (
              <div className="absolute top-[40%] -translate-y-1/2 right-0 flex items-center px-1 font-mono text-xs font-bold gap-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-red-500">
                  {errors?.location?.state?.message}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              id="pincode"
              name="location.pincode"
              className="w-full px-3 py-2 mb-2 border rounded"
              placeholder="Pincode"
              {...register("location.pincode", { required: "Provide pincode" })}
            />
            {errors?.location?.pincode?.message && (
              <div className="absolute top-[40%] -translate-y-1/2 right-0 flex items-center px-1 font-mono text-xs font-bold gap-x-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-red-500">
                  {errors?.location?.pincode?.message}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap mb-4">
          <div className="w-full pr-2 sm:w-1/3">
            <label
              htmlFor="beds"
              className="block mb-2 font-bold text-gray-700"
            >
              Beds
            </label>
            <input
              type="number"
              id="beds"
              name="beds"
              className="w-full px-3 py-2 border rounded"
              {...register("beds", { required: true })}
            />
          </div>
          <div className="w-full px-2 sm:w-1/3">
            <label
              htmlFor="baths"
              className="block mb-2 font-bold text-gray-700"
            >
              Baths
            </label>
            <input
              type="number"
              id="baths"
              name="baths"
              className="w-full px-3 py-2 border rounded"
              {...register("baths", { required: true })}
            />
          </div>
          <div className="w-full pl-2 sm:w-1/3">
            <label
              htmlFor="square_feet"
              className="block mb-2 font-bold text-gray-700"
            >
              Square Feet
            </label>
            <input
              type="number"
              id="square_feet"
              name="square_feet"
              className="w-full px-3 py-2 border rounded"
              {...register("square_feet", { required: true })}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700">
            Amenities
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <div>
              <input
                type="checkbox"
                id="amenity_wifi"
                name="amenities"
                value="Wifi"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_wifi">Wifi</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_kitchen"
                name="amenities"
                value="Full kitchen"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_kitchen">Full kitchen</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_washer_dryer"
                name="amenities"
                value="Washer & Dryer"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_free_parking"
                name="amenities"
                value="Free Parking"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_free_parking">Free Parking</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_pool"
                name="amenities"
                value="Swimming Pool"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_pool">Swimming Pool</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_hot_tub"
                name="amenities"
                value="Hot Tub"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_hot_tub">Hot Tub</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_24_7_security"
                name="amenities"
                value="24/7 Security"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_24_7_security">24/7 Security</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_wheelchair_accessible"
                name="amenities"
                value="Wheelchair Accessible"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_wheelchair_accessible">
                Wheelchair Accessible
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_elevator_access"
                name="amenities"
                value="Elevator Access"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_elevator_access">Elevator Access</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_dishwasher"
                name="amenities"
                value="Dishwasher"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_dishwasher">Dishwasher</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_gym_fitness_center"
                name="amenities"
                value="Gym/Fitness Center"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_gym_fitness_center">
                Gym/Fitness Center
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_air_conditioning"
                name="amenities"
                value="Air Conditioning"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_balcony_patio"
                name="amenities"
                value="Balcony/Patio"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_smart_tv"
                name="amenities"
                value="Smart TV"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_smart_tv">Smart TV</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_coffee_maker"
                name="amenities"
                value="Coffee Maker"
                className="mr-2"
                {...register("amenities")}
              />
              <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
            </div>
          </div>
        </div>

        <div className="p-4 mb-4 bg-blue-50">
          <label className="block mb-2 font-bold text-gray-700">
            Rates (Leave blank if not applicable)
          </label>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="weekly_rate" className="mr-2">
                Weekly
              </label>
              <input
                type="number"
                id="weekly_rate"
                name="rates.weekly"
                className="w-full px-3 py-2 border rounded"
                {...register("rates.weekly", { required: true })}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="monthly_rate" className="mr-2">
                Monthly
              </label>
              <input
                type="number"
                id="monthly_rate"
                name="rates.monthly"
                className="w-full px-3 py-2 border rounded"
                {...register("rates.monthly")}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="nightly_rate" className="mr-2">
                Nightly
              </label>
              <input
                type="number"
                id="nightly_rate"
                name="rates.nightly"
                className="w-full px-3 py-2 border rounded"
                {...register("rates.nightly")}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="seller_name"
            className="block mb-2 font-bold text-gray-700"
          >
            Seller Name
          </label>
          <input
            type="text"
            id="seller_name"
            name="seller_info.name"
            className="w-full px-3 py-2 border rounded"
            placeholder="Name"
            {...register("seller_info.name", {
              required: "Provide  your name",
            })}
          />
          {errors?.seller_info?.name?.message && (
            <div className="flex items-center px-1 font-mono text-xs font-bold gap-x-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-500">
                {errors?.seller_info?.name?.message}
              </span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_email"
            className="block mb-2 font-bold text-gray-700"
          >
            Seller Email
          </label>
          <input
            type="email"
            id="seller_email"
            name="seller_info.email"
            className="w-full px-3 py-2 border rounded"
            placeholder="Email address"
            {...register("seller_info.email", {
              required: "Provide your email",
            })}
          />
          {errors?.seller_info?.email?.message && (
            <div className="flex items-center px-1 font-mono text-xs font-bold gap-x-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-500">
                {errors?.seller_info?.email?.message}
              </span>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_phone"
            className="block mb-2 font-bold text-gray-700"
          >
            Seller Phone
          </label>
          <input
            type="tel"
            id="seller_phone"
            name="seller_info.phone"
            className="w-full px-3 py-2 border rounded"
            placeholder="Phone"
            {...register("seller_info.phone", {
              required: "Provide your contact info",
            })}
          />
          {errors?.seller_info?.phone?.message && (
            <div className="flex items-center px-1 font-mono text-xs font-bold gap-x-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-500">
                {errors?.seller_info?.phone?.message}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="images"
            className="block mb-2 font-bold text-gray-700"
          >
            Images (Select up to 4 images)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
            multiple
            {...register("images", { required: "Enter atleast 1 image" })}
          />
          {errors?.images?.message && (
            <div className="flex items-center px-1 font-mono text-xs font-bold gap-x-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-500">{errors?.images?.message}</span>
            </div>
          )}
        </div>

        <div>
          <button
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline disabled:cursor-not-allowed disabled:bg-opacity-35"
            type="submit"
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <ClipLoader size={24} color="#3b82f6" />
            ) : (
              "Add Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPropertyForm;
