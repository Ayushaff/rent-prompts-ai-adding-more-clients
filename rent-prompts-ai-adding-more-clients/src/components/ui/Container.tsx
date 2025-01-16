interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  children
}) => {
  return (
    <div className="mx-auto w-screen max-w-[1350px] no-scrollbar overflow-y-auto h-screen whitespace-nowrap overflow-x-hidden">
      {children}
    </div>
   );
};

export default Container;
