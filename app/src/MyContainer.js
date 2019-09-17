import MyComponent from "./MyComponent";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    lock2PayState: state.contracts.Lock2Pay,
    currentBlock: state.currentBlock,
  };
};

const MyContainer = drizzleConnect(MyComponent, mapStateToProps);

export default MyContainer;
