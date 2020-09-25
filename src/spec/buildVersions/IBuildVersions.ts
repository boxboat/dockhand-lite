export interface IBuildVersions {
  imageRepoMap: Map<string, IImageRepo>;        // image : repo
  imageVersionMap: Map<string, IImageVersion>;  // event : Map<image:version>
  repoVersionMap: Map<string, IRepoVersion>;    // repo  : Map<tagPrefix:version>
}

type IImageRepo = string

type IImageVersion = Map<string, string>

type IRepoVersion = Map<string, string>
