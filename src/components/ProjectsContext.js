import React, { useState, useEffect, useContext } from "react";
import { FeedbackContext } from "../../shared/contexts/FeedbackContext";

import { get, post, $delete } from "../../util/axios";
import { useDispatch,useSelector } from "react-redux";
import { setPrjcts } from "dashboard/features/dashboardSlice";

export const ProjectsContext = React.createContext({
  allProjects:[],
  projects: [],
  loading: true,
  load: true,
  totalPages: 0,
  currentPage: 1,
  projectsPerPage: "",
  showComplete:"",
  submitNewProject: () => {},
  deleteProject: () => {},
  refreshData: () => {},
  getAllProject:()=>{},
});

export const ProjectsContextProvider = ({ children }) => {
  const { showErrorToast } = useContext(FeedbackContext);

  const [loading, setLoading] = useState(true);
  const [load, setLoad] = useState(true);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage, setProjectsPerPage] = useState("");
  const [showComplete,setShowComplete]=useState("")
  const [allProjects, setAllProjects] = useState([])

  const dispatch = useDispatch();
  const isLoaded = useSelector((state) => state.dashboard.isLoaded);
  const dashboardData = useSelector((state) => state.dashboard.items);


  const refreshData = (page = 1) => {
    if (isLoaded) {
      setProjects(dashboardData);
      setTotalPages(totalPages);
      setCurrentPage(page > totalPages ? 1 : page);
      setLoading(false);
    } else {
      const onSuccess = (response) => {
        const { data, totalPages } = response;
        setProjects(data);
        // dispatch(setPrjcts(data)); 
        setTotalPages(totalPages);
        setCurrentPage(page > totalPages ? 1 : page);
        setLoading(false);
      };
      const onError = (err) => {
        showErrorToast(err);
        setLoading(false);
      };


      if (projectsPerPage === "All") {
        get(
          `/api/projects?projectsPerPage=${projectsPerPage}&complete=${showComplete}`,
          onSuccess,
          onError
        );
      } else {
        get(
          `/api/projects?page=${page}&projectsPerPage=${
            projectsPerPage === "" ? 20 : projectsPerPage
          }&complete=${showComplete}`,
          onSuccess,
          onError
        );
      }
    }
  };


  // const refreshData = (page = 1) => {
  //   const onSuccess = (response) => {
  //     const { data, totalPages } = response;
  //     setProjects(data);
  //   //  dispatch(setPrjcts(data));
  //     setTotalPages(totalPages);
  //     setCurrentPage(page > totalPages ? 1 : page);
  //     setLoading(false);
  //   };
  //   const onError = (err) => {
  //     showErrorToast(err);
  //     setLoading(false);
  //   };

  //   if (projectsPerPage === "All") {
  //     get(`/api/projects?projectsPerPage=${projectsPerPage}&complete=${showComplete}`, onSuccess, onError);
  //   } else {
  //     get(`/api/projects?page=${page}&projectsPerPage=${projectsPerPage === "" ? 20 : projectsPerPage}&complete=${showComplete}`, onSuccess, onError);
  //   } 
  // };

  const getAllProject = () => {
    if (isLoaded) {
      return;
      
    }
    setLoad(true);
    const onSuccess = (projects) => {
      setAllProjects(projects.data);
      dispatch(setPrjcts(projects.data));
      setLoad(false);
    };
    const onError = (err) => {
      showErrorToast(err);
      setLoad(false);
    };
    get(
      `/api/projects?projectsPerPage=All&complete=${showComplete}`,
      onSuccess,
      onError
    );
  };
  
useEffect(() => {
  getAllProject();
  refreshData(currentPage);
}, [showComplete]);



// * TODO: store newly added projects to the store 

const submitNewProject = (newProjectData, callback) => {
  const onSuccess = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    dispatch(setPrjcts([...dashboardData, newProject]));

    if (callback) callback();
  };
  const onError = (err) => {
    showErrorToast(err);
    if (callback) callback();
  };
  
  post(`/api/projects`, newProjectData, onSuccess, onError);
  setTimeout(() => refreshData(), 1000);
};

// * TODO: remove archieved projects from the store 

  const deleteProject = (projects, callback) => {
    const onSuccess = (newProject) => {
      const updatedProjects = projects.filter((project) => !projects.includes(project));
      setProjects(updatedProjects);
      dispatch(setPrjcts(updatedProjects));

      if (callback) callback();
    };
    const onError = (err) => {
      showErrorToast(err);
      if (callback) callback();
    };

    $delete(`/api/admin/project/archive`, { data: projects }, onSuccess, onError);
    refreshData(currentPage);
  }; 

  const contextVal = {
    allProjects,
    projects,
    loading,
    load,
    totalPages,
    currentPage,
    projectsPerPage,
    showComplete,
    setShowComplete,
    setTotalPages,
    setProjectsPerPage,
    submitNewProject,
    deleteProject,
    refreshData,
    getAllProject,
  };

  return (
    <ProjectsContext.Provider value={contextVal}>
      {children}
    </ProjectsContext.Provider>
  );
};

