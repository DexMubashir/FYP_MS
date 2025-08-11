import api from "../utils/api";

export const getAdminAnalytics = async (token) => {
  const response = await api.get("/fyps/analytics/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
