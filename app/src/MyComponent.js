import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

export default ({ accounts }) => (
  <div className="App">
    Send Dai

    <ContractForm contract={"DaiSender"} method={"sendDai"} />
  </div>
);
