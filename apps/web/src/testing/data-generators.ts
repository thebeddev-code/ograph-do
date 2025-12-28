import { formatDate } from "@/lib/utils/date";
import { Todo } from "@/types/api";
import {
  randCompanyName,
  randUserName,
  randEmail,
  randParagraph,
  randUuid,
  randPassword,
  randColor,
  randPastDate,
  randTodo,
  randProductDescription,
  rand,
  randNumber,
  randProductName,
  randFutureDate,
} from "@ngneat/falso";

const generateUser = () => ({
  id: randUuid() + Math.random(),
  firstName: randUserName({ withAccents: false }),
  lastName: randUserName({ withAccents: false }),
  email: randEmail(),
  password: randPassword(),
  teamId: randUuid(),
  teamName: randCompanyName(),
  role: "ADMIN",
  bio: randParagraph(),
  createdAt: Date.now(),
});

export const createUser = <T extends Partial<ReturnType<typeof generateUser>>>(
  overrides?: T,
) => {
  return { ...generateUser(), ...overrides };
};

const generateTeam = () => ({
  id: randUuid(),
  name: randCompanyName(),
  description: randParagraph(),
  createdAt: Date.now(),
});

let todoId = 0;
const generateTodo = () => {
  const startHour = randNumber({
    min: 0,
    max: 23,
  });
  const todo = {
    id: todoId,
    color: randColor(),
    createdAt: formatDate(randPastDate()),
    title: randProductName(),
    description: randProductDescription(),
    priority: rand(["low", "medium", "high"]),
    status: "pending",
    tags: [rand(["work", "stuff", "study", "health"])],
    time: {
      start: {
        hour: startHour,
        minutes: randNumber({ min: 0, max: 60 }),
      },
      end: {
        hour: randNumber({ min: startHour, max: 23 }),
        minutes: randNumber({ min: 0, max: 60 }),
      },
    },
    due: formatDate(randFutureDate()),
  } as Todo;

  todoId += 1;
  return todo;
};

export const createTodo = <T extends Partial<ReturnType<typeof generateTodo>>>(
  overrides?: T,
) => {
  return { ...generateTodo(), ...overrides };
};

// export const createTeam = <T extends Partial<ReturnType<typeof generateTeam>>>(
//   overrides?: T,
// ) => {
//   return { ...generateTeam(), ...overrides };
// };

// const generateDiscussion = () => ({
//   id: randUuid(),
//   title: randCatchPhrase(),
//   body: randParagraph(),
//   createdAt: Date.now(),
//   public: true,
// });

// export const createDiscussion = <
//   T extends Partial<ReturnType<typeof generateDiscussion>>,
// >(
//   overrides?: T & {
//     authorId?: string;
//     teamId?: string;
//   },
// ) => {
//   return { ...generateDiscussion(), ...overrides };
// };

// const generateComment = () => ({
//   id: randUuid(),
//   body: randParagraph(),
//   createdAt: Date.now(),
// });

// export const createComment = <
//   T extends Partial<ReturnType<typeof generateComment>>,
// >(
//   overrides?: T & {
//     authorId?: string;
//     discussionId?: string;
//   },
// ) => {
//   return { ...generateComment(), ...overrides };
// };
