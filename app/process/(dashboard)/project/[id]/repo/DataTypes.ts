// DataTypes.ts
export interface Data {
    id: string;
    path: string;
    type: "dir" | "file" | "submodule" | "symlink";
    // ... and any other properties you might need
  }
  