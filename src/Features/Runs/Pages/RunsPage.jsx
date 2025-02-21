import RunsTable from "../Components/RunsTable";

const RunsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/90">
      <main className="container mx-auto px-8 py-8">
        <div className="">
          <RunsTable />
        </div>
      </main>
    </div>
  );
};

export default RunsPage;
