import { useQuery } from "@tanstack/react-query";
import UseAuth from "../UseAuth/UseAuth";
import UseAxiosCommon from "../UseAxiosCommon/UseAxiosCommon";



const UseAdmin = () => {

 const { user } = UseAuth();

  const axiosCommon = UseAxiosCommon();
  const { data: isAdmin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    queryFn: async () => {
      const response = await axiosCommon.get(`/users/admin/${user.email}`);
      console.log(response.data);
      return response.data?.admin;
    },
  });
  return [isAdmin, isAdminLoading];
};

export default UseAdmin;
