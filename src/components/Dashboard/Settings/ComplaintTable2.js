import React, { useState, useEffect } from "react";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllComplaints,
  fetchResolvedComplaintsAPI, // Import your API functions for resolved and unresolved complaints
  fetchUnresolvedComplaintsAPI,
  deleteComplaint,
} from "../../services/operations/ComplaintAPI";
import { formattedDate } from "../../utils/dateFormatter";
import { FaCheck } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiClock } from "react-icons/hi";
import ConfirmationModal from "../common/ConfirmationModal";

const ComplaintTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 30;

  const [complaints, setComplaints] = useState([]);

  const handleComplaintDelete = async (complaintId) => {
    setLoading(true);
    await deleteComplaint({ complaintId: complaintId }, token);
    const result = await fetchAllComplaints(token);
    if (result) {
      dispatch(setComplaints(result));
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  // ... (rest of the component remains unchanged)

  return (
    <>
      {/* Add a dropdown or buttons to select the filter type (all, resolved, unresolved) */}
      <Table className="rounded-xl border border-richblack-800 ">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-yellow-100 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-slate-200">
              Complaints
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-slate-200">
              Date
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-slate-200">
              UpVote
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-slate-200">
              DownVote
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {complaints?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Complaint found
                {/* TODO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            complaints?.map((complaint) => (
              <Tr
                key={complaint._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={complaint?.img}
                    alt={complaint?.title}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {complaint.body.split(" ").length > TRUNCATE_LENGTH
                        ? complaint.body
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : complaint.body}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {formattedDate(complaint.createdAt)}
                    </p>
                    {complaint.isResolved ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Resolved
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Unresolved
                      </p>
                    )}
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  {/* it will chnage after */}
                  Upvote Icon
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  DownVote Icon
                </Td>
                <Td className="text-sm font-medium text-richblack-100 ">
                  {/* <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button> */}
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this Complaint?",
                        text2:
                          "All the data related to this Complaint will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleComplaintDelete(complaint._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default ComplaintTable;
