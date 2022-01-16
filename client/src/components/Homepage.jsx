import { Publish, Verify, Welcome, Search } from ".";

const Homepage = () => {
    return (
        <div>
            <Welcome/>
            <Publish/>
            <Verify/>
            <Search/>
        </div>
    );
}
  export default Homepage;