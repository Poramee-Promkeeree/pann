import { AnnouncementRepository } from "./AnnouncementRepository";
import { UserResultRepository } from "./UserResultRepository";

const repositories = {
    announcements: new AnnouncementRepository(),
    userResult: new UserResultRepository()
}

export default repositories
