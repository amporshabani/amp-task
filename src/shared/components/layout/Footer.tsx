import Logo from "../Logo";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-card py-4 mt-auto flex items-center justify-center">
      <div className="tracking-wider text-muted-foreground text-xs flex items-center gap-2">
        &copy; 1405
        <Logo height="45" width="45" />
        تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
};
