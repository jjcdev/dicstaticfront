import { FaLinkedin, FaGithub } from "react-icons/fa";

import { resolveStaticBase } from "../../services/api";
const STATIC_URL = resolveStaticBase();

export default function MemberCard({ member }) {
  const photo = member.photo_url
    ? `${STATIC_URL}${member.photo_url}`
    : "/default-avatar.png";

  return (
    <article className="dic-card">
      <img
        src={photo}
        alt={`${member.first_name} ${member.last_name}`}
        className="dic-avatar"
      />
      <div className="dic-card-body text-center">
        <h3 className="dic-card-title">
          {member.first_name} {member.last_name}
        </h3>
        <p className="dic-card-sub">{member.role}</p>
        {member.bio && (
          <p className="dic-card-text d-none d-sm-block mb-2">{member.bio}</p>
        )}
        <div className="d-flex justify-content-center gap-3 mt-auto pt-2">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}