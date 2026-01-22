#!/usr/bin/env ruby
require 'yaml'
require 'fileutils'

root = File.expand_path('..', __dir__)
source = ENV['RESUME_SOURCE'] || '/Users/Ben/Code/ben_resume/resume_linkedln.yaml'

unless File.exist?(source)
  warn "Resume source not found: #{source}"
  exit 1
end

raw = YAML.safe_load(File.read(source))
resume = raw['resume'] || raw

FileUtils.mkdir_p(File.join(root, 'data'))
File.write(File.join(root, 'data', 'resume.yaml'), YAML.dump(raw))

content_dir = File.join(root, 'content', 'english')
FileUtils.mkdir_p(content_dir)

summary = (resume['professional_summary'] || '').strip
summary = summary.gsub('Tensorflow', 'TensorFlow').gsub('Stem separation', 'stem separation')
summary = summary.gsub(/\s+/, ' ')
header = resume['header'] || {}
contact = (header['contact'] || '').split('|').map(&:strip).reject(&:empty?)


education_lines = (resume['education'] || []).map do |item|
  details = []
  details << "GPA: #{item['gpa']}" if item['gpa'] && !item['gpa'].empty?
  details += Array(item['details'])
  extra = details.empty? ? '' : " (#{details.join('; ')})"
  "- **#{item['degree']}**, #{item['institution']} — #{item['location']} (#{item['date']})#{extra}"
end

experience_blocks = (resume['work_experience'] || []).map do |item|
  lines = []
  lines << "### #{item['title']} — #{item['organization']}"
  lines << "*#{item['location']} · #{item['date']}*"
  Array(item['bullet_points']).each do |point|
    original = point.to_s
    cleaned = original
    if original.include?('**')
      last_bold = original.rindex('**')
      period_before_bold = original.rindex('.', last_bold)
      cleaned = original[0..period_before_bold] if period_before_bold
    end
    cleaned = cleaned.gsub(/\*\*([^*]+)\*\*/, '\1')
    cleaned = cleaned.gsub(/\s{2,}/, ' ').strip
    cleaned = cleaned.gsub(/\s+([.,;:])/, '\1')
    cleaned = cleaned.gsub(/\s+and$/, '').strip
    cleaned = cleaned.gsub(/[,;:]+$/, '').strip
    lines << "- #{cleaned}"
  end
  lines.join("\n")
end

project_blocks = (resume['projects'] || []).map do |project|
  lines = []
  title = project['title'].to_s.gsub('*', '')
  lines << "### #{title}"
  project_links = {
    "Improving Developer Code Understanding with GitHub Issues and Retrieval-Augmented Generation" => "https://github.com/ben2002chou/CodeUnderstandingRAGGithubIssues",
    "Multi-Agent Self-Play for Beating Atari Games" => "https://github.com/ben2002chou/MultiAgentReinforcementLearningGames",
    "Spectral Image Inpainting with Deep Learning" => "https://github.com/ben2002chou/admm-adam-NMF-Inpainting"
  }
  if project_links[title]
    lines << "[GitHub](#{project_links[title]})"
  end
  project_assets = {
    "Improving Developer Code Understanding with GitHub Issues and Retrieval-Augmented Generation" => {
      paper: "/github_issues.pdf"
    },
    "Multi-Agent Self-Play for Beating Atari Games" => {
      paper: "/multi-agent-self-play.pdf",
      video: "https://youtu.be/B6ykyBO_HcU"
    },
    "Spectral Image Inpainting with Deep Learning" => {
      slides: "/nmf-based-inpainting.pdf"
    }
  }
  if project_assets[title]
    assets = project_assets[title]
    lines << "[Paper](#{assets[:paper]})" if assets[:paper]
    lines << "[Slides](#{assets[:slides]})" if assets[:slides]
    lines << "[Video](#{assets[:video]})" if assets[:video]
  end
  skills = project['skills'].to_s.gsub('*', '')
  lines << "*#{skills}*" unless skills.empty?
  Array(project['bullet_points']).each { |point| lines << "- #{point}" }
  lines.join("\n")
end

publication_lines = (resume['publications'] || []).map do |pub|
  title = pub['title'].to_s.gsub('*', '')
  authors = pub['authors'].to_s.gsub('*', '')
  venue = pub['venue']
  link = pub['link']
  line = "- **#{title}** — #{authors}"
  line += ". *#{venue}*" if venue && !venue.empty?
  line += " ([link](#{link}))" if link && !link.to_s.empty?
  line
end

front_matter = lambda do |title, description|
  ["+++", "title = \"#{title}\"", "description = \"#{description}\"", "date = \"2026-01-22\"", "+++"].join("\n")
end

about_body = [
  summary,
  "\n## Education\n",
  education_lines.join("\n")
].join("\n").strip

publications_body = publication_lines.join("\n")

projects_body = project_blocks.join("\n\n")

experience_body = experience_blocks.join("\n\n")

email = contact.find { |c| c.include?('@') } || 'ben2002chou@gmail.com'
phone = contact.find { |c| c.gsub(/\D/, '').length >= 7 }
citizenship = contact.find { |c| c.downcase.include?('citizen') }

contact_body = [
  "Email: #{email}",
  phone ? "" : nil,
  phone ? "Phone: #{phone}" : nil,
  "",
  "LinkedIn: https://www.linkedin.com/in/benjamin-chou-6aa058228",
  "",
  "GitHub: https://github.com/ben2002chou",
  citizenship ? "" : nil,
  citizenship ? "Citizenship: #{citizenship}" : nil
].compact.join("\n")

pages = {
  'about.md' => [front_matter.call('About', 'Background and education.'), about_body],
  'publications.md' => [front_matter.call('Publications', 'Selected publications and preprints.'), publications_body],
  'projects.md' => [front_matter.call('Projects', 'Selected projects and research prototypes.'), projects_body],
  'experience.md' => [front_matter.call('Experience', 'Industry, research, and leadership experience.'), experience_body],
  'contact.md' => [front_matter.call('Contact', 'Get in touch.'), contact_body]
}

pages.each do |filename, parts|
  File.write(File.join(content_dir, filename), parts.join("\n\n").strip + "\n")
end

puts 'Resume sync complete.'
