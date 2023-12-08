import React, { useState } from "react";

const useNetworkWithIntecepters = () => {
  const [state, setState] = useState({ error: "", data: null, loading: false });
};

export default useNetworkWithIntecepters;
