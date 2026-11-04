// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, toast} from "@heroui/react";

const uploadFile = (): Promise<{filename: string; size: number}> => {
  return new Promise<{filename: string; size: number}>((resolve) => {
    setTimeout(() => resolve({filename: "document.pdf", size: 1024}), 2000);
  });
};

const createEvent = (): Promise<never> => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Network error. Please try again.")), 2000);
  });
};

const saveData = (): Promise<{count: number}> => {
  return new Promise<{count: number}>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({count: 42});
      } else {
        reject(new Error("Failed to save data"));
      }
    }, 2000);
  });
};

const fetchUser = (): Promise<{name: string; email: string}> => {
  return new Promise<{name: string; email: string}>((resolve) => {
    setTimeout(() => resolve({email: "john@example.com", name: "John Doe"}), 2000);
  });
};

export function PromiseDemo() {
  const t = useCopy();
  return (
    <div className="flex h-full max-w-2xl flex-col items-center justify-center gap-8">
      {/* Promise API Section */}
      <div className="w-full space-y-3">
        <div className="text-center">
          <h3 className="text-sm font-medium">{t("Using toast.promise()")}</h3>
          <p className="text-xs text-muted">
            {t("Automatically handles loading, success, and error states")}</p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              toast.promise(uploadFile(), {
                error: t("Failed to upload file"),
                loading: t("Uploading file..."),
                success: (data) => t("File {filename} uploaded ({size}KB)", {filename: data.filename, size: data.size}),
              });
            }}
          >
            {t("Upload file")}</Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              toast.promise(createEvent(), {
                error: (err) => t(err.message),
                loading: t("Creating event..."),
                success: t("Event created"),
              });
            }}
          >
            {t("Create event (error)")}</Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              toast.promise(saveData(), {
                error: (err) => t(err.message),
                loading: t("Saving changes..."),
                success: (data) => t("Saved {count} items", {count: data.count}),
              });
            }}
          >
            {t("Save data (random)")}</Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              toast.promise(fetchUser(), {
                error: t("Failed to fetch user"),
                loading: t("Loading user..."),
                success: (data) => t("Welcome back, {name}!", {name: t(data.name)}),
              });
            }}
          >
            {t("Fetch user")}</Button>
        </div>
      </div>

      {/* Manual Loading Section */}
      <div className="w-full space-y-3">
        <div className="text-center">
          <h3 className="text-sm font-medium">{t("Manual Loading State")}</h3>
          <p className="text-xs text-muted">{t("Manually control loading state with isLoading prop")}</p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              const loadingId = toast(t("Uploading file..."), {
                description: t("Please wait while we upload your file"),
                isLoading: true,
                timeout: 0,
              });

              setTimeout(() => {
                toast.update(loadingId, t("File uploaded"), {
                  description: t("Your file has been uploaded successfully"),
                  variant: "success",
                });
              }, 3000);
            }}
          >
            {t("Upload with loading")}</Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              const loadingId = toast(t("Processing payment..."), {
                isLoading: true,
                timeout: 0,
              });

              setTimeout(() => {
                toast.update(loadingId, t("Payment processed"), {
                  description: t("Your payment has been processed successfully"),
                  variant: "success",
                });
              }, 2500);
            }}
          >
            {t("Payment processing")}</Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => {
              const loadingId = toast(t("Saving changes..."), {
                isLoading: true,
                timeout: 0,
              });

              setTimeout(() => {
                toast.update(loadingId, t("Failed to save"), {
                  description: t("Please try again"),
                  variant: "danger",
                });
              }, 2000);
            }}
          >
            {t("Loading to error")}</Button>
        </div>
      </div>
    </div>
  );
}

export default PromiseDemo;
