import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import {
  PostApiResult,
  postFromApiResult,
  Post,
} from "../model/post";
import { Availability } from "../model/availability";
import { Skill } from "../model/skill";
import { Tool } from "../model/tool";
import { toQueryString, useApiRequest } from "../utils/apiRequest";
import { sortArrayImmutably } from "../utils/fns";

export type SortByOption = keyof Post;
export interface SearchOptions {
  description?: string;
  skillsPossessed?: Skill[];
  skillsSought?: Skill[];
  tools?: Tool[];
  languages?: string[];
  availability?: Availability[];
  sortBy?: SortByOption;
  sortDir?: "asc" | "desc";
}

type PostsListQueryKey = ["posts", "list", SearchOptions];

export function usePostsList(
  searchOptions?: SearchOptions,
  queryOptions?: UseQueryOptions<
    PostApiResult[],
    Error,
    Post[],
    PostsListQueryKey
  >
): UseQueryResult<Post[], Error> {
  const apiRequest = useApiRequest();

  const normalizedSearchOptions: SearchOptions = {
    ...searchOptions,
    skillsPossessed:
      searchOptions?.skillsPossessed &&
      sortArrayImmutably(searchOptions.skillsPossessed),
    skillsSought:
      searchOptions?.skillsSought &&
      sortArrayImmutably(searchOptions.skillsSought),
    tools: searchOptions?.tools && sortArrayImmutably(searchOptions.tools),
    languages:
      searchOptions?.languages && sortArrayImmutably(searchOptions.languages),
    availability:
      searchOptions?.availability &&
      sortArrayImmutably(searchOptions.availability),
  };

  return useQuery(
    ["posts", "list", normalizedSearchOptions ?? {}],
    () => {
      const params = {
        ...normalizedSearchOptions,
        skillsPossessed: normalizedSearchOptions?.skillsPossessed?.join(","),
        skillsSought: normalizedSearchOptions?.skillsSought?.join(","),
        tools: normalizedSearchOptions?.tools?.join(","),
        languages: normalizedSearchOptions?.languages?.join(","),
        availability: normalizedSearchOptions?.availability?.join(","),
      };
      return apiRequest<PostApiResult[]>(`/posts?${toQueryString(params)}`);
    },
    {
      ...queryOptions,
      select: (posts: PostApiResult[]) => posts.map(postFromApiResult),
    }
  );
}
