const updateObjectInArray = (array, updatedObject) => {
  return array.map((item) => {
    if (item._id === updatedObject._id) {
      return { ...item, ...updatedObject };
    }
    return item;
  });
};
export default updateObjectInArray;
